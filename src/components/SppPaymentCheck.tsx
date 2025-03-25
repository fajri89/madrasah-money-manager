
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/utils/api";
import { motion } from "framer-motion";

interface PaymentRecord {
  id: number;
  studentName: string;
  nisn: string;
  period: string;
  amount: number;
  status: "Lunas" | "Belum Lunas";
}

const SppPaymentCheck = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PaymentRecord[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      // In a real app, this would be an API call to search payments
      // For demo purposes, we'll simulate some results
      
      const dummyResults: PaymentRecord[] = [
        {
          id: 1,
          studentName: "Ahmad Rizki",
          nisn: "1234567890",
          period: "Januari 2023",
          amount: 150000,
          status: "Lunas"
        },
        {
          id: 2,
          studentName: "Ahmad Rizki",
          nisn: "1234567890",
          period: "Februari 2023",
          amount: 150000,
          status: "Lunas"
        },
        {
          id: 3,
          studentName: "Ahmad Rizki",
          nisn: "1234567890",
          period: "Maret 2023",
          amount: 150000,
          status: "Belum Lunas"
        }
      ];
      
      // Simulate search delay
      setTimeout(() => {
        setSearchResults(dummyResults);
        setSearching(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error searching payments:", error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <img 
              src="/lovable-uploads/ec06af05-0ccf-4881-b9fd-985fbd2d8ba3.png" 
              alt="Logo Madrasah Aliyah At-Tahzib Kekait" 
              className="h-16 w-auto mx-auto pb-2"
            />
          </div>
          <CardTitle className="text-xl font-semibold text-center text-green-700">
            Cek Pembayaran SPP
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search-query">Nama Siswa atau NISN</Label>
              <Input
                id="search-query"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Masukkan nama atau NISN siswa"
                className="w-full"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-green-700 hover:bg-green-800"
              disabled={searching}
            >
              {searching ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                  <span>Mencari...</span>
                </div>
              ) : (
                "Cek Pembayaran"
              )}
            </Button>
          </form>
          
          {searchResults.length > 0 && (
            <div className="mt-6">
              <Table>
                <TableCaption>Riwayat Pembayaran SPP</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Siswa</TableHead>
                    <TableHead>NISN</TableHead>
                    <TableHead>Bulan/Tahun</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.studentName}</TableCell>
                      <TableCell>{record.nisn}</TableCell>
                      <TableCell>{record.period}</TableCell>
                      <TableCell>Rp {record.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <span 
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            record.status === "Lunas" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {record.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SppPaymentCheck;
