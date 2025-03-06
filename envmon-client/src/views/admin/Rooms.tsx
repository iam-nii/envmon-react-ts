import { Tab, Tabs } from "@heroui/react";
import { useEffect, useState } from "react";
// import { useRoomContext } from "../../context/RoomContextProvider";
import AddRoom from "../../components/AddRoom";
// import { RoomsT } from "../../Types";

const Rooms = () => {
  const [selected, setSelected] = useState("addRoom");
  // const { rooms, setRooms } = useRoomContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  useEffect(() => {
    setIsLoading(false);
  }, []);
  return (
    <Tabs
      fullWidth
      aria-label="Табы"
      size="md"
      selectedKey={selected}
      onSelectionChange={(key) => setSelected(key as string)}
    >
      <Tab key="addRoom" title="Добавить помещение">
        <AddRoom
          setSelected={setSelected}
          // rooms={Array.isArray(rooms) ? rooms : []} // Ensure rooms is an array
          // setRooms={setRooms}
          setError={setError}
          setSuccess={setSuccess}
          isLoading={isLoading}
          error={error}
          success={success}
        />
      </Tab>
      <Tab key="addDevice" title="Добавить устройство">
        {/* <AddDevice
          setSelected={setSelected}
          rooms={Array.isArray(rooms) ? rooms : []} // Ensure rooms is an array
          setError={setError}
          setSuccess={setSuccess}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          error={error}
          success={success}
        /> */}
      </Tab>
    </Tabs>
  );
};

export default Rooms;
