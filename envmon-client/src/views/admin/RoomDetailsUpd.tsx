import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../axiosClient";
import { device, Params, Room, User } from "../../Types";
import { useDeviceContext } from "../../context/DeviceContextProvider";
import {
  Button,
  TableColumn,
  TableHeader,
  TableRow,
  Table,
  TableBody,
  TableCell,
  // Pagination,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/react";
import { useRoomContext } from "../../context/RoomContextProvider";
// import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import { useUserContext } from "../../context/UserContextProvider";
import Chart from "../../components/Chart";

// Get the devId from the url
// interface DateRange {
//   startDate: string;
//   endData: string;
// }
interface DataItem {
  // batch_num: number;
  // dateTime: string;
  [key: string]: number | string | undefined;
}
interface TabColumn {
  name: string;
  uid: string;
  max?: number;
  min?: number;
  uom?: string;
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

type Warning = {
  parameterName?: string[];
  parameterValue?: number[];
  uom?: string[];
  min?: number[];
  max?: number[];
};

//Data response example

function RoomDetailsUpd() {
  const { room_id, device_id } = useParams();
  const { devices } = useDeviceContext();
  const { rooms } = useRoomContext();
  const { users } = useUserContext();
  const [warning, setWarning] = useState<Warning | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [warningTime, setWarningTime] = useState<number>(0);
  const [isWindowSet, setIsWindowSet] = useState<boolean>(false);
  const [reqInterval, setReqInterval] = useState<number>(0);
  const [roomDetails, setRoomDetails] = useState<Room | null>(null);
  const [device, setDevice] = useState<device | undefined>(undefined);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [logs, setLogs] = useState<DataItem[]>([]);
  const [window, setWindow] = useState<number | null>(null);
  const [logStart, setLogStart] = useState<boolean>(false);
  // const [nextBatch_num, setNextBatch_num] = useState<number>(window);
  const [parameters, setParameters] = useState<TabColumn[]>([
    // { name: "Номер замера", uid: "id" },
    // { name: "Дата и время", uid: "dateTime" },
    // ...
  ]);
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  interface ChartRef {
    chart?: {
      reflow: () => void;
    };
  }
  const chartRefs = useRef<(HTMLDivElement & ChartRef)[]>([]);
  const windowRef = useRef(Number(window));
  useEffect(() => {
    if (window) {
      setIsWindowSet(true);
      windowRef.current = Number(window);
    }
  }, [window]);

  // setting the pagination
  // const [page, setPage] = useState(1);
  // const rowsPerPage = 10;

  // // const pages = Math.ceil(logs.length / rowsPerPage);

  // const items =
  //   useMemo(() => {
  //     const start = (page - 1) * rowsPerPage;
  //     const end = start + rowsPerPage;

  //     return [...logs]
  //       .sort((a, b) => Number(b.mdt) - Number(a.mdt))
  //       .slice(start, end);
  //   }, [page, logs]) || [];

  useEffect(() => {
    axiosClient
      .get("/api/reports/?method=GET&query=getSettings")
      .then(({ data }) => {
        // console.log("data", data.data.warning_settings);
        const interval = Number(data.data.warning_settings.interval);
        setWarningTime(interval * 1000);
      });
  }, []);

  // useEffect(() => {
  //   if (logStart) {
  //     startLogging();
  //   }
  // }, [logStart]);

  // Set the room details
  useEffect(() => {
    const room = rooms.find((room) => room.room_id === Number(room_id));

    if (room) {
      // console.log("room", room);
      try {
        setRoomDetails(room);
        setUserInfo(
          users.find((user) => user.userName?.trim() === room.frPerson?.trim())!
        );
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Room not found for room_id:", room_id);
    }
    setDevice(devices.find((device) => device.device_id === device_id));
    // setWarning((prev) => ({
    //   ...prev,
    //   userName: userInfo?.userName || "",
    //   roomNumber: roomDetails?.roomNumber || 0,
    //   location: roomDetails?.location || "",
    //   zoneNum: device?.zoneNum || 0,
    //   parameterName: [],
    //   parameterValue: [],
    //   uom: [],
    //   min: [],
    //   max: [],
    // }));
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
      // getDeviceLogs();

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
          name: "ID",
          uid: "batch_num",
        });
      }

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
        console.log("parameters", response);
        const newParameters = response.map((param: Params) => ({
          name: `${param.parameter_alias}, ${param.unitOfMeasure}`,
          uid: param.parameter_alias,
          techReg_id: param.techReg_id,
          uom: param.unitOfMeasure,
          min: param.min,
          max: param.max,
        }));
        newParameters.sort((a: Params, b: Params) => {
          // Handle undefined or missing aliases
          const aliasA = a?.parameter_alias || "";
          const aliasB = b?.parameter_alias || "";
          // First, sort by length
          if (aliasA.length !== aliasB.length) {
            return aliasA.length - aliasB.length;
          }
          // If lengths are equal, sort alphabetically
          return aliasA.localeCompare(aliasB);
        });

        setParameters(newParameters);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Get the Filtered logs
  const handleFilteredSearch = (query: string) => {
    // const handleFilteredSearch = () => {

    if (query == "getLastLog") {
      axiosClient
        .get(`/api/logs/?method=GET&id=${device_id}&query=getLastLog`)
        .then(({ data }) => {
          const convertedData = data.data.map((log: LogEntry) => ({
            ...log,
            mdt: convertDateFormat(log.mdt),
          }));
          console.log("data", convertedData);

          // Check data
          checkData(convertedData);

          const log = transformLogsToRows(convertedData, parameters)[0];
          // console.log("log", log);
          setLogs((prev) => {
            const newLogs = [log, ...prev]; // Add new log at the front
            return newLogs.slice(0, Number(windowRef.current)); // Keep only the most recent 'window' logs
          });
          // if (log.logValue < log.min || log.logValue > log.max) {

          // }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      try {
        setLogs([]);
        let windowSize = window;
        console.log("windowSize", windowSize);
        if (parameters.length > 2) {
          windowSize = windowRef.current * (parameters.length - 2);
        }
        axiosClient
          .get(
            `/api/logs/?method=GET&id=${device_id}&query=getFilteredLogs&&limit=${windowSize}`
          )
          .then(({ data }) => {
            // console.log("data", data);
            const convertedData = data.data.map((log: LogEntry) => ({
              ...log,
              mdt: convertDateFormat(log.mdt),
            }));
            console.log("data", convertedData);
            setLogs(
              transformLogsToRows(convertedData, parameters).slice(
                0,
                Number(windowRef.current)
              )
            );

            setLogStart(true);
          })
          .catch((error) => {
            console.error(error);
          });
      } catch (error) {
        console.error(error);
      }
    }
    // if (query === "startLogging") {
    //   // /api/logs/?method=GET&id=2gE8gJn37DPMz2V1&query=getLastLog

    // } else {
    //   setIsLoading(true);
    //   try {
    //     let windowSize = window;
    //     if (parameters.length > 2) {
    //       windowSize = window * (parameters.length - 2);
    //     }
    //     axiosClient
    //       .get(
    //         `/api/logs/?method=GET&id=${device_id}&query=getFilteredLogs&minDate=${dateRange?.startDate}&maxDate=${dateRange?.endData}&limit=${windowSize}`
    //       )
    //       .then(({ data }) => {
    //         // console.log("data", data);
    //         setLogs(transformLogsToRows(data.data, parameters));
    //         setLogStart(true);
    //       })
    //       .catch((error) => {
    //         console.error(error);
    //       });
    //   } catch (error) {
    //     console.error(error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // }
  };
  function convertDateFormat(dateStr: string) {
    const dt = new Date(dateStr.replace(" ", "T")); // Ensure proper parsing
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(dt.getDate())}.${pad(
      dt.getMonth() + 1
    )}.${dt.getFullYear()} ${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(
      dt.getSeconds()
    )}`;
  }
  interface dataItem {
    log_id: number;
    logValue: number;
    mdt: string;
    batch_num: number;
    max: number;
    min: number;
    parameter_name: string;
    parameter_alias: string;
    unitOfMeasure: string;
    [key: string]: number | string;
  }
  const checkData = (data: dataItem[]) => {
    data.forEach((log) => {
      if (log.logValue < log.min || log.logValue > log.max) {
        if (
          log.logValue < Number(log.pmin) ||
          log.logValue > Number(log.pmax)
        ) {
          return;
        }

        // console.log("log", log);
        // Send warning
        setWarning((prev) => ({
          ...prev,
          userName: userInfo?.userName || "",
          roomNumber: roomDetails?.roomNumber || 0,
          location: roomDetails?.location || "",
          zoneNum: device?.zoneNum || 0,
          parameterName: [...(prev?.parameterName || []), log.parameter_name],
          parameterValue: [...(prev?.parameterValue || []), log.logValue],
          uom: [...(prev?.uom || []), log.unitOfMeasure],
          min: [...(prev?.min || []), log.min],
          max: [...(prev?.max || []), log.max],
        }));
      }
    });
  };
  useEffect(() => {
    if (warning) {
      ShowWarning();
    }
  }, [warning]);

  const ShowWarning = () => {
    setShowWarning(true);
    console.log("warning", warning);
    onOpen();
    setTimeout(() => {
      setWarning(null);
      setShowWarning(false);
    }, warningTime);
  };

  const startLogging = () => {
    setInterval(() => {
      handleFilteredSearch("getLastLog");
    }, reqInterval * 1000);
  };
  useEffect(() => {
    if (logStart) {
      startLogging();
    }
  }, [logStart]);
  // const setWindowSize = (size: number) => {
  //   if (parameters.length > 2) {
  //     const windowSize = size * (parameters.length - 2);
  //     // setWindow(windowSize);
  //   }
  // };
  useEffect(() => {
    console.log("logs", logs);
    const sortedParameters = [
      ...parameters.slice(0, 2), // Keep the first two as-is
      ...parameters.slice(2).sort((a, b) => {
        const aliasA = a?.name || "";
        const aliasB = b?.name || "";
        if (aliasA.length !== aliasB.length) {
          return aliasA.length - aliasB.length;
        }
        return aliasA.localeCompare(aliasB);
      }),
    ];
    if (logs.length > 0) {
      setGraphData(buildGraphData(logs, sortedParameters));
    }
  }, [logs, parameters]);

  // const buildGraphData = (
  //   logs: DataItem[],
  //   parameters: TabColumn[]
  // ): GraphData[] => {
  //   return parameters
  //     .filter((param) => param.uid !== "batch_num" && param.uid !== "dateTime") // skip non-parameter columns
  //     .map((param) => {
  //       const data: DataPoint[] = logs
  //         .filter((log) => typeof log[param.uid] === "number")
  //         .map((log) => ({
  //           y: log[param.uid] as number,
  //           batch_num: log.batch_num as number,
  //         }));

  //       // Find the first log that has this parameter for meta info
  //       const metaLog = logs.find((log) => typeof log[param.uid] === "number");

  //       return {
  //         [param.name]: {
  //           data,
  //           max: Number(metaLog?.max),
  //           min: Number(metaLog?.min),
  //           uom: metaLog?.unitOfMeasure as string,
  //         },
  //       };
  //     });
  // };

  const buildGraphData = (
    logs: DataItem[],
    parameters: TabColumn[]
  ): GraphData[] => {
    return parameters
      .filter((param) => param.uid !== "batch_num" && param.uid !== "dateTime")
      .map((param) => {
        const data: DataPoint[] = logs
          .filter((log) => typeof log[param.uid] === "number")
          .map((log) => {
            console.log("log", log);
            return {
              x: log.dateTime as string,
              y: log[param.uid] as number,
            };
          });

        return {
          [param.name]: {
            data,
            max: param.max ?? 0,
            min: param.min ?? 0,
            uom: param.uom ?? "",
          },
        };
      });
  };

  const transformLogsToRows = (
    data: LogEntry[] | LogEntry,
    parameters: TabColumn[]
  ): TableRow[] => {
    // group by batch_num
    const grouped: Record<string, TableRow> = {};
    // let batch_num_ = window;
    if (Array.isArray(data)) {
      data.forEach((log) => {
        const key = log.mdt;
        if (!grouped[key]) {
          grouped[key] = {
            batch_num: log.batch_num,
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
      // setNextBatch_num((prev) => prev + 1);
    } else {
      const key = data.mdt;
      // setBatch_num((prev) => prev + 1);
      // let batch_num_ = nextBatch_num;
      if (!grouped[key]) {
        grouped[key] = {
          batch_num: data.batch_num,
          dateTime: data.mdt,
        };
      }
      // Find the matching parameter by parameter_alias
      const paramDef = parameters.find(
        (param) => param.uid === data.parameter_alias
      );
      if (paramDef) {
        grouped[key][paramDef.uid] = data.logValue;
      }
      // setNextBatch_num((prev) => prev + 1);
    }
    return Object.values(grouped);
  };

  // Set the date
  // const handleDateRangeChange = (range: {
  //   start: Date | null;
  //   end: Date | null;
  // }) => {
  //   // 2025-05-20 20:01:43
  //   let startDate = "";
  //   let startTime = "";
  //   if (range.start) {
  //     startDate = `${range.start?.getFullYear()}-${
  //       range.start.getMonth() + 1
  //     }-${range.start.getDate()}`;
  //     startTime = `${range.start.getHours()}:${range.start.getMinutes()}:${range.start.getSeconds()}`;
  //     // console.log(`From: ${startDate} ${startTime}`);
  //   }

  //   let endDate = "";
  //   let endTime = "";
  //   if (range.end) {
  //     endDate = `${range.end.getFullYear()}-${
  //       range.end.getMonth() + 1
  //     }-${range.end.getDate()}`;
  //     endTime = `${range.end.getHours()}:${range.end.getMinutes()}:${range.end.getSeconds()}`;
  //     // console.log(`To: ${endDate} ${endTime}`);
  //   }

  //   // &query=getFilteredReports&minDate=2025-05-19 00:15:33&maxDate=2025-5-20 20:01:43
  //   if (range.start && range.end)
  //     setDateRange({
  //       startDate: `${startDate} ${startTime}`,
  //       endData: `${endDate} ${endTime}`,
  //     });
  // };
  const toggleFullScreen = (current: HTMLDivElement | null) => {
    if (current) {
      if (!document.fullscreenElement) {
        // Enter fullscreen mode
        current.requestFullscreen().catch((err) => {
          console.error("Error entering fullscreen mode", err);
        });
      } else {
        // Exit fullscreen mode
        document.exitFullscreen();
      }
    }
  };
  type DataPoint = {
    x: number | string;
    y: number;
    // batch_num: string | number;
  };
  type GraphData = {
    [title: string]: {
      data?: DataPoint[] | null;
      max: number;
      min: number;
      uom: string;
    };
  };

  useEffect(() => {
    console.log("graphData", graphData);
  }, [graphData]);
  // const graphDataRef = useRef<GraphData[]>(graphData);
  return (
    <div>
      <div>
        <div className="flex flex-col align-center gap-5 mb-5 w-full ">
          <h1 className="font-bold text-center text">
            Мониторинг параметров помещения № {roomDetails?.roomNumber} (
            {roomDetails?.location}, зона {device?.zoneNum})
          </h1>
          <div className="flex flex-row gap-5 justify-center">
            {/* <CustomDateRangePicker onChange={handleDateRangeChange} /> */}
            <Input
              type="number"
              min={5}
              step={5}
              max={100}
              className="w-44 h-12"
              label="Количество строк"
              variant="bordered"
              value={window?.toString()}
              onChange={(e) => setWindow(Number(e.target.value))}
            />
            <Button
              isDisabled={!isWindowSet}
              variant="solid"
              color="primary"
              className="w-24 h-11"
              onPress={() => handleFilteredSearch("getAllLogs")}
            >
              Показать
            </Button>
          </div>
          <div className="overflow-x-hidden">
            <Table
              aria-label="Table with log data"
              className="mb-5 "

              // bottomContent={
              //   <div className="flex w-full justify-center">
              //     <Pagination
              //       isCompact
              //       showControls
              //       showShadow
              //       color="primary"
              //       page={page}
              //       total={pages}
              //       onChange={(page) => setPage(page)}
              //     />
              //   </div>
              // }
            >
              <TableHeader>
                {[
                  ...parameters.slice(0, 2), // Keep the first two as-is
                  ...parameters.slice(2).sort((a, b) => {
                    const aliasA = a?.name || "";
                    const aliasB = b?.name || "";
                    if (aliasA.length !== aliasB.length) {
                      return aliasA.length - aliasB.length;
                    }
                    return aliasA.localeCompare(aliasB);
                  }),
                ].map((column) => (
                  <TableColumn key={column.uid}>{column.name}</TableColumn>
                ))}
              </TableHeader>
              <TableBody emptyContent="Нет данных">
                {logs.slice(0, Number(windowRef.current)).map((item) => (
                  <TableRow key={item.batch_num}>
                    {parameters.map((column) => (
                      <TableCell key={column.uid}>{item[column.uid]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <h1 className="text-center font-bold mb-5 ">
              Графики измерения параметров микроклимата
            </h1>

            <div
              ref={(el) => {
                if (el) {
                  chartRefs.current[0] = el;
                }
              }}
              className="cursor-pointer mb-10 overflow-x-hidden h-full"
              // onClick={() => toggleFullScreen(chartRefs.current[0])}
              onDoubleClick={() => toggleFullScreen(chartRefs.current[0])}
            >
              <Chart data={graphData} />
            </div>
          </div>
        </div>
      </div>
      {showWarning && (
        <div>
          <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
            <ModalContent>
              <ModalHeader>
                <h1 className="text-center uppercase text-2xl font-bold mx-auto">
                  Внимание!
                </h1>
              </ModalHeader>
              <ModalBody className="text-left mb-5">
                <h2>
                  ПОМЕЩЕНИЕ №{" "}
                  <span className="font-bold font-sans">
                    {roomDetails?.roomNumber} ({roomDetails?.location}), зона №
                    {device?.zoneNum}
                  </span>
                </h2>
                <h2 className="flex flex-row gap-3">
                  <p className="w-28 text-right">Ответственный</p>
                  <p className="font-bold font-sans">{userInfo?.userName}</p>
                </h2>
                <h2 className="flex flex-row gap-3">
                  <p className="w-28 text-right">Тел.</p>
                  <p className="font-bold font-sans">{userInfo?.uPhone}</p>
                </h2>
                <h2 className="flex flex-row gap-3">
                  <p className="w-28 text-right">E-mail</p>
                  <p className="font-bold font-sans">{userInfo?.uEmail}</p>
                </h2>
                <p className="text-center text-wrap">
                  Контролируемые параметры микроклимата за границами допустимого
                  диапазона{" "}
                </p>
                <div className="bg-red-500 w-full h-[3px]"></div>

                <div className="w-full ">
                  {warning?.min?.map((min, index) => (
                    <div
                      key={index}
                      className="flex flex-row gap-2 w-full items-center justify-center"
                    >
                      <p className="w-[60%] text-right">
                        {warning?.parameterName?.[index]},{" "}
                        {warning?.uom?.[index]}{" "}
                      </p>

                      <div
                        id="min-max-container"
                        className="w-[30%] flex flex-row gap-2"
                      >
                        <p className=" text-red-600 font-bold w-[40%] text-right">
                          {warning?.parameterValue?.[index]}
                        </p>
                        {warning?.parameterValue![index] <
                          warning?.min![index] && (
                          <div className="flex flex-row w-[20%]">
                            <p className="w-full mx-auto">&lt; </p>
                            <p className="text-green-600 ml-2 w-20 font-bold text-left">
                              {warning?.min![index]}
                            </p>
                          </div>
                        )}
                        {warning?.parameterValue![index] >
                          warning?.max![index] && (
                          <div className="flex flex-row w-[20%]">
                            <p className="w-full mx-auto">&gt; </p>
                            <p className="text-green-600 ml-2 w-20 font-bold text-left">
                              {warning?.max![index]}
                            </p>
                            <p className="hidden">{min}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ModalBody>
            </ModalContent>
          </Modal>
        </div>
      )}
    </div>
  );
}
export default RoomDetailsUpd;
