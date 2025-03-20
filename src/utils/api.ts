// This is a placeholder for the actual API integration
// In a real implementation, this would connect to PHP backend endpoints

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

// Placeholder data that would come from the PHP/MySQL backend
const dummyData: DatabaseStructure = {
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
      password: "password123", // In real app, this would be hashed
      nama: "Administrator",
      level: "admin"
    },
    {
      id: 2,
      username: "bendahara",
      password: "bendahara123", // In real app, this would be hashed
      nama: "Bendahara Sekolah",
      level: "bendahara"
    }
  ]
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
  
  // School info
  getSekolahInfo: async () => {
    return dummyData.sekolah[0];
  },
  
  // WhatsApp integration placeholder
  sendWhatsAppNotification: async (phoneNumber: string, message: string) => {
    // This would connect to WhatsApp API in the PHP backend
    console.log(`Sending WhatsApp message to ${phoneNumber}: ${message}`);
    return { success: true, message: "Notifikasi berhasil dikirim" };
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
