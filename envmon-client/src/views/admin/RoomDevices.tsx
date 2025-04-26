import { useEffect, useState } from "react";
import { useDeviceContext } from "../../context/DeviceContextProvider";
import { useNavigate, useParams } from "react-router-dom";
import { device, Devices } from "../../Types";
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { useRoomContext } from "../../context/RoomContextProvider";

function RoomDevices() {
  const navigate = useNavigate();
  const { devices } = useDeviceContext();
  const { rooms } = useRoomContext();
  const { room_id } = useParams();
  const [room_id_, setRoom_id_] = useState<number>(Number(room_id));
  const [roomDevices, setRoomDevices] = useState<Devices>([]);
  useEffect(() => {
    setRoom_id_(Number(room_id));
  }, [room_id]);

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
    navigate(`/admin/data/${device.device_id}`);
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
              isPressable
              key={device.device_id}
              className="h-[170px] w-[50%]"
              onPress={() => {
                handleDevicePress(device);
              }}
            >
              <CardHeader>
                <div className="text-lg font-bold">{device.deviceName}</div>
              </CardHeader>
              <Divider />
              <CardBody className="flex h-5 text-small">
                <div>
                  <span className="font-bold">Идентификатор: </span>{" "}
                  {device.device_id}
                </div>
                <div>
                  <span className="font-bold">Номер зоны:</span>{" "}
                  {device.zoneNum}
                </div>
                <div>
                  <span className="font-bold">Интервал:</span>{" "}
                  {device.reqInterval}
                </div>
                <div>
                  <span className="font-bold">Номер помещения:</span>{" "}
                  {
                    rooms?.find((room) => room.room_id === device.room_id)
                      ?.roomNumber
                  }
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
