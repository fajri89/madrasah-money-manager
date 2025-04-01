
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api, formatRupiah, formatDate, getYears } from "@/utils/api";
import { Download, FileSpreadsheet, FileText, Calendar } from "lucide-react";
import { toast } from "sonner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { addReportHeader } from "@/utils/reportUtils";

interface SppReportProps {
  isReadOnly: boolean;
}

const SppReport = ({ isReadOnly }: SppReportProps) => {
  // State for filtering
  const [month, setMonth] = useState<string>(new Date().toLocaleString('id-ID', { month: 'long' }));
  const [year, setYear] = useState<string>("2025");
  const [loading, setLoading] = useState<boolean>(false);
  const [sppData, setSppData] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<"month" | "year">("month");
  
  // Indonesian month names
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  
  // Years for select (2025-2030)
  const years = getYears();

  // Load data when component mounts
  useEffect(() => {
    loadSppReport();
  }, []);
  
  // Load SPP data
  const loadSppReport = async () => {
    setLoading(true);
    try {
      // Fetch payment and student data
      const [sppRecords, studentRecords] = await Promise.all([
        api.getSpp(),
        api.getSiswa()
      ]);
      
      let filteredSpp;
      
      if (filterType === "month") {
        // Filter SPP by selected month and year
        filteredSpp = sppRecords.filter(
          (spp: any) => spp.bulan === month && spp.tahun === year
        );
      } else {
        // Filter SPP by selected year only
        filteredSpp = sppRecords.filter(
          (spp: any) => spp.tahun === year
        );
      }
      
      // Combine with student data
      const combinedData = filteredSpp.map((spp: any) => {
        const student = studentRecords.find((s: any) => s.id === spp.siswa_id);
        const className = api.kelas.find((k: any) => k.id === student?.kelas_id)?.nama || '';
        
        return {
          ...spp,
          student: student ? { 
            nama: student.nama,
            nis: student.nis,
            kelas: className
          } : null
        };
      });
      
      setSppData(combinedData);
      setStudents(studentRecords);
    } catch (error) {
      console.error("Error loading SPP report:", error);
      toast.error("Gagal memuat data laporan SPP");
    } finally {
      setLoading(false);
    }
  };

  // Calculate total SPP
  const totalSpp = sppData.reduce((sum, item) => sum + item.jumlah, 0);
  
  // Handle download report as Excel
  const handleDownloadExcel = () => {
    try {
      // Prepare data for Excel
      const excelData = sppData.map((payment) => ({
        NIS: payment.student?.nis || "-",
        "Nama Siswa": payment.student?.nama || "-",
        Kelas: payment.student?.kelas || "-",
        "Tanggal Bayar": formatDate(payment.tanggal),
        Bulan: payment.bulan,
        Tahun: payment.tahun,
        Jumlah: payment.jumlah,
        Status: payment.status
      }));

      // Create workbook and worksheet
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "SPP Data");

      // Generate file name
      const fileName = filterType === "month" 
        ? `Laporan_SPP_${month}_${year}.xlsx`
        : `Laporan_SPP_Tahun_${year}.xlsx`;

      // Write and download the file
      XLSX.writeFile(wb, fileName);
      toast.success("Laporan SPP berhasil diunduh dalam format Excel");
    } catch (error) {
      console.error("Error downloading Excel:", error);
      toast.error("Gagal mengunduh file Excel");
    }
  };
  
  // Handle download report as PDF
  const handleDownloadPdf = () => {
    try {
      // Create new PDF document
      const doc = new jsPDF();
      
      // Add title
      const title = filterType === "month"
        ? `Laporan SPP Bulan ${month} ${year}`
        : `Laporan SPP Tahun ${year}`;
      
      // Add header with logo
      addReportHeader(doc, title);
      
      // Prepare table data
      const tableColumn = ["NIS", "Nama Siswa", "Kelas", "Tanggal", "Jumlah", "Status"];
      const tableRows = sppData.map((payment) => [
        payment.student?.nis || "-",
        payment.student?.nama || "-",
        payment.student?.kelas || "-",
        formatDate(payment.tanggal),
        formatRupiah(payment.jumlah).replace("Rp", "").trim(),
        payment.status
      ]);
      
      // Add summary
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 50,
        theme: 'grid',
        styles: { fontSize: 8 },
        columnStyles: { 0: { cellWidth: 25 } },
        headStyles: { fillColor: [76, 175, 80] }
      });
      
      // Add total
      const finalY = doc.lastAutoTable.finalY || 50;
      doc.setFontSize(10);
      doc.text(`Total Pembayaran: ${formatRupiah(totalSpp)}`, 14, finalY + 10);
      doc.text(`Jumlah Siswa: ${sppData.length}`, 14, finalY + 15);
      
      // Generate file name
      const fileName = filterType === "month" 
        ? `Laporan_SPP_${month}_${year}.pdf`
        : `Laporan_SPP_Tahun_${year}.pdf`;
      
      // Save the PDF
      doc.save(fileName);
      toast.success("Laporan SPP berhasil diunduh dalam format PDF");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Gagal mengunduh file PDF");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Laporan Pembayaran SPP</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Label htmlFor="filter-type" className="mb-2 block">Tipe Laporan</Label>
          <ToggleGroup type="single" value={filterType} onValueChange={(value) => value && setFilterType(value as "month" | "year")} className="mb-4 justify-start">
            <ToggleGroupItem value="month" className="flex gap-2">
              <Calendar size={16} />
              <span>Bulanan</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="year" className="flex gap-2">
              <Calendar size={16} />
              <span>Tahunan</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {filterType === "month" && (
            <div>
              <Label htmlFor="month">Bulan</Label>
              <Select
                value={month}
                onValueChange={setMonth}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih bulan" />
                </SelectTrigger>
                <SelectContent>
                  {monthNames.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div>
            <Label htmlFor="year">Tahun</Label>
            <Select
              value={year}
              onValueChange={setYear}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih tahun" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button onClick={loadSppReport} className="w-full">
              Tampilkan
            </Button>
          </div>
        </div>
        
        {/* Download buttons */}
        {sppData.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <Button variant="outline" onClick={handleDownloadExcel} className="flex gap-2">
              <FileSpreadsheet size={16} />
              <span>Download Excel</span>
            </Button>
            <Button variant="outline" onClick={handleDownloadPdf} className="flex gap-2">
              <FileText size={16} />
              <span>Download PDF</span>
            </Button>
          </div>
        )}
        
        {/* SPP data table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NIS</TableHead>
                <TableHead>Nama Siswa</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Tanggal Bayar</TableHead>
                {filterType === "year" && <TableHead>Bulan</TableHead>}
                <TableHead>Jumlah</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={filterType === "year" ? 7 : 6} className="text-center py-10">
                    <div className="flex justify-center">
                      <div className="animate-spin h-6 w-6 border-4 border-green-700 rounded-full border-t-transparent"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : sppData.length > 0 ? (
                sppData.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.student?.nis || "-"}</TableCell>
                    <TableCell>{payment.student?.nama || "-"}</TableCell>
                    <TableCell>{payment.student?.kelas || "-"}</TableCell>
                    <TableCell>{formatDate(payment.tanggal)}</TableCell>
                    {filterType === "year" && <TableCell>{payment.bulan}</TableCell>}
                    <TableCell>{formatRupiah(payment.jumlah)}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {payment.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={filterType === "year" ? 7 : 6} className="text-center py-10 text-gray-500">
                    {loading ? "Memuat data..." : filterType === "month" 
                      ? "Belum ada data pembayaran SPP untuk bulan ini"
                      : "Belum ada data pembayaran SPP untuk tahun ini"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Summary */}
        {sppData.length > 0 && (
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between font-medium">
              <span>Total Pembayaran SPP: {filterType === "month" ? `(${month} ${year})` : `(Tahun ${year})`}</span>
              <span className="text-green-700">{formatRupiah(totalSpp)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>Jumlah Siswa Bayar:</span>
              <span>{sppData.length} siswa</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SppReport;
