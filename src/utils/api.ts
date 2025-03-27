
// This is a placeholder for the actual API integration
// In a real implementation, this would connect to PHP backend endpoints
import { sendWhatsAppNotification } from "./whatsAppIntegration";
import * as XLSX from 'xlsx';

// Get data from localStorage or use defaults
const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : defaultValue;
};

// Save data to localStorage
const saveToLocalStorage = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Simulated database structure that would be on the PHP/MySQL backend
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

// Default data to use if nothing in localStorage
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
      tanggal: "2023-01-01",
      jumlah: 5000000,
      keterangan: "Bantuan operasional sekolah",
      pengguna_id: 1
    },
    {
      id: 2,
      tanggal: "2023-01-15",
      jumlah: 2500000,
      keterangan: "Pembayaran SPP",
      pengguna_id: 1
    }
  ],
  pengeluaran: [
    {
      id: 1,
      tanggal: "2023-01-05",
      jumlah: 1000000,
      keterangan: "Pembayaran listrik",
      pengguna_id: 1
    },
    {
      id: 2,
      tanggal: "2023-01-10",
      jumlah: 1500000,
      keterangan: "Pembelian alat tulis",
      pengguna_id: 1
    }
  ],
  spp: [
    {
      id: 1,
      siswa_id: 1,
      tanggal: "2023-01-10",
      bulan: "Januari",
      tahun: "2023",
      jumlah: 250000,
      status: "Lunas",
      pengguna_id: 1
    },
    {
      id: 2,
      siswa_id: 2,
      tanggal: "2023-01-15",
      bulan: "Januari",
      tahun: "2023",
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

// Function to get monthly financial data for charts
export const getMonthlySummary = async () => {
  // This would be a GET request to PHP backend
  // For now, we'll calculate this from our dummy data
  
  const currentYear = new Date().getFullYear().toString();
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  
  // Calculate monthly income
  const monthlyIncome = months.map((month, index) => {
    const monthData = dummyData.pemasukan.filter(item => {
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
    const monthData = dummyData.pengeluaran.filter(item => {
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
    const monthData = dummyData.spp.filter(item => {
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

// Simulated API functions that would connect to PHP backend
export const api = {
  // Auth functions
  login: async (username: string, password: string) => {
    // This would be a POST request to PHP backend
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
    // In a real implementation, this would be a PUT request to update the user
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
    // In a real implementation, this would be a PUT request to update the password
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

  // Financial functions
  getPemasukan: async () => {
    // This would fetch data from PHP backend
    return dummyData.pemasukan;
  },
  
  getPengeluaran: async () => {
    return dummyData.pengeluaran;
  },
  
  getSpp: async () => {
    return dummyData.spp;
  },
  
  // Student functions
  getSiswa: async () => {
    return dummyData.siswa;
  },
  
  saveSiswa: async (students: Student[]) => {
    dummyData.siswa = students;
    saveToLocalStorage('siswa', students);
    return { success: true, message: "Data siswa berhasil disimpan" };
  },
  
  // School info
  getSekolahInfo: async () => {
    return dummyData.sekolah[0];
  },
  
  saveSekolahInfo: async (data: DatabaseStructure['sekolah'][0]) => {
    dummyData.sekolah[0] = data;
    saveToLocalStorage('sekolah', dummyData.sekolah);
    return { success: true, message: "Data sekolah berhasil disimpan" };
  },
  
  // Class (Kelas) functions
  saveKelas: async (classes: DatabaseStructure['kelas']) => {
    dummyData.kelas = classes;
    saveToLocalStorage('kelas', classes);
    return { success: true, message: "Data kelas berhasil disimpan" };
  },
  
  // Department (Jurusan) functions
  saveJurusan: async (departments: DatabaseStructure['jurusan']) => {
    dummyData.jurusan = departments;
    saveToLocalStorage('jurusan', departments);
    return { success: true, message: "Data jurusan berhasil disimpan" };
  },
  
  // Excel import function
  importExcel: async (file: File): Promise<{success: boolean; message: string; data?: Student[]}> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
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
          
          // Add to existing students
          const updatedStudents = [...dummyData.siswa, ...students];
          dummyData.siswa = updatedStudents;
          saveToLocalStorage('siswa', updatedStudents);
          
          resolve({ 
            success: true, 
            message: `${students.length} data siswa berhasil diimpor`, 
            data: students 
          });
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

  // Direct access to the data (for simplicity in this demo)
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
