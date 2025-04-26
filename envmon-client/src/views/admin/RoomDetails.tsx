import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from "@heroui/react";
import React, { useState } from "react";

interface DataItem {
  id: number;
  dateTime: string;
  temperature: number;
  humidity: number;
  light: number;
  voc: number;
  co2: number;
}

interface TableColumn {
  name: string;
  uid: keyof DataItem; // Ensures uid must be a key of DataItem
}

const COLUMNS: TableColumn[] = [
  { name: "Номер замера", uid: "id" },
  { name: "Дата и время", uid: "dateTime" },
  { name: "Температура, °C", uid: "temperature" },
  { name: "Влажность, %", uid: "humidity" },
  { name: "Освещенность, лк", uid: "light" },
  { name: "VOC, ppm", uid: "voc" },
  { name: "CO2, ppm", uid: "co2" },
];
const DATA: DataItem[] = [
  // {
  //     id: 20,
  //     dateTime: "2023-10-01 12:00",
  //     temperature: 23.2,
  //     humidity: 51,
  //     light: 105,
  //     voc: 0,
  //     co2: 414,
  // },
  {
    id: 19,
    dateTime: "2023-10-01 12:00",
    temperature: 23.2,
    humidity: 51,
    light: 105,
    voc: 3,
    co2: 414,
  },
  {
    id: 18,
    dateTime: "2023-10-01 12:00",
    temperature: 23.0,
    humidity: 51,
    light: 105,
    voc: 1,
    co2: 414,
  },
  {
    id: 17,
    dateTime: "2023-10-01 12:00",
    temperature: 23.1,
    humidity: 51,
    light: 105,
    voc: 4,
    co2: 414,
  },
  {
    id: 16,
    dateTime: "2023-10-01 12:00",
    temperature: 22.9,
    humidity: 51,
    light: 105,
    voc: 1,
    co2: 414,
  },
  {
    id: 15,
    dateTime: "2023-10-01 12:00",
    temperature: 23.2,
    humidity: 51,
    light: 105,
    voc: 0,
    co2: 414,
  },
  {
    id: 14,
    dateTime: "2023-10-01 12:00",
    temperature: 23.0,
    humidity: 51,
    light: 105,
    voc: 4,
    co2: 414,
  },
  {
    id: 13,
    dateTime: "2023-10-01 12:00",
    temperature: 23.1,
    humidity: 51,
    light: 105,
    voc: 3,
    co2: 414,
  },
  {
    id: 12,
    dateTime: "2023-10-01 12:00",
    temperature: 22.8,
    humidity: 51,
    light: 105,
    voc: 7,
    co2: 414,
  },
  {
    id: 11,
    dateTime: "2023-10-01 12:00",
    temperature: 23.0,
    humidity: 51,
    light: 105,
    voc: 4,
    co2: 414,
  },
  {
    id: 10,
    dateTime: "2023-10-01 12:00",
    temperature: 23.1,
    humidity: 51,
    light: 105,
    voc: 2,
    co2: 414,
  },
  {
    id: 9,
    dateTime: "2023-10-01 12:00",
    temperature: 23.2,
    humidity: 50,
    light: 105,
    voc: 5,
    co2: 414,
  },
  {
    id: 8,
    dateTime: "2023-10-01 12:00",
    temperature: 23.3,
    humidity: 51,
    light: 105,
    voc: 1,
    co2: 414,
  },
  {
    id: 7,
    dateTime: "2023-10-01 12:00",
    temperature: 23.0,
    humidity: 51,
    light: 105,
    voc: 0,
    co2: 414,
  },
  {
    id: 6,
    dateTime: "2023-10-01 12:00",
    temperature: 23.1,
    humidity: 51,
    light: 105,
    voc: 0,
    co2: 414,
  },
  {
    id: 5,
    dateTime: "2023-10-01 12:00",
    temperature: 23.2,
    humidity: 52,
    light: 105,
    voc: 2,
    co2: 414,
  },
  {
    id: 4,
    dateTime: "2023-10-01 12:00",
    temperature: 22.9,
    humidity: 52,
    light: 105,
    voc: 5,
    co2: 414,
  },
  {
    id: 3,
    dateTime: "2023-10-01 12:00",
    temperature: 23.0,
    humidity: 53,
    light: 105,
    voc: 7,
    co2: 414,
  },
  {
    id: 2,
    dateTime: "2023-10-01 12:00",
    temperature: 23.1,
    humidity: 53,
    light: 105,
    voc: 7,
    co2: 414,
  },
  {
    id: 1,
    dateTime: "2023-10-01 12:00",
    temperature: 23.0,
    humidity: 52,
    light: 105,
    voc: 0,
    co2: 414,
  },
];

function RoomDetails() {
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const pages = Math.ceil(DATA.length / pageSize);
  const items = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return DATA.slice(start, end);
  }, [page, DATA]);

  return (
    <div>
      <Table
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
      >
        <TableHeader>
          {COLUMNS.map((column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              {COLUMNS.map((column) => (
                <TableCell key={column.uid}>{item[column.uid]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default RoomDetails;
