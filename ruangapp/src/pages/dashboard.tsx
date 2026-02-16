import { useEffect, useState } from "react";
import api from "../api/axios";

interface Room {
  id: number;
  roomName: string;
}

type Status = "Pending" | "Approved" | "Rejected";

interface Borrowing {
  id: number;
  borrowerName: string;
  borrowingDate: string;
  status: Status;
  room?: Room;
}

export default function Dashboard() {

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

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="p-6">

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">

          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-gray-500 text-sm">Total Peminjaman</h2>
            <p className="text-2xl font-bold">{total}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-gray-500 text-sm">Disetujui</h2>
            <p className="text-2xl font-bold text-green-500">
              {approved}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-gray-500 text-sm">Pending</h2>
            <p className="text-2xl font-bold text-yellow-500">
              {pending}
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
                <tr className="border-b text-left">
                  <th className="p-2">Room</th>
                  <th className="p-2">Peminjam</th>
                  <th className="p-2">Tanggal</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 5).map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">
                      {item.room?.roomName ?? "-"}
                    </td>
                    <td className="p-2">
                      {item.borrowerName}
                    </td>
                    <td className="p-2">
                      {item.borrowingDate}
                    </td>
                    <td className="p-2">
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
