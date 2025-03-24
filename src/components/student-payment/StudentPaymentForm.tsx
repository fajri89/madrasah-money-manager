
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CalendarIcon, Send } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { api } from "@/utils/api";
import { sendWhatsAppNotification, createNotificationMessages } from "@/utils/whatsAppIntegration";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

// Form validation schema
const formSchema = z.object({
  siswa_id: z.string({
    required_error: "Pilih siswa",
  }),
  bulan: z.string({
    required_error: "Pilih bulan",
  }),
  tahun: z.string({
    required_error: "Masukkan tahun",
  }),
  tanggal: z.date({
    required_error: "Pilih tanggal pembayaran",
  }),
  jumlah: z.string().min(1, {
    message: "Masukkan jumlah pembayaran",
  }).refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Jumlah harus berupa angka positif"
  ),
});

type FormValues = z.infer<typeof formSchema>;

const StudentPaymentForm = () => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [studentPhone, setStudentPhone] = useState("");

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      siswa_id: "",
      bulan: "",
      tahun: new Date().getFullYear().toString(),
      tanggal: new Date(),
      jumlah: "250000", // Default SPP amount
    },
  });

  // Get students on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await api.getSiswa();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
        toast.error("Gagal memuat data siswa");
      }
    };

    fetchStudents();
  }, []);

  // Handle student selection to get their phone number
  const handleStudentChange = (studentId: string) => {
    const selectedStudent = students.find(
      (student) => student.id.toString() === studentId
    );
    if (selectedStudent) {
      setStudentPhone(selectedStudent.telepon || "");
    }
  };

  // Months in Indonesian
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setLoading(true);

    try {
      // Prepare SPP payment data
      const sppData = {
        siswa_id: parseInt(data.siswa_id),
        bulan: data.bulan,
        tahun: data.tahun,
        tanggal: format(data.tanggal, "yyyy-MM-dd"),
        jumlah: parseInt(data.jumlah),
        status: "Lunas",
        pengguna_id: 2, // Assuming user ID 2 is bendahara
      };

      // Get student name for notification
      const student = students.find(
        (s) => s.id.toString() === data.siswa_id
      );
      const studentName = student ? student.nama : "Siswa";
      const formattedDate = format(data.tanggal, "dd MMMM yyyy", { locale: id });

      // This would be a POST request to PHP backend in a real implementation
      // For now, we'll simulate it with our API utility
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

      // Create notification messages using our utility
      const messages = createNotificationMessages.sppPayment(
        studentName,
        data.bulan,
        data.tahun,
        parseInt(data.jumlah),
        formattedDate
      );
      
      // Send WhatsApp notification to kepala sekolah
      await sendWhatsAppNotification("081234567890", messages.toHeadmaster);
      
      // Send WhatsApp notification to parent if phone number is available
      if (studentPhone) {
        await sendWhatsAppNotification(studentPhone, messages.toParent);
      }

      // Show success notification
      toast.success("Pembayaran SPP berhasil disimpan", {
        description: `${studentName} - ${data.bulan} ${data.tahun}`,
      });

      // Reset form
      form.reset({
        siswa_id: "",
        bulan: "",
        tahun: new Date().getFullYear().toString(),
        tanggal: new Date(),
        jumlah: "250000",
      });
    } catch (error) {
      console.error("Error saving payment:", error);
      toast.error("Gagal menyimpan pembayaran");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Student Selection */}
              <FormField
                control={form.control}
                name="siswa_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Siswa</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleStudentChange(value);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih siswa" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem
                            key={student.id}
                            value={student.id.toString()}
                          >
                            {student.nis} - {student.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Month Selection */}
              <FormField
                control={form.control}
                name="bulan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bulan</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih bulan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month} value={month}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Year Input */}
              <FormField
                control={form.control}
                name="tahun"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tahun</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="2000" max="2100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date Selection */}
              <FormField
                control={form.control}
                name="tanggal"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tanggal Pembayaran</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value && "text-muted-foreground"
                            }`}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: id })
                            ) : (
                              <span>Pilih tanggal</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Amount Input */}
              <FormField
                control={form.control}
                name="jumlah"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jumlah Pembayaran (Rp)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" step="1000" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full"></div>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Simpan Pembayaran
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StudentPaymentForm;
