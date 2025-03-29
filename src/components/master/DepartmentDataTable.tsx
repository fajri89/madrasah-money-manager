
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { api } from "@/utils/api";

interface DepartmentData {
  id: number;
  nama: string;
}

interface DepartmentFormData {
  id?: number;
  nama: string;
}

const DepartmentDataTable = () => {
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentData | null>(null);
  
  const form = useForm<DepartmentFormData>({
    defaultValues: {
      nama: ""
    }
  });
  
  // Fetch departments data using the updated API
  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        // Use the new getJurusan function instead of direct access
        const data = await api.getJurusan();
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
        toast.error("Gagal mengambil data jurusan");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDepartments();
  }, []);
  
  const handleAddEdit = (department: DepartmentData | null = null) => {
    setSelectedDepartment(department);
    
    if (department) {
      form.reset({
        id: department.id,
        nama: department.nama
      });
    } else {
      form.reset({
        nama: ""
      });
    }
    
    setIsDialogOpen(true);
  };
  
  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus jurusan ini?")) {
      const updatedDepartments = departments.filter(d => d.id !== id);
      
      try {
        // Save to Supabase using the updated API
        await api.saveJurusan(updatedDepartments);
        setDepartments(updatedDepartments);
        toast.success("Jurusan berhasil dihapus");
      } catch (error) {
        console.error("Error deleting department:", error);
        toast.error("Gagal menghapus jurusan");
      }
    }
  };
  
  const onSubmit = async (data: DepartmentFormData) => {
    let updatedDepartments: DepartmentData[];
    
    if (selectedDepartment) {
      // Edit existing department
      updatedDepartments = departments.map(d => 
        d.id === selectedDepartment.id ? { ...data, id: selectedDepartment.id } as DepartmentData : d
      );
      toast.success("Jurusan berhasil diperbarui");
    } else {
      // Add new department
      const newDepartment = {
        ...data,
        id: Math.max(0, ...departments.map(d => d.id)) + 1
      } as DepartmentData;
      updatedDepartments = [...departments, newDepartment];
      toast.success("Jurusan berhasil ditambahkan");
    }
    
    try {
      // Save to Supabase using the updated API
      await api.saveJurusan(updatedDepartments);
      setDepartments(updatedDepartments);
    } catch (error) {
      console.error("Error saving department data:", error);
      toast.error("Gagal menyimpan data jurusan");
    }
    
    setIsDialogOpen(false);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-green-700">
          Data Jurusan
        </CardTitle>
        <Button 
          onClick={() => handleAddEdit()} 
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" /> Tambah Jurusan
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nama Jurusan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : departments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6">
                    Tidak ada data jurusan
                  </TableCell>
                </TableRow>
              ) : (
                departments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell>{department.id}</TableCell>
                    <TableCell>{department.nama}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAddEdit(department)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(department.id)}
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
                {selectedDepartment ? "Edit Jurusan" : "Tambah Jurusan Baru"}
              </DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="nama"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Jurusan</FormLabel>
                      <FormControl>
                        <Input placeholder="Nama Jurusan" {...field} />
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
                    {selectedDepartment ? "Perbarui" : "Simpan"}
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

export default DepartmentDataTable;
