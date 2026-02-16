export interface Room {
  id: number;
  roomName: string;
  location: string;
  capacity: number;
  isAvailable: boolean;
}

export type BorrowingStatus = "Pending" | "Approved" | "Rejected";

export interface Borrowing {
  id: number;
  borrowerName: string;
  roomId: number;
  borrowingDate: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: BorrowingStatus;
  room?: Room;
}
