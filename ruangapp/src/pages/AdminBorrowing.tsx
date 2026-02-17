import { useEffect, useState } from "react";
import type { Borrowing } from "../types/borrowing";
import type { Room } from "../types/room";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { edit, trash, times, save, plus } from "../assets/icons";

export default function AdminBorrowing() {
 const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
 const [rooms, setRooms] = useState<Room[]>([]);
 const [editingId, setEditingId] = useState<number | null>(null);
 const [editData, setEditData] = useState<Borrowing | null>(null);
 const [showDeleteModal, setShowDeleteModal] = useState(false);
 const [deleteId, setDeleteId] = useState<number | null>(null);
 const [loading, setLoading] = useState(false);
 const [showAddForm, setShowAddForm] = useState(false);
 const [search, setSearch] = useState("");
 const [filterStatus, setFilterStatus] = useState("");
 const [filterRoomId, setFilterRoomId] = useState<number | null>(null);
 const [filterDate, setFilterDate] = useState("");

 const [newData, setNewData] = useState<Borrowing>({
  id: 0,
  borrowerName: "",
  roomId: 0,
  borrowingDate: "",
  startTime: "",
  endTime: "",
  purpose: "",
  status: "Pending",
 });

 // Fetch data peminjaman
 useEffect(() => {
  fetchBorrowings();
  fetchRooms();
 }, []);

 const fetchBorrowings = async () => {
  try {
   setLoading(true);
   const token = localStorage.getItem("token");
   const params = new URLSearchParams();

   if (search) params.append("search", search);
   if (filterStatus) params.append("status", filterStatus);
   if (filterRoomId) params.append("roomId", filterRoomId.toString());
   if (filterDate) params.append("borrowingDate", filterDate);

   const response = await fetch(
    `http://localhost:5182/api/borrowings?${params.toString()}`,
    {
     headers: { Authorization: `Bearer ${token}` },
    },
   );
   const data = await response.json();
   setBorrowings(data);
  } catch (error) {
   console.error("Error fetching borrowings:", error);
  } finally {
   setLoading(false);
  }
 };

 const fetchRooms = async () => {
  try {
   const token = localStorage.getItem("token");
   const response = await fetch("http://localhost:5182/api/rooms", {
    headers: { Authorization: `Bearer ${token}` },
   });
   const data = await response.json();
   setRooms(data);
  } catch (error) {
   console.error("Error fetching rooms:", error);
  } finally {
   setLoading(false);
  }
 };

 // Handle Add
 const handleAdd = async () => {
  try {
   setLoading(true);
   const token = localStorage.getItem("token");
   const response = await fetch("http://localhost:5182/api/borrowings", {
    method: "POST",
    headers: {
     "Content-Type": "application/json",
     Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(newData),
   });

   if (response.ok) {
    const created = await response.json();
    setBorrowings([...borrowings, created]);
    setShowAddForm(false);
    alert("Data berhasil ditambahkan");
   } else {
    alert("Gagal menambahkan data");
   }
  } catch (error) {
   console.error(error);
  } finally {
   setLoading(false);
  }
 };

 // Handle Edit
 const handleEdit = (borrowing: Borrowing) => {
  setEditingId(borrowing.id);
  setEditData({ ...borrowing });
 };

 const handleSaveEdit = async () => {
  if (!editData) return;

  try {
   setLoading(true);
   const token = localStorage.getItem("token");
   const response = await fetch(
    `http://localhost:5182/api/borrowings/${editData.id}`,
    {
     method: "PUT",
     headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
     },
     body: JSON.stringify(editData),
    },
   );

   if (response.ok) {
    setBorrowings(borrowings.map((b) => (b.id === editData.id ? editData : b)));
    setEditingId(null);
    setEditData(null);
    alert("Data peminjaman berhasil diperbarui");
   } else {
    alert("Gagal memperbarui data");
   }
  } catch (error) {
   console.error("Error updating borrowing:", error);
   alert("Terjadi kesalahan saat update");
  } finally {
   setLoading(false);
  }
 };

 // Handle Delete
 const handleDeleteClick = (id: number) => {
  setDeleteId(id);
  setShowDeleteModal(true);
 };

 const handleConfirmDelete = async () => {
  if (!deleteId) return;

  try {
   setLoading(true);
   const token = localStorage.getItem("token");
   const response = await fetch(
    `http://localhost:5182/api/borrowings/${deleteId}`,
    {
     method: "DELETE",
     headers: { Authorization: `Bearer ${token}` },
    },
   );

   if (response.ok) {
    setBorrowings(borrowings.filter((b) => b.id !== deleteId));
    setShowDeleteModal(false);
    setDeleteId(null);
    alert("Data peminjaman berhasil dihapus");
   } else {
    alert("Gagal menghapus data");
   }
  } catch (error) {
   console.error("Error deleting borrowing:", error);
   alert("Terjadi kesalahan saat delete");
  } finally {
   setLoading(false);
  }
 };

 const handleCancelEdit = () => {
  setEditingId(null);
  setEditData(null);
 };

 return (
  <div className="p-6 bg-gray-50 min-h-screen">
   <h1 className="text-3xl font-bold mb-6 text-gray-800">Kelola Peminjaman</h1>
   <button
    onClick={() => setShowAddForm(true)}
    className="fixed right-10 bottom-10 bg-blue-500 text-white px-4 py-2 rounded"
   >
    <FontAwesomeIcon icon={plus} />
   </button>

   {showAddForm && (
    <div className="bg-white p-4 rounded shadow mb-6">
     <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col">
       <label
        htmlFor="borrowerName"
        className="text-sm font-semibold text-gray-700"
       >
        Nama Peminjam
       </label>
       <input
        type="text"
        id="borrowerName"
        placeholder="Nama Peminjam"
        value={newData.borrowerName}
        onChange={(e) =>
         setNewData({ ...newData, borrowerName: e.target.value })
        }
        className="border p-2 rounded"
       />
      </div>

      <div className="flex flex-col">
       <label className="text-sm font-semibold text-gray-700">Ruangan</label>
       <select
        value={newData.roomId}
        onChange={(e) =>
         setNewData({ ...newData, roomId: Number(e.target.value) })
        }
        className="border p-2 rounded"
       >
        <option value="">Pilih Ruangan</option>
        {rooms.map((room: Room) => (
         <option key={room.id} value={room.id}>
          {room.roomName}
         </option>
        ))}
       </select>
      </div>

      <div className="flex flex-col">
       <label className="text-sm font-semibold text-gray-700">
        Tanggal Pinjam
       </label>
       <input
        type="date"
        value={newData.borrowingDate}
        onChange={(e) =>
         setNewData({ ...newData, borrowingDate: e.target.value })
        }
        className="border p-2 rounded"
       />
      </div>

      <div className="flex flex-col">
       <label className="text-sm font-semibold text-gray-700">
        Waktu Mulai
       </label>
       <input
        type="time"
        value={newData.startTime}
        onChange={(e) => setNewData({ ...newData, startTime: e.target.value })}
        className="border p-2 rounded"
       />
      </div>

      <div className="flex flex-col">
       <label className="text-sm font-semibold text-gray-700">
        Waktu Selesai
       </label>
       <input
        type="time"
        value={newData.endTime}
        onChange={(e) => setNewData({ ...newData, endTime: e.target.value })}
        className="border p-2 rounded"
       />
      </div>

      <div className="flex flex-col">
       <label className="text-sm font-semibold text-gray-700">
        Tujuan Peminjaman
       </label>
       <input
        type="text"
        placeholder="Tujuan Peminjaman"
        value={newData.purpose}
        onChange={(e) => setNewData({ ...newData, purpose: e.target.value })}
        className="border p-2 rounded"
       />
      </div>
     </div>

     <div className="flex gap-3 mt-4">
      <button
       onClick={handleAdd}
       className="bg-green-500 text-white px-4 py-2 rounded"
      >
       <FontAwesomeIcon icon={save} />
      </button>
      <button
       onClick={() => setShowAddForm(false)}
       className="bg-gray-400 text-white px-4 py-2 rounded"
      >
       <FontAwesomeIcon icon={times} />
      </button>
     </div>
    </div>
   )}

   {loading && <p className="text-blue-500 mb-4">Loading...</p>}

   <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-4 gap-4">
    {/* Search Nama */}
    <input
     type="text"
     placeholder="Cari nama peminjam..."
     value={search}
     onChange={(e) => setSearch(e.target.value)}
     className="border border-gray-300 p-2 rounded"
    />

    {/* Filter Status */}
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

    {/* Filter Ruangan */}
    <select
     value={filterRoomId ?? ""}
     onChange={(e) =>
      setFilterRoomId(e.target.value ? Number(e.target.value) : null)
     }
     className="border border-gray-300 p-2 rounded"
    >
     <option value="">Semua Ruangan</option>
     {rooms.map((room) => (
      <option key={room.id} value={room.id}>
       {room.roomName}
      </option>
     ))}
    </select>

    {/* Filter Tanggal */}
    <input
     type="date"
     value={filterDate}
     onChange={(e) => setFilterDate(e.target.value)}
     className="border border-gray-300 p-2 rounded"
    />
   </div>

   <div className="mb-4 flex gap-3">
    <button
     onClick={fetchBorrowings}
     className="bg-blue-500 text-white px-4 py-2 rounded"
    >
     Cari
    </button>

    <button
     onClick={() => {
      setSearch("");
      setFilterStatus("");
      setFilterRoomId(null);
      setFilterDate("");
      fetchBorrowings();
     }}
     className="bg-gray-400 text-white px-4 py-2 rounded"
    >
     Reset
    </button>
   </div>

   {/* Table */}
   <div className="bg-white rounded-lg shadow overflow-x-auto w-full">
    <table className="min-w-full text-center">
     <thead className="bg-gray-100 border-b border-gray-200">
      <tr>
       <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
        User
       </th>
       <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
        Ruangan
       </th>
       <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
        Tanggal Pinjam
       </th>
       <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
        Waktu Mulai
       </th>
       <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
        Waktu Selesai
       </th>
       <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
        Tujuan Peminjaman
       </th>
       <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
        Status
       </th>
       <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
        Aksi
       </th>
      </tr>
     </thead>
     <tbody>
      {borrowings.map((borrowing) => (
       <tr
        key={borrowing.id}
        className="border-b text-center border-gray-200 hover:bg-gray-50"
       >
        {editingId === borrowing.id ? (
         // Edit Mode
         <>
          <td className="px-6 py-4 text-sm">{borrowing.borrowerName}</td>
          <td className="px-6 py-4 text-sm">{borrowing.room?.roomName ?? "-"}</td>
          <td className="px-6 py-4 text-sm">{borrowing.borrowingDate}</td>
          <td className="px-6 py-4 text-sm">{borrowing.startTime}</td>
          <td className="px-6 py-4 text-sm">{borrowing.endTime}</td>
          <td className="px-6 py-4 text-sm">{borrowing.purpose}</td>
          <td className="px-6 py-4">
           <select
            value={editData?.status || ""}
            onChange={(e) =>
             setEditData({ ...editData!, status: e.target.value })
            }
            className="border border-gray-300 px-6 py-2 text-sm rounded"
           >
            <option value="Pending" >Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
           </select>
          </td>
          <td className="flex px-6 py-4 text-center space-x-2">
           <button
            onClick={handleSaveEdit}
            className="bg-green-500 text-white hover:bg-green-600 text-lg py-1 px-2 rounded"
           >
            <FontAwesomeIcon icon={save} />
           </button>
           <button
            onClick={handleCancelEdit}
            className="bg-gray-500 text-white hover:bg-gray-600 text-lg py-1 px-2 rounded"
           >
            <FontAwesomeIcon icon={times} />
           </button>
          </td>
         </>
        ) : (
         // View Mode
         <>
          <td className="px-6 py-4 text-sm text-gray-900">
           {borrowing.borrowerName}
          </td>
          <td className="px-6 py-4 text-sm text-gray-900">
           {borrowing.room?.roomName ?? "-"}
          </td>
          <td className="px-6 py-4 text-sm text-gray-900">
           {borrowing.borrowingDate}
          </td>
          <td className="px-6 py-4 text-sm text-gray-900">
           {borrowing.startTime}
          </td>
          <td className="px-6 py-4 text-sm text-gray-900">
           {borrowing.endTime}
          </td>
          <td className="px-6 py-4 text-sm text-gray-900">
           {borrowing.purpose}
          </td>
          <td className="px-6 py-4">
           <span
            className={`px-3 py-1 rounded text-sm font-semibold ${
             borrowing.status === "Approved"
              ? "bg-green-100 text-green-800"
              : borrowing.status === "Pending"
                ? "bg-yellow-100 text-yellow-800"
                : borrowing.status === "Rejected"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
            }`}
           >
            {borrowing.status}
           </span>
          </td>
          <td className="px-6 py-4 text-center space-x-3">
           <button
            onClick={() => handleEdit(borrowing)}
            className="text-blue-500 hover:text-blue-700 text-lg"
            title="Edit"
           >
            <FontAwesomeIcon icon={edit} />
           </button>
           <button
            onClick={() => handleDeleteClick(borrowing.id)}
            className="text-red-500 hover:text-red-700 text-lg"
            title="Delete"
           >
            <FontAwesomeIcon icon={trash} />
           </button>
          </td>
         </>
        )}
       </tr>
      ))}
     </tbody>
    </table>
   </div>

   {/* Delete Confirmation Modal */}
   {showDeleteModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
     <div className="bg-white rounded-lg p-6 max-w-sm w-full">
      <div className="flex items-center justify-between mb-4">
       <h2 className="text-xl font-bold text-gray-800">Konfirmasi Hapus</h2>
       <button
        onClick={() => setShowDeleteModal(false)}
        className="text-gray-500 hover:text-gray-700"
       >
        <FontAwesomeIcon icon={times} />
       </button>
      </div>
      <p className="text-gray-600 mb-6">
       Apakah Anda yakin ingin menghapus data peminjaman ini?
      </p>
      <div className="flex gap-3 justify-end">
       <button
        onClick={() => setShowDeleteModal(false)}
        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
       >
        Batal
       </button>
       <button
        onClick={handleConfirmDelete}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
       >
        Hapus
       </button>
      </div>
     </div>
    </div>
   )}
  </div>
 );
}
