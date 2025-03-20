
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import SchoolDataForm from "@/components/master/SchoolDataForm";
import StudentDataTable from "@/components/master/StudentDataTable";
import ClassDataTable from "@/components/master/ClassDataTable";
import DepartmentDataTable from "@/components/master/DepartmentDataTable";

const MasterData = () => {
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
        Data Master Madrasah At-Tahzib Kekait
      </h1>
      
      <Tabs defaultValue="school" className="w-full">
        <TabsList className="w-full flex flex-wrap mb-6 h-auto">
          <TabsTrigger value="school" className="flex-1 py-2">Sekolah</TabsTrigger>
          <TabsTrigger value="students" className="flex-1 py-2">Siswa</TabsTrigger>
          <TabsTrigger value="classes" className="flex-1 py-2">Kelas</TabsTrigger>
          <TabsTrigger value="departments" className="flex-1 py-2">Jurusan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="school" className="pt-2">
          <SchoolDataForm />
        </TabsContent>
        
        <TabsContent value="students" className="pt-2">
          <StudentDataTable />
        </TabsContent>
        
        <TabsContent value="classes" className="pt-2">
          <ClassDataTable />
        </TabsContent>
        
        <TabsContent value="departments" className="pt-2">
          <DepartmentDataTable />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default MasterData;
