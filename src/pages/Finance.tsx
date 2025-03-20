
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IncomeForm from "@/components/finance/IncomeForm";
import ExpenseForm from "@/components/finance/ExpenseForm";
import FinancialHistory from "@/components/finance/FinancialHistory";
import { api } from "@/utils/api";

const Finance = () => {
  // Role-based access check
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = () => {
      // This would be replaced with actual auth check in the PHP backend
      // For demo purposes, we'll simulate a logged in user with "bendahara" role
      const role = "bendahara"; // In real app, this would come from auth system
      setUserRole(role);
      setLoading(false);
    };

    checkUserRole();
    
    // When the component mounts, scroll to top
    window.scrollTo(0, 0);
  }, []);

  // If user doesn't have the "bendahara" role, show access denied message
  if (!loading && userRole !== "bendahara") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-10 text-center"
      >
        <h1 className="text-2xl font-bold text-red-600 mb-4">Akses Ditolak</h1>
        <p className="text-gray-700">
          Hanya bendahara yang diizinkan mengakses halaman ini.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-6"
    >
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 text-green-700">
        Manajemen Keuangan Madrasah At-Tahzib Kekait
      </h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-green-700 rounded-full border-t-transparent"></div>
        </div>
      ) : (
        <Tabs defaultValue="income" className="w-full">
          <TabsList className="w-full flex flex-wrap mb-6 h-auto">
            <TabsTrigger value="income" className="flex-1 py-2">Pemasukan</TabsTrigger>
            <TabsTrigger value="expense" className="flex-1 py-2">Pengeluaran</TabsTrigger>
            <TabsTrigger value="history" className="flex-1 py-2">Riwayat</TabsTrigger>
          </TabsList>
          
          <TabsContent value="income" className="pt-2">
            <IncomeForm />
          </TabsContent>
          
          <TabsContent value="expense" className="pt-2">
            <ExpenseForm />
          </TabsContent>
          
          <TabsContent value="history" className="pt-2">
            <FinancialHistory />
          </TabsContent>
        </Tabs>
      )}
    </motion.div>
  );
};

export default Finance;
