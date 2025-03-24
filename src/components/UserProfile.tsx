import React, { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '../../contexts/AuthContext'; // Sesuaikan path

// Define user interface (sesuaikan dengan AuthContext)
interface User {
  id: number;
  username: string;
  name: string;
  role: string;
}

const UserProfile = ({ user }: { user: User }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user: authUser } = useAuth(); // Ambil user dari AuthContext

  // Function to get initials from name
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
  };

  // Map role to display name
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'bendahara':
        return 'Bendahara';
      case 'kepala_sekolah':
        return 'Kepala Sekolah';
      default:
        return role;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
          <Avatar className="h-8 w-8 bg-green-700 text-white">
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profil Pengguna</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center py-4 space-y-4">
          <Avatar className="h-20 w-20 bg-green-700 text-white text-xl">
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="text-lg font-semibold">{user.name}</p>
            <p className="text-sm text-gray-600">{getRoleDisplayName(user.role)}</p>
            {/* Tampilkan username dari authUser */}
            <p className="text-sm text-gray-600 font-medium">
              Username: {authUser?.username || 'Belum login'}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfile;
