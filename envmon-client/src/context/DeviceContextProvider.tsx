import { createContext, useContext, useEffect, useState } from "react";
import { Devices } from "../Types";
import axiosClient from "../axiosClient";

interface DeviceContextProviderType {
  children: React.ReactNode;
}

interface DeviceContextType {
  devices: Devices;
  setDevices: (device: Devices) => void;
}

const DeviceContext = createContext<DeviceContextType>({
  devices: [],
  setDevices: () => {},
});

export const DeviceContextProvider = ({
  children,
}: DeviceContextProviderType) => {
  const [devices, setDevices] = useState<Devices>([]);

  useEffect(() => {
    axiosClient
      .get("/api/devices/?method=GET&query=getDevices")
      .then(({ data }) => {
        setDevices(data.data);
      });
  }, []);

  // useEffect(() => {
  //   console.log(devices);
  // }, [devices]);

  return (
    <DeviceContext.Provider value={{ devices, setDevices }}>
      {children}
    </DeviceContext.Provider>
  );
};
export const useDeviceContext = () => useContext(DeviceContext);
