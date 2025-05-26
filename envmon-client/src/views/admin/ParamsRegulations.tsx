import { Tab, Tabs } from "@heroui/react";
import { useState } from "react";
import AddParam from "../../components/AddParam";
// import AddRegulation from "../../components/AddRegulation";
import DeviceReg from "../../Tables/DeviceRegTable";

const ParamsRegulations = () => {
  const [selected, setSelected] = useState<string>("addParam");
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
        <Tab key="addParam" title="Параметры">
          <AddParam
            setSelected={setSelected}
            setError={setError}
            setSuccess={setSuccess}
            error={error}
            success={success}
          />
        </Tab>
        <Tab key="addRegulation" title="Регламенты">
          {/* <AddRegulation /> */}
          <DeviceReg />
        </Tab>
      </Tabs>
    </div>
  );
};

export default ParamsRegulations;
