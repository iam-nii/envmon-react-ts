import { useRoomContext } from "../../context/RoomContextProvider";
import { Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Room } from "../../Types";
// import { useUserContext } from "../../context/UserContextProvider";
import { useDeviceContext } from "../../context/DeviceContextProvider";
import DeviceParamCard from "../../components/DeviceParamCard";

function Dashboard() {
  const { rooms } = useRoomContext();
  // const { users } = useUserContext();
  const { devices } = useDeviceContext();
  // const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // const handlePress = (room: Room) => {
  //   navigate(`/admin/room/devices/${room.room_id}`);
  // };

  useEffect(() => {
    if (rooms == null) setIsLoading(true);
    else setIsLoading(false);
    console.log(rooms);
  }, []);

  //TODO
  // Get the device ID of each room
  // Get the parameter aliases for the parameters of each device

  useEffect(() => {
    // getDeviceParameters();

    console.log(devices);
  }, [devices]);

  return (
    <div className="w-full">
      <div className="w-full flex flex-wrap gap-5">
        {isLoading ? (
          <Spinner size="lg" />
        ) : (
          rooms.map((room) => <DeviceParamCard room={room} role="engineer" />)
        )}
      </div>
    </div>
  );
}

export default Dashboard;
