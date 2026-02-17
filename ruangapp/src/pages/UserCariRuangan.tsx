import { useEffect, useState } from "react";
import type { Room } from "../types/Room";
import type { Borrowing } from "../types/borrowing";

export default function SearchRoom() {
 const [rooms, setRooms] = useState<Room[]>([]);
 const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
 const [loading, setLoading] = useState(false);
 const [selectedDate, setSelectedDate] = useState("");
 const [startTime, setStartTime] = useState("");
 const [endTime, setEndTime] = useState("");

 useEffect(() => {
  fetchRooms();
  fetchBorrowings();
 }, []);

 const fetchRooms = async () => {
  try {
   setLoading(true);
   const token = localStorage.getItem("token");
   const res = await fetch("http://localhost:5182/api/rooms", {
    headers: { Authorization: `Bearer ${token}` },
   });
   if (res.ok) {
    const data = await res.json();
    setRooms(data);
   }
  } catch (error) {
   console.error(error);
  } finally {
   setLoading(false);
  }
 };

 const fetchBorrowings = async () => {
  try {
   setLoading(true);
   const token = localStorage.getItem("token");
   const res = await fetch("http://localhost:5182/api/borrowings", {
    headers: { Authorization: `Bearer ${token}` },
   });
   if (res.ok) {
    const data = await res.json();
    setBorrowings(data);
   }
  } catch (error) {
   console.error(error);
  } finally {
   setLoading(false);
  }
 };

 // Filter ruangan yang tersedia sesuai tanggal & jam
 const availableRooms = rooms.filter((room) => {
  if (!room.isAvailable) return false;

  const hasConflict = borrowings.some(
   (b) =>
    b.roomId === room.id &&
    b.borrowingDate === selectedDate &&
    ((startTime >= b.startTime && startTime < b.endTime) ||
     (endTime > b.startTime && endTime <= b.endTime) ||
     (startTime <= b.startTime && endTime >= b.endTime)),
  );
  return !hasConflict;
 });

 return (
  <div className="p-8 bg-gray-50">
   <h2 className="text-2xl font-bold mb-6">Cari Ruangan</h2>

   <div className="bg-white p-6 rounded shadow mb-6 grid grid-cols-3 gap-4">
    <input
     type="date"
     value={selectedDate}
     onChange={(e) => setSelectedDate(e.target.value)}
     className="border border-gray-300 p-2 rounded"
    />
    <input
     type="time"
     value={startTime}
     onChange={(e) => setStartTime(e.target.value)}
     className="border border-gray-300 p-2 rounded"
    />
    <input
     type="time"
     value={endTime}
     onChange={(e) => setEndTime(e.target.value)}
     className="border border-gray-300 p-2 rounded"
    />
   </div>

   {loading && <p>Loading...</p>}

   <div className="bg-white rounded shadow overflow-x-auto">
    <table className="min-w-full text-center">
     <thead className="bg-gray-100">
      <tr>
       <th className="p-3 font-semibold text-md text-gray-900">Nama Ruangan</th>
       <th className="p-3 font-semibold text-md text-gray-900">Kapasitas</th>
       <th className="p-3 font-semibold text-md text-gray-900">Status</th>
      </tr>
     </thead>
     <tbody>
      {availableRooms.map((room) => (
       <tr key={room.id} className="border-t border-gray-200 hover:bg-gray-50">
        <td className="px-6 py-4 text-sm">{room.roomName}</td>
        <td className="px-6 py-4 text-sm">{room.capacity}</td>
        <td className="px-6 py-4 text-sm text-green-600 font-semibold">Tersedia</td>
       </tr>
      ))}
      {availableRooms.length === 0 && (
       <tr>
        <td colSpan={3} className="p-6 text-gray-500">
         Tidak ada ruangan tersedia untuk waktu ini.
        </td>
       </tr>
      )}
     </tbody>
    </table>
   </div>
  </div>
 );
}
