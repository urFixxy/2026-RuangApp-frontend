import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

<link 
  rel="stylesheet" 
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
/>

interface Props {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItem = (path: string, label: string) => {
    const isActive = location.pathname === path;

    return (
      <Link
        to={path}
        className={`block px-4 py-2 rounded mb-2 transition ${
          isActive
            ? "bg-blue-500 text-white"
            : "text-gray-700 hover:bg-gray-200"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      {/* Sidebar Admin */}
      <div className="w-48 bg-white shadow-lg p-5">
        <h1 className="text-2xl font-bold text-blue-500 mb-6">
          RuangApp
        </h1>

        <nav>
          {menuItem("/admin/dashboard", "Dashboard")}
          {menuItem("/admin/borrowings", "Peminjaman")}
          {menuItem("/admin/rooms", "Ruangan")}
        </nav>

        <div className="mt-10 pt-5">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
