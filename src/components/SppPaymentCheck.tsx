
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, User } from "lucide-react";
import { formatRupiah, formatDate } from "@/utils/api";

interface SppPayment {
  bulan: string;
  tahun: string;
  tanggal: string;
  jumlah: number;
  status: string;
}

interface StudentPaymentDetails {
  nama: string;
  nis: string;
  kelas: string;
  jurusan: string;
  pembayaran: SppPayment[];
}

const SppPaymentCheck = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<StudentPaymentDetails | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError("Silakan masukkan Nama Siswa atau NISN");
      return;
    }
    
    setIsSearching(true);
    setError("");
    
    try {
      // In a real implementation, this would be an API call to the backend
      // For this demo, we'll simulate a response with dummy data
      setTimeout(() => {
        // Simulate finding a student based on the query
        if (searchQuery.toLowerCase().includes("ahmad") || searchQuery === "2021001") {
          setPaymentDetails({
            nama: "Ahmad Fauzi",
            nis: "2021001",
            kelas: "X",
            jurusan: "IPA",
            pembayaran: [
              { bulan: "Januari", tahun: "2023", tanggal: "2023-01-10", jumlah: 250000, status: "Lunas" },
              { bulan: "Februari", tahun: "2023", tanggal: "2023-02-05", jumlah: 250000, status: "Lunas" },
              { bulan: "Maret", tahun: "2023", tanggal: "2023-03-07", jumlah: 250000, status: "Lunas" },
              { bulan: "April", tahun: "2023", tanggal: "", jumlah: 250000, status: "Belum Lunas" },
            ]
          });
        } else if (searchQuery.toLowerCase().includes("siti") || searchQuery === "2021002") {
          setPaymentDetails({
            nama: "Siti Aisyah",
            nis: "2021002",
            kelas: "X",
            jurusan: "IPS",
            pembayaran: [
              { bulan: "Januari", tahun: "2023", tanggal: "2023-01-15", jumlah: 250000, status: "Lunas" },
              { bulan: "Februari", tahun: "2023", tanggal: "2023-02-12", jumlah: 250000, status: "Lunas" },
              { bulan: "Maret", tahun: "2023", tanggal: "", jumlah: 250000, status: "Belum Lunas" },
              { bulan: "April", tahun: "2023", tanggal: "", jumlah: 250000, status: "Belum Lunas" },
            ]
          });
        } else {
          setError("Siswa tidak ditemukan. Pastikan nama atau NISN benar.");
          setPaymentDetails(null);
        }
        setIsSearching(false);
      }, 1000);
    } catch (error) {
      setError("Terjadi kesalahan saat mencari data.");
      setPaymentDetails(null);
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <CardContent className="p-0">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search-query">Nama Siswa atau NISN</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="search-query"
                type="text"
                placeholder="Masukkan nama siswa atau NISN"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          
          <Button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800"
            disabled={isSearching}
          >
            {isSearching ? (
              <div className="flex items-center">
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                <span>Mencari...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <Search className="mr-2 h-4 w-4" />
                <span>Cek Pembayaran SPP</span>
              </div>
            )}
          </Button>
        </form>
      </CardContent>
      
      {paymentDetails && (
        <CardContent className="p-4 pt-0">
          <Card className="border-t-4 border-t-green-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Informasi Siswa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-semibold">Nama:</div>
                <div>{paymentDetails.nama}</div>
                <div className="font-semibold">NISN:</div>
                <div>{paymentDetails.nis}</div>
                <div className="font-semibold">Kelas:</div>
                <div>{paymentDetails.kelas}</div>
                <div className="font-semibold">Jurusan:</div>
                <div>{paymentDetails.jurusan}</div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Riwayat Pembayaran SPP</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bulan</TableHead>
                    <TableHead>Tahun</TableHead>
                    <TableHead>Tanggal Bayar</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentDetails.pembayaran.map((payment, index) => (
                    <TableRow key={index}>
                      <TableCell>{payment.bulan}</TableCell>
                      <TableCell>{payment.tahun}</TableCell>
                      <TableCell>{payment.tanggal ? formatDate(payment.tanggal) : "-"}</TableCell>
                      <TableCell>{formatRupiah(payment.jumlah)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          payment.status === "Lunas" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {payment.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      )}
    </div>
  );
};

export default SppPaymentCheck;
