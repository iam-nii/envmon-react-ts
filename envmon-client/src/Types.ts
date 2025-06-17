type TableItem = {
  id?: null | number;
  device_id?: null | number;
  room_id?: null | number;
  user_id?: null | number;
  [key: string]: unknown;
};
interface User {
  user_id?: number | null;
  userName?: string | null;
  uEmail?: string | null;
  uPhone?: string | null;
  uPassword?: string | null;
  uRole?: "Администратор" | "Инженер по охране труда";
  uPosition?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}
type Users = User[];

export const userRole = [
  {
    key: "Инженер по охране труда",
    label: "Инженер по охране труда",
  },
  {
    key: "Администратор",
    label: "Администратор",
  },
];

interface Room {
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
  old_device_id?: string;
  device_id?: string;
  deviceName?: string | null;
  zoneNum?: number;
  reqInterval?: number;
  room_id?: number | null;
  roomNumber?: number;
  status?: boolean | number;
}

type Devices = device[];

interface Params {
  param_id?: number;
  parameter_name?: string;
  unitOfMeasure?: string;
  pminValue?: number;
  pmaxValue?: number;
  parameter_alias?: string;
  techReg_id?: number;
  min?: number;
  max?: number;
}

type Parameters = Params[];

interface Regulation {
  techReg_id?: number;
  techreg_id?: number;
  param_id?: number | string;
  parameter_name?: string;
  minValue?: number;
  maxValue?: number;
  device_id?: string;
  // device_id?: string | Set<string>;
  sendMsg?: number | boolean;
}

interface Report {
  room_number: number;
  room_report: {
    param_name: string;
    param_uom: string;
    range: string;
    values: string[];
    date: string[];
  }[];
}
interface resData {
  status: string;
  message: string;
  data: string | [];
}

type Reports = Report[];

export type {
  Report,
  Reports,
  User,
  Users,
  Room,
  Rooms,
  device,
  Devices,
  Params,
  resData,
  TableItem,
  Parameters,
  Regulation,
};
