import { Tab, Tabs } from "@heroui/react";
import { useState } from "react";
import AddRoom from "../../components/AddRoom";
import AddDevice from "../../components/AddDevice";

const Rooms = () => {
  const [selected, setSelected] = useState<string>("addRoom");
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
        <Tab key="addRoom" title="Помещения">
          <AddRoom
            setSelected={setSelected}
            setError={setError}
            setSuccess={setSuccess}
            error={error}
            success={success}
          />
        </Tab>
        <Tab key="addDevice" title="Устройства мониторинга">
          <AddDevice
            setSelected={setSelected}
            setError={setError}
            setSuccess={setSuccess}
            error={error}
            success={success}
          />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Rooms;
