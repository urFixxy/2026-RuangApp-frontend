import { useEffect, useState } from "react";
import type { Borrowing } from "../types/borrowing";

export default function UserDashboard() {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBorrowings();
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
      console.error("Error fetching borrowings:", error);
    } finally {
      setLoading(false);
    }
  };

  const total = borrowings.length;
  const pending = borrowings.filter(b => b.status === "Pending").length;
  const approved = borrowings.filter(b => b.status === "Approved").length;
  const rejected = borrowings.filter(b => b.status === "Rejected").length;

  return (
    <div>
      {loading && <p>Loading...</p>}

      <div className="grid grid-cols-4 gap-6">

        {/* Total */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-gray-500 text-sm">Total Peminjaman</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {total}
          </p>
        </div>

        {/* Pending */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-gray-500 text-sm">Pending</h3>
          <p className="text-3xl font-bold text-yellow-500 mt-2">
            {pending}
          </p>
        </div>

        {/* Approved */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-gray-500 text-sm">Approved</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {approved}
          </p>
        </div>

        {/* Rejected */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-gray-500 text-sm">Rejected</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {rejected}
          </p>
        </div>

      </div>

      {/* Recent Borrowings */}
      <div className="mt-8 bg-white rounded shadow p-6">
        <h3 className="text-lg font-semibold mb-4">
          Peminjaman Terbaru
        </h3>

        {borrowings.length === 0 ? (
          <p className="text-gray-500">
            Belum ada peminjaman.
          </p>
        ) : (
          <div className="space-y-3">
            {borrowings.slice(0, 5).map((b) => (
              <div
                key={b.id}
                className="flex justify-between border-b pb-2"
              >
                <div>
                  <p className="font-medium">
                    {b.room?.roomName ?? "Ruangan"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {b.borrowingDate} | {b.startTime} - {b.endTime}
                  </p>
                </div>

                <span
                  className={`text-sm font-semibold ${
                    b.status === "Approved"
                      ? "text-green-600"
                      : b.status === "Pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}