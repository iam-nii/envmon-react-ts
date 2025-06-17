import { useUserContext } from "../context/UserContextProvider";
import { useNavigate, Navigate, Outlet, Link } from "react-router-dom";
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import Logo from "../../public/Icons/proto-2-light-short.svg";
import { useEffect, useState } from "react";
import { useDeviceContext } from "../context/DeviceContextProvider";
import axiosClient from "../axiosClient";

const EngineerLayout = () => {
  const { token, setToken, user, setUser } = useUserContext();
  const { devices } = useDeviceContext();
  const [deviceObjs, setDeviceObjs] = useState<deviceObj[]>([]);
  const [isDeviceReady, setIsDeviceReady] = useState(false);
  interface deviceObj {
    device_id: string;
    reqInterval: number;
    deviceParams: recievedData[];
  }

  type recievedData = {
    device_id?: string;
    param_id: number;
    parameter_name: string;
    parameter_alias: string;
    unitOfMeasure: string;
    techReg_id: number;
    min: number;
    max: number;
  };
  // Get user data
  useEffect(() => {
    const userData = localStorage.getItem("USER_DATA");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Get device parameters
  useEffect(() => {
    if (devices) {
      const devices_ = getDevices();
      devices_.forEach((device) => {
        const deviceObj: deviceObj = {
          device_id: device.device_id!,
          reqInterval: device.reqInterval!,
          deviceParams: [],
        };
        // const interval = device.reqInterval;

        console.log("Device not found");
        const dev = deviceObjs.find(
          (obj) => obj.device_id === device.device_id
        );
        if (dev) {
          getDeviceParameters(device.device_id!).then((params) => {
            dev.deviceParams = params;
          });
        } else {
          getDeviceParameters(device.device_id!).then((params) => {
            deviceObj.deviceParams = params;
          });
          setDeviceObjs((prev) => [...prev, deviceObj]);
        }
      });
    }
  }, [devices]);

  useEffect(() => {
    axiosClient
      .get("/api/rooms/?method=GET&query=getRoomParameters")
      .then((response) => {
        const res = response.data.data;

        const updatedDevices = deviceObjs.map((device) => {
          const deviceParams = device.deviceParams.map((param) => {
            const match = res.find(
              (res_data: recievedData) =>
                res_data.device_id === device.device_id &&
                res_data.param_id === param.param_id
            );
            if (match) {
              return {
                ...param,
                min: match.min,
                max: match.max,
              };
            }
            return param;
          });
          return {
            ...device,
            deviceParams,
          };
        });

        // Only update state if data actually changed
        const isEqual =
          JSON.stringify(updatedDevices) === JSON.stringify(deviceObjs);
        if (!isEqual) {
          console.log("Updated devices", updatedDevices);
          setDeviceObjs(updatedDevices);
          setIsDeviceReady(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [deviceObjs]);

  useEffect(() => {
    // Get the readings for all parameters in deviceObjs
    deviceObjs.forEach((device) => {
      device.deviceParams.forEach((param) => {
        getParamReadings(param.techReg_id, param.max, param.min);
      });
    });
  }, [isDeviceReady]);

  type Reading = {
    batch_num: number;
    logValue: number;
    log_id: number;
    mdt: Date;
    techReg_id: number;
  };

  const getParamReadings = (
    techReg_id: number,
    maxReading: number,
    minReading: number
  ) => {
    axiosClient
      .get(`/api/logs/?method=GET&id=${techReg_id}&query=1`)
      .then(({ data }) => {
        // console.log(`${techReg_id}:`, data.data);

        const readings: number = data.data.map((reading: Reading) => {
          if (
            reading.logValue > maxReading! ||
            reading.logValue < minReading!
          ) {
            //sending mail
            console.log(
              `sending mail: \nLogValue: ${reading.logValue}, \nMax: ${maxReading}, \nMin: ${minReading}, \nTechReg_id: ${techReg_id}`
            );
          }

          return {
            reading: reading.logValue,
            color:
              reading.logValue < maxReading! && reading.logValue > minReading!
                ? "text-green-700"
                : "text-red-700",
          };
        });
        console.log(readings);
      });
  };

  const getDeviceParameters = (device_id: string): Promise<recievedData[]> => {
    let deviceParams: recievedData[] = [];
    return axiosClient
      .get(`/api/settings/?method=GET&id=${device_id}&query=parameters`)
      .then((response) => {
        if (response.status === 204) {
          console.log("No content");
          return deviceParams;
        } else {
          deviceParams = response.data.data;
          return deviceParams;
        }
      })
      .catch((response) => {
        console.error(response);
        return deviceParams;
      });
  };
  const navigate = useNavigate();
  if (!token) {
    return <Navigate to="/signin" />;
  }
  const onLogout = () => {
    // e.preventDefault();
    setToken(null);
    navigate("/signin");
  };
  // Get all devices
  function getDevices() {
    return devices.filter((device) => device.status == 1);
  }

  return (
    <div className="flex">
      <aside className="min-w-72 h-screen flex flex-col gap-4 bg-slate-100">
        <img src={Logo} alt="University Logo" className="w-40 mx-4 mt-2" />

        <Link
          to="/engineer"
          className="hover:bg-slate-200 p-4 text-start font-bold rounded-lg"
        >
          Главная
        </Link>
        <Link
          to="/engineer/reports"
          className="hover:bg-slate-200 p-4 text-start font-bold rounded-lg"
        >
          Отчеты
        </Link>
      </aside>
      <div className="w-full">
        <Navbar className="bg-slate-100 border-b-2 border-slate-200">
          <NavbarBrand>
            <p className="text-xl font-bold">
              АИС мониторинга микроклимата производственных помещений
            </p>
          </NavbarBrand>
          <NavbarContent className="hidden sm:flex gap-6 mt-" justify="end">
            <NavbarItem className="flex flex-row gap-2 items-center ">
              <div>{user && user.uEmail}</div>
              <Button onPress={onLogout} color="danger">
                Выйти
              </Button>
            </NavbarItem>
          </NavbarContent>
        </Navbar>

        <main className="w-full h-full p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EngineerLayout;
