
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
import { Download, FileText, Calendar } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { addReportHeader } from "@/utils/reportUtils";

interface IncomeReportProps {
  isReadOnly: boolean;
}

const IncomeReport = ({ isReadOnly }: IncomeReportProps) => {
  const [incomeData, setIncomeData] = useState<FinancialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"month" | "year">("month");
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const currentDate = new Date();
    return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedYear, setSelectedYear] = useState<string>(() => {
    return new Date().getFullYear().toString();
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
  
  const years = ['2023', '2024', '2025', '2026', '2027'];

  useEffect(() => {
    fetchIncomeData();
  }, []);

  const fetchIncomeData = async () => {
    setLoading(true);
    try {
      // In a real app, this would filter based on the selected month on the backend
      const income = await api.getPemasukan();
      
      let filteredData;
      
      if (filterType === "month") {
        // Since we're using a simulated API, we'll filter on the client side
        const [year, month] = selectedMonth.split('-').map(Number);
        
        filteredData = income.filter(item => {
          const itemDate = new Date(item.tanggal);
          return itemDate.getFullYear() === year && itemDate.getMonth() + 1 === month;
        });
      } else {
        // Filter by year only
        const year = Number(selectedYear);
        
        filteredData = income.filter(item => {
          const itemDate = new Date(item.tanggal);
          return itemDate.getFullYear() === year;
        });
      }
      
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
  
  const handleYearChange = (value: string) => {
    setSelectedYear(value);
  };
  
  const handleFilterTypeChange = (value: string) => {
    if (value) {
      setFilterType(value as "month" | "year");
    }
  };

  const totalIncome = incomeData.reduce((sum, item) => sum + item.jumlah, 0);

  const handleDownloadExcel = () => {
    try {
      // Prepare data for Excel
      const excelData = incomeData.map((income, index) => ({
        No: index + 1,
        Tanggal: formatDate(income.tanggal),
        Keterangan: income.keterangan,
        Jumlah: income.jumlah
      }));

      // Create workbook and worksheet
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Income Data");

      // Generate filename
      let fileName;
      if (filterType === "month") {
        const [year, month] = selectedMonth.split('-');
        const monthLabel = months.find(m => m.value === selectedMonth)?.label.split(' ')[0] || `Bulan-${month}`;
        fileName = `Laporan_Penerimaan_${monthLabel}_${year}.xlsx`;
      } else {
        fileName = `Laporan_Penerimaan_Tahun_${selectedYear}.xlsx`;
      }

      // Write and download the file
      XLSX.writeFile(wb, fileName);
      toast.success("Laporan Excel berhasil diunduh");
    } catch (error) {
      console.error("Error downloading Excel:", error);
      toast.error("Gagal mengunduh file Excel");
    }
  };

  const handleDownloadPDF = () => {
    try {
      // Create new PDF document
      const doc = new jsPDF();
      
      // Add report title
      let title;
      if (filterType === "month") {
        const [year, month] = selectedMonth.split('-');
        const monthLabel = months.find(m => m.value === selectedMonth)?.label || `Bulan ${month}/${year}`;
        title = `Laporan Penerimaan ${monthLabel}`;
      } else {
        title = `Laporan Penerimaan Tahun ${selectedYear}`;
      }
      
      // Add header with logo
      addReportHeader(doc, title);
      
      // Prepare table data
      const tableColumn = ["No", "Tanggal", "Keterangan", "Jumlah"];
      const tableRows = incomeData.map((income, index) => [
        index + 1,
        formatDate(income.tanggal),
        income.keterangan,
        formatRupiah(income.jumlah).replace("Rp", "").trim()
      ]);
      
      // Add table
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 50,
        theme: 'grid',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [76, 175, 80] }
      });
      
      // Add total
      const finalY = doc.lastAutoTable.finalY || 50;
      doc.setFontSize(10);
      doc.text(`Total Penerimaan: ${formatRupiah(totalIncome)}`, 14, finalY + 10);
      
      // Generate filename
      let fileName;
      if (filterType === "month") {
        const [year, month] = selectedMonth.split('-');
        const monthLabel = months.find(m => m.value === selectedMonth)?.label.split(' ')[0] || `Bulan-${month}`;
        fileName = `Laporan_Penerimaan_${monthLabel}_${year}.pdf`;
      } else {
        fileName = `Laporan_Penerimaan_Tahun_${selectedYear}.pdf`;
      }
      
      // Save the PDF
      doc.save(fileName);
      toast.success("Laporan PDF berhasil diunduh");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Gagal mengunduh file PDF");
    }
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
            
            <div className="flex flex-col space-y-4">
              <ToggleGroup type="single" value={filterType} onValueChange={handleFilterTypeChange} className="justify-start">
                <ToggleGroupItem value="month" className="flex gap-2">
                  <Calendar size={16} />
                  <span>Bulanan</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="year" className="flex gap-2">
                  <Calendar size={16} />
                  <span>Tahunan</span>
                </ToggleGroupItem>
              </ToggleGroup>

              <div className="flex items-center gap-2">
                {filterType === "month" ? (
                  <>
                    <Label htmlFor="month-select" className="whitespace-nowrap">Bulan:</Label>
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
                  </>
                ) : (
                  <>
                    <Label htmlFor="year-select" className="whitespace-nowrap">Tahun:</Label>
                    <Select value={selectedYear} onValueChange={handleYearChange}>
                      <SelectTrigger id="year-select" className="w-[180px]">
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
                  </>
                )}
                <Button onClick={fetchIncomeData} size="sm">
                  Tampilkan
                </Button>
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
                        {filterType === "month" 
                          ? "Tidak ada data penerimaan pada bulan yang dipilih"
                          : "Tidak ada data penerimaan pada tahun yang dipilih"}
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
              disabled={loading || isReadOnly || incomeData.length === 0}
            >
              <FileText className="h-4 w-4" />
              <span>Excel</span>
            </Button>
            <Button 
              onClick={handleDownloadPDF} 
              variant="default" 
              className="flex items-center gap-2"
              disabled={loading || isReadOnly || incomeData.length === 0}
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
