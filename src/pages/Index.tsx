
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
    >
      <Dashboard />
    </motion.div>
  );
};

export default Index;
