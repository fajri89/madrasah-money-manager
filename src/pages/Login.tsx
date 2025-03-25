
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import { LockKeyhole, User, School, GraduationCap, FileCheck } from "lucide-react";
import SppPaymentCheck from "@/components/SppPaymentCheck";

const Login = () => {
  // Staff login state
  const [staffUsername, setStaffUsername] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [staffRole, setStaffRole] = useState("admin");
  
  // Student login state
  const [studentId, setStudentId] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!staffUsername || !staffPassword) {
      return;
    }
    
    setIsLoading(true);
    try {
      // For now, we're using the same login function for all roles
      // In a real implementation, the role would be handled on the backend
      await login(staffUsername, staffPassword);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentId || !studentPassword) {
      return;
    }
    
    setIsLoading(true);
    try {
      // Student login would be handled differently in a real implementation
      // For now, we'll just show an alert
      alert("Fitur login siswa belum diimplementasikan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-8"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-green-700">Madrasah At-Tahzib</CardTitle>
          <CardDescription>
            Sistem Informasi Keuangan Madrasah
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="staff" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="staff" className="flex items-center gap-1">
              <School className="h-4 w-4" />
              <span className="hidden sm:inline">Pihak Sekolah</span>
            </TabsTrigger>
            <TabsTrigger value="student" className="flex items-center gap-1">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Siswa</span>
            </TabsTrigger>
            <TabsTrigger value="spp" className="flex items-center gap-1">
              <FileCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Cek SPP</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="staff">
            <form onSubmit={handleStaffLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="staff-role">Peran</Label>
                  <RadioGroup 
                    id="staff-role" 
                    value={staffRole} 
                    onValueChange={setStaffRole}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="admin" id="admin" />
                      <Label htmlFor="admin">Admin</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bendahara" id="bendahara" />
                      <Label htmlFor="bendahara">Bendahara</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="kepala_sekolah" id="kepala_sekolah" />
                      <Label htmlFor="kepala_sekolah">Kepala Sekolah</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="staff-username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="staff-username"
                      type="text"
                      placeholder="Masukkan username"
                      className="pl-10"
                      value={staffUsername}
                      onChange={(e) => setStaffUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="staff-password">Password</Label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="staff-password"
                      type="password"
                      placeholder="Masukkan password"
                      className="pl-10"
                      value={staffPassword}
                      onChange={(e) => setStaffPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-green-700 hover:bg-green-800"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                      <span>Memproses...</span>
                    </div>
                  ) : (
                    "Login"
                  )}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="student">
            <form onSubmit={handleStudentLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student-id">NISN / Nomor Induk</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="student-id"
                      type="text"
                      placeholder="Masukkan NISN"
                      className="pl-10"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="student-password">Password</Label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="student-password"
                      type="password"
                      placeholder="Masukkan password"
                      className="pl-10"
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-green-700 hover:bg-green-800"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                      <span>Memproses...</span>
                    </div>
                  ) : (
                    "Login Siswa"
                  )}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="spp">
            <SppPaymentCheck />
          </TabsContent>
        </Tabs>
      </Card>
    </motion.div>
  );
};

export default Login;
