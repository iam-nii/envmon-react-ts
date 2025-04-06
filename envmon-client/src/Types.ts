type TableItem = {
  id?: null | number;
  device_id?: null | number;
  room_id?: null | number;
  user_id?: null | number;
  [key: string]: unknown;
};
interface User extends TableItem {
  user_id?: number | null;
  userName?: string | null;
  uEmail: string | null;
  uPhone?: string | null;
  uPassword: string | null;
  uRole?: "admin" | "user" | null;
  uPosition?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}
type Users = User[];

export const userRole = [
  {
    key: "user",
    label: "Инженер по охране труда",
  },
  {
    key: "admin",
    label: "Администратор",
  },
];

interface Room extends TableItem {
  room_id?: number;
  roomNumber: number;
  frPerson: string;
  location: string;
  length: number;
  width: number;
  height: number;
  area: number;
}

type Rooms = Room[];

interface device {
  device_id: number;
  deviceName: string | null;
  zoneNum?: number;
  reqInterval?: number;
  roomID?: number | null;
}

type Devices = device[];

interface Params {
  param_id: number;
  parameter_name: string;
  unitOfMeasurement: string;
  minValue: number;
  maxValue: number;
}

export type { User, Users, Room, Rooms, device, Devices, Params, TableItem };
