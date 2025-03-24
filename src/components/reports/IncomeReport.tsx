
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
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, formatRupiah, formatDate, FinancialData } from "@/utils/api";
import { toast } from "sonner";
import { Download, FileText } from "lucide-react";

interface IncomeReportProps {
  isReadOnly: boolean;
}

const IncomeReport = ({ isReadOnly }: IncomeReportProps) => {
  const [incomeData, setIncomeData] = useState<FinancialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const currentDate = new Date();
    return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  });
  
  const months = [
    { value: '2023-01', label: 'Januari 2023' },
    { value: '2023-02', label: 'Februari 2023' },
    { value: '2023-03', label: 'Maret 2023' },
    { value: '2023-04', label: 'April 2023' },
    { value: '2023-05', label: 'Mei 2023' },
    { value: '2023-06', label: 'Juni 2023' },
    { value: '2023-07', label: 'Juli 2023' },
    { value: '2023-08', label: 'Agustus 2023' },
    { value: '2023-09', label: 'September 2023' },
    { value: '2023-10', label: 'Oktober 2023' },
    { value: '2023-11', label: 'November 2023' },
    { value: '2023-12', label: 'Desember 2023' },
    { value: '2024-01', label: 'Januari 2024' },
    { value: '2024-02', label: 'Februari 2024' },
    { value: '2024-03', label: 'Maret 2024' }
  ];

  useEffect(() => {
    fetchIncomeData();
  }, [selectedMonth]);

  const fetchIncomeData = async () => {
    setLoading(true);
    try {
      // In a real app, this would filter based on the selected month on the backend
      const income = await api.getPemasukan();
      
      // Since we're using a simulated API, we'll filter on the client side
      const [year, month] = selectedMonth.split('-').map(Number);
      
      const filteredData = income.filter(item => {
        const itemDate = new Date(item.tanggal);
        return itemDate.getFullYear() === year && itemDate.getMonth() + 1 === month;
      });
      
      setIncomeData(filteredData);
    } catch (error) {
      console.error("Error fetching income data:", error);
      toast.error("Gagal memuat data pemasukan");
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
  };

  const totalIncome = incomeData.reduce((sum, item) => sum + item.jumlah, 0);

  const handleDownloadExcel = () => {
    // In a real app, this would call the PHP backend endpoint that generates an Excel file
    toast.success("Mengunduh laporan Excel...");
    console.log("Downloading Excel report for:", selectedMonth);
    
    // Simulate delay for demonstration
    setTimeout(() => {
      toast.success("Laporan Excel berhasil diunduh");
    }, 1500);
  };

  const handleDownloadPDF = () => {
    // In a real app, this would call the PHP backend endpoint that generates a PDF file
    toast.success("Mengunduh laporan PDF...");
    console.log("Downloading PDF report for:", selectedMonth);
    
    // Simulate delay for demonstration
    setTimeout(() => {
      toast.success("Laporan PDF berhasil diunduh");
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span>Laporan Penerimaan Madrasah</span>
            <div className="flex items-center gap-2">
              <Label htmlFor="month-select" className="whitespace-nowrap">Filter Bulan:</Label>
              <Select value={selectedMonth} onValueChange={handleMonthChange}>
                <SelectTrigger id="month-select" className="w-[180px]">
                  <SelectValue placeholder="Pilih Bulan" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
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
                    <TableHead className="w-[100px]">No</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Keterangan</TableHead>
                    <TableHead className="text-right">Jumlah</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incomeData.length > 0 ? (
                    incomeData.map((income, index) => (
                      <TableRow key={income.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{formatDate(income.tanggal)}</TableCell>
                        <TableCell>{income.keterangan}</TableCell>
                        <TableCell className="text-right">{formatRupiah(income.jumlah)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                        Tidak ada data penerimaan pada bulan yang dipilih
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t">
          <div className="font-bold text-lg">
            Total: {formatRupiah(totalIncome)}
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleDownloadExcel} 
              variant="outline" 
              className="flex items-center gap-2"
              disabled={loading || isReadOnly}
            >
              <FileText className="h-4 w-4" />
              <span>Excel</span>
            </Button>
            <Button 
              onClick={handleDownloadPDF} 
              variant="default" 
              className="flex items-center gap-2"
              disabled={loading || isReadOnly}
            >
              <Download className="h-4 w-4" />
              <span>PDF</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default IncomeReport;
