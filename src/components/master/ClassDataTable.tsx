
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

interface ClassData {
  id: number;
  nama: string;
}

interface ClassFormData {
  id?: number;
  nama: string;
}

const ClassDataTable = () => {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  
  const form = useForm<ClassFormData>({
    defaultValues: {
      nama: ""
    }
  });
  
  // Fetch classes data
  useEffect(() => {
    const fetchClasses = async () => {
      setIsLoading(true);
      try {
        const data = await Promise.resolve(api.kelas);
        setClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
        toast.error("Gagal mengambil data kelas");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClasses();
  }, []);
  
  const handleAddEdit = (classItem: ClassData | null = null) => {
    setSelectedClass(classItem);
    
    if (classItem) {
      form.reset({
        id: classItem.id,
        nama: classItem.nama
      });
    } else {
      form.reset({
        nama: ""
      });
    }
    
    setIsDialogOpen(true);
  };
  
  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus kelas ini?")) {
      // In a real app, this would delete from the database
      // For now, we'll just remove from the local state
      setClasses(classes.filter(c => c.id !== id));
      toast.success("Kelas berhasil dihapus");
    }
  };
  
  const onSubmit = (data: ClassFormData) => {
    if (selectedClass) {
      // Edit existing class
      setClasses(classes.map(c => 
        c.id === selectedClass.id ? { ...data, id: selectedClass.id } as ClassData : c
      ));
      toast.success("Kelas berhasil diperbarui");
    } else {
      // Add new class
      const newClass = {
        ...data,
        id: Math.max(0, ...classes.map(c => c.id)) + 1
      } as ClassData;
      setClasses([...classes, newClass]);
      toast.success("Kelas berhasil ditambahkan");
    }
    
    setIsDialogOpen(false);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-green-700">
          Data Kelas
        </CardTitle>
        <Button 
          onClick={() => handleAddEdit()} 
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" /> Tambah Kelas
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nama Kelas</TableHead>
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
              ) : classes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6">
                    Tidak ada data kelas
                  </TableCell>
                </TableRow>
              ) : (
                classes.map((classItem) => (
                  <TableRow key={classItem.id}>
                    <TableCell>{classItem.id}</TableCell>
                    <TableCell>{classItem.nama}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAddEdit(classItem)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(classItem.id)}
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
                {selectedClass ? "Edit Kelas" : "Tambah Kelas Baru"}
              </DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="nama"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Kelas</FormLabel>
                      <FormControl>
                        <Input placeholder="Nama Kelas" {...field} />
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
                    {selectedClass ? "Perbarui" : "Simpan"}
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

export default ClassDataTable;
