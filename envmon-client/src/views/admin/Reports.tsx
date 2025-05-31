import { Select, SelectItem, Button } from "@heroui/react";
import { useRoomContext } from "../../context/RoomContextProvider";
import { useEffect, useState } from "react";
// import { useReportContext } from "../../context/ReportContextProvider";
import { resData } from "../../Types";
import axiosClient from "../../axiosClient";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";

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
  const [roomNumber, setRoomNumber] = useState<number>(0);
  // const { ReportRef } = useReportContext();
  // const [roomReport, setRoomReport] = useState<Report | null>(null);
  const [isDateSelected, setIsDataSelected] = useState<boolean>(false);
  const [roomParameters, setRoomParameters] = useState<roomParams[] | null>();
  // const [isEmptyReport, setIsEmptyReport] = useState<boolean>(false);
  const [allReports, setAllReport] = useState<roomParams[] | null>(null);
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endData: string;
  } | null>(null);

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
  const generateReport = () => {
    // Get params for each room
    // const report = ReportRef.current.find(
    //   (report: Report) => report.room_number === roomNumber
    // );
    // if (report) {
    //   setRoomReport(report);
    //   setIsEmptyReport(false);
    //   // console.log("report", report);
    //   const param_names = report?.room_report.map((param) => param.param_name);
    //   console.log("param_names", param_names);
    //   // setIsGeneratedReport(true);
    // } else {
    //   setIsEmptyReport(true);
    // }
  };

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

  // useEffect(() => {
  //   if (dateRange) {
  //     setIsDataSelected(true);
  //     axiosClient
  //       .get(
  //         `/api/reports/?method=GET&query=getFilteredReports&minDate=${dateRange.startDate}&maxDate=${dateRange.endData}`
  //       )
  //       .then(({ data }) => {
  //         // console.log(data);
  //         if (roomParameters) {
  //           const rooms = addReportsToRooms(roomParameters!, data.data);
  //           setAllReport(rooms);
  //         }
  //       });
  //   }
  // }, [roomParameters, dateRange]);

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

  // function dateFilter(value: RangeValue<ZonedDateTime> | null) {
  //   // console.log("value", value);
  //   // 2025-05-20 15:40:06

  //   const month = value?.start.month;
  //   const day = value?.start.day;
  //   const year = value?.start.year;
  //   const hour = value?.start.hour;
  //   const minute = value?.start.minute;
  //   const startDate = `${year}-${month}-${day}`;
  // }
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
          // console.log(data);
          if (roomParameters) {
            const rooms = addReportsToRooms(roomParameters!, data.data);
            setAllReport(rooms);
          }
        });
    }
  };
  useEffect(() => {
    console.log(allReports);
  }, [allReports]);
  return (
    <>
      <div className="flex items-center">
        <h1 className="w-[38%] my-auto font-bold text-lg">
          ОТЧЕТ О МОНИТОРИНГЕ МИКРОКЛИМАТА ЗА ПЕРИОД
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
      <div className="mt-10 flex gap-5 items-center">
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
              textValue={String(room.roomNumber)}
            >
              {room.roomNumber} ({room.location})
            </SelectItem>
          ))}
        </Select>
        <Button
          isDisabled={!roomNumber}
          size="lg"
          color="primary"
          className="py-7 font-bold"
          onPress={() => generateReport()}
        >
          Генерировать отчет
        </Button>
      </div>
      {allReports && (
        <div className="mt-10">
          {allReports.map((room) => (
            <>
              <h1 className="text-xl font-bold mt-10">
                Помещение № {room.roomNumber}
              </h1>
              {room.entities[0].parameters.length > 0 ? (
                <>
                  {room.entities.map((entity) => (
                    <>
                      <h1 className="font-semi-bold">
                        Идентификация устройства {entity.device_id}
                      </h1>
                      <h1 className="font-semi-bold">
                        Номер зона {entity.zone_num}
                      </h1>
                      <h1 className="font-semi-bold">Параметры микроклимата</h1>
                      {entity.parameters.map((parameter) => (
                        <>
                          {parameter.report.length > 1 ? (
                            <>
                              <h1 className="font-bold mt-5">
                                {parameter.parameter_name}{" "}
                                {parameter.parameter_alias},{" "}
                                {parameter.unitOfMeasure} [{parameter.trMin} -{" "}
                                {parameter.trMax}]
                              </h1>
                              <div className="flex flex-row flex-wrap gap-1 w-[75%] bg-slate-700 rounded-lg p-1">
                                {parameter.report.map((report) => (
                                  <div className="bg-slate-50 p-1 w-[33%]">
                                    <p
                                      key={report.logId}
                                      className="text-red-600 font-bold break-words"
                                    >
                                      {report.logValue}{" "}
                                      <span className="text-black">
                                        {report.mdt}
                                      </span>
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </>
                          ) : (
                            <></>
                          )}
                        </>
                      ))}
                    </>
                  ))}
                </>
              ) : (
                <>
                  <h1 className="font-semibold text-lg text-slate-700">
                    За выбранный период отчетов не существует{" "}
                  </h1>
                </>
              )}
            </>
          ))}
        </div>
      )}
      {/* {roomReport ? (
    <>
      <div className="mt-10">
        <h1 className="font-bold text-lg mb-5">
          Параметры микроклимата помещения №{roomNumber}
        </h1>
        {roomReport!.room_report.map((param) => (
          <div key={param.param_name}>
            <h2 className="text-md font-bold">
              {param.param_name}, {param.param_uom}{" "}
              <span>[{param.range}]</span>
            </h2>
            <div className="grid grid-rows-3 grid-flow-col gap-1 w-[70%] bg-black p-1">
              {param.values.map((value, index) => (
                <div key={index} className="bg-slate-50 p-1">
                  <span className="font-bold text-red-600">{value}</span> (
                  {param.date[index]})
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  ) : (
    isEmptyReport && (
      <div className="mt-10">
        <h1 className="font-bold text-lg mb-5">
          Нет отчета о монтиторинге помещения №{roomNumber}
        </h1>
      </div>
    )
  )} */}
      {/* Show all reports  if no room Number is selected */}
      {/* {roomNumber === 0 &&
    ReportRef.current.map((report) => (
      <div key={report.room_number} className="mt-10">
        <h1 className="font-bold text-lg mb-2">
          Отчет о монтиторинге помещения №{report.room_number}
        </h1>
        {report.room_report.map((param) => (
          <div key={param.param_name}>
            <h2 className="text-md font-bold">
              {param.param_name}, {param.param_uom}{" "}
              <span>[{param.range}]</span>
            </h2>
          </div>
        ))}
      </div>
    ))} */}
    </>
  );
}

export default Reports;
