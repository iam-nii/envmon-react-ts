import { Select, SelectItem, Button } from "@heroui/react";
import { useRoomContext } from "../../context/RoomContextProvider";
import { useEffect, useRef, useState } from "react";
// import { useReportContext } from "../../context/ReportContextProvider";
import { resData } from "../../Types";
import axiosClient from "../../axiosClient";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import RoomReport from "../../components/reports/RoomReport";
import html2pdf from "html2pdf.js";
import { useUserContext } from "../../context/UserContextProvider";

function Reports() {
  interface roomParams {
    roomNumber: number;
    entities: {
      device_id: string;
      zone_num: number;
      parameters: {
        parameter_name: string;
        parameter_alias: string;
        trMax: number;
        trMin: number;
        unitOfMeasure: string;
        report: {
          logId: number;
          logValue: number;
          mdt: string;
        }[];
      }[];
    }[];
  }
  const { rooms } = useRoomContext();
  const [roomNumber, setRoomNumber] = useState<number>();
  // const { ReportRef } = useReportContext();
  // const [roomReport, setRoomReport] = useState<Report | null>(null);
  const [isDateSelected, setIsDataSelected] = useState<boolean>(false);
  const { user } = useUserContext();
  const [roomParameters, setRoomParameters] = useState<roomParams[] | null>();
  // const [isEmptyReport, setIsEmptyReport] = useState<boolean>(false);
  const [allReports, setAllReport] = useState<roomParams[] | null>(null);
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endData: string;
  } | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleRoomSelectionChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    // setRoomReport(null);
    // setIsEmptyReport(false);
    const roomNumber = rooms.find(
      (room) => room.room_id === Number(e.target.value)
    )?.roomNumber;
    setRoomNumber(roomNumber!);
  };
  const handleDownloadPdf = () => {
    if (contentRef.current) {
      const options = {
        margin: 0.2,
        pagebreak: { mode: ["css", "legacy"] },
        filename: `Отчет для ${
          roomNumber ? `помещения № ${roomNumber}` : "всех помещений"
        }.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
      };
      console.log(contentRef.current);

      html2pdf().set(options).from(contentRef.current).save();
    }
  };
  // const generateReport = () => {
  //   getRoomParameters();
  // };

  interface ApiDataItem {
    room_id: number;
    roomNumber: number;
    device_id: string;
    zoneNum: number;
    deviceName: string;
    param_id: string;
    parameter_name: string;
    parameter_alias: string;
    max: number;
    min: number;
    unitOfMeasure: string;
  }

  // Getting the room parameters
  useEffect(() => {
    getRoomParameters();
  }, []);

  // Get room parameters
  const getRoomParameters = () => {
    axiosClient
      .get("/api/rooms/?method=GET&query=getRoomParameters")
      .then(({ data }) => {
        const response: resData = data;
        if (Array.isArray(response.data)) {
          const room_params = groupByRoom(response.data);
          setRoomParameters(room_params);
        }
      });
  };
  // Group by room
  function groupByRoom(data: ApiDataItem[]): roomParams[] {
    // Map to hold rooms by roomNumber
    const roomsMap = new Map<number, roomParams>();

    data.forEach((item) => {
      // Check if room already exists
      let room = roomsMap.get(item.roomNumber);
      if (!room) {
        room = {
          roomNumber: item.roomNumber,
          entities: [],
        };
        roomsMap.set(item.roomNumber, room);
      }

      // Find device in entities
      let device = room.entities.find((d) => d.device_id === item.device_id);
      if (!device) {
        device = {
          device_id: item.device_id,
          zone_num: item.zoneNum,
          parameters: [],
        };
        room.entities.push(device);
      }
      // Add parameter to device
      device.parameters.push({
        parameter_name: item.parameter_name,
        parameter_alias: item.parameter_alias,
        unitOfMeasure: item.unitOfMeasure,
        trMax: item.max,
        trMin: item.min,
        report: [],
      });
    });
    return Array.from(roomsMap.values());
  }

  interface ReportItem {
    roomNumber: number;
    log_id: number;
    logValue: number;
    mdt: string;
    parameter_name: string;
  }

  function addReportsToRooms(
    rooms: roomParams[],
    reports: ReportItem[]
  ): roomParams[] {
    // Creating a map for fast lookup: roomNumber -> room
    const roomMap = new Map<number, roomParams>();
    rooms.forEach((room) => roomMap.set(room.roomNumber, room));
    console.log(roomMap);

    reports.forEach((report) => {
      const room = roomMap.get(report.roomNumber);
      if (!room) return; // no such room,  skip

      // find parameter by parameter_name inside all devices of the room
      for (const device of room.entities) {
        const param = device.parameters.find(
          (p) => p.parameter_name === report.parameter_name
        );
        if (param) {
          param.report.push({
            logId: report.log_id,
            logValue: report.logValue,
            mdt: report.mdt,
          });
          break;
        }
      }
    });
    return rooms;
  }

  const handleDateRangeChange = (range: {
    start: Date | null;
    end: Date | null;
  }) => {
    // 2025-05-20 20:01:43
    let startDate = "";
    let startTime = "";
    if (range.start) {
      startDate = `${range.start?.getFullYear()}-${
        range.start.getMonth() + 1
      }-${range.start.getDate()}`;
      startTime = `${range.start.getHours()}:${range.start.getMinutes()}:${range.start.getSeconds()}`;
      console.log(`From: ${startDate} ${startTime}`);
    }

    let endDate = "";
    let endTime = "";
    if (range.end) {
      endDate = `${range.end.getFullYear()}-${
        range.end.getMonth() + 1
      }-${range.end.getDate()}`;
      endTime = `${range.end.getHours()}:${range.end.getMinutes()}:${range.end.getSeconds()}`;
      console.log(`To: ${endDate} ${endTime}`);
    }

    // &query=getFilteredReports&minDate=2025-05-19 00:15:33&maxDate=2025-5-20 20:01:43
    if (range.start && range.end)
      setDateRange({
        startDate: `${startDate} ${startTime}`,
        endData: `${endDate} ${endTime}`,
      });
  };
  const handleFilteredSearch = () => {
    setAllReport(null);
    getRoomParameters();
    if (dateRange) {
      setIsDataSelected(true);
      axiosClient
        .get(
          `/api/reports/?method=GET&query=getFilteredReports&minDate=${dateRange.startDate}&maxDate=${dateRange.endData}`
        )
        .then(({ data }) => {
          console.log(data);
          data.data.map((item: ReportItem) => {
            item.mdt = formatDate(new Date(item.mdt));
          });
          if (roomParameters) {
            const rooms = addReportsToRooms(roomParameters!, data.data);
            setAllReport(rooms);
          }
        });
    }
  };
  function formatDate(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return (
      [pad(date.getDate()), pad(date.getMonth() + 1), date.getFullYear()].join(
        "."
      ) +
      " " +
      [
        pad(date.getHours()),
        pad(date.getMinutes()),
        pad(date.getSeconds()),
      ].join(":")
    );
  }
  // useEffect(() => {
  //   console.log(allReports);
  // }, [allReports]);
  return (
    <>
      <div className="flex items-center">
        <h1 className="w-[39%] my-auto font-bold text-md">
          <span className="text-lg">О</span>ТЧЕТ О МОНИТОРИНГЕ МИКРОКЛИМАТА
        </h1>
        <div className="p-4">
          <CustomDateRangePicker onChange={handleDateRangeChange} />
          {!isDateSelected && (
            <p className=" ml-2 mt-2 font-medium text-sm text-red-400">
              Пожалуйста выберите даты{" "}
            </p>
          )}
        </div>
        <Button color="primary" onPress={handleFilteredSearch}>
          Поиск
        </Button>
      </div>
      <div className="mt-5 flex gap-5 items-center">
        <Select
          label="Помещение"
          placeholder="Выберите помещение"
          variant="bordered"
          className="w-52"
          onChange={handleRoomSelectionChange}
        >
          {rooms?.map((room) => (
            <SelectItem
              key={String(room.room_id)}
              textValue={String(`${room.roomNumber} (${room.location})`)}
            >
              {room.roomNumber} ({room.location})
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* Report for all rooms */}
      <div className="mt-10" id="report-container">
        <Button variant="bordered" color="primary" onPress={handleDownloadPdf}>
          Скачать в PDF
        </Button>
        <div ref={contentRef} className="h-full" id="content">
          <div className="my-10" id="Information">
            <h1 className="font-bold underline">
              Составитель отчёта:{" "}
              <span className="font-normal">{user?.userName}</span>
            </h1>
            <h1 className="font-bold underline">
              E-mail: <span className="font-normal">{user?.uEmail}</span>
            </h1>
          </div>
          {/* Report for all rooms */}
          {allReports &&
            !roomNumber &&
            allReports.map((room) => (
              <RoomReport room={room} key={room.roomNumber} />
            ))}

          {/* Report for a specific room */}
          {allReports &&
            roomNumber &&
            (() => {
              const room = allReports.find((r) => r.roomNumber === roomNumber);
              if (!room) {
                return (
                  <h1 className="font-semibold text-lg text-slate-700">
                    Данные для помещения № {roomNumber} не найдены
                  </h1>
                );
              } else {
                return (
                  <div key={room.roomNumber} id={`room-${room.roomNumber}`}>
                    <h1 className="text-xl font-bold">
                      Отчет для помещения № {roomNumber} (
                      {rooms.find((r) => r.roomNumber === roomNumber)?.location}
                      )
                    </h1>
                    <RoomReport room={room} />
                  </div>
                );
              }
            })()}
        </div>
      </div>
    </>
  );
}

export default Reports;
