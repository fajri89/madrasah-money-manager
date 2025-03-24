
import { toast } from "sonner";

interface WhatsAppMessage {
  to: string;
  message: string;
}

/**
 * Send WhatsApp notification using the WhatsApp API (e.g., Twilio)
 * This is a placeholder implementation that would connect to a real API in production
 */
export const sendWhatsAppNotification = async (
  phoneNumber: string,
  message: string
): Promise<boolean> => {
  // Remove any spaces, dashes or other characters from phone number
  const cleanPhoneNumber = phoneNumber.replace(/\D/g, "");
  
  // Ensure the phone number starts with proper country code
  const formattedNumber = cleanPhoneNumber.startsWith("62")
    ? cleanPhoneNumber
    : cleanPhoneNumber.startsWith("0")
    ? `62${cleanPhoneNumber.substring(1)}`
    : `62${cleanPhoneNumber}`;

  console.log(`Sending WhatsApp message to +${formattedNumber}: ${message}`);
  
  try {
    // In a real implementation, this would call an API like Twilio
    // For demo purposes, we're just simulating the API call
    const response = await simulateApiCall({
      to: formattedNumber,
      message: message
    });
    
    return true;
  } catch (error) {
    console.error("Error sending WhatsApp notification:", error);
    toast.error("Gagal mengirim notifikasi WhatsApp");
    return false;
  }
};

/**
 * Simulate API call to WhatsApp service provider
 * In a real implementation, this would be replaced with actual API calls
 */
const simulateApiCall = async (data: WhatsAppMessage): Promise<any> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Simulate successful API response
  return {
    status: "success",
    message: "Message queued for delivery",
    messageId: `msg_${Math.random().toString(36).substring(2, 10)}`
  };
};

/**
 * Create templated messages for different notification types
 */
export const createNotificationMessages = {
  // For SPP payments
  sppPayment: (studentName: string, month: string, year: string, amount: number, date: string) => ({
    toHeadmaster: `*Notifikasi Pembayaran SPP*\n\nNama: ${studentName}\nBulan: ${month} ${year}\nJumlah: Rp${amount.toLocaleString('id-ID')}\nStatus: Lunas\nTanggal: ${date}`,
    toParent: `*Konfirmasi Pembayaran SPP*\n\nYth. Wali dari ${studentName}\n\nPembayaran SPP untuk bulan ${month} ${year} telah kami terima dengan baik pada tanggal ${date}.\n\nTerima kasih.\n\nHormat kami,\nBendahara Madrasah At-Tahzib Kekait`
  }),
  
  // For income entries
  income: (amount: number, description: string, date: string) => ({
    toHeadmaster: `*Notifikasi Pemasukan*\n\nTelah dicatat pemasukan pada tanggal ${date}:\n\nKeterangan: ${description}\nJumlah: Rp${amount.toLocaleString('id-ID')}`
  }),
  
  // For expense entries
  expense: (amount: number, description: string, date: string) => ({
    toHeadmaster: `*Notifikasi Pengeluaran*\n\nTelah dicatat pengeluaran pada tanggal ${date}:\n\nKeterangan: ${description}\nJumlah: Rp${amount.toLocaleString('id-ID')}`
  }),
  
  // Payment reminder
  paymentReminder: (studentName: string, month: string, year: string) => ({
    toParent: `*Pengingat Pembayaran SPP*\n\nYth. Wali dari ${studentName}\n\nDengan hormat kami mengingatkan bahwa pembayaran SPP untuk bulan ${month} ${year} belum kami terima. Mohon segera melakukan pembayaran.\n\nTerima kasih.\n\nHormat kami,\nBendahara Madrasah At-Tahzib Kekait`
  })
};
