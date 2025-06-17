import { useNavigate } from "react-router-dom";
import { Room } from "../Types";
import { useUserContext } from "../context/UserContextProvider";
import { useDeviceContext } from "../context/DeviceContextProvider";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { useEffect, useState } from "react";
import axiosClient from "../axiosClient";
import ParameterReading from "./ParameterReading";

type DeviceParamCardTypes = {
  room: Room;
  role: string;
};

function DeviceParamCard({ room, role }: DeviceParamCardTypes) {
  const navigate = useNavigate();
  const { users } = useUserContext();
  const { devices } = useDeviceContext();
  const [deviceID, setDeviceID] = useState<string | null>();
  const [deviceStatus, setDeviceStatus] = useState<number>(0);
  const [zoneNumber, setZoneNumber] = useState<number>();
  const [deviceParams, setDeviceParams] = useState<
    (recievedData | undefined)[]
  >([]);

  // Get the device id of the room
  useEffect(() => {
    const device = devices.find((device) => device.room_id === room.room_id);
    // console.log(device);
    if (device) {
      setZoneNumber(device.zoneNum);
      setDeviceID(device.device_id);
    }
    // console.log("role: ", role);
  }, [devices]);
  useEffect(() => {}, [deviceID]);
  type recievedData = {
    param_id: number;
    parameter_name: string;
    parameter_alias: string;
    unitOfMeasure: string;
    techReg_id: number;
  };

  // Get the device parameters
  useEffect(() => {
    // console.log("deviceID", deviceID);
    getDeviceParameters(deviceID!);
  }, [deviceID]);

  const getDeviceParameters = (device_id: string) => {
    let status = 0;
    if (device_id) {
      status = devices.find((device) => device.device_id === deviceID)
        ?.status as number;
      // console.log("status: ", status);
      // console.log(typeof status);
      setDeviceStatus(status);
      // getDeviceStatus(deviceID);
    }
    if (Number(status) === 1) {
      axiosClient
        .get(`/api/settings/?method=GET&id=${device_id}&query=parameters`)
        .then((response) => {
          if (response.status === 204) {
            console.log("No content");
          } else {
            // console.log(response.data.data);

            // const deviceParams: recievedData[] = response.data.data.map(
            //   (devParam: recievedData) => devParam.parameter_name?.trim()
            // );
            setDeviceParams(response.data.data);
          }
        })
        .catch((response) => {
          console.error(response);
        });
    }
  };

  const handlePress = (room: Room) => {
    if (role === "admin") {
      navigate(`/admin/room/devices/${room.room_id}/${deviceID}`);
    } else {
      navigate(`/engineer/room/devices/${room.room_id}/${deviceID}`);
    }
  };
  return (
    <div>
      <Card
        key={room.room_id}
        isPressable
        className="w-100"
        shadow="sm"
        onPress={() => {
          handlePress(room);
        }}
      >
        <CardHeader className="flex justify-center items-center">
          <p className="text-2xl">
            <span className="text-primary font-bold">
              {room.location}, № {room.roomNumber}
            </span>
          </p>
        </CardHeader>
        <CardBody className="overflow-visible">
          <div className="flex gap-2">
            <p className="text-md text-right font-bold w-32">Ответственный</p>
            <p className="text-md">{room.frPerson}</p>
          </div>

          <div className="flex gap-2 w-full">
            <p className="text-md text-right font-bold w-32">Телефон</p>
            <p className="text-md">
              {users?.find(
                (user) => user.userName?.trim() === room.frPerson?.trim()
              )?.uPhone || "Нет телефона"}
            </p>
          </div>
          {/* make a line seperator */}
          <div className="w-full h-px bg-gray-300 mt-1"></div>

          {/* <div className="flex gap-2">
            <p className="text-lg font-bold">Л,лм:</p>
            <p className="text-xl">
              <span className="pl-2 text-md">105 </span>
              <span className="text-lg font-bold">106</span>
              <span className="pl-2 text-md"> 107</span>
            </p>
          </div> */}
          {deviceID && deviceStatus == 1 ? (
            <div>
              <div>
                <h3 className="text-center">
                  Номер зоны: <span className="text-sm">{zoneNumber}</span>{" "}
                </h3>
              </div>
              <div key={deviceID}>
                {deviceParams ? (
                  [...deviceParams]
                    .sort((a, b) => {
                      // Handle undefined or missing aliases
                      const aliasA = a?.parameter_alias || "";
                      const aliasB = b?.parameter_alias || "";
                      // First, sort by length
                      if (aliasA.length !== aliasB.length) {
                        return aliasA.length - aliasB.length;
                      }
                      // If lengths are equal, sort alphabetically
                      return aliasA.localeCompare(aliasB);
                    })
                    .map((param: recievedData | undefined) => (
                      <div
                        key={param?.param_id}
                        className="flex flex-row gap-2 mb-0"
                      >
                        <p className="w-28 text-right">
                          {param?.parameter_alias}, {param?.unitOfMeasure}:
                        </p>
                        <div>
                          <ParameterReading techReg_id={param?.techReg_id} />
                        </div>
                      </div>
                    ))
                ) : (
                  <div>
                    <p>Нет отслеживаемых параметров</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2"></div>
            </div>
          ) : (
            <div>
              <p>Нет устройств в данном помещении</p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default DeviceParamCard;
