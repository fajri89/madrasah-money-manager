
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';
import { getAdminSettings, saveAdminSettings } from '@/utils/api';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    headmasterPhone: '',
    enableWhatsAppNotifications: true
  });
  const [loading, setLoading] = useState(false);

  // Load settings on component mount
  useEffect(() => {
    const currentSettings = getAdminSettings();
    setSettings(currentSettings);
  }, []);

  const handleSave = () => {
    try {
      setLoading(true);
      
      // Clean phone number
      const cleanPhone = settings.headmasterPhone.replace(/\D/g, "");
      const formattedPhone = cleanPhone.startsWith('0') 
        ? cleanPhone.substring(1) 
        : cleanPhone;
        
      // Validate phone number
      if (!formattedPhone || formattedPhone.length < 10) {
        toast.error('Nomor telepon tidak valid');
        setLoading(false);
        return;
      }
      
      // Save with formatted phone number
      const updatedSettings = {
        ...settings,
        headmasterPhone: formattedPhone
      };
      
      saveAdminSettings(updatedSettings);
      setSettings(updatedSettings);
      
      toast.success('Pengaturan berhasil disimpan');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Gagal menyimpan pengaturan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Pengaturan Admin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* WhatsApp Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Pengaturan Notifikasi WhatsApp</h3>
            
            <div className="space-y-2">
              <Label htmlFor="enableWhatsApp" className="flex items-center justify-between">
                <span>Aktifkan notifikasi WhatsApp</span>
                <Switch 
                  id="enableWhatsApp"
                  checked={settings.enableWhatsAppNotifications}
                  onCheckedChange={(checked) => 
                    setSettings({...settings, enableWhatsAppNotifications: checked})
                  }
                />
              </Label>
              <p className="text-sm text-gray-500">
                Notifikasi akan dikirim ke kepala sekolah dan wali siswa untuk pembayaran SPP, pemasukan, dan pengeluaran.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="headmasterPhone">Nomor WhatsApp Kepala Sekolah</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  +62
                </span>
                <Input
                  id="headmasterPhone"
                  className="pl-10"
                  value={settings.headmasterPhone}
                  onChange={(e) => setSettings({...settings, headmasterPhone: e.target.value})}
                  placeholder="8123456789"
                  disabled={!settings.enableWhatsAppNotifications}
                />
              </div>
              <p className="text-xs text-gray-500">
                Masukkan nomor tanpa angka 0 di depan
              </p>
            </div>
          </div>
          
          <Button 
            onClick={handleSave}
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                <span>Menyimpan...</span>
              </div>
            ) : (
              'Simpan Pengaturan'
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminSettings;
