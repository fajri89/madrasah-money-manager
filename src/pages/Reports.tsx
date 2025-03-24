
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import IncomeReport from "@/components/reports/IncomeReport";
import ExpenseReport from "@/components/reports/ExpenseReport";
import SppReport from "@/components/reports/SppReport";

const Reports = () => {
  // Role-based access check
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = () => {
      // This would be replaced with actual auth check in the PHP backend
      // For demo purposes, we'll simulate a logged in user with "admin" role
      const role = "admin"; // In real app, this would come from auth system - can be "admin" or "kepala_sekolah"
      setUserRole(role);
      setLoading(false);
    };

    checkUserRole();
    
    // When the component mounts, scroll to top
    window.scrollTo(0, 0);
  }, []);

  // If user doesn't have the "admin" or "kepala_sekolah" role, show access denied message
  if (!loading && userRole !== "admin" && userRole !== "kepala_sekolah") {
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
          Hanya admin dan kepala sekolah yang diizinkan mengakses halaman ini.
        </p>
      </motion.div>
    );
  }

  const isReadOnly = userRole === "kepala_sekolah";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-6"
    >
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 text-green-700">
        Laporan Keuangan Madrasah At-Tahzib Kekait
      </h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-green-700 rounded-full border-t-transparent"></div>
        </div>
      ) : (
        <Tabs defaultValue="income" className="w-full">
          <TabsList className="w-full flex flex-wrap mb-6 h-auto">
            <TabsTrigger value="income" className="flex-1 py-2">Laporan Penerimaan</TabsTrigger>
            <TabsTrigger value="expense" className="flex-1 py-2">Laporan Pengeluaran</TabsTrigger>
            <TabsTrigger value="spp" className="flex-1 py-2">Laporan SPP</TabsTrigger>
          </TabsList>
          
          <TabsContent value="income" className="pt-2">
            <IncomeReport isReadOnly={isReadOnly} />
          </TabsContent>
          
          <TabsContent value="expense" className="pt-2">
            <ExpenseReport isReadOnly={isReadOnly} />
          </TabsContent>
          
          <TabsContent value="spp" className="pt-2">
            <SppReport isReadOnly={isReadOnly} />
          </TabsContent>
        </Tabs>
      )}
    </motion.div>
  );
};

export default Reports;
