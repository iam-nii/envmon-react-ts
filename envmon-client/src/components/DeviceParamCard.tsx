import { useNavigate } from "react-router-dom";
import { Room } from "../Types";
import { useUserContext } from "../context/UserContextProvider";
import { useDeviceContext } from "../context/DeviceContextProvider";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { useEffect, useState } from "react";
import axiosClient from "../axiosClient";
import ParameterReading from "./ParameterReading";
import { DeviceLogData } from "./classes/DeviceLogData";

type DeviceParamCardTypes = {
  room: Room;
};

function DeviceParamCard({ room }: DeviceParamCardTypes) {
  const navigate = useNavigate();
  const { users } = useUserContext();
  const { devices } = useDeviceContext();
  const [deviceID, setDeviceID] = useState<string>();
  const [reqInterval, setReqInterval] = useState<number>();
  const [deviceParams, setDeviceParams] = useState<
    (recievedData | undefined)[]
  >([]);

  // Get the device id of the room
  useEffect(() => {
    const device = devices.find((device) => device.room_id === room.room_id);
    console.log(device);
    if (device) setDeviceID(device.device_id);
  }, []);
  type recievedData = {
    param_id: number;
    parameter_name: string;
    parameter_alias: string;
    unitOfMeasure: string;
    techReg_id: number;
  };

  // Get the device parameters
  useEffect(() => {
    console.log("deviceID", deviceID);
    getDeviceParameters(deviceID!);
  }, [deviceID]);

  const getDeviceParameters = (device_id: string) => {
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
        console.log(response);
      });
    console.log("device_id", device_id);
    // api/devices/?method=GET&query=getInterval&id=n0G79nWmp6sm3ZYO
    if (device_id) {
      axiosClient
        .get(`/api/devices/?method=GET&query=getInterval&id=${device_id}`)
        .then(({ data }) => {
          console.log("reqInterval", data, device_id);
          const reqInterval = data.data.reqInterval;
          setReqInterval(reqInterval);
        });
    }
  };

  useEffect(() => {
    console.log("reqInterval", reqInterval);
    const logData = new DeviceLogData(deviceID!, room.roomNumber, reqInterval!);
    if (reqInterval && reqInterval > 0) {
      logData.getLogData();
    }
  }, [reqInterval, deviceID]);

  const handlePress = (room: Room) => {
    navigate(`/admin/room/devices/${room.room_id}/${deviceID}/${reqInterval}`);
  };
  return (
    <div>
      <Card
        key={room.room_id}
        isPressable
        shadow="sm"
        onPress={() => {
          handlePress(room);
        }}
      >
        <CardHeader className="flex justify-center items-center">
          <p className="text-2xl">
            <span className="text-primary font-bold">{room.roomNumber}</span>
          </p>
        </CardHeader>
        <CardBody className="overflow-visible">
          <div className="flex gap-2">
            <p className="text-md font-bold">Ответственный:</p>
            <p className="text-md">{room.frPerson}</p>
          </div>

          <div className="flex gap-5 w-full">
            <p className="text-md font-bold">телефон:</p>
            <p className="text-md">
              {users?.find(
                (user) => user.userName?.trim() === room.frPerson?.trim()
              )?.uPhone || "Нет телефона"}
            </p>
          </div>
          {/* make a line seperator */}
          <div className="w-full h-px bg-gray-300"></div>

          {/* <div className="flex gap-2">
            <p className="text-lg font-bold">Л,лм:</p>
            <p className="text-xl">
              <span className="pl-2 text-md">105 </span>
              <span className="text-lg font-bold">106</span>
              <span className="pl-2 text-md"> 107</span>
            </p>
          </div> */}
          {deviceID ? (
            <div>
              <div>
                <h3>
                  Ид. устройства: <span className="text-sm">{deviceID}</span>{" "}
                </h3>
              </div>
              <div key={deviceID}>
                {deviceParams ? (
                  deviceParams.map((param: recievedData | undefined) => (
                    <div key={param?.param_id} className="flex flex-row gap-2">
                      <p>
                        {param?.parameter_alias}, {param?.unitOfMeasure}:
                      </p>
                      <p>
                        <ParameterReading techReg_id={param?.techReg_id} />
                      </p>
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
