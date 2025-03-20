
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api, formatRupiah, formatDate } from "@/utils/api";
import { CheckCircle2, Search } from "lucide-react";

interface SPPRecord {
  id: number;
  siswa_id: number;
  tanggal: string;
  bulan: string;
  tahun: string;
  jumlah: number;
  status: string;
  pengguna_id: number;
  siswa?: {
    nama: string;
    nis: string;
  };
}

const StudentPaymentHistory = () => {
  const [payments, setPayments] = useState<SPPRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch payment data
        const sppData = await api.getSpp();
        const studentsData = await api.getSiswa();
        setStudents(studentsData);

        // Combine payment data with student information
        const combinedData = sppData.map((payment: SPPRecord) => {
          const student = studentsData.find((s: any) => s.id === payment.siswa_id);
          return {
            ...payment,
            siswa: student ? {
              nama: student.nama,
              nis: student.nis
            } : undefined
          };
        });

        setPayments(combinedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching payment data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter payments by search query
  const filteredPayments = payments.filter((payment) => {
    const studentName = payment.siswa?.nama || "";
    const studentNIS = payment.siswa?.nis || "";
    const searchLower = searchQuery.toLowerCase();
    
    return (
      studentName.toLowerCase().includes(searchLower) ||
      studentNIS.includes(searchQuery) ||
      payment.bulan.toLowerCase().includes(searchLower) ||
      payment.tahun.includes(searchQuery)
    );
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center justify-between">
            <span>Riwayat Pembayaran SPP</span>
          </CardTitle>
          <div className="relative">
            <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari berdasarkan nama, NIS, bulan, atau tahun..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin h-8 w-8 border-4 border-green-700 rounded-full border-t-transparent"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NIS</TableHead>
                    <TableHead>Nama Siswa</TableHead>
                    <TableHead>Bulan/Tahun</TableHead>
                    <TableHead>Tanggal Bayar</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.siswa?.nis || "-"}</TableCell>
                        <TableCell>{payment.siswa?.nama || "-"}</TableCell>
                        <TableCell>{`${payment.bulan} ${payment.tahun}`}</TableCell>
                        <TableCell>{formatDate(payment.tanggal)}</TableCell>
                        <TableCell>{formatRupiah(payment.jumlah)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                            <span>{payment.status}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                        {searchQuery 
                          ? "Tidak ada data pembayaran yang sesuai dengan pencarian" 
                          : "Belum ada data pembayaran SPP"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StudentPaymentHistory;
