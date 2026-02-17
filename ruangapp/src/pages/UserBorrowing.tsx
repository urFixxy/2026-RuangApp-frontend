import { useEffect, useState } from "react";
import type { Borrowing } from "../types/borrowing";
import type { Room } from "../types/Room";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { plus, times } from "../assets/icons";

export default function UserBorrowing() {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");

  const [newData, setNewData] = useState({
    roomId: 0,
    borrowingDate: "",
    startTime: "",
    endTime: "",
    purpose: "",
  });

  useEffect(() => {
    fetchBorrowings();
    fetchRooms();
  }, []);

  const fetchBorrowings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5182/api/borrowings",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBorrowings(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5182/api/rooms", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();
      setRooms(data.filter((r: Room) => r.isAvailable));
    }
  };

  // ADD
  const handleAdd = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5182/api/borrowings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newData),
        }
      );

      if (response.ok) {
        alert("Peminjaman berhasil diajukan");
        setShowAddForm(false);
        fetchBorrowings();
      } else {
        alert("Gagal mengajukan peminjaman");
      }
    } catch (error) {
      alert("Terjadi kesalahan");
    }
  };

  // DELETE (hanya pending)
  const handleDelete = async (id: number) => {
    if (!window.confirm("Batalkan peminjaman ini?")) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5182/api/borrowings/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        alert("Peminjaman dibatalkan");
        fetchBorrowings();
      } else {
        alert("Gagal membatalkan peminjaman");
      }
    } catch (error) {
      alert("Terjadi kesalahan saat membatalkan peminjaman");
    }
  };

  const filteredBorrowings = filterStatus
    ? borrowings.filter((b) => b.status === filterStatus)
    : borrowings;

  return (
    <div className="bg-gray-50 p-8">
      <h2 className="text-2xl font-bold mb-6">Peminjaman Saya</h2>

      {/* Add Button */}
      <button
        onClick={() => setShowAddForm(true)}
        className="bg-blue-600 fixed right-10 bottom-6 text-white px-4 py-2 rounded mb-6"
      >
        <FontAwesomeIcon icon={plus} />
      </button>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded shadow mb-6 grid grid-cols-2 gap-4">
          <select
            value={newData.roomId}
            onChange={(e) =>
              setNewData({ ...newData, roomId: Number(e.target.value) })
            }
            className="border border-gray-300 p-2 rounded"
          >
            <option value="">Pilih Ruangan</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.roomName}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={newData.borrowingDate}
            onChange={(e) =>
              setNewData({ ...newData, borrowingDate: e.target.value })
            }
            className="border border-gray-300 p-2 rounded"
          />

          <input
            type="time"
            value={newData.startTime}
            onChange={(e) =>
              setNewData({ ...newData, startTime: e.target.value })
            }
            className="border border-gray-300 p-2 rounded"
          />

          <input
            type="time"
            value={newData.endTime}
            onChange={(e) =>
              setNewData({ ...newData, endTime: e.target.value })
            }
            className="border border-gray-300 p-2 rounded"
          />

          <input
            type="text"
            placeholder="Keperluan"
            value={newData.purpose}
            onChange={(e) =>
              setNewData({ ...newData, purpose: e.target.value })
            }
            className="border border-gray-300 p-2 rounded col-span-2"
          />

          <div className="col-span-2 flex gap-3">
            <button
              onClick={handleAdd}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Simpan
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {loading && <p>Loading...</p>}

      {/* Filter */}
      <div className="mb-4 bg-white p-4 rounded shadow">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 p-2 rounded"
        >
          <option value="">Semua Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-sm font-medium text-gray-700">Ruangan</th>
              <th className="p-3 text-sm font-medium text-gray-700">Tanggal</th>
              <th className="p-3 text-sm font-medium text-gray-700">Waktu</th>
              <th className="p-3 text-sm font-medium text-gray-700">Status</th>
              <th className="p-3 text-sm font-medium text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredBorrowings.map((b) => (
              <tr key={b.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{b.room?.roomName}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{b.borrowingDate}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {b.startTime} - {b.endTime}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {b.status === "Approved" && <span className="text-green-600">Approved</span>}
                  {b.status === "Rejected" && <span className="text-red-600">Rejected</span>}
                  {b.status === "Pending" && <span className="text-yellow-600">Pending</span>}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      <FontAwesomeIcon icon={times} />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredBorrowings.length === 0 && (
          <p className="p-6 text-gray-500">
            Belum ada peminjaman.
          </p>
        )}
      </div>
    </div>
  );
}