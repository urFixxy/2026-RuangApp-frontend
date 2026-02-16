import { Link, useLocation, useNavigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
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

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-5">

        <h1 className="text-xl font-bold text-blue-600 mb-6">
          RuangApp
        </h1>

        <nav>
          {menuItem("/", "Dashboard")}
          {menuItem("/borrowings", "Borrowings")}
          {menuItem("/rooms", "Rooms")}
        </nav>

        <div className="mt-10">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {children}
      </div>

    </div>
  );
}
