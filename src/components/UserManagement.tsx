
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus, Edit, Trash2 } from "lucide-react";
import { api } from "@/utils/api";

interface User {
  id: number;
  username: string;
  nama: string;
  level: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  
  // Form states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nama, setNama] = useState("");
  const [level, setLevel] = useState("bendahara");
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Get only the users who are not admin
      const allUsers = api.pengguna.filter(user => user.level !== "admin");
      setUsers(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Gagal mengambil data pengguna");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    if (!username || !password || !nama || !level) {
      toast.error("Semua field harus diisi");
      return;
    }

    // Check if username already exists
    const userExists = api.pengguna.some(user => user.username === username);
    if (userExists) {
      toast.error("Username sudah digunakan");
      return;
    }

    // In a real app, this would be an API call
    try {
      // Add new user to the local data
      const newUser = {
        id: api.pengguna.length + 1,
        username,
        password,
        nama,
        level
      };
      
      api.pengguna.push(newUser);
      setUsers(prevUsers => [...prevUsers, { id: newUser.id, username: newUser.username, nama: newUser.nama, level: newUser.level }]);
      
      toast.success("Pengguna berhasil ditambahkan");
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Gagal menambahkan pengguna");
    }
  };

  const handleEditUser = () => {
    if (!username || !nama || !level || !editingUserId) {
      toast.error("Semua field harus diisi");
      return;
    }

    // Check if username already exists and it's not the current user
    const userExists = api.pengguna.some(user => user.username === username && user.id !== editingUserId);
    if (userExists) {
      toast.error("Username sudah digunakan");
      return;
    }

    try {
      // Find the user in the array
      const userIndex = api.pengguna.findIndex(user => user.id === editingUserId);
      
      if (userIndex !== -1) {
        // Update the user
        api.pengguna[userIndex].username = username;
        api.pengguna[userIndex].nama = nama;
        api.pengguna[userIndex].level = level;
        
        // If a new password is provided, update it
        if (password) {
          api.pengguna[userIndex].password = password;
        }
        
        // Update the local state
        setUsers(prevUsers => {
          const newUsers = [...prevUsers];
          const index = newUsers.findIndex(user => user.id === editingUserId);
          if (index !== -1) {
            newUsers[index] = {
              id: editingUserId,
              username,
              nama,
              level
            };
          }
          return newUsers;
        });
        
        toast.success("Pengguna berhasil diperbarui");
        setEditOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Gagal memperbarui pengguna");
    }
  };

  const handleDeleteUser = (userId: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      try {
        // Find and remove the user
        const userIndex = api.pengguna.findIndex(user => user.id === userId);
        
        if (userIndex !== -1) {
          api.pengguna.splice(userIndex, 1);
          setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
          toast.success("Pengguna berhasil dihapus");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Gagal menghapus pengguna");
      }
    }
  };

  const prepareEditUser = (user: User) => {
    const fullUserData = api.pengguna.find(u => u.id === user.id);
    
    if (fullUserData) {
      setEditingUserId(user.id);
      setUsername(fullUserData.username);
      setNama(fullUserData.nama);
      setLevel(fullUserData.level);
      setPassword(""); // Clear password field for editing
      setEditOpen(true);
    }
  };

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setNama("");
    setLevel("bendahara");
    setEditingUserId(null);
  };

  const formatRole = (role: string) => {
    if (role === "bendahara") return "Bendahara";
    if (role === "kepala_sekolah") return "Kepala Sekolah";
    if (role === "admin") return "Admin";
    return role;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Kelola Pengguna</CardTitle>
            <CardDescription>Mengelola akun Bendahara dan Kepala Sekolah</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-700 hover:bg-green-800">
                <UserPlus size={16} className="mr-2" />
                Tambah Pengguna
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Pengguna Baru</DialogTitle>
                <DialogDescription>
                  Tambahkan akun untuk Bendahara atau Kepala Sekolah.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="Masukkan username"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Masukkan password"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Lengkap</Label>
                  <Input 
                    id="nama" 
                    value={nama} 
                    onChange={(e) => setNama(e.target.value)} 
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="level">Peran</Label>
                  <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih peran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bendahara">Bendahara</SelectItem>
                      <SelectItem value="kepala_sekolah">Kepala Sekolah</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
                <Button className="bg-green-700 hover:bg-green-800" onClick={handleAddUser}>Simpan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-green-700 rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <Table>
            <TableCaption>Daftar pengguna sistem</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Peran</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Belum ada data pengguna
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.nama}</TableCell>
                    <TableCell>{formatRole(user.level)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => prepareEditUser(user)}>
                        <Edit size={14} className="mr-1" />
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user.id)}>
                        <Trash2 size={14} className="mr-1" />
                        Hapus
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Edit User Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Pengguna</DialogTitle>
            <DialogDescription>
              Perbarui informasi pengguna.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-username">Username</Label>
              <Input 
                id="edit-username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Masukkan username"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-password">Password (Biarkan kosong jika tidak diubah)</Label>
              <Input 
                id="edit-password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Masukkan password baru"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-nama">Nama Lengkap</Label>
              <Input 
                id="edit-nama" 
                value={nama} 
                onChange={(e) => setNama(e.target.value)} 
                placeholder="Masukkan nama lengkap"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-level">Peran</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih peran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bendahara">Bendahara</SelectItem>
                  <SelectItem value="kepala_sekolah">Kepala Sekolah</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Batal</Button>
            <Button className="bg-green-700 hover:bg-green-800" onClick={handleEditUser}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UserManagement;
