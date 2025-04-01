
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api, formatRupiah, formatDate, getYears } from "@/utils/api";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const StudentPaymentHistory = () => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toLocaleString("id-ID", { month: "long" })
  );
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [monthlyTotal, setMonthlyTotal] = useState<number>(0);

  // Indonesian months
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

  // Years 2025-2030
  const years = getYears();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("Fetching SPP and student data...");
        const [paymentsData, studentsData] = await Promise.all([
          api.getSpp(),
          api.getSiswa()
        ]);

        console.log("Received SPP data:", paymentsData);
        console.log("Received student data:", studentsData);

        setPayments(paymentsData);
        setStudents(studentsData);

        // Calculate monthly total for the current selection
        updateMonthlyTotal(paymentsData, selectedMonth, selectedYear);
      } catch (error) {
        console.error("Error fetching payment data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update calculations when month/year selection changes
  useEffect(() => {
    updateMonthlyTotal(payments, selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear, payments]);

  // Filter and calculate monthly total
  const updateMonthlyTotal = (allPayments: any[], month: string, year: string) => {
    const filteredPayments = allPayments.filter(
      payment => payment.bulan === month && payment.tahun === year && payment.status === "Lunas"
    );

    const total = filteredPayments.reduce(
      (sum, payment) => sum + payment.jumlah,
      0
    );

    setMonthlyTotal(total);
  };

  // Get filtered payments for current month/year
  const filteredPayments = payments.filter(
    payment => 
      payment.bulan === selectedMonth && 
      payment.tahun === selectedYear && 
      payment.status === "Lunas"
  );

  // Find student by id
  const getStudentById = (studentId: number) => {
    return students.find(s => s.id === studentId);
  };

  // Handle month change
  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
  };

  // Handle year change
  const handleYearChange = (value: string) => {
    setSelectedYear(value);
  };

  // Function to handle the display button click
  const handleDisplayClick = () => {
    updateMonthlyTotal(payments, selectedMonth, selectedYear);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Riwayat Pembayaran SPP</CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="month">Bulan</Label>
              <Select
                value={selectedMonth}
                onValueChange={handleMonthChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih bulan" />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="year">Tahun</Label>
              <Select
                value={selectedYear}
                onValueChange={handleYearChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tahun" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button className="w-full" onClick={handleDisplayClick}>
                Tampilkan
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-green-600 rounded-full border-t-transparent"></div>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-gray-400 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p>Tidak ada data pembayaran untuk {selectedMonth} {selectedYear}</p>
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
                    {filteredPayments.map((payment) => {
                      const student = getStudentById(payment.siswa_id);
                      return (
                        <TableRow key={payment.id}>
                          <TableCell>{student?.nis || "-"}</TableCell>
                          <TableCell>{student?.nama || "-"}</TableCell>
                          <TableCell>{formatDate(payment.tanggal)}</TableCell>
                          <TableCell>{formatRupiah(payment.jumlah)}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              {payment.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between font-medium">
                  <span>Total Pembayaran SPP ({selectedMonth} {selectedYear}):</span>
                  <span className="text-green-700">{formatRupiah(monthlyTotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>Jumlah Siswa Bayar:</span>
                  <span>{filteredPayments.length} siswa</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StudentPaymentHistory;
