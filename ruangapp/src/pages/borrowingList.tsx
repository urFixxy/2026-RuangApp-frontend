import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { Borrowing } from "../types/borrowing";

export default function BorrowingList() {
 const [data, setData] = useState<Borrowing[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");

 useEffect(() => {
  const fetchBorrowings = async () => {
   try {
    const res = await api.get<Borrowing[]>("/api/borrowings");
    setData(res.data);
   } catch (err) {
    setError("Gagal mengambil data dari backend");
   } finally {
    setLoading(false);
   }
  };

  fetchBorrowings();
 }, []);

 if (loading) return <p className="p-4">Loading...</p>;
 if (error) return <p className="p-4 text-red-600">{error}</p>;

 return (
  <div className="p-6">
   <h1 className="text-2xl font-bold mb-4">Borrowing List</h1>

   <table className="w-full border border-gray-200 bg-white">
    <thead className="bg-gray-200">
     <tr>
      <th className="p-2">Room</th>
      <th className="p-2">Borrower</th>
      <th className="p-2">Date</th>
      <th className="p-2">Status</th>
     </tr>
    </thead>
    <tbody>
     {data.map((item) => (
      <tr key={item.id} className="border-t border-gray-200 text-center">
       <td className="p-2">{item.room?.roomName ?? "-"}</td>
       <td className="p-2">{item.borrowerName}</td>
       <td className="p-2">{item.borrowingDate}</td>
       <td className="p-2">
        <span
         className={`text-sm px-2 py-1 rounded-full text-white ${
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
  </div>
 );
}
