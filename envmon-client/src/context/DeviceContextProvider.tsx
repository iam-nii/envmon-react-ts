import { createContext, useContext, useState } from "react";
import { Devices } from "../Types";

interface DeviceContextProviderType {
  children: React.ReactNode;
}

interface DeviceContextType {
  devices: Devices | null;
  setDevices: (device: Devices) => void;
}

const DeviceContext = createContext<DeviceContextType>({
  devices: null,
  setDevices: () => {},
});

export const DeviceContextProvider = ({
  children,
}: DeviceContextProviderType) => {
  const [devices, setDevices] = useState<Devices | null>([]);

  return (
    <DeviceContext.Provider value={{ devices, setDevices }}>
      {children}
    </DeviceContext.Provider>
  );
};
export const useDeviceContext = () => useContext(DeviceContext);
