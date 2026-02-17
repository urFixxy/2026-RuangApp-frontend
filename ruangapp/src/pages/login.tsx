import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login({ username, password });

      // Simpan token dan user data ke context
      authLogin(data.token, data.user);

      navigate("/");
    } catch (err) {
      setError("Email atau password salah");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-80"
      >
        <h2 className="flex flex-col text-xl font-bold mb-8 text-center">
          <span className="text-black">Login</span>
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
          type="password"
          placeholder="Password"
          className="w-full border border-blue-500 p-2 mb-4 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Login
        </button>

        <p className="text-center text-sm mt-4">
          Belum punya akun?{" "}
          <Link to="/register" className="text-blue-600 hover:underline font-semibold">
            Daftar di sini
          </Link>
        </p>
      </form>
    </div>
  );
}
