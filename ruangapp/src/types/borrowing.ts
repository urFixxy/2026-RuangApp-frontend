export interface Room {
  id: number;
  roomName: string;
  location: string;
  capacity: number;
  isAvailable: boolean;
}

export interface Borrowing {
  id: number;
  borrowerName: string;
  roomId: number;
  room?: Room;
  borrowingDate: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: string;
}
