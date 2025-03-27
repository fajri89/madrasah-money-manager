
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import SchoolDataForm from "@/components/master/SchoolDataForm";
import StudentDataTable from "@/components/master/StudentDataTable";
import ClassDataTable from "@/components/master/ClassDataTable";
import DepartmentDataTable from "@/components/master/DepartmentDataTable";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api } from "@/utils/api";

const MasterData = () => {
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  // When the component mounts, scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleImport = async () => {
    if (!importFile) {
      setImportError("Silahkan pilih file terlebih dahulu");
      return;
    }

    if (!importFile.name.endsWith('.xlsx')) {
      setImportError("File harus berformat .xlsx");
      return;
    }

    setIsImporting(true);
    setImportError(null);
    setImportSuccess(null);

    try {
      const result = await api.importExcel(importFile);
      if (result.success) {
        setImportSuccess(result.message);
        setImportFile(null);
        toast.success(result.message);
      } else {
        setImportError(result.message);
      }
    } catch (error) {
      console.error("Error importing data:", error);
      setImportError("Terjadi kesalahan saat mengimpor data");
    } finally {
      setIsImporting(false);
    }
  };

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
          <TabsTrigger value="import" className="flex-1 py-2">Import Data</TabsTrigger>
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

        <TabsContent value="import" className="pt-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-green-700 flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Import Data dari Excel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="excelFile">File Excel (.xlsx)</Label>
                <Input 
                  id="excelFile"
                  type="file" 
                  accept=".xlsx" 
                  onChange={(e) => {
                    setImportFile(e.target.files?.[0] || null);
                    setImportError(null);
                    setImportSuccess(null);
                  }}
                />
                <p className="text-sm text-gray-500">
                  Pilih file Excel yang berisi data siswa untuk diimpor
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-md font-medium">Format Data Excel:</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="flex items-center text-sm text-gray-700">
                    <FileText className="h-4 w-4 mr-2 text-blue-600" />
                    Format kolom: nis, nama, kelas_id, jurusan_id, alamat, telepon
                  </p>
                  <p className="mt-2 text-sm text-gray-600">Contoh:</p>
                  <ul className="ml-6 list-disc text-sm text-gray-600 mt-1">
                    <li>nis: "2021001"</li>
                    <li>nama: "Ahmad Fauzi"</li>
                    <li>kelas_id: 1 (ID kelas yang sudah ada di sistem)</li>
                    <li>jurusan_id: 1 (ID jurusan yang sudah ada di sistem)</li>
                    <li>alamat: "Jl. Raya Kekait No. 123" (opsional)</li>
                    <li>telepon: "08123456789" (opsional)</li>
                  </ul>
                </div>
              </div>

              {importError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription className="whitespace-pre-line">
                    {importError}
                  </AlertDescription>
                </Alert>
              )}

              {importSuccess && (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                  <AlertTitle>Berhasil</AlertTitle>
                  <AlertDescription>{importSuccess}</AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handleImport} 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isImporting || !importFile}
              >
                {isImporting ? "Mengimpor..." : "Import Data"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default MasterData;
