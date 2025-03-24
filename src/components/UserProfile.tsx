import { useAuth } from '../../contexts/AuthContext'; // Sesuaikan path

const UserProfile = ({ user }: { user: User }) => {
  const { user: authUser } = useAuth(); // Ambil user dari AuthContext

  const getInitials = (name: string) => {
    // Logika inisial
  };

  const getRoleDisplayName = (role: string) => {
    // Logika role
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
            {/* Tambahkan username di sini */}
            <p className="text-sm text-gray-600">Username: {authUser?.username || 'Belum login'}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
