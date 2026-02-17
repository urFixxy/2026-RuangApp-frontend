import { useEffect, useState } from "react";
import api from "../api/axios";
import type { Borrowing } from "../types/borrowing";


export default function AdminDashboard() {

  const [data, setData] = useState<Borrowing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/api/borrowings");
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const total = data.length;
  const approved = data.filter(d => d.status === "Approved").length;
  const pending = data.filter(d => d.status === "Pending").length;
  const rejected = total - approved - pending;

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="p-6">

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">

          <div className="bg-white border-l-4 border-blue-500 p-4 rounded-xl shadow">
            <h2 className="text-gray-500 text-sm">Total Peminjaman</h2>
            <p className="text-2xl font-bold">{total}</p>
          </div>

          <div className="bg-white border-l-4 border-green-500 p-4 rounded-xl shadow">
            <h2 className="text-gray-500 text-sm">Disetujui</h2>
            <p className="text-2xl font-bold text-green-500">
              {approved}
            </p>
          </div>

          <div className="bg-white border-l-4 border-yellow-500 p-4 rounded-xl shadow">
            <h2 className="text-gray-500 text-sm">Ditunda</h2>
            <p className="text-2xl font-bold text-yellow-500">
              {pending}
            </p>
          </div>

          <div className="bg-white border-l-4 border-red-500 p-4 rounded-xl shadow">
            <h2 className="text-gray-500 text-sm">Ditolak</h2>
            <p className="text-2xl font-bold text-red-500">
              {rejected}
            </p>
          </div>

        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-4">
            Peminjaman Terbaru
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-center text-gray-900 font-medium">
                  <th className="p-3">Room</th>
                  <th className="p-3">Peminjam</th>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 5).map((item) => (
                  <tr key={item.id} className="border-t border-gray-200 text-center">
                    <td className="px-6 py-3">
                      {item.room?.roomName ?? "-"}
                    </td>
                    <td className="px-6 py-3">
                      {item.borrowerName}
                    </td>
                    <td className="px-6 py-3">
                      {item.borrowingDate}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-2 py-1 text-white rounded text-xs ${
                          item.status === "Approved"
                            ? "bg-green-500"
                            : item.status === "Rejected"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>
      </div>
    </div>
  );
}
