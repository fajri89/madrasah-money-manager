// This is a placeholder for the actual API integration
// In a real implementation, this would connect to PHP backend endpoints
import { sendWhatsAppNotification } from "./whatsAppIntegration";
import * as XLSX from 'xlsx';
import { supabase } from "@/integrations/supabase/client";

// Get data from localStorage or use defaults if no data in Supabase yet
const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : defaultValue;
};

// Save data to localStorage (Kept for backward compatibility)
const saveToLocalStorage = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Database structure interface
export interface DatabaseStructure {
  sekolah: {
    id: number;
    nama: string;
    alamat: string;
    telepon: string;
    email: string;
  }[];
  siswa: {
    id: number;
    nis: string;
    nama: string;
    kelas_id: number;
    jurusan_id: number;
    alamat: string;
    telepon: string;
  }[];
  kelas: {
    id: number;
    nama: string;
  }[];
  jurusan: {
    id: number;
    nama: string;
  }[];
  pemasukan: {
    id: number;
    tanggal: string;
    jumlah: number;
    keterangan: string;
    pengguna_id: number;
  }[];
  pengeluaran: {
    id: number;
    tanggal: string;
    jumlah: number;
    keterangan: string;
    pengguna_id: number;
  }[];
  spp: {
    id: number;
    siswa_id: number;
    tanggal: string;
    bulan: string;
    tahun: string;
    jumlah: number;
    status: string;
    pengguna_id: number;
  }[];
  pengguna: {
    id: number;
    username: string;
    password: string;
    nama: string;
    level: string;
  }[];
}

// Default data to use if nothing in localStorage or database
const defaultData: DatabaseStructure = {
  sekolah: [
    {
      id: 1,
      nama: "Madrasah At-Tahzib Kekait",
      alamat: "Kekait, Lombok Barat, NTB",
      telepon: "08123456789",
      email: "madrasah.attahzib@example.com"
    }
  ],
  siswa: [
    {
      id: 1,
      nis: "2021001",
      nama: "Ahmad Fauzi",
      kelas_id: 1,
      jurusan_id: 1,
      alamat: "Jl. Raya Kekait No. 123",
      telepon: "08123456789"
    },
    {
      id: 2,
      nis: "2021002",
      nama: "Siti Aisyah",
      kelas_id: 1,
      jurusan_id: 2,
      alamat: "Jl. Raya Kekait No. 124",
      telepon: "08123456790"
    }
  ],
  kelas: [
    { id: 1, nama: "X" },
    { id: 2, nama: "XI" },
    { id: 3, nama: "XII" }
  ],
  jurusan: [
    { id: 1, nama: "IPA" },
    { id: 2, nama: "IPS" }
  ],
  pemasukan: [
    {
      id: 1,
      tanggal: "2025-01-01",
      jumlah: 5000000,
      keterangan: "Bantuan operasional sekolah",
      pengguna_id: 1
    },
    {
      id: 2,
      tanggal: "2025-01-15",
      jumlah: 2500000,
      keterangan: "Pembayaran SPP",
      pengguna_id: 1
    }
  ],
  pengeluaran: [
    {
      id: 1,
      tanggal: "2025-01-05",
      jumlah: 1000000,
      keterangan: "Pembayaran listrik",
      pengguna_id: 1
    },
    {
      id: 2,
      tanggal: "2025-01-10",
      jumlah: 1500000,
      keterangan: "Pembelian alat tulis",
      pengguna_id: 1
    }
  ],
  spp: [
    {
      id: 1,
      siswa_id: 1,
      tanggal: "2025-01-10",
      bulan: "Januari",
      tahun: "2025",
      jumlah: 250000,
      status: "Lunas",
      pengguna_id: 1
    },
    {
      id: 2,
      siswa_id: 2,
      tanggal: "2025-01-15",
      bulan: "Januari",
      tahun: "2025",
      jumlah: 250000,
      status: "Lunas",
      pengguna_id: 1
    }
  ],
  pengguna: [
    {
      id: 1,
      username: "admin", 
      password: "joeng18031989",
      nama: "Administrator",
      level: "admin"
    },
    {
      id: 2,
      username: "bendahara",
      password: "bendahara123",
      nama: "Bendahara Sekolah",
      level: "bendahara"
    },
    {
      id: 3,
      username: "kepsek",
      password: "kepsek123",
      nama: "Kepala Sekolah",
      level: "kepala_sekolah"
    }
  ]
};

// Initialize database from localStorage or defaults
// (This will be used as fallback if Supabase is unreachable)
const dummyData: DatabaseStructure = {
  sekolah: getLocalStorage('sekolah', defaultData.sekolah),
  siswa: getLocalStorage('siswa', defaultData.siswa),
  kelas: getLocalStorage('kelas', defaultData.kelas),
  jurusan: getLocalStorage('jurusan', defaultData.jurusan),
  pemasukan: getLocalStorage('pemasukan', defaultData.pemasukan),
  pengeluaran: getLocalStorage('pengeluaran', defaultData.pengeluaran),
  spp: getLocalStorage('spp', defaultData.spp),
  pengguna: getLocalStorage('pengguna', defaultData.pengguna)
};

// Interfaces for the data types
export interface Student {
  id: number;
  nis: string;
  nama: string;
  kelas_id: number;
  jurusan_id: number;
  alamat: string;
  telepon: string;
}

export interface FinancialData {
  id: number;
  tanggal: string;
  jumlah: number;
  keterangan: string;
  pengguna_id: number;
}

export interface SppData {
  id: number;
  siswa_id: number;
  tanggal: string;
  bulan: string;
  tahun: string;
  jumlah: number;
  status: string;
  pengguna_id: number;
}

// Configuration for admin settings
export interface AdminSettings {
  headmasterPhone: string; // Phone number for the headmaster for notifications
  enableWhatsAppNotifications: boolean;
}

// Default admin settings
const defaultAdminSettings: AdminSettings = {
  headmasterPhone: "081234567890",
  enableWhatsAppNotifications: true
};

// Get admin settings
export const getAdminSettings = (): AdminSettings => {
  const storedSettings = localStorage.getItem('adminSettings');
  return storedSettings ? JSON.parse(storedSettings) : defaultAdminSettings;
};

// Save admin settings
export const saveAdminSettings = (settings: AdminSettings): void => {
  localStorage.setItem('adminSettings', JSON.stringify(settings));
};

// Function to get years array (2025-2030)
export const getYears = (): string[] => {
  const startYear = 2025;
  const endYear = 2030;
  return Array.from({length: endYear - startYear + 1}, (_, i) => (startYear + i).toString());
};

// Function to get monthly financial data for charts
export const getMonthlySummary = async () => {
  // This would be a GET request to PHP backend
  // For now, we'll calculate this from our dummy data
  
  const currentYear = new Date().getFullYear().toString();
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  
  // Get the latest data
  const pemasukanData = await api.getPemasukan();
  const pengeluaranData = await api.getPengeluaran();
  const sppData = await api.getSpp();
  
  // Calculate monthly income
  const monthlyIncome = months.map((month, index) => {
    const monthData = pemasukanData.filter(item => {
      const itemDate = new Date(item.tanggal);
      return itemDate.getMonth() === index && itemDate.getFullYear().toString() === currentYear;
    });
    
    return {
      name: month,
      value: monthData.reduce((sum, item) => sum + item.jumlah, 0)
    };
  });
  
  // Calculate monthly expenses
  const monthlyExpenses = months.map((month, index) => {
    const monthData = pengeluaranData.filter(item => {
      const itemDate = new Date(item.tanggal);
      return itemDate.getMonth() === index && itemDate.getFullYear().toString() === currentYear;
    });
    
    return {
      name: month,
      value: monthData.reduce((sum, item) => sum + item.jumlah, 0)
    };
  });
  
  // Calculate monthly SPP payments
  const monthlySppPayments = months.map((month, index) => {
    const monthData = sppData.filter(item => {
      return item.bulan === month && item.tahun === currentYear && item.status === "Lunas";
    });
    
    return {
      name: month,
      value: monthData.reduce((sum, item) => sum + item.jumlah, 0)
    };
  });
  
  return {
    income: monthlyIncome,
    expenses: monthlyExpenses,
    spp: monthlySppPayments
  };
};

// Modified API functions to handle Supabase type issues with fallbacks to localStorage
export const api = {
  // Auth functions
  login: async (username: string, password: string) => {
    // Keep the dummy authentication logic as we're not using Supabase Auth yet
    console.log("Login request", { username, password });
    const user = dummyData.pengguna.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      return { success: true, user };
    }
    return { success: false, message: "Username atau password salah" };
  },

  // User management functions
  updateUsername: async (userId: number, newUsername: string) => {
    // Keep existing user management logic
    console.log("Update username request", { userId, newUsername });
    
    // Check if username already exists
    const usernameExists = dummyData.pengguna.some(
      (u) => u.username === newUsername && u.id !== userId
    );
    
    if (usernameExists) {
      return { success: false, message: "Username sudah digunakan" };
    }
    
    // Find the user to update
    const userIndex = dummyData.pengguna.findIndex((u) => u.id === userId);
    
    if (userIndex === -1) {
      return { success: false, message: "Pengguna tidak ditemukan" };
    }
    
    // Update the username
    dummyData.pengguna[userIndex].username = newUsername;
    
    return { success: true, message: "Username berhasil diubah" };
  },
  
  updatePassword: async (userId: number, oldPassword: string, newPassword: string) => {
    // Keep existing password update logic
    console.log("Update password request", { userId, oldPassword: "***", newPassword: "***" });
    
    // Find the user and verify old password
    const userIndex = dummyData.pengguna.findIndex(
      (u) => u.id === userId && u.password === oldPassword
    );
    
    if (userIndex === -1) {
      return { success: false, message: "Password lama salah" };
    }
    
    // Update the password
    dummyData.pengguna[userIndex].password = newPassword;
    
    return { success: true, message: "Password berhasil diubah" };
  },

  // Financial functions - updated to handle Supabase type issues
  getPemasukan: async () => {
    try {
      console.log("Fetching income data...");
      // Try to fetch from localStorage first as a fallback
      const localData = getLocalStorage('pemasukan', defaultData.pemasukan);
      
      try {
        // Attempt to fetch from Supabase
        const { data, error } = await supabase
          .from('pemasukan')
          .select('*');
        
        if (error) {
          console.error("Error fetching income from Supabase:", error);
          console.log("Using local data instead");
          return localData;
        }
        
        if (data && data.length > 0) {
          console.log("Successfully fetched income data from Supabase:", data);
          saveToLocalStorage('pemasukan', data);
          return data as FinancialData[];
        }
        
        return localData;
      } catch (e) {
        console.error("Exception in getPemasukan:", e);
        return localData;
      }
    } catch (error) {
      console.error("Critical error in getPemasukan:", error);
      return [];
    }
  },
  
  getPengeluaran: async () => {
    try {
      console.log("Fetching expense data...");
      // Try to fetch from localStorage first as a fallback
      const localData = getLocalStorage('pengeluaran', defaultData.pengeluaran);
      
      try {
        // Attempt to fetch from Supabase
        const { data, error } = await supabase
          .from('pengeluaran')
          .select('*');
        
        if (error) {
          console.error("Error fetching expenses from Supabase:", error);
          console.log("Using local data instead");
          return localData;
        }
        
        if (data && data.length > 0) {
          console.log("Successfully fetched expense data from Supabase:", data);
          saveToLocalStorage('pengeluaran', data);
          return data as FinancialData[];
        }
        
        return localData;
      } catch (e) {
        console.error("Exception in getPengeluaran:", e);
        return localData;
      }
    } catch (error) {
      console.error("Critical error in getPengeluaran:", error);
      return [];
    }
  },
  
  getSpp: async () => {
    try {
      console.log("Fetching SPP data...");
      // Try to fetch from localStorage first as a fallback
      const localData = getLocalStorage('spp', defaultData.spp);
      
      try {
        // Attempt to fetch from Supabase
        const { data, error } = await supabase
          .from('spp')
          .select('*');
        
        if (error) {
          console.error("Error fetching SPP from Supabase:", error);
          console.log("Using local data instead");
          return localData;
        }
        
        if (data && data.length > 0) {
          console.log("Successfully fetched SPP data from Supabase:", data);
          saveToLocalStorage('spp', data);
          return data as SppData[];
        }
        
        return localData;
      } catch (e) {
        console.error("Exception in getSpp:", e);
        return localData;
      }
    } catch (error) {
      console.error("Critical error in getSpp:", error);
      return [];
    }
  },

  // Save income data with fallback
  savePemasukan: async (data: FinancialData) => {
    try {
      console.log("Saving income data:", data);
      
      // Make sure there's an ID for the transaction
      const formattedData = {
        ...data,
        id: data.id || Date.now()
      };
      
      try {
        // Try to save to Supabase first
        const { error } = await supabase
          .from('pemasukan')
          .insert(formattedData);
        
        if (error) {
          console.error("Error saving to Supabase:", error);
          console.log("Falling back to localStorage");
          
          // Fallback to localStorage
          const existingData = dummyData.pemasukan;
          const newData = [...existingData, formattedData];
          dummyData.pemasukan = newData;
          saveToLocalStorage('pemasukan', newData);
        }
      } catch (e) {
        console.error("Exception in savePemasukan:", e);
        
        // Fallback to localStorage
        const existingData = dummyData.pemasukan;
        const newData = [...existingData, formattedData];
        dummyData.pemasukan = newData;
        saveToLocalStorage('pemasukan', newData);
      }
      
      // Send WhatsApp notification to headmaster regardless of storage method
      try {
        const settings = getAdminSettings();
        
        if (settings.enableWhatsAppNotifications && settings.headmasterPhone) {
          const formattedDate = formatDate(data.tanggal);
          const message = createNotificationMessages.income(
            data.jumlah,
            data.keterangan,
            formattedDate
          ).toHeadmaster;
          
          await sendWhatsAppNotification(settings.headmasterPhone, message);
        }
      } catch (notifError) {
        console.error("Error sending WhatsApp notification:", notifError);
        // Don't fail the main operation if notification fails
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error in savePemasukan:", error);
      return { success: false, error };
    }
  },

  // Save expense data with fallback
  savePengeluaran: async (data: FinancialData) => {
    try {
      console.log("Saving expense data:", data);
      
      // Make sure there's an ID for the transaction
      const formattedData = {
        ...data,
        id: data.id || Date.now()
      };
      
      try {
        // Try to save to Supabase
        const { error } = await supabase
          .from('pengeluaran')
          .insert(formattedData);
        
        if (error) {
          console.error("Error saving to Supabase:", error);
          console.log("Falling back to localStorage");
          
          // Fallback to localStorage
          const existingData = dummyData.pengeluaran;
          const newData = [...existingData, formattedData];
          dummyData.pengeluaran = newData;
          saveToLocalStorage('pengeluaran', newData);
        }
      } catch (e) {
        console.error("Exception in savePengeluaran:", e);
        
        // Fallback to localStorage
        const existingData = dummyData.pengeluaran;
        const newData = [...existingData, formattedData];
        dummyData.pengeluaran = newData;
        saveToLocalStorage('pengeluaran', newData);
      }
      
      // Send WhatsApp notification to headmaster regardless of storage method
      try {
        const settings = getAdminSettings();
        
        if (settings.enableWhatsAppNotifications && settings.headmasterPhone) {
          const formattedDate = formatDate(data.tanggal);
          const message = createNotificationMessages.expense(
            data.jumlah,
            data.keterangan,
            formattedDate
          ).toHeadmaster;
          
          await sendWhatsAppNotification(settings.headmasterPhone, message);
        }
      } catch (notifError) {
        console.error("Error sending WhatsApp notification:", notifError);
        // Don't fail the main operation if notification fails
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error in savePengeluaran:", error);
      return { success: false, error };
    }
  },
  
  // Save SPP data with fallback
  saveSpp: async (data: SppData) => {
    try {
      console.log("Saving SPP data:", data);
      
      // Make sure there's an ID for the transaction
      const formattedData = {
        ...data,
        id: data.id || Date.now()
      };
      
      try {
        // Try to save to Supabase
        const { error } = await supabase
          .from('spp')
          .insert(formattedData);
        
        if (error) {
          console.error("Error saving SPP to Supabase:", error);
          console.log("Falling back to localStorage");
          
          // Fallback to localStorage if Supabase fails
          const existingData = dummyData.spp;
          const newData = [...existingData, formattedData];
          dummyData.spp = newData;
          saveToLocalStorage('spp', newData);
        }
      } catch (e) {
        console.error("Exception in saveSpp:", e);
        
        // Fallback to localStorage
        const existingData = dummyData.spp;
        const newData = [...existingData, formattedData];
        dummyData.spp = newData;
        saveToLocalStorage('spp', newData);
      }
      
      // Send WhatsApp notifications regardless of storage method
      try {
        // Get student details for the notification
        const student = await api.getSiswaById(data.siswa_id);
        
        if (student) {
          const settings = getAdminSettings();
          const formattedDate = formatDate(data.tanggal);
          
          // Send notification to headmaster
          if (settings.enableWhatsAppNotifications && settings.headmasterPhone) {
            const headmasterMessage = createNotificationMessages.sppPayment(
              student.nama,
              data.bulan,
              data.tahun,
              data.jumlah,
              formattedDate
            ).toHeadmaster;
            
            await sendWhatsAppNotification(settings.headmasterPhone, headmasterMessage);
          }
          
          // Send notification to student/parent if phone number exists
          if (settings.enableWhatsAppNotifications && student.telepon) {
            const parentMessage = createNotificationMessages.sppPayment(
              student.nama,
              data.bulan,
              data.tahun,
              data.jumlah,
              formattedDate
            ).toParent;
            
            await sendWhatsAppNotification(student.telepon, parentMessage);
          }
        }
      } catch (notifError) {
        console.error("Error sending WhatsApp notification:", notifError);
        // Don't fail the main operation if notification fails
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error in saveSpp:", error);
      return { success: false, error };
    }
  },

  // Get monthly SPP summary
  getSppMonthly: async (month: string, year: string) => {
    try {
      const allSpp = await api.getSpp();
      
      // Filter by month and year
      const filteredSpp = allSpp.filter(spp => 
        spp.bulan === month && spp.tahun === year && spp.status === "Lunas"
      );
      
      // Get student details for each payment
      const students = await api.getSiswa();
      
      const paymentsWithStudentDetails = await Promise.all(
        filteredSpp.map(async (payment) => {
          const student = students.find(s => s.id === payment.siswa_id);
          return {
            ...payment,
            studentName: student?.nama || "Unknown",
            studentNIS: student?.nis || "N/A",
            classId: student?.kelas_id
          };
        })
      );
      
      // Calculate total amount
      const totalAmount = filteredSpp.reduce((sum, payment) => sum + payment.jumlah, 0);
      
      return {
        payments: paymentsWithStudentDetails,
        totalAmount,
        count: filteredSpp.length
      };
    } catch (error) {
      console.error("Error getting monthly SPP summary:", error);
      return { payments: [], totalAmount: 0, count: 0 };
    }
  },
  
  // Student functions with fallback
  getSiswa: async () => {
    try {
      console.log("Fetching student data...");
      // Try to fetch from localStorage first as a fallback
      const localData = getLocalStorage('siswa', defaultData.siswa);
      
      try {
        // Attempt to fetch from Supabase
        const { data, error } = await supabase
          .from('siswa')
          .select('*');
        
        if (error) {
          console.error("Error fetching from Supabase:", error);
          console.log("Using local data instead for students");
          return localData;
        }
        
        if (data && data.length > 0) {
          console.log("Successfully fetched student data from Supabase");
          saveToLocalStorage('siswa', data);
          return data as Student[];
        }
        
        return localData;
      } catch (e) {
        console.error("Exception in getSiswa:", e);
        return localData;
      }
    } catch (error) {
      console.error("Error in getSiswa:", error);
      return dummyData.siswa;
    }
  },
  
  getSiswaById: async (id: number) => {
    try {
      console.log(`Fetching student with ID: ${id}`);
      // Get all students and find the one with matching ID
      const students = await api.getSiswa();
      return students.find(s => s.id === id);
    } catch (error) {
      console.error("Error in getSiswaById:", error);
      return dummyData.siswa.find(s => s.id === id);
    }
  },
  
  saveSiswa: async (students: Student[]) => {
    try {
      // First delete all existing data to avoid duplicates
      const { error: deleteError } = await supabase
        .from('siswa')
        .delete()
        .neq('id', 0); // Delete all rows
      
      if (deleteError) {
        console.error("Error deleting from Supabase:", deleteError);
        // Fallback to localStorage
        saveToLocalStorage('siswa', students);
        return { success: true, message: "Data siswa berhasil disimpan (lokal)" };
      }
      
      // Insert new data
      const { error: insertError } = await supabase
        .from('siswa')
        .insert(students);
      
      if (insertError) {
        console.error("Error inserting to Supabase:", insertError);
        // Fallback to localStorage
        saveToLocalStorage('siswa', students);
        return { success: true, message: "Data siswa berhasil disimpan (lokal)" };
      }
      
      // Update localStorage as backup
      saveToLocalStorage('siswa', students);
      return { success: true, message: "Data siswa berhasil disimpan" };
    } catch (error) {
      console.error("Error in saveSiswa:", error);
      // Fallback to localStorage
      saveToLocalStorage('siswa', students);
      return { success: true, message: "Data siswa berhasil disimpan (lokal)" };
    }
  },
  
  // UPDATED: School info to use Supabase
  getSekolahInfo: async () => {
    try {
      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('sekolah')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (error) {
        console.error("Error fetching school from Supabase:", error);
        // Fallback to localStorage
        return dummyData.sekolah[0];
      }
      
      // If successful, also update localStorage as a backup
      if (data) {
        saveToLocalStorage('sekolah', [data]);
        return data;
      }
      
      return dummyData.sekolah[0];
    } catch (error) {
      console.error("Error in getSekolahInfo:", error);
      return dummyData.sekolah[0];
    }
  },
  
  saveSekolahInfo: async (data: DatabaseStructure['sekolah'][0]) => {
    try {
      // Upsert school data
      const { error } = await supabase
        .from('sekolah')
        .upsert({ ...data, id: 1 }); // Always use id 1
      
      if (error) {
        console.error("Error saving school to Supabase:", error);
        // Fallback to localStorage
        dummyData.sekolah[0] = data;
        saveToLocalStorage('sekolah', dummyData.sekolah);
        return { success: true, message: "Data sekolah berhasil disimpan (lokal)" };
      }
      
      // Update localStorage as backup
      dummyData.sekolah[0] = data;
      saveToLocalStorage('sekolah', dummyData.sekolah);
      return { success: true, message: "Data sekolah berhasil disimpan" };
    } catch (error) {
      console.error("Error in saveSekolahInfo:", error);
      // Fallback to localStorage
      dummyData.sekolah[0] = data;
      saveToLocalStorage('sekolah', dummyData.sekolah);
      return { success: true, message: "Data sekolah berhasil disimpan (lokal)" };
    }
  },
  
  // UPDATED: Class (Kelas) functions to use Supabase
  saveKelas: async (classes: DatabaseStructure['kelas']) => {
    try {
      // First delete all existing data
      const { error: deleteError } = await supabase
        .from('kelas')
        .delete()
        .neq('id', 0); // Delete all rows
      
      if (deleteError) {
        console.error("Error deleting classes from Supabase:", deleteError);
        // Fallback to localStorage
        saveToLocalStorage('kelas', classes);
        return { success: true, message: "Data kelas berhasil disimpan (lokal)" };
      }
      
      // Insert new data
      const { error: insertError } = await supabase
        .from('kelas')
        .insert(classes);
      
      if (insertError) {
        console.error("Error inserting classes to Supabase:", insertError);
        // Fallback to localStorage
        saveToLocalStorage('kelas', classes);
        return { success: true, message: "Data kelas berhasil disimpan (lokal)" };
      }
      
      // Update localStorage as backup
      saveToLocalStorage('kelas', classes);
      return { success: true, message: "Data kelas berhasil disimpan" };
    } catch (error) {
      console.error("Error in saveKelas:", error);
      // Fallback to localStorage
      saveToLocalStorage('kelas', classes);
      return { success: true, message: "Data kelas berhasil disimpan (lokal)" };
    }
  },
  
  // UPDATED: Department (Jurusan) functions to use Supabase
  saveJurusan: async (departments: DatabaseStructure['jurusan']) => {
    try {
      // First delete all existing data
      const { error: deleteError } = await supabase
        .from('jurusan')
        .delete()
        .neq('id', 0); // Delete all rows
      
      if (deleteError) {
        console.error("Error deleting departments from Supabase:", deleteError);
        // Fallback to localStorage
        saveToLocalStorage('jurusan', departments);
        return { success: true, message: "Data jurusan berhasil disimpan (lokal)" };
      }
      
      // Insert new data
      const { error: insertError } = await supabase
        .from('jurusan')
        .insert(departments);
      
      if (insertError) {
        console.error("Error inserting departments to Supabase:", insertError);
        // Fallback to localStorage
        saveToLocalStorage('jurusan', departments);
        return { success: true, message: "Data jurusan berhasil disimpan (lokal)" };
      }
      
      // Update localStorage as backup
      saveToLocalStorage('jurusan', departments);
      return { success: true, message: "Data jurusan berhasil disimpan" };
    } catch (error) {
      console.error("Error in saveJurusan:", error);
      // Fallback to localStorage
      saveToLocalStorage('jurusan', departments);
      return { success: true, message: "Data jurusan berhasil disimpan (lokal)" };
    }
  },

  // UPDATED: Get kelas from Supabase instead of direct access
  getKelas: async () => {
    try {
      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('kelas')
        .select('*');
      
      if (error) {
        console.error("Error fetching classes from Supabase:", error);
        // Fallback to localStorage
        return dummyData.kelas;
      }
      
      // If successful, also update localStorage as a backup
      if (data) {
        saveToLocalStorage('kelas', data);
        return data;
      }
      
      return dummyData.kelas;
    } catch (error) {
      console.error("Error in getKelas:", error);
      return dummyData.kelas;
    }
  },

  // UPDATED: Get jurusan from Supabase instead of direct access
  getJurusan: async () => {
    try {
      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('jurusan')
        .select('*');
      
      if (error) {
        console.error("Error fetching departments from Supabase:", error);
        // Fallback to localStorage
        return dummyData.jurusan;
      }
      
      // If successful, also update localStorage as a backup
      if (data) {
        saveToLocalStorage('jurusan', data);
        return data;
      }
      
      return dummyData.jurusan;
    } catch (error) {
      console.error("Error in getJurusan:", error);
      return dummyData.jurusan;
    }
  },
  
  // UPDATED: Excel import function to use Supabase
  importExcel: async (file: File): Promise<{success: boolean; message: string; data?: Student[]}> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get first sheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          // Validate structure
          if (jsonData.length === 0) {
            resolve({ success: false, message: "File Excel kosong" });
            return;
          }
          
          // Map data to Student format
          const students: Student[] = [];
          const errors: string[] = [];
          
          jsonData.forEach((row: any, index) => {
            // Validate required fields
            if (!row.nis || !row.nama || !row.kelas_id || !row.jurusan_id) {
              errors.push(`Data pada baris ${index + 2} tidak lengkap`);
              return;
            }
            
            students.push({
              id: Math.max(0, ...dummyData.siswa.map(s => s.id)) + 1 + index,
              nis: row.nis.toString(),
              nama: row.nama,
              kelas_id: parseInt(row.kelas_id),
              jurusan_id: parseInt(row.jurusan_id),
              alamat: row.alamat || "",
              telepon: row.telepon || ""
            });
          });
          
          if (errors.length > 0) {
            resolve({ 
              success: false, 
              message: `Terdapat ${errors.length} kesalahan:\n${errors.join('\n')}` 
            });
            return;
          }
          
          try {
            // Save to Supabase
            const { error } = await supabase
              .from('siswa')
              .insert(students);
            
            if (error) {
              console.error("Error importing data to Supabase:", error);
              // Fallback to localStorage
              const updatedStudents = [...dummyData.siswa, ...students];
              dummyData.siswa = updatedStudents;
              saveToLocalStorage('siswa', updatedStudents);
              
              resolve({ 
                success: true, 
                message: `${students.length} data siswa berhasil diimpor (lokal)`, 
                data: students 
              });
              return;
            }
            
            // Update localStorage as backup
            const updatedStudents = [...dummyData.siswa, ...students];
            dummyData.siswa = updatedStudents;
            saveToLocalStorage('siswa', updatedStudents);
            
            resolve({ 
              success: true, 
              message: `${students.length} data siswa berhasil diimpor`, 
              data: students 
            });
          } catch (error) {
            console.error("Error saving imported data:", error);
            // Fallback to localStorage
            const updatedStudents = [...dummyData.siswa, ...students];
            dummyData.siswa = updatedStudents;
            saveToLocalStorage('siswa', updatedStudents);
            
            resolve({ 
              success: true, 
              message: `${students.length} data siswa berhasil diimpor (lokal)`, 
              data: students 
            });
          }
        } catch (error) {
          console.error("Error parsing Excel:", error);
          resolve({ success: false, message: "Format file tidak valid" });
        }
      };
      
      reader.onerror = () => {
        resolve({ success: false, message: "Gagal membaca file" });
      };
      
      reader.readAsArrayBuffer(file);
    });
  },
  
  // WhatsApp integration 
  sendWhatsAppNotification: async (phoneNumber: string, message: string) => {
    // Use our centralized WhatsApp service
    return sendWhatsAppNotification(phoneNumber, message);
  },

  // Direct access to the data (for backward compatibility)
  kelas: dummyData.kelas,
  jurusan: dummyData.jurusan,
  pengguna: dummyData.pengguna
};

// Format currency to Indonesian Rupiah
export const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

// Format date to Indonesian format
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

// Import from whatsAppIntegration.ts
import { createNotificationMessages } from "./whatsAppIntegration";
