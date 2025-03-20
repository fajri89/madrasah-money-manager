
import { useEffect } from "react";
import { motion } from "framer-motion";
import Dashboard from "@/components/Dashboard";

const Index = () => {
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
        Dashboard Keuangan Madrasah At-Tahzib Kekait
      </h1>
      <Dashboard />
    </motion.div>
  );
};

export default Index;
