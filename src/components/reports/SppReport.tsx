
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api, formatRupiah, formatDate } from "@/utils/api";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "sonner";

interface SppReportProps {
  isReadOnly: boolean;
}

const SppReport = ({ isReadOnly }: SppReportProps) => {
  // State for filtering
  const [month, setMonth] = useState<string>(new Date().toLocaleString('id-ID', { month: 'long' }));
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [loading, setLoading] = useState<boolean>(false);
  const [sppData, setSppData] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  
  // Indonesian month names
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  
  // Years for select (last 5 years)
  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());

  // Load SPP data
  const loadSppReport = async () => {
    setLoading(true);
    try {
      // Fetch payment and student data
      const [sppRecords, studentRecords] = await Promise.all([
        api.getSpp(),
        api.getSiswa()
      ]);
      
      // Filter SPP by selected month and year
      const filteredSpp = sppRecords.filter(
        (spp: any) => spp.bulan === month && spp.tahun === year
      );
      
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
    // In a real app, this would call a PHP endpoint that generates Excel
    toast.success("Laporan SPP berhasil diunduh dalam format Excel");
  };
  
  // Handle download report as PDF
  const handleDownloadPdf = () => {
    // In a real app, this would call a PHP endpoint that generates PDF
    toast.success("Laporan SPP berhasil diunduh dalam format PDF");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Laporan Pembayaran SPP</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                <TableHead>Jumlah</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
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
                  <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                    {loading ? "Memuat data..." : "Belum ada data pembayaran SPP untuk periode ini"}
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
              <span>Total Pembayaran SPP ({month} {year}):</span>
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
