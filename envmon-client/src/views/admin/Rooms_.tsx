import { Tab, Tabs } from "@heroui/react";
import { useState } from "react";
// import { useRoomContext } from "../../context/RoomContextProvider";
import AddRoom from "../../components/AddRoom";
import AddDevice from "../../components/AddDevice";
// import { RoomsT } from "../../Types";

const Rooms = () => {
  const [selected, setSelected] = useState("addRoom");
  // const { rooms, setRooms } = useRoomContext();
  // const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <div className="w-[90%] mx-auto">
      <Tabs
        fullWidth
        className="w-full"
        aria-label="Табы"
        size="md"
        color="primary"
        selectedKey={selected}
        onSelectionChange={(key) => setSelected(key as string)}
      >
        <Tab key="addRoom" title="Добавить помещение">
          <AddRoom
            setSelected={setSelected}
            setError={setError}
            setSuccess={setSuccess}
            // isLoading={isLoading}
            error={error}
            success={success}
          />
        </Tab>
        <Tab key="addDevice" title="Добавить устройство">
          <AddDevice
            setSelected={setSelected}
            setError={setError}
            setSuccess={setSuccess}
            // isLoading={isLoading}
            error={error}
            success={success}
          />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Rooms;
