import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  children: React.ReactNode;
}

export default function UserLayout({ children }: Props) {
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
        className={`block px-4 py-2 rounded-lg mb-2 transition ${
          isActive
            ? "bg-blue-600 text-white"
            : "text-gray-700 hover:bg-gray-200"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      {/* Sidebar User */}
      <div className="w-64 bg-white shadow-lg p-5">
        <h1 className="text-xl font-bold text-blue-600 mb-6">
          RuangApp
        </h1>

        <nav>
          {menuItem("/user/dashboard", "Dashboard")}
          {menuItem("/user/borrowings", "Peminjaman Saya")}
          {menuItem("/user/findrooms", "Cari Ruangan")}
        </nav>

        <div className="mt-6 pt-5">
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
