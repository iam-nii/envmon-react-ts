import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../axiosClient";
import { device, Params, Room } from "../../Types";
import { useDeviceContext } from "../../context/DeviceContextProvider";
import {
  Button,
  Spinner,
  TableColumn,
  TableHeader,
  TableRow,
  Table,
  TableBody,
  TableCell,
  Pagination,
  Input,
} from "@heroui/react";
import { useRoomContext } from "../../context/RoomContextProvider";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";

// Get the devId from the url
interface DateRange {
  startDate: string;
  endData: string;
}
interface DataItem {
  // batch_num: number;
  // dateTime: string;
  [key: string]: number | string | undefined;
}
interface TabColumn {
  name: string;
  uid: string;
}
type LogEntry = {
  batch_num: number;
  log_id: number;
  logValue: number;
  mdt: string;
  max: number;
  min: number;
  parameter_name: string;
  parameter_alias: string;
  unitOfMeasure: string;
};

type TableRow = {
  batch_num: number;
  dateTime: string;
  [key: string]: number | string | undefined;
};

//Data response example
const data = [
  {
    log_id: 87131,
    logValue: 37,
    mdt: "2025-05-20 15:55:11",
    max: 60,
    min: 40,
    parameter_name: "Влажность",
    parameter_alias: "H",
    unitOfMeasure: "%",
  },
  {
    log_id: 87130,
    logValue: 400,
    mdt: "2025-05-20 15:55:11",
    max: 1000,
    min: 400,
    parameter_name: "Содержание CO2",
    parameter_alias: "CO2",
    unitOfMeasure: "ч/млн",
  },
  // ...
];
function RoomDetailsUpd() {
  const { room_id, device_id } = useParams();
  const { devices } = useDeviceContext();
  const { rooms } = useRoomContext();
  const [isLoading, setIsLoading] = useState(false);
  const [warningTime, setWarningTime] = useState<number>(0);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [reqInterval, setReqInterval] = useState<number>(0);
  const [roomDetails, setRoomDetails] = useState<Room | null>(null);
  const [device, setDevice] = useState<device | undefined>(undefined);
  const [logs, setLogs] = useState<DataItem[]>([]);
  const [window, setWindow] = useState<number>(10);
  const [parameters, setParameters] = useState<TabColumn[]>([
    // { name: "Номер замера", uid: "id" },
    // { name: "Дата и время", uid: "dateTime" },
    // ...
  ]);

  // setting the pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 4;

  const pages = Math.ceil(logs.length / rowsPerPage);

  const items =
    useMemo(() => {
      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage;

      return [...logs]
        .sort((a, b) => Number(b.batch_num) - Number(a.batch_num))
        .slice(start, end);
    }, [page, logs]) || [];

  useEffect(() => {
    axiosClient
      .get("/api/reports/?method=GET&query=getSettings")
      .then(({ data }) => {
        // console.log("data", data.data.warning_settings);
        const interval = Number(data.data.warning_settings.interval);
        setWarningTime(interval);
      });
  }, []);

  // Set the room details
  useEffect(() => {
    const room = rooms.find((room) => room.room_id === Number(room_id));

    if (room) {
      // console.log("room", room);
      setRoomDetails(room);
    } else {
      // console.log("Room not found for room_id:", room_id);
    }
    setDevice(devices.find((device) => device.device_id === device_id));
  }, [room_id, rooms, device_id, devices]);

  // on mount, get the devId from the url
  useEffect(() => {
    //Get the device parameters
    getDeviceParameters();
    if (device_id) {
      axiosClient
        .get(`/api/devices/?method=GET&query=getInterval&id=${device_id}`)
        .then(({ data }) => {
          //console.log("reqInterval", data, device_id);
          const reqInterval = data.data.reqInterval;
          setReqInterval(reqInterval);
        });
      // Get all the device logs
      getDeviceLogs();

      setDevice(devices.find((device) => device.device_id === device_id));
    }
  }, [device_id]);
  useEffect(() => {
    try {
      //check if "id" and "dateTime" are in the parameters array

      if (!parameters.some((param) => param.uid === "dateTime")) {
        parameters.unshift({ name: "Дата и время", uid: "dateTime" });
      }
      if (!parameters.some((param) => param.uid === "batch_num")) {
        parameters.unshift({
          name: "№ п/п",
          uid: "batch_num",
        });
      }
      // Get the Filtered logs

      // console.log("parameters", parameters);
    } catch (error) {
      console.error(error);
    }
  }, [parameters]);

  // Get functions
  // Get the device parameters
  const getDeviceParameters = () => {
    axiosClient
      .get(`/api/settings/?method=GET&id=${device_id}&query=parameters`)
      .then(async ({ data }) => {
        const response = data.data;
        const newParameters = response.map((param: Params) => ({
          name: `${param.parameter_alias}, ${param.unitOfMeasure}`,
          uid: param.parameter_alias,
          techReg_id: param.techReg_id,
        }));

        setParameters(newParameters);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Get the Filtered logs
  const handleFilteredSearch = () => {
    //api/logs/?method=GET&id=2gE8gJn37DPMz2V1&query=getFilteredLogs&minDate=2025-05-120 00:15:33&maxDate=2025-5-20 20:01:43&limit=20
    axiosClient
      .get(
        `/api/logs/?method=GET&id=${device_id}&query=getFilteredLogs&minDate=${dateRange?.startDate}&maxDate=${dateRange?.endData}&limit=${window}`
      )
      .then(({ data }) => {
        // console.log("data", data);
        setLogs(transformLogsToRows(data.data, parameters));
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    console.log("logs", logs);
  }, [logs]);

  const transformLogsToRows = (
    data: LogEntry[],
    parameters: TabColumn[]
  ): TableRow[] => {
    // group by batch_num
    const grouped: Record<string, TableRow> = {};
    data.forEach((log, index) => {
      const key = log.batch_num;
      if (!grouped[key]) {
        grouped[key] = {
          batch_num: index + 1,
          dateTime: log.mdt,
        };
      }
      // Find the matching parameter by parameter_alias
      const paramDef = parameters.find(
        (param) => param.uid === log.parameter_alias
      );
      if (paramDef) {
        grouped[key][paramDef.uid] = log.logValue;
      }
    });
    return Object.values(grouped);
  };

  // Set the date
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
      // console.log(`From: ${startDate} ${startTime}`);
    }

    let endDate = "";
    let endTime = "";
    if (range.end) {
      endDate = `${range.end.getFullYear()}-${
        range.end.getMonth() + 1
      }-${range.end.getDate()}`;
      endTime = `${range.end.getHours()}:${range.end.getMinutes()}:${range.end.getSeconds()}`;
      // console.log(`To: ${endDate} ${endTime}`);
    }

    // &query=getFilteredReports&minDate=2025-05-19 00:15:33&maxDate=2025-5-20 20:01:43
    if (range.start && range.end)
      setDateRange({
        startDate: `${startDate} ${startTime}`,
        endData: `${endDate} ${endTime}`,
      });
  };

  const getDeviceLogs = () => {};
  return (
    <div>
      {isLoading ? (
        <div>
          <Spinner />
        </div>
      ) : (
        <div>
          <div className="flex flex-col align-center gap-5 mb-5 w-full">
            <h1 className="font-bold text-center">
              Журнал мониторинга параметров помещения номер{" "}
              {roomDetails?.roomNumber} ({roomDetails?.location} - Зон:{" "}
              {device?.zoneNum}) За период
            </h1>
            <div className="flex flex-row gap-5">
              <CustomDateRangePicker onChange={handleDateRangeChange} />
              <Input
                type="number"
                min={5}
                step={5}
                max={20}
                className="w-24 h-12"
                label="Окно"
                variant="bordered"
                value={window.toString()}
                onChange={(e) => setWindow(Number(e.target.value))}
              />
              <Button
                isDisabled={!dateRange}
                variant="solid"
                color="primary"
                className="w-24 h-11"
                onPress={handleFilteredSearch}
              >
                Показать
              </Button>
            </div>
            {dateRange && (
              <Table
                aria-label="Table with log data"
                className="mb-5"
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
                  {parameters.map((column) => (
                    <TableColumn key={column.uid}>{column.name}</TableColumn>
                  ))}
                </TableHeader>
                <TableBody emptyContent="Нет данных">
                  {items.map((item) => (
                    <TableRow key={item.batch_num}>
                      {parameters.map((column) => (
                        <TableCell key={column.uid}>
                          {item[column.uid]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default RoomDetailsUpd;
