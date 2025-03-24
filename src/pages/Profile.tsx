
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/utils/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { User } from "lucide-react";

const Profile = () => {
  const { user, logout } = useAuth();
  
  // Username change state
  const [newUsername, setNewUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [usernameSuccess, setUsernameSuccess] = useState("");
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  
  // Password change state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUsernameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setUsernameError("");
    setUsernameSuccess("");
    
    // Validate username
    if (!newUsername.trim()) {
      setUsernameError("Username tidak boleh kosong");
      return;
    }
    
    setIsUpdatingUsername(true);
    
    try {
      const result = await api.updateUsername(user?.id as number, newUsername);
      
      if (result.success) {
        setUsernameSuccess("Username berhasil diubah");
        toast.success("Username berhasil diubah");
        // Force logout after username change to re-login with new username
        setTimeout(() => {
          logout();
        }, 2000);
      } else {
        setUsernameError(result.message || "Gagal mengubah username");
      }
    } catch (error) {
      setUsernameError("Terjadi kesalahan saat mengubah username");
      console.error("Error updating username:", error);
    } finally {
      setIsUpdatingUsername(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setPasswordError("");
    setPasswordSuccess("");
    
    // Validate password
    if (!oldPassword.trim() || !newPassword.trim()) {
      setPasswordError("Semua field harus diisi");
      return;
    }
    
    setIsUpdatingPassword(true);
    
    try {
      const result = await api.updatePassword(
        user?.id as number, 
        oldPassword, 
        newPassword
      );
      
      if (result.success) {
        setPasswordSuccess("Password berhasil diubah");
        toast.success("Password berhasil diubah");
        setOldPassword("");
        setNewPassword("");
      } else {
        setPasswordError(result.message || "Gagal mengubah password");
      }
    } catch (error) {
      setPasswordError("Terjadi kesalahan saat mengubah password");
      console.error("Error updating password:", error);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-green-700">Profil Pengguna</h1>
        <p className="text-gray-500">Kelola informasi akun Anda</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Username Change Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ubah Username</CardTitle>
            <CardDescription>
              Masukkan username baru untuk akun Anda
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleUsernameChange}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-username">Username Saat Ini</Label>
                <Input 
                  id="current-username" 
                  value={user.username} 
                  readOnly 
                  disabled 
                  className="bg-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-username">Username Baru</Label>
                <Input
                  id="new-username"
                  placeholder="Masukkan username baru"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                />
              </div>
              
              {usernameError && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription className="text-red-600">
                    {usernameError}
                  </AlertDescription>
                </Alert>
              )}
              
              {usernameSuccess && (
                <Alert className="py-2 bg-green-50 border-green-200">
                  <AlertDescription className="text-green-600">
                    {usernameSuccess}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isUpdatingUsername}
              >
                {isUpdatingUsername ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                    <span>Memproses...</span>
                  </div>
                ) : (
                  "Simpan Username"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        {/* Password Change Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ubah Password</CardTitle>
            <CardDescription>
              Ubah password akun Anda untuk keamanan
            </CardDescription>
          </CardHeader>
          <form onSubmit={handlePasswordChange}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="old-password">Password Lama</Label>
                <Input
                  id="old-password"
                  type="password"
                  placeholder="Masukkan password lama"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Password Baru</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Masukkan password baru"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              
              {passwordError && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription className="text-red-600">
                    {passwordError}
                  </AlertDescription>
                </Alert>
              )}
              
              {passwordSuccess && (
                <Alert className="py-2 bg-green-50 border-green-200">
                  <AlertDescription className="text-green-600">
                    {passwordSuccess}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isUpdatingPassword}
              >
                {isUpdatingPassword ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                    <span>Memproses...</span>
                  </div>
                ) : (
                  "Simpan Password"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
