import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
} from "@heroui/react";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../axiosClient";
import { device, Params } from "../../Types";
import { useRoomContext } from "../../context/RoomContextProvider";
import Chart from "../../components/Chart";
import { useDeviceContext } from "../../context/DeviceContextProvider";
import { useParameterContext } from "../../context/ParameterContextProvider";

interface DataItem {
  // batch_num: number;
  // dateTime: string;
  [key: string]: number | string | undefined;
}

interface TableColumn {
  name: string;
  //hr.stena@lsrgroup.ru
  //8-921-769-32-53
  uid: string; // Ensures uid must be a key of DataItem
  techReg_id?: number;
  max?: number;
  min?: number;
}
type MaxMinData = {
  max: number;
  min: number;
  techReg_id?: number;
};

// const COLUMNS: TableColumn[] = [
//   { name: "Номер замера", uid: "id" },
//   { name: "Дата и время", uid: "dateTime" },
//   // { name: "Температура, °C", uid: "temperature" },
//   // { name: "Влажность, %", uid: "humidity" },
//   // { name: "Освещенность, лк", uid: "light" },
//   // { name: "VOC, ppm", uid: "voc" },
//   // { name: "CO2, ppm", uid: "co2" },
// ];
// const DATA: DataItem[] = [
//   // {
//   //     id: 20,
//   //     dateTime: "2023-10-01 12:00",
//   //     temperature: 23.2,
//   //     humidity: 51,
//   //     light: 105,
//   //     voc: 0,
//   //     co2: 414,
//   // },
//   {
//     batch_num: 19,
//     dateTime: "2023-10-01 12:00",
//     temperature: 23.2,
//     humidity: 51,
//     light: 105,
//     voc: 3,
//     co2: 414,
//   },
//   {
//     batch_num: 18,
//     dateTime: "2023-10-01 12:00",
//     temperature: 23.0,
//     humidity: 51,
//     light: 105,
//     voc: 1,
//     co2: 414,
//   },
//   {
//     batch_num: 17,
//     dateTime: "2023-10-01 12:00",
//     temperature: 23.1,
//     humidity: 51,
//     light: 105,
//     voc: 4,
//     co2: 414,
//   },
//   {
//     batch_num: 16,
//     dateTime: "2023-10-01 12:00",
//     temperature: 22.9,
//     humidity: 51,
//     light: 105,
//     voc: 1,
//     co2: 414,
//   },
//   {
//     batch_num: 15,
//     dateTime: "2023-10-01 12:00",
//     temperature: 23.2,
//     humidity: 51,
//     light: 105,
//     voc: 0,
//     co2: 414,
//   },
//   {
//     batch_num: 14,
//     dateTime: "2023-10-01 12:00",
//     temperature: 23.0,
//     humidity: 51,
//     light: 105,
//     voc: 4,
//     co2: 414,
//   },
//   {
//     batch_num: 13,
//     dateTime: "2023-10-01 12:00",
//     temperature: 23.1,
//     humidity: 51,
//     light: 105,
//     voc: 3,
//     co2: 414,
//   },
//   {
//     batch_num: 12,
//     dateTime: "2023-10-01 12:00",
//     temperature: 22.8,
//     humidity: 51,
//     light: 105,
//     voc: 7,
//     co2: 414,
//   },
//   {
//     batch_num: 11,
//     dateTime: "2023-10-01 12:00",
//     temperature: 23.0,
//     humidity: 51,
//     light: 105,
//     voc: 4,
//     co2: 414,
//   },
//   {
//     batch_num: 10,
//     dateTime: "2023-10-01 12:00",
//     temperature: 23.1,
//     humidity: 51,
//     light: 105,
//     voc: 2,
//     co2: 414,
//   },
//   {
//     batch_num: 9,
//     dateTime: "2023-10-01 12:00",
//     temperature: 23.2,
//     humidity: 50,
//     light: 105,
//     voc: 5,
//     co2: 414,
//   },
//   {
//     batch_num: 8,
//     dateTime: "2023-10-01 12:00",
//     temperature: 23.3,
//     humidity: 51,
//     light: 105,
//     voc: 1,
//     co2: 414,
//   },
//   {
//     batch_num: 7,
//     dateTime: "2023-10-01 12:00",
//     temperature: 23.0,
//     humidity: 51,
//     light: 105,
//     voc: 0,
//     co2: 414,
//   },
//   {
//     batch_num: 6,
//     dateTime: "2023-10-01 12:00",
//     temperature: 23.1,
//     humidity: 51,
//     light: 105,
//     voc: 0,
//     co2: 414,
//   },
//   {
//     batch_num: 5,
//     dateTime: "2023-10-01 12:00",
//     temperature: 23.2,
//     humidity: 52,
//     light: 105,
//     voc: 2,
//     co2: 414,
//   },
//   {
//     batch_num: 4,
//     dateTime: "2023-10-01 12:00",
//     temperature: 22.9,
//     humidity: 52,
//     light: 105,
//     voc: 5,
//     co2: 414,
//   },
//   {
//     batch_num: 3,
//     dateTime: "2023-10-01 12:00",
//     temperature: 23.0,
//     humidity: 53,
//     light: 105,
//     voc: 7,
//     co2: 414,
//   },
//   {
//     batch_num: 2,
//     dateTime: "2023-10-01 12:00",
//     temperature: 23.1,
//     humidity: 53,
//     light: 105,
//     voc: 7,
//     co2: 414,
//   },
//   {
//     batch_num: 1,
//     dateTime: "2023-10-01 12:00",
//     temperature: 23.0,
//     humidity: 52,
//     light: 105,
//     voc: 0,
//     co2: 414,
//   },
// ];
// TODO
// get the parameter names from the device

// const tempData = {
//   temperature: {
//     data: [
//       {
//         y: 23,
//         dateTime: "2023-10-01 12:00",
//       },
//     ],
//     max: 25,
//     min: 15,
//   },
// };

type DataPoint = {
  y: number;
  batch_num: number;
};
type GraphData = {
  [title: string]: {
    data?: DataPoint[] | null;
    max: number;
    min: number;
    uom: string;
  };
};
function RoomDetails() {
  const pageSize = 15;
  const effectRan = useRef(false);
  const [page, setPage] = useState(1);
  const { rooms } = useRoomContext();
  const { devices } = useDeviceContext();
  const { parameters: parameters_ } = useParameterContext();
  const { room_id, device_id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [logData, setLogData] = useState<DataItem[]>([]);
  const [reqInterval, setReqInterval] = useState<number>();
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const [maxMinData, setMaxMinData] = useState<MaxMinData[]>([]);
  const [device, setDevice] = useState<device | undefined>(undefined);
  const graphDataRef = useRef<GraphData[]>(graphData);
  const [roomDetails, setRoomDetails] = useState<{
    roomNumber: number;
    roomLocation: string;
  } | null>(null);
  const [parameters, setParameters] = useState<TableColumn[]>([
    // { name: "Номер замера", uid: "id" },
    // { name: "Дата и время", uid: "dateTime" },
  ]);

  useEffect(() => {
    //api/settings/?method=GET&id=2gE8gn37DP282V1&query=parameters
    axiosClient
      .get(`/api/settings/?method=GET&id=${device_id}&query=parameters`)
      .then(async ({ data }) => {
        const response = data.data;
        const newParameters = response.map((param: Params) => ({
          name: `${param.parameter_alias} (${param.unitOfMeasure})`,
          uid: param.parameter_alias,
          techReg_id: param.techReg_id,
        }));
        console.log("newParameters", newParameters);
        type itemType = {
          techReg_id: number;
        };
        const maxMinPromises = response.map((item: itemType) =>
          axiosClient.get(
            `/api/settings/?method=GET&query=maxmin&id=${item.techReg_id}`
          )
        );
        const results = await Promise.all(maxMinPromises);

        const maxMinData = results.map((res) => {
          return {
            max: res.data.data[0].maxValue,
            min: res.data.data[0].minValue,
            techReg_id: res.data.data[0].techReg_id,
          };
        });
        setMaxMinData(maxMinData);

        setParameters(newParameters);
      })
      .catch((error) => {
        console.log(error);
      });

    // Get the request interval
    if (device_id) {
      axiosClient
        .get(`/api/devices/?method=GET&query=getInterval&id=${device_id}`)
        .then(({ data }) => {
          console.log("reqInterval", data, device_id);
          const reqInterval = data.data.reqInterval;
          setReqInterval(reqInterval);
        });
    }
    setDevice(devices.find((device) => device.device_id === device_id));
  }, [device_id]);

  useEffect(() => {
    console.log("maxMinData", maxMinData);
  }, [maxMinData]);

  useEffect(() => {
    setIsLoading(false);
    console.log("logData", logData);
  }, [logData]);
  useEffect(() => setIsLoading(true), []);

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
      // console.log("parameters", parameters);
    } catch (error) {
      console.log(error);
    }
    if (parameters.length > 2) {
      // console.log("parameters", parameters);

      if (effectRan.current) return;
      effectRan.current = true;
      parameters.forEach((param) => {
        try {
          const maxMinData_: MaxMinData | undefined = maxMinData.find(
            (item) => item.techReg_id === param.techReg_id
          );
          if (maxMinData_) {
            param.max = maxMinData_.max;
            param.min = maxMinData_.min;
          }
        } catch {
          // continue;
        }
      });
      console.log("parameters", parameters);
      const param_aliases = parameters.map((param) => param.uid);

      for (let i = 2; i < parameters.length; i++) {
        // const paramDataInit = {
        //   [parameters[i].uid]: {
        //     data: [],
        //     max: parameters[i].max || 0,
        //     min: parameters[i].min || 0,
        //   },
        // };

        // setUnitOfMeasure(UOM);
        const UOM = parameters_.find(
          (param) => param.techReg_id === parameters[i].techReg_id
        )?.unitOfMeasure;
        console.log("UOM", UOM);
        const paramDataInit = {
          [`${parameters[i].uid}`]: {
            data: [],
            max: parameters[i].max || 0,
            min: parameters[i].min || 0,
            uom: "",
          },
        };
        setGraphData((prev) => [...prev, paramDataInit]);
      }
      if (reqInterval && reqInterval > 0) {
        startLogging(param_aliases, reqInterval);
      }
    }
  }, [parameters, maxMinData, parameters_]);

  interface ChartRef {
    chart?: {
      reflow: () => void;
    };
  }
  const chartRefs = useRef<(HTMLDivElement & ChartRef)[]>([]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        // Reflow charts when exiting fullscreen
        chartRefs.current.forEach((chartRef) => {
          if (chartRef?.chart) {
            chartRef.chart.reflow();
          }
        });
        document.body.style.overflow = ""; // Restore scrolling
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

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
  // useEffect(() => {
  //   console.log("parameters_", parameters_);
  // }, [parameters_]);
  function startLogging(param_aliases: Array<string>, reqInterval: number) {
    let num = 0;
    setInterval(() => {
      axiosClient
        .get(`/envmon/?id=${device_id}`)
        .then(({ data }) => {
          type LogData = {
            [key: string]: number | string;
          };
          // get only the parameters that are in the param_aliases array
          try {
            const filteredData = param_aliases.reduce(
              (result: LogData, prop: string) => {
                const value = data?.data?.[prop];
                if (value !== undefined) {
                  result[prop] = value;
                }
                return result;
              },
              {} as LogData
            );
            console.log("filteredData", filteredData);
            const graphData_ = graphDataRef.current;
            for (const key in filteredData) {
              const paramData = graphData_.find((item) => item[key]);

              // console.log("paramData", paramData);
              if (paramData) {
                for (const key_ in paramData) {
                  const data = paramData[key_].data;
                  if (data) {
                    paramData[key_].data?.push({
                      y: Number(filteredData[key]),
                      batch_num: Number(num),
                    });
                  }
                }
              }
              console.log("paramData", paramData);

              // if (paramData) {
              //   paramData.data?.data?.push({
              //     y: Number(filteredData[key]),
              //     batch_num: Number(filteredData.batch_num),
              //   });
              // }
              // console.log("paramData", paramData);
            }

            // add id and dateTime to the filteredData
            const now = new Date();
            const formatted = formatDate(now);
            const newData = {
              ...filteredData!,
              batch_num: num,
              dateTime: formatted,
            };
            setLogData((prev) => [...prev, newData as DataItem]);
            // this.logData.push(filteredData);
          } catch (error) {
            console.log(error);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      num++;
    }, reqInterval * 1000);
  }
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

  useEffect(() => {
    graphDataRef.current = graphData;
    console.log("graphData", graphData);
    graphData.forEach((item) => {
      const title = Object.keys(item)[0];
      const UOM = parameters_.find(
        (param) => param.parameter_alias === title
      )?.unitOfMeasure;
      // console.log("UOM", UOM);
      item[title].uom = UOM || "";
    });
  }, [graphData, parameters_]);

  useEffect(() => {
    const room = rooms.find((room) => room.room_id === Number(room_id));
    console.log("room", room);

    if (room) {
      setRoomDetails({
        roomNumber: room.roomNumber,
        roomLocation: room.location,
      });
    } else {
      console.error("Room not found for room_id:", room_id);
    }
    setDevice(devices.find((device) => device.device_id === device_id));
  }, [room_id, rooms, device_id, devices]);

  const pages = Math.ceil(logData.length / pageSize);
  const items = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return [...logData]
      .sort((a, b) => Number(b.batch_num) - Number(a.batch_num))
      .slice(start, end);
  }, [page, logData]);

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Spinner
            size="lg"
            variant="wave"
            label={`Загрузка данных начнется через ${reqInterval} секунд...`}
          />
        </div>
      ) : (
        <>
          <h1 className="text-center font-bold mb-5">
            Журнал мониторинга параметров помещения номер{" "}
            {roomDetails?.roomNumber} ({roomDetails?.roomLocation} - Зон:{" "}
            {device?.zoneNum})
          </h1>
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
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.batch_num}>
                  {parameters.map((column) => (
                    <TableCell key={column.uid}>{item[column.uid]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <h1 className="text-center font-bold mb-5">
            Графики измерения параметров помещения номер{" "}
            {roomDetails?.roomNumber} ({roomDetails?.roomLocation})
          </h1>

          <div
            ref={(el) => {
              if (el) {
                chartRefs.current[0] = el;
              }
            }}
            className="w-[75vw] h-[800px] cursor-pointer"
            // onClick={() => toggleFullScreen(chartRefs.current[0])}
            onDoubleClick={() => toggleFullScreen(chartRefs.current[0])}
          >
            <Chart data={graphData} />
          </div>
        </>
      )}
    </div>
  );
}

export default RoomDetails;
