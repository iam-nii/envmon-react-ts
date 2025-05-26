import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  useDisclosure,
  ModalBody,
} from "@heroui/react";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../axiosClient";
import { device, Params, Room } from "../../Types";
import { useRoomContext } from "../../context/RoomContextProvider";
import Chart from "../../components/Chart";
import { useDeviceContext } from "../../context/DeviceContextProvider";
import { useParameterContext } from "../../context/ParameterContextProvider";
import { useUserContext } from "../../context/UserContextProvider";

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

type Warning = {
  parameterName: string[];
  parameterValue: number[];
  uom: string[];
  min: number[];
  max: number[];
  userName: string;
  roomNumber: string;
  location: string;
  zoneNum: number;
};
function RoomDetails() {
  const pageSize = 15;
  const effectRan = useRef(false);
  const [page, setPage] = useState(1);
  const { rooms } = useRoomContext();
  const { users } = useUserContext(); // to get the person responsible for the room and their contact information
  const { devices } = useDeviceContext();
  const { room_id, device_id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [mailTo, setMailTo] = useState<string>("");
  const [frTel, setFrTel] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showWarning, setShowWarning] = useState(false);
  const [logData, setLogData] = useState<DataItem[]>([]);
  const [reqInterval, setReqInterval] = useState<number>();
  const { parameters: parameters_ } = useParameterContext();
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const [warning, setWarning] = useState<Warning | null>(null);
  const [maxMinData, setMaxMinData] = useState<MaxMinData[]>([]);
  const [device, setDevice] = useState<device | undefined>(undefined);
  const graphDataRef = useRef<GraphData[]>(graphData);
  const [roomDetails, setRoomDetails] = useState<Room | null>(null);
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
          name: `${param.parameter_alias}, ${param.unitOfMeasure}`,
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
        // Get the last mdt from the logs table
        let lastMdt;
        axiosClient
          .get(`/envmon/?id=${device_id}&query=lastMdt`)
          .then(async ({ data }) => {
            console.log("data", data);
            lastMdt = data.data.mdt;
            console.log("lastMdt", lastMdt);
            // Get the current datetime using typescript
            const dbDate = new Date(lastMdt!);
            const currentDateTime = new Date(); // current date/time

            const diffInSeconds = Math.floor(
              (currentDateTime.getTime() - dbDate.getTime()) / 1000
            );
            console.log(diffInSeconds);

            console.log("lastMdt", lastMdt);
            // await sleep(diffInSeconds * 1000);
            // setNum(1);
            fetchData(param_aliases, 1);
            startLogging(param_aliases, reqInterval);
          });
      }
    }
  }, [parameters, maxMinData, parameters_]);
  // async function sleep(ms: number): Promise<void> {
  //   return new Promise((resolve) => setTimeout(resolve, ms));
  // }
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
  function startLogging(param_aliases: Array<string>, reqInterval: number) {
    let num = 2;

    setInterval(() => {
      fetchData(param_aliases, num);
      num++;
    }, reqInterval * 1000);
  }

  function fetchData(param_aliases?: Array<string>, num?: number) {
    axiosClient
      .get(`/envmon/?id=${device_id}`)
      .then(({ data }) => {
        type LogData = {
          [key: string]: number | string;
        };
        // get only the parameters that are in the param_aliases array
        try {
          const filteredData = param_aliases?.reduce(
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
                  const min = paramData[key_].min;
                  const max = paramData[key_].max;
                  if (
                    Number(filteredData[key]) < min ||
                    Number(filteredData[key]) > max
                  ) {
                    const deviantParam = parameters_.find(
                      (param) => param.parameter_alias == key
                    );
                    const parameterName = deviantParam?.parameter_name || "";
                    const parameterValue = filteredData[key];
                    const uom = paramData[key_].uom;

                    // sendEmail(
                    //   parameterName,
                    //   Number(parameterValue),
                    //   uom,
                    //   min,
                    //   max
                    // );
                    const frPerson = users.find(
                      (user) =>
                        user.userName?.trim() === roomDetails?.frPerson?.trim()
                    );
                    const device = devices.find(
                      (device) => device.device_id === device_id
                    );
                    setMailTo(frPerson?.uEmail || "");
                    setFrTel(frPerson?.uPhone || "");

                    setWarning((prev) => ({
                      ...prev,
                      parameterName: [
                        ...(prev?.parameterName || []),
                        parameterName,
                      ],
                      parameterValue: [
                        ...(prev?.parameterValue || []),
                        Number(parameterValue),
                      ],
                      uom: [...(prev?.uom || []), uom],
                      min: [...(prev?.min || []), min],
                      max: [...(prev?.max || []), max],
                      userName: prev?.userName || "",
                      roomNumber: prev?.roomNumber || "",
                      location: prev?.location || "",
                      zoneNum: device?.zoneNum || 0,
                    }));
                    sendEmail();
                    // parameterName,
                    // Number(parameterValue),
                    // uom,
                    // min,
                    // max

                    // console.log(
                    //   "Warning: ",
                    //   parameterName,
                    //   "value: ",
                    //   parameterValue,
                    //   " ",
                    //   uom,
                    //   " is out of range",
                    //   min,
                    //   max
                    // );
                  }
                  paramData[key_].data?.push({
                    y: Number(filteredData[key]),
                    batch_num: Number(num),
                  });
                }
              }
            }
            // console.log("paramData", paramData);

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

  function sendEmail() {
    // console.log("roomDetails", roomDetails);
    const frPerson = users.find(
      (user) => user.userName?.trim() === roomDetails?.frPerson?.trim()
    );
    if (frPerson) {
      setShowWarning(true);
      const warningTime = localStorage.getItem("WARNINING_TIME");

      onOpen();
      setTimeout(() => {
        setWarning(null);
        setShowWarning(false);
        onClose();
      }, Number(warningTime));
    }
    // console.log("frPersonEmail", frPersonEmail);
    // if (frPerson) {
    //   console.log(
    //     `ВНИМАНИЕ: Значение параметра "${parameterName}" (${parameterValue} ${uom}) выходит за допустимые пределы!
    //   Минимально допустимое значение: ${min}
    //   Максимально допустимое значение: ${max}
    //   Письмо отправлено на адрес: ${frPerson?.uEmail}`
    //   );
    // }
  }
  useEffect(() => {
    const deviantParams = warning?.parameterName.map((name, index) => {
      return `${name} (${warning?.parameterValue[index]} ${warning?.uom[index]})`;
    });
    // console.log("deviantParams", deviantParams);
    if (deviantParams && mailTo) {
      const roomNumber = roomDetails?.roomNumber;
      const location = roomDetails?.location;
      const zoneNum = device?.zoneNum;
      const frPerson = roomDetails?.frPerson;
      const frPersonMail = mailTo;
      const frPersonPhone = frTel;
      const mailSubject = `ВНИМАНИЕ: Значение параметра "${deviantParams?.join(
        ", "
      )}" ${
        warning?.parameterName.length && warning?.parameterName.length > 1
          ? "выходят"
          : "выходит"
      } за допустимые пределы!`;
      const message = `Номер помещения: ${roomNumber}
      Местоположение: ${location}
      Зона: ${zoneNum}
      Ответственный за помещение: ${frPerson}
      Почта ответственного: ${frPersonMail}
      Номер телефона ответсвенного: ${frPersonPhone}
      ${warning?.parameterValue
        .map(
          (value, index) =>
            `${warning?.parameterName[index]} 
          текущее значение: ${value} ${warning?.uom[index]}, 
          минимальное значение: ${warning?.min[index]} ${warning?.uom[index]}, 
          максимальное значение: ${warning?.max[index]} ${warning?.uom[index]}`
        )
        .join("\n")}`;

      axiosClient
        .get("/api/reports/?method=GET&query=sendEmail", {
          params: {
            mailSubject,
            message,
            mailTo,
            mailFrom: "lsr.monitoring@gmail.com",
          },
        })
        .then(({ data }) => {
          console.log("data", data);
        });

      // console.log("mailSubject", mailSubject);
      // console.log("message", message);
    }
  }, [showWarning]);

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

    if (room) {
      console.log("room", room);
      setRoomDetails(room);
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
            {roomDetails?.roomNumber} ({roomDetails?.location} - Зон:{" "}
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
            {roomDetails?.roomNumber} ({roomDetails?.location})
          </h1>

          <div
            ref={(el) => {
              if (el) {
                chartRefs.current[0] = el;
              }
            }}
            className="w-[75vw] h-[800px] cursor-pointer mb-10"
            // onClick={() => toggleFullScreen(chartRefs.current[0])}
            onDoubleClick={() => toggleFullScreen(chartRefs.current[0])}
          >
            <Chart data={graphData} />
          </div>
        </>
      )}

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
                  <p className="font-bold font-sans">{roomDetails?.frPerson}</p>
                </h2>
                <h2 className="flex flex-row gap-3">
                  <p className="w-28 text-right">Тел.</p>
                  <p className="font-bold font-sans">{frTel && frTel}</p>
                </h2>
                <h2 className="flex flex-row gap-3">
                  <p className="w-28 text-right">E-mail</p>
                  <p className="font-bold font-sans">{mailTo && mailTo}</p>
                </h2>
                <p className="text-center text-wrap">
                  Контролируемые параметры микроклимата за границами допустимого
                  диапазона{" "}
                </p>
                <div className="bg-red-500 w-full h-[3px]"></div>
                {/* {warning?.parameterName.map((name, index) => (
                  <p key={index}>
                    Значение параметра{" "}
                    <span className="font-bold font-sans text-red-600">
                      "{name}" ({warning?.parameterValue[index]}
                      {warning?.uom[index]}){" "}
                    </span>
                    выходит за допустимые пределы!
                  </p>
                ))} */}
                <div>
                  {warning?.min.map((min, index) => (
                    <div
                      key={index}
                      className="flex flex-row gap-2 w-full items-center justify-center"
                    >
                      <p className="w-64 text-right">
                        {warning?.parameterName[index]}, {warning?.uom[index]}{" "}
                      </p>
                      <p className=" text-red-600 font-bold w-20 text-right">
                        {warning?.parameterValue[index]}
                      </p>
                      <div className="w-full">
                        {warning?.parameterValue[index] <
                          warning?.min[index] && (
                          <div className="flex flex-row w-[20%]">
                            <p className="w-full mx-auto">&lt; </p>
                            <p className="text-green-600 ml-2 w-20 font-bold text-left">
                              {warning?.min[index]}
                            </p>
                          </div>
                        )}
                        {warning?.parameterValue[index] >
                          warning?.max[index] && (
                          <div className="flex flex-row w-[20%]">
                            <p className="w-full mx-auto">&gt; </p>
                            <p className="text-green-600 ml-2 w-20 font-bold text-left">
                              {warning?.max[index]}
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

export default RoomDetails;
