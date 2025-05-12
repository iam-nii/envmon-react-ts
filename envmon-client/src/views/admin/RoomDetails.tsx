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
import { Params } from "../../Types";
import { useRoomContext } from "../../context/RoomContextProvider";

interface DataItem {
  // batch_num: number;
  // dateTime: string;
  [key: string]: number | string | undefined;
}

interface TableColumn {
  name: string;
  uid: string; // Ensures uid must be a key of DataItem
  techReg_id?: number;
}

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
// type GraphData = {
//   [title: string]: {
//     data: [
//       {
//         y: number;
//         dateTime: string;
//       }
//     ];
//     max: number;
//     min: number;
//   };
// };
function RoomDetails() {
  const { rooms } = useRoomContext();
  const [roomDetails, setRoomDetails] = useState<{
    roomNumber: number;
    roomLocation: string;
  } | null>(null);
  const { room_id, device_id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [reqInterval, setReqInterval] = useState<number>();
  // const [graphData, setGraphData] = useState<GraphData[]>([]);
  const [maxMinData, setMaxMinData] = useState<
    {
      max: number;
      min: number;
    }[]
  >([]);
  const effectRan = useRef(false);
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [logData, setLogData] = useState<DataItem[]>([]);
  // const [dataWithTechRegId, setDataWithTechRegId] = useState();
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
          name: `${param.parameter_name} (${param.unitOfMeasure})`,
          uid: param.parameter_alias,
          techReg_id: param.techReg_id,
        }));
        console.log("newParameters", newParameters);
        // const dataWithTechRegId = newParameters.map((param: Params) => ({
        //   name: param.parameter_name,
        //   techReg_id: param.techReg_id,
        // }));
        // setDataWithTechRegId(dataWithTechRegId);
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
  }, [device_id]);

  useEffect(() => {
    console.log("maxMinData", maxMinData);
  }, [maxMinData]);

  // useEffect(() => {
  //   const param_aliases = parameters.map((param) => param.uid);
  //   console.log("parameters", parameters);
  //   console.log("param_aliases", param_aliases);
  //   // const graphData = param_aliases.map((param) => ({
  //   //   [param]: {
  //   //     data: [],
  //   //     max: 0,
  //   //     min: 0,
  //   //   },
  //   // }));

  //   // if (reqInterval && reqInterval > 0) {
  //   //   logData.getLogData();
  //   // }
  // }, [reqInterval]);
  // }, [reqInterval, device_id, room_id]);

  // useEffect(() => {
  //   console.log("Current logData:", logData);
  //   console.log("Current parameters:", parameters);
  // }, [logData, parameters]);

  function startLogging(param_aliases: Array<string>, reqInterval: number) {
    let num = 0;
    setInterval(() => {
      axiosClient
        .get(`/envmon/?id=${device_id}`)
        .then(({ data }) => {
          // Destructure only the data that is in the param_aliases array
          // const { data: filteredData } = data;
          // console.log("filteredData", filteredData);
          // console.log("rest", rest);
          // param_aliases.forEach((param) => {
          //   console.log("param", param);
          //   for (const key in filteredData) {
          //     if (key === param) {
          //       console.log("key", key);
          //     }
          //   }
          // });

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
            // add id and dateTime to the filteredData
            const newData = {
              ...filteredData!,
              batch_num: num,
              dateTime: new Date().toLocaleString(),
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
  useEffect(() => {
    setIsLoading(false);
    console.log("logData", logData);
  }, [logData]);
  useEffect(() => setIsLoading(true), []);

  useEffect(() => {
    try {
      //check if "id" and "dateTime" are in the parameters array
      if (!parameters.some((param) => param.uid === "batch_num")) {
        parameters.unshift({
          name: "Номер замера",
          uid: "batch_num",
        });
      }
      if (!parameters.some((param) => param.uid === "dateTime")) {
        parameters.unshift({ name: "Дата и время", uid: "dateTime" });
      }
      // console.log("parameters", parameters);
    } catch (error) {
      console.log(error);
    }
    if (parameters.length > 2) {
      // console.log("parameters", parameters);
      if (effectRan.current) return;
      effectRan.current = true;
      const param_aliases = parameters.map((param) => param.uid);

      if (reqInterval && reqInterval > 0) {
        startLogging(param_aliases, reqInterval);
      }
    }
  }, [parameters]);

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
  }, [room_id, rooms]);

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
            {roomDetails?.roomNumber} ({roomDetails?.roomLocation})
          </h1>
          <Table
            aria-label="Table with log data"
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
        </>
      )}
    </div>
  );
}

export default RoomDetails;
