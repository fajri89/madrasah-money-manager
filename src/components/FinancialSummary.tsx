
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMonthlySummary, formatRupiah } from "@/utils/api";
import { slideUp } from "@/utils/transitions";
import { ArrowDown, ArrowUp, Wallet } from "lucide-react";

const FinancialSummary = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["financial-summary"],
    queryFn: getMonthlySummary
  });

  // Get current month name in Indonesian
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const currentMonth = months[new Date().getMonth()];
  
  // Calculate monthly totals
  const totalIncome = data?.income.find(item => item.name === currentMonth)?.value || 0;
  const totalExpenses = data?.expenses.find(item => item.name === currentMonth)?.value || 0;
  const totalSpp = data?.spp.find(item => item.name === currentMonth)?.value || 0;
  
  // Calculate balance
  const balance = totalIncome - totalExpenses;
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
    >
      {/* Total Penerimaan */}
      <motion.div variants={slideUp}>
        <Card className="overflow-hidden border-green-100 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-2 bg-green-50">
            <CardTitle className="text-md font-medium text-green-700">Penerimaan</CardTitle>
            <ArrowUp className="h-5 w-5 text-green-700" />
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <p className="text-2xl font-bold">{formatRupiah(totalIncome)}</p>
            <p className="text-xs text-gray-500 mt-1">Bulan {currentMonth}</p>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Total Pengeluaran */}
      <motion.div variants={slideUp}>
        <Card className="overflow-hidden border-red-100 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-2 bg-red-50">
            <CardTitle className="text-md font-medium text-red-700">Pengeluaran</CardTitle>
            <ArrowDown className="h-5 w-5 text-red-700" />
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <p className="text-2xl font-bold">{formatRupiah(totalExpenses)}</p>
            <p className="text-xs text-gray-500 mt-1">Bulan {currentMonth}</p>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Saldo */}
      <motion.div variants={slideUp}>
        <Card className="overflow-hidden border-blue-100 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-2 bg-blue-50">
            <CardTitle className="text-md font-medium text-blue-700">Saldo</CardTitle>
            <Wallet className="h-5 w-5 text-blue-700" />
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatRupiah(balance)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Per {currentMonth}</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default FinancialSummary;
