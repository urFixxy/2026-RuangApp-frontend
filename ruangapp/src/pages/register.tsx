import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    setLoading(true);

    try {
      await register({ username, email, password });
      alert("Akun berhasil dibuat! Silakan login.");
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal membuat akun");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-80"
      >
        <h2 className="flex flex-col text-xl font-bold mb-8 text-center">
          <span className="text-black">Daftar</span>
          <span className="text-blue-500 text-2xl">RuangApp</span>
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        <input
          type="text"
          placeholder="Username"
          className="w-full border border-blue-500 p-2 mb-3 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border border-blue-500 p-2 mb-3 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border border-blue-500 p-2 mb-3 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Konfirmasi Password"
          className="w-full border border-blue-500 p-2 mb-3 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Membuat Akun..." : "Daftar"}
        </button>

        <p className="text-center text-sm mt-4">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-semibold">
            Login di sini
          </Link>
        </p>
      </form>
    </div>
  );
}
