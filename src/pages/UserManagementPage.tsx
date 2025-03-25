
import { useEffect } from "react";
import { motion } from "framer-motion";
import UserManagement from "@/components/UserManagement";

const UserManagementPage = () => {
  // When the component mounts, scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-6"
    >
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 text-green-700">
        Kelola Pengguna Sistem
      </h1>
      
      <div className="max-w-5xl mx-auto">
        <UserManagement />
      </div>
    </motion.div>
  );
};

export default UserManagementPage;
