import { useEffect, useState } from "react";
import { useDeviceContext } from "../../context/DeviceContextProvider";
import { useNavigate, useParams } from "react-router-dom";
import { device, Devices } from "../../Types";
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { useRoomContext } from "../../context/RoomContextProvider";
import { useUserContext } from "../../context/UserContextProvider";

function RoomDevices() {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { devices } = useDeviceContext();
  const { rooms } = useRoomContext();
  const { room_id, device_id } = useParams();
  const [room_id_, setRoom_id_] = useState<number>(Number(room_id));
  const [device_id_, setDevice_id_] = useState<string>(device_id!);
  const [roomDevices, setRoomDevices] = useState<Devices>([]);

  useEffect(() => {
    setRoom_id_(Number(room_id));
  }, [room_id]);
  useEffect(() => {
    setDevice_id_(device_id!);
  }, [device_id]);

  useEffect(() => {
    console.log(room_id_);
    const devices_ = devices.filter((device) => device.room_id === room_id_);
    console.log(devices_);
    setRoomDevices(devices_);
  }, [room_id_, devices]);

  useEffect(() => {
    console.log(roomDevices);
  }, [roomDevices]);

  const handleDevicePress = (device: device) => {
    console.log(device);
    if (user?.uRole === "Администратор") {
      navigate(`/admin/data/${room_id_}/${device_id_}`);
    } else {
      navigate(`/engineer/data/${room_id_}/${device_id_}`);
    }
  };
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {roomDevices.length === 0 ? (
          <div className="h-full w-full mt-48 ml-48 flex items-center justify-center">
            <div className="text-2xl text-slate-500 font-semibold items-center justify-center">
              Нет устройств в данном помещении
            </div>
          </div>
        ) : (
          roomDevices.map((device) => (
            // <div key={device.device_id}>{device.device_id}</div>
            <Card
              isPressable={device.status == 1}
              isDisabled={device.status == 0}
              key={device.device_id}
              className="h-[170px] w-[50%]"
              onPress={() => {
                handleDevicePress(device);
              }}
            >
              <CardHeader>
                <div className="text-lg font-bold w-full">
                  <h1 className="text-xl text-center">{device.deviceName}</h1>
                </div>
              </CardHeader>
              <Divider />
              <CardBody className="flex h-5 text-small">
                <div>
                  <span className="font-bold">Идентификатор: </span>{" "}
                  {device.device_id}
                </div>
                <div>
                  <span className="font-bold">Помещение:</span>{" "}
                  {
                    rooms?.find((room) => room.room_id === device.room_id)
                      ?.roomNumber
                  }{" "}
                  (
                  {
                    rooms?.find((room) => room.room_id === device.room_id)
                      ?.location
                  }
                  )
                </div>
                <div>
                  <span className="font-bold">Номер зоны:</span>{" "}
                  {device.zoneNum}
                </div>
                <div>
                  <span className="font-bold">Интервал опроса:</span>{" "}
                  {device.reqInterval} с
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>
    </>
  );
}

export default RoomDevices;
