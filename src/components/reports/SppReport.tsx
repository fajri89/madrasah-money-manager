
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
import { api, formatRupiah, SppData } from "@/utils/api";
import { toast } from "sonner";
import { Download, FileText } from "lucide-react";

interface SPPReportProps {
  isReadOnly: boolean;
}

interface ExtendedSppData extends SppData {
  siswa_nama?: string;
  siswa_nis?: string;
}

const SppReport = ({ isReadOnly }: SPPReportProps) => {
  const [sppData, setSppData] = useState<ExtendedSppData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>("Januari");
  const [selectedYear, setSelectedYear] = useState<string>("2023");
  
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  
  const years = ["2022", "2023", "2024"];

  useEffect(() => {
    fetchSppData();
  }, [selectedMonth, selectedYear]);

  const fetchSppData = async () => {
    setLoading(true);
    try {
      // In a real app, this would filter based on the selected month on the backend
      const allSpp = await api.getSpp();
      const students = await api.getSiswa();
      
      // Since we're using a simulated API, we'll filter on the client side
      const filteredData = allSpp.filter(item => {
        return item.bulan === selectedMonth && item.tahun === selectedYear && item.status === "Lunas";
      });
      
      // Add student information to SPP records
      const enhancedData = filteredData.map(sppItem => {
        const student = students.find(s => s.id === sppItem.siswa_id);
        return {
          ...sppItem,
          siswa_nama: student ? student.nama : "Tidak ditemukan",
          siswa_nis: student ? student.nis : "N/A"
        };
      });
      
      setSppData(enhancedData);
    } catch (error) {
      console.error("Error fetching SPP data:", error);
      toast.error("Gagal memuat data SPP");
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
  };

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
  };

  const totalSpp = sppData.reduce((sum, item) => sum + item.jumlah, 0);

  const handleDownloadExcel = () => {
    // In a real app, this would call the PHP backend endpoint that generates an Excel file
    toast.success("Mengunduh laporan Excel...");
    console.log("Downloading Excel report for:", `${selectedMonth} ${selectedYear}`);
    
    // Simulate delay for demonstration
    setTimeout(() => {
      toast.success("Laporan Excel berhasil diunduh");
    }, 1500);
  };

  const handleDownloadPDF = () => {
    // In a real app, this would call the PHP backend endpoint that generates a PDF file
    toast.success("Mengunduh laporan PDF...");
    console.log("Downloading PDF report for:", `${selectedMonth} ${selectedYear}`);
    
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
            <span>Laporan Pembayaran SPP Siswa</span>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="month-select">Bulan:</Label>
                <Select value={selectedMonth} onValueChange={handleMonthChange}>
                  <SelectTrigger id="month-select" className="w-[150px]">
                    <SelectValue placeholder="Pilih Bulan" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Label htmlFor="year-select">Tahun:</Label>
                <Select value={selectedYear} onValueChange={handleYearChange}>
                  <SelectTrigger id="year-select" className="w-[100px]">
                    <SelectValue placeholder="Pilih Tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                    <TableHead>NIS</TableHead>
                    <TableHead>Nama Siswa</TableHead>
                    <TableHead>Tanggal Bayar</TableHead>
                    <TableHead className="text-right">Jumlah</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sppData.length > 0 ? (
                    sppData.map((spp, index) => (
                      <TableRow key={spp.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{spp.siswa_nis}</TableCell>
                        <TableCell>{spp.siswa_nama}</TableCell>
                        <TableCell>{formatDate(spp.tanggal)}</TableCell>
                        <TableCell className="text-right">{formatRupiah(spp.jumlah)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                        Belum ada siswa yang membayar SPP pada bulan {selectedMonth} {selectedYear}
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
            Total: {formatRupiah(totalSpp)}
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

export default SppReport;
