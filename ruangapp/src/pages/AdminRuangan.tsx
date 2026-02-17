import { useEffect, useState } from "react";
import type { Room } from "../types/room";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { edit, trash, times, save, plus } from "../assets/icons";

export default function AdminRuangan() {
 const [rooms, setRooms] = useState<Room[]>([]);
 const [editingId, setEditingId] = useState<number | null>(null);
 const [editData, setEditData] = useState<Room | null>(null);
 const [showDeleteModal, setShowDeleteModal] = useState(false);
 const [deleteId, setDeleteId] = useState<number | null>(null);
 const [loading, setLoading] = useState(false);
 const [showAddForm, setShowAddForm] = useState(false);
 const [search, setSearch] = useState("");

 const [newData, setNewData] = useState<Room>({
  id: 0,
  roomName: "",
  capacity: 0,
  location: "",
  isAvailable: true,
 });

 useEffect(() => {
  fetchRooms();
 }, []);

 const fetchRooms = async () => {
  try {
   setLoading(true);
   const token = localStorage.getItem("token");

   const params = new URLSearchParams();
   if (search) params.append("search", search);

   const response = await fetch(
    `http://localhost:5182/api/rooms?${params.toString()}`,
    {
     headers: { Authorization: `Bearer ${token}` },
    },
   );

   const data = await response.json();
   setRooms(data);
  } catch (error) {
   console.error("Error fetching rooms:", error);
  } finally {
   setLoading(false);
  }
 };

 // ADD
 const handleAdd = async () => {
  try {
   setLoading(true);
   const token = localStorage.getItem("token");

   const response = await fetch("http://localhost:5182/api/rooms", {
    method: "POST",
    headers: {
     "Content-Type": "application/json",
     Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(newData),
   });

   if (response.ok) {
    const created = await response.json();
    setRooms([...rooms, created]);
    setShowAddForm(false);
   }
  } finally {
   setLoading(false);
  }
 };

 // EDIT
 const handleEdit = (room: Room) => {
  setEditingId(room.id);
  setEditData({ ...room });
 };

 const handleSaveEdit = async () => {
  if (!editData) return;

  try {
   setLoading(true);
   const token = localStorage.getItem("token");

   const response = await fetch(
    `http://localhost:5182/api/rooms/${editData.id}`,
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
    setRooms(rooms.map((r) => (r.id === editData.id ? editData : r)));
    alert("Ruangan berhasil diperbarui");
    setEditingId(null);
    setEditData(null);
   }
  } catch (error) {
   console.error(error);
   alert("Gagal memperbarui ruangan");
  } finally {
   setLoading(false);
  }
 };

 // DELETE
 const handleDeleteClick = (id: number) => {
  setDeleteId(id);
  setShowDeleteModal(true);
 };

 const handleConfirmDelete = async () => {
  if (!deleteId) return;

  try {
   const token = localStorage.getItem("token");

   const response = await fetch(`http://localhost:5182/api/rooms/${deleteId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
   });

   if (response.ok) {
    setRooms(rooms.filter((r) => r.id !== deleteId));
    alert("Ruangan berhasil dihapus");
    setShowDeleteModal(false);
    setDeleteId(null);
   }
  } catch (error) {
   console.error(error);
   alert("Gagal menghapus ruangan");
  }
 };

 return (
  <div className="p-6 bg-gray-50 min-h-screen">
   <h1 className="text-3xl font-bold mb-6 text-gray-800">Kelola Ruangan</h1>
   {/* Add Button */}
   <button
    onClick={() => setShowAddForm(true)}
    className="fixed right-10 bottom-10 bg-blue-500 text-white px-4 py-2 rounded"
   >
    <FontAwesomeIcon icon={plus} />
   </button>

   {/* Add Form */}
   {showAddForm && (
    <div className="bg-white p-4 rounded shadow mb-6">
     <div className="grid grid-cols-3 gap-4">
      <input
       type="text"
       placeholder="Nama Ruangan"
       value={newData.roomName}
       onChange={(e) => setNewData({ ...newData, roomName: e.target.value })}
       className="border p-2 rounded"
      />

      <input
       type="number"
       placeholder="Kapasitas"
       value={newData.capacity}
       onChange={(e) =>
        setNewData({ ...newData, capacity: Number(e.target.value) })
       }
       className="border p-2 rounded"
      />

      <input
       type="text"
       placeholder="Lokasi"
       value={newData.location}
       onChange={(e) => setNewData({ ...newData, location: e.target.value })}
       className="border p-2 rounded"
      />
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

   {/* Search */}
   <div className="mb-4 flex gap-3 bg-white p-4 rounded shadow">
    <input
     type="text"
     placeholder="Cari ruangan..."
     value={search}
     onChange={(e) => setSearch(e.target.value)}
     className="border border-gray-300 p-2 rounded"
    />
    <button
     onClick={fetchRooms}
     className="bg-blue-500 text-white px-4 py-2 rounded"
    >
     Cari
    </button>
    <button
     onClick={() => {
      setSearch("");
      fetchRooms();
     }}
     className="bg-gray-400 text-white px-4 py-2 rounded"
    >
     Reset
    </button>
   </div>
   {loading && <p className="text-blue-500 mb-4">Loading...</p>}

   {/* Table */}
   <div className="bg-white rounded shadow overflow-x-auto">
    <table className="min-w-full">
     <thead className="bg-gray-100">
      <tr>
       <th className="px-4 py-2 text-center text-sm font-semibold text-gray-900">
        Nama
       </th>
       <th className="px-4 py-2 text-center text-sm font-semibold text-gray-900">
        Kapasitas
       </th>
       <th className="px-4 py-2 text-center text-sm font-semibold text-gray-900">
        Lokasi
       </th>
       <th className="px-4 py-2 text-center text-sm font-semibold text-gray-900">
        Status
       </th>
       <th className="px-4 py-2 text-center text-sm font-semibold text-gray-900">
        Aksi
       </th>
      </tr>
     </thead>
     <tbody>
      {rooms.map((room) => (
       <tr
        key={room.id}
        className="border-t border-gray-200 hover:bg-gray-50 transition duration-200 text-center"
       >
        {editingId === room.id ? (
         <>
          <td className="px-6 py-4">
           <input
            value={editData?.roomName}
            onChange={(e) =>
             setEditData({
              ...editData!,
              roomName: e.target.value,
             })
            }
            className="border text-sm border-gray-300 p-2 rounded"
           />
          </td>
          <td className="px-6 py-4">
           <input
            type="number"
            value={editData?.capacity}
            onChange={(e) =>
             setEditData({
              ...editData!,
              capacity: Number(e.target.value),
             })
            }
            className="border text-sm border-gray-300 p-2 rounded"
           />
          </td>
          <td className="px-6 py-4">
           <input
            value={editData?.location}
            onChange={(e) =>
             setEditData({
              ...editData!,
              location: e.target.value,
             })
            }
            className="border text-sm border-gray-300 p-2 rounded"
           />
          </td>
          <td className="px-6 py-4">
           <select
            value={editData?.isAvailable ? "true" : "false"}
            onChange={(e) =>
             setEditData({
              ...editData!,
              isAvailable: e.target.value === "true",
             })
            }
            className="border text-sm border-gray-300 p-2 rounded"
           >
            <option value="true">Tersedia</option>
            <option value="false">Tidak Tersedia</option>
           </select>
          </td>
          <td className="px-6 py-4">
           <div className="flex justify-center justify-center items-center gap-2">
            <button onClick={handleSaveEdit} className="text-green-600">
             <FontAwesomeIcon icon={save} />
            </button>

            <button
             onClick={() => setEditingId(null)}
             className="text-gray-600"
            >
             <FontAwesomeIcon icon={times} />
            </button>
           </div>
          </td>
         </>
        ) : (
         <>
          <td className="px-6 py-4 text-sm text-gray-900">{room.roomName}</td>
          <td className="px-6 py-4 text-sm text-gray-900">{room.capacity}</td>
          <td className="px-6 py-4 text-sm text-gray-900">{room.location}</td>
          <td className="px-6 py-4 text-sm text-gray-900">
           {room.isAvailable ? "Tersedia" : "Tidak Tersedia"}
          </td>
          <td className="px-6 py-4 flex gap-3 text-lg justify-center items-center">
           <button onClick={() => handleEdit(room)} className="text-blue-500 hover:text-blue-800">
            <FontAwesomeIcon icon={edit} />
           </button>
           <button
            onClick={() => handleDeleteClick(room.id)}
            className="text-red-500 hover:text-red-800"
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
   {/* Delete Modal */}
   {showDeleteModal && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
     <div className="bg-white p-6 rounded shadow-lg w-96">
      <h2 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h2>

      <p className="mb-6">Apakah Anda yakin ingin menghapus ruangan ini?</p>

      <div className="flex justify-end gap-3">
       <button
        onClick={() => setShowDeleteModal(false)}
        className="bg-gray-400 text-white px-4 py-2 rounded"
       >
        Batal
       </button>

       <button
        onClick={handleConfirmDelete}
        className="bg-red-500 text-white px-4 py-2 rounded"
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
