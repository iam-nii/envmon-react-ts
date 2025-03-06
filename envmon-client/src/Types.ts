interface User {
  user_id?: number | null;
  userName?: string | null;
  uEmail: string | null;
  uPassword: string | null;
  uRole?: "admin" | "user" | null;
  uPosition?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}
type Users = User[];

interface Room {
  room_id: number;
  roomNumber: string;
  frPerson: string;
  location: string;
  length: number;
  width: number;
  height: number;
  area: number;
}

type RoomsT = Room[];

interface device {
  device_id: string | null;
  deviceName: string | null;
  zoneNum?: number;
  reqInterval?: number;
  roomID?: number;
}

type Devices = device[];

interface Params {
  param_id: number;
  parameter_name: string;
  unitOfMeasurement: string;
  minValue: number;
  maxValue: number;
}

export type { User, Users, Room, RoomsT, device, Devices, Params };
