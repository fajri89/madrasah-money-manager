
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Safe access to auth context
  let user = null;
  let logout = () => {};
  
  try {
    const auth = useAuth();
    user = auth.user;
    logout = auth.logout;
  } catch (error) {
    console.error("Auth context not available:", error);
    return null; // Don't render anything if auth context is not available
  }

  if (!user) {
    return null;
  }

  // Get initials from user name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Map role to display name
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "bendahara":
        return "Bendahara";
      case "kepala_sekolah":
        return "Kepala Sekolah";
      default:
        return role;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
          <Avatar className="h-8 w-8 bg-green-700 text-white">
            <AvatarFallback>{getInitials(user.nama)}</AvatarFallback>
          </Avatar>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profil Pengguna</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center py-4 space-y-4">
          <Avatar className="h-20 w-20 bg-green-700 text-white text-xl">
            <AvatarFallback>{getInitials(user.nama)}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="text-lg font-semibold">{user.nama}</h3>
            <p className="text-sm text-gray-500">{getRoleDisplayName(user.level)}</p>
          </div>
          <div className="w-full pt-4 border-t flex flex-col gap-3">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() => {
                setIsOpen(false);
              }}
              asChild
            >
              <Link to="/profile">
                <Settings size={16} />
                <span>Pengaturan Akun</span>
              </Link>
            </Button>
            <Button
              variant="destructive"
              className="w-full flex items-center gap-2"
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfile;
