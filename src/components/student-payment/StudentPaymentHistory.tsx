
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, formatRupiah, formatDate } from "@/utils/api";
import { CheckCircle2, CalendarIcon, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toLocaleString('id-ID', { month: 'long' }));
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  
  // Indonesian month names
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  
  // Years for select (last 5 years)
  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());

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

  // Filter payments by search query for the All tab
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

  // Filter payments by month and year for the Monthly tab
  const monthlyPayments = payments.filter(payment => 
    payment.bulan === selectedMonth && payment.tahun === selectedYear
  );

  // Calculate the total amount collected for the selected month and year
  const totalMonthlyAmount = monthlyPayments.reduce(
    (sum, payment) => sum + payment.jumlah, 
    0
  );

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
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full flex flex-wrap mb-6 h-auto">
              <TabsTrigger value="all" className="flex-1 py-2">Semua Pembayaran</TabsTrigger>
              <TabsTrigger value="monthly" className="flex-1 py-2">Pembayaran per Bulan</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="relative mb-4">
                <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari berdasarkan nama, NIS, bulan, atau tahun..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
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
            </TabsContent>
            
            <TabsContent value="monthly">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="month" className="mb-2 block">Bulan</Label>
                  <Select
                    value={selectedMonth}
                    onValueChange={setSelectedMonth}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih bulan" />
                    </SelectTrigger>
                    <SelectContent>
                      {monthNames.map((month) => (
                        <SelectItem key={month} value={month}>{month}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="year" className="mb-2 block">Tahun</Label>
                  <Select
                    value={selectedYear}
                    onValueChange={setSelectedYear}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih tahun" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center mb-4 p-3 bg-green-50 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="text-lg font-medium text-green-800">
                  Pembayaran SPP Bulan {selectedMonth} {selectedYear}
                </h3>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin h-8 w-8 border-4 border-green-700 rounded-full border-t-transparent"></div>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>NIS</TableHead>
                          <TableHead>Nama Siswa</TableHead>
                          <TableHead>Tanggal Bayar</TableHead>
                          <TableHead>Jumlah</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {monthlyPayments.length > 0 ? (
                          monthlyPayments.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell>{payment.siswa?.nis || "-"}</TableCell>
                              <TableCell>{payment.siswa?.nama || "-"}</TableCell>
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
                            <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                              {`Belum ada pembayaran SPP untuk bulan ${selectedMonth} ${selectedYear}`}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Total Pembayaran SPP {selectedMonth} {selectedYear}:</h4>
                      <span className="text-xl font-bold text-green-700">{formatRupiah(totalMonthlyAmount)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Jumlah siswa yang telah membayar: {monthlyPayments.length} siswa
                    </p>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StudentPaymentHistory;
