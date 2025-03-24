
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center"
    >
      <div className="bg-red-100 p-4 rounded-full mb-6">
        <ShieldAlert className="h-16 w-16 text-red-600" />
      </div>
      <h1 className="text-3xl font-bold text-red-600 mb-4">Akses Ditolak</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi administrator jika Anda memerlukan akses.
      </p>
      <Button
        onClick={() => navigate("/")}
        className="bg-green-700 hover:bg-green-800"
      >
        Kembali ke Dashboard
      </Button>
    </motion.div>
  );
};

export default AccessDenied;
