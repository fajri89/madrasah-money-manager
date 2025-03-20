
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Edit, Trash2, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { api, Student } from "@/utils/api";

interface StudentFormData {
  id?: number;
  nis: string;
  nama: string;
  kelas_id: number;
  jurusan_id: number;
  alamat: string;
  telepon: string;
}

const StudentDataTable = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<{id: number, nama: string}[]>([]);
  const [departments, setDepartments] = useState<{id: number, nama: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const form = useForm<StudentFormData>({
    defaultValues: {
      nis: "",
      nama: "",
      kelas_id: 0,
      jurusan_id: 0,
      alamat: "",
      telepon: ""
    }
  });
  
  // Fetch students, classes, and departments data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const studentsData = await api.getSiswa();
        const classesData = await Promise.resolve(api.kelas);
        const departmentsData = await Promise.resolve(api.jurusan);
        
        setStudents(studentsData);
        setClasses(classesData);
        setDepartments(departmentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Gagal mengambil data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleAddEdit = (student: Student | null = null) => {
    setSelectedStudent(student);
    
    if (student) {
      form.reset({
        id: student.id,
        nis: student.nis,
        nama: student.nama,
        kelas_id: student.kelas_id,
        jurusan_id: student.jurusan_id,
        alamat: student.alamat,
        telepon: student.telepon
      });
    } else {
      form.reset({
        nis: "",
        nama: "",
        kelas_id: classes[0]?.id || 0,
        jurusan_id: departments[0]?.id || 0,
        alamat: "",
        telepon: ""
      });
    }
    
    setIsDialogOpen(true);
  };
  
  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus data siswa ini?")) {
      // In a real app, this would delete from the database
      // For now, we'll just remove from the local state
      setStudents(students.filter(student => student.id !== id));
      toast.success("Data siswa berhasil dihapus");
    }
  };
  
  const onSubmit = (data: StudentFormData) => {
    if (selectedStudent) {
      // Edit existing student
      setStudents(students.map(s => 
        s.id === selectedStudent.id ? { ...data, id: selectedStudent.id } as Student : s
      ));
      toast.success("Data siswa berhasil diperbarui");
    } else {
      // Add new student
      const newStudent = {
        ...data,
        id: Math.max(0, ...students.map(s => s.id)) + 1
      } as Student;
      setStudents([...students, newStudent]);
      toast.success("Data siswa berhasil ditambahkan");
    }
    
    setIsDialogOpen(false);
  };
  
  // Filter students based on search query
  const filteredStudents = searchQuery
    ? students.filter(student => 
        student.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.nis.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : students;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-green-700">
          Data Siswa
        </CardTitle>
        <Button 
          onClick={() => handleAddEdit()} 
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" /> Tambah Siswa
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Cari siswa berdasarkan nama atau NIS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NIS</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Jurusan</TableHead>
                <TableHead>No. Telepon</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    Tidak ada data siswa
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.nis}</TableCell>
                    <TableCell>{student.nama}</TableCell>
                    <TableCell>
                      {classes.find(c => c.id === student.kelas_id)?.nama || '-'}
                    </TableCell>
                    <TableCell>
                      {departments.find(d => d.id === student.jurusan_id)?.nama || '-'}
                    </TableCell>
                    <TableCell>{student.telepon}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAddEdit(student)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(student.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedStudent ? "Edit Data Siswa" : "Tambah Siswa Baru"}
              </DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="nis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIS</FormLabel>
                      <FormControl>
                        <Input placeholder="NIS Siswa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="nama"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Siswa</FormLabel>
                      <FormControl>
                        <Input placeholder="Nama Lengkap Siswa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="kelas_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kelas</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          defaultValue={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Kelas" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {classes.map((c) => (
                              <SelectItem key={c.id} value={c.id.toString()}>
                                {c.nama}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="jurusan_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jurusan</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          defaultValue={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Jurusan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments.map((d) => (
                              <SelectItem key={d.id} value={d.id.toString()}>
                                {d.nama}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="alamat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat</FormLabel>
                      <FormControl>
                        <Input placeholder="Alamat Lengkap" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="telepon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No. Telepon/WA Wali</FormLabel>
                      <FormControl>
                        <Input placeholder="No. Telepon/WA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    {selectedStudent ? "Perbarui" : "Simpan"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default StudentDataTable;
