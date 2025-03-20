
import { useState } from "react";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";

// Define form schema with Zod
const formSchema = z.object({
  tanggal: z.date({
    required_error: "Tanggal wajib diisi",
  }),
  jumlah: z.string().min(1, "Jumlah wajib diisi").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Jumlah harus berupa angka positif"
  ),
  keterangan: z.string().min(3, "Keterangan minimal 3 karakter"),
});

const IncomeForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tanggal: new Date(),
      jumlah: "",
      keterangan: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Convert string to number for the amount
      const numericAmount = Number(values.jumlah);
      
      // Format the date as ISO string (YYYY-MM-DD)
      const formattedDate = format(values.tanggal, "yyyy-MM-dd");
      
      // In a real implementation, this would be a POST request to PHP backend
      // For now, we'll use our simulated API
      // This would save data to the 'pemasukan' table in MySQL
      const result = await new Promise(resolve => {
        setTimeout(() => {
          console.log("Submitting income data:", {
            tanggal: formattedDate,
            jumlah: numericAmount,
            keterangan: values.keterangan,
            pengguna_id: 2 // ID of the bendahara user
          });
          resolve({ success: true });
        }, 1000);
      });
      
      // After successful submission, send WhatsApp notification
      await api.sendWhatsAppNotification(
        "81234567890", // This would be the school principal's number in production
        `Ada pemasukan baru: ${values.keterangan} sebesar Rp${Number(values.jumlah).toLocaleString('id-ID')}`
      );
      
      // Show success message
      toast.success("Pemasukan berhasil dicatat", {
        description: "Data telah tersimpan dan notifikasi terkirim"
      });
      
      // Reset form
      form.reset({
        tanggal: new Date(),
        jumlah: "",
        keterangan: "",
      });
    } catch (error) {
      console.error("Error submitting income:", error);
      toast.error("Gagal mencatat pemasukan", {
        description: "Terjadi kesalahan saat menyimpan data"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-xl font-semibold mb-4 text-green-700">Input Pemasukan</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="tanggal"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
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
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="jumlah"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jumlah (Rp)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Contoh: 1000000" 
                    type="text"
                    inputMode="numeric"
                    {...field} 
                    onChange={(e) => {
                      // Only allow numbers
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="keterangan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Keterangan</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Masukkan keterangan pemasukan" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Menyimpan...
              </>
            ) : "Simpan Pemasukan"}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
};

export default IncomeForm;
