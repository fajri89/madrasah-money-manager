
import { useState } from 'react';
import { motion } from 'framer-motion';
import { sendWhatsAppNotification } from '@/utils/whatsAppIntegration';
import { toast } from 'sonner';

const WhatsAppNotification = () => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || !message) {
      toast.error('Lengkapi semua field terlebih dahulu');
      return;
    }
    
    try {
      setSending(true);
      
      // Use our centralized WhatsApp notification service
      const success = await sendWhatsAppNotification(phone, message);
      
      if (success) {
        // Clear form and show success toast
        setPhone('');
        setMessage('');
        toast.success('Pesan WhatsApp berhasil dikirim');
      }
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      toast.error('Gagal mengirim pesan WhatsApp');
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      className="glass-card rounded-xl p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h3 className="text-lg font-semibold mb-4">Kirim Notifikasi WhatsApp</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Nomor WhatsApp
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              +62
            </span>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500 px-4 py-2 text-sm"
              placeholder="81234567890"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Masukkan nomor tanpa angka 0 di depan
          </p>
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Pesan
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500 px-4 py-2 text-sm"
            rows={3}
            placeholder="Ketik pesan di sini..."
          />
        </div>
        
        <motion.button
          type="submit"
          disabled={sending || !phone || !message}
          className={`w-full py-2 px-4 rounded-lg text-white font-medium flex items-center justify-center transition-colors ${
            sending || !phone || !message
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
          whileTap={{ scale: 0.98 }}
        >
          {sending ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Mengirim...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M22 2 11 13"></path>
                <path d="m22 2-7 20-4-9-9-4 20-7z"></path>
              </svg>
              Kirim Pesan
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default WhatsAppNotification;
