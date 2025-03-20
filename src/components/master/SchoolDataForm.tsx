
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/utils/api";

interface SchoolFormData {
  nama: string;
  alamat: string;
  telepon: string;
  email: string;
}

const SchoolDataForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [schoolData, setSchoolData] = useState<SchoolFormData | null>(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SchoolFormData>();
  
  // Fetch school data
  useEffect(() => {
    const fetchSchoolData = async () => {
      setIsLoading(true);
      try {
        const data = await api.getSekolahInfo();
        setSchoolData(data);
        // Set form values
        reset({
          nama: data.nama,
          alamat: data.alamat,
          telepon: data.telepon,
          email: data.email
        });
      } catch (error) {
        console.error("Error fetching school data:", error);
        toast.error("Gagal mengambil data sekolah");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSchoolData();
  }, [reset]);
  
  const onSubmit = async (data: SchoolFormData) => {
    setIsLoading(true);
    
    // In a real app, this would update the data in the database
    // For now, we'll just simulate a successful update
    setTimeout(() => {
      setSchoolData(data);
      toast.success("Data sekolah berhasil diperbarui");
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-green-700">
          Data Sekolah
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama">Nama Sekolah</Label>
            <Input
              id="nama"
              placeholder="Nama Sekolah"
              {...register("nama", { required: "Nama sekolah wajib diisi" })}
            />
            {errors.nama && (
              <p className="text-red-500 text-sm">{errors.nama.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="alamat">Alamat</Label>
            <Input
              id="alamat"
              placeholder="Alamat Sekolah"
              {...register("alamat", { required: "Alamat wajib diisi" })}
            />
            {errors.alamat && (
              <p className="text-red-500 text-sm">{errors.alamat.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="telepon">Nomor Telepon</Label>
            <Input
              id="telepon"
              placeholder="Nomor Telepon"
              {...register("telepon", { required: "Nomor telepon wajib diisi" })}
            />
            {errors.telepon && (
              <p className="text-red-500 text-sm">{errors.telepon.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email Sekolah"
              {...register("email", {
                required: "Email wajib diisi",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Format email tidak valid"
                }
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
            {isLoading ? "Menyimpan..." : "Simpan Data Sekolah"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SchoolDataForm;
