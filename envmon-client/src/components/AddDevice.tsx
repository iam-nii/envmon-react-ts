import {
  Alert,
  Button,
  cn,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
  // Spinner,
  useDisclosure,
} from "@heroui/react";
import { useEffect, useState } from "react";
import DevicesTable from "../Tables/DevicesTable";
import axiosClient from "../axiosClient";
import { useRoomContext } from "../context/RoomContextProvider";

// import { Rooms } from "../Types";
// import RoomsTable from "../../components/Tables/RoomsTable";
import { useDeviceContext } from "../context/DeviceContextProvider";
// import { Power, PowerOff } from "lucide-react";
// import { device, Devices } from "../Types";

interface AddDeviceType {
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
  setSelected: (selected: string) => void;
  //   isLoading: boolean;
  error: string | null;
  success: string | null;
}

interface devicePayloadType {
  device_id: string;
  deviceName: string;
  zoneNum: number | string;
  reqInterval: number | string;
  room_id: number | string;
  status: boolean | number;
}

function AddDevice({
  setError,
  setSuccess,
  //   isLoading,
  error,
  success,
}: AddDeviceType) {
  const [devicePayload, setDevicePayload] = useState<devicePayloadType>({
    device_id: "",
    deviceName: "",
    zoneNum: "",
    reqInterval: "",
    room_id: "",
    status: false,
  });
  const { rooms } = useRoomContext();
  const { devices, setDevices } = useDeviceContext();

  useEffect(() => {
    console.log("rooms:", rooms);
  }, [rooms]);
  //   const [freeDevices, setFreeDevices] = useState<Devices | null>(null);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  //   useEffect(() => {
  //     setFreeDevices(devices.filter((device: device) => device.room_id === null));
  //   }, [devices]);

  const handleAddDevice = () => {
    setError(null);
    console.log("devicePayload", devicePayload);
    if (devicePayload.status === true) {
      devicePayload.status = 1;
    } else {
      devicePayload.status = 0;
    }
    axiosClient.post("/api/devices/", devicePayload).then(({ data }) => {
      console.log(data);
      setDevices([...devices, data.data]);
      setError(null);
      setSuccess(data.message);
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      onClose();
    });

    // const newPayload = {
    //   ...roomPayload,
    //   area: roomPayload.area,
    // };
    // console.log(devicePayload.deviceID);
    // if (devicePayload.deviceID !== "null") {
    //   axiosClient
    //     .post("/insertRoom", newPayload)
    //     .then(({ data }) => {
    //       setDevicePayload((prev) => ({
    //         ...prev,
    //         room_id: data.room.room_id,
    //       }));
    //       setError(null);
    //       setSuccess(data.message);
    //       setTimeout(() => {
    //         setSuccess(null);
    //       }, 3000);

    //       const updatedDevices = devices.map((device: device) =>
    //         devicePayload.deviceID.includes(device.device_id)
    //           ? { ...device, room_id: data.room.room_id }
    //           : device
    //       );
    //       setDevices(updatedDevices);

    //       axiosClient
    //         .patch(
    //           `/updateDevice/${devicePayload.deviceID}`,
    //           updatedDevices.find(
    //             (device: device) => device.device_id === devicePayload.deviceID
    //           )
    //         )
    //         .then(({ data }) => {
    //           console.log(data);
    //           setError(null);
    //           setSuccess("Помещение и устройство добавлены");
    //           setTimeout(() => {
    //             setSuccess(null);
    //           }, 3000);
    //         })
    //         .catch((error) => {
    //           console.log(error);
    //           setError("Ошибка при добавлении устройства");
    //           setSuccess(null);
    //           setTimeout(() => {
    //             setError(null);
    //           }, 3000);
    //         });
    //     })
    //     .catch((error) => {
    //       const errorMessage = error;
    //       console.log(errorMessage);
    //       const errorError = error.response.data.error;

    //       if (errorError.includes("Duplicate entry")) {
    //         // Extract the room number from the error message
    //         const duplicateRoomNumber = errorError.match(/'([^']+)'/)[1];
    //         setError(`Номер помещения ${duplicateRoomNumber} уже существует.`);
    //         setTimeout(() => {
    //           setError(null);
    //         }, 3000);
    //         return;
    //       } else {
    //         setError("Ошибка добавления помещения.");
    //         setTimeout(() => {
    //           setError(null);
    //         }, 3000);
    //         return;
    //       }
    //     });
    // } else {
    //   setError("Укажите устройство");
    //   setTimeout(() => {
    //     setError(null);
    //   }, 3000);
    // }
  };
  return (
    <div>
      <div className="flex justify-center items-center">
        <Button onPress={onOpen} color="primary" className="text-lg w-full">
          Добавить устройство
        </Button>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Добавить устройство</ModalHeader>
              <ModalBody>
                <Input
                  label="Идентификатор устройства"
                  variant="bordered"
                  value={devicePayload.device_id}
                  maxLength={16}
                  onChange={(e) => {
                    setDevicePayload((prev) => ({
                      ...prev,
                      device_id: e.target.value,
                    }));
                  }}
                />
                <Input
                  label="Название устройства"
                  variant="bordered"
                  value={devicePayload.deviceName}
                  onChange={(e) => {
                    setDevicePayload((prev) => ({
                      ...prev,
                      deviceName: e.target.value,
                    }));
                  }}
                />
                <Input
                  label="Номер зоны"
                  variant="bordered"
                  value={devicePayload.zoneNum.toString()}
                  type="number"
                  min={0}
                  onChange={(e) => {
                    setDevicePayload((prev) => ({
                      ...prev,
                      zoneNum: e.target.value,
                    }));
                  }}
                />
                <Input
                  label="Интервал запроса"
                  variant="bordered"
                  value={devicePayload.reqInterval.toString()}
                  type="number"
                  min={10}
                  step={10}
                  onChange={(e) => {
                    setDevicePayload((prev) => ({
                      ...prev,
                      reqInterval: e.target.value,
                    }));
                  }}
                />
                <Select
                  label="Номер помещения"
                  placeholder="Выберите помещение"
                  variant="bordered"
                  selectedKeys={
                    devicePayload.room_id ? [devicePayload.room_id] : []
                  }
                  onChange={(e) => {
                    setDevicePayload((prev) => ({
                      ...prev,
                      room_id: e.target.value,
                    }));
                  }}
                >
                  {rooms?.map((room) => (
                    <SelectItem
                      key={String(room.room_id)}
                      textValue={String(room.roomNumber)}
                    >
                      {room.roomNumber} ({room.location})
                    </SelectItem>
                  ))}
                </Select>
                <Switch
                  classNames={{
                    base: cn(
                      "inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center",
                      "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                      "data-[selected=true]:border-primary"
                    ),
                    wrapper: "p-0 h-4 overflow-visible",
                    thumb: cn(
                      "w-6 h-6 border-2 shadow-lg",
                      "group-data-[hover=true]:border-primary",
                      //selected
                      "group-data-[selected=true]:ms-6",
                      // pressed
                      "group-data-[pressed=true]:w-7",
                      "group-data-[selected]:group-data-[pressed]:ms-4"
                    ),
                  }}
                  onValueChange={(value) => {
                    setDevicePayload((prev) => ({
                      ...prev,
                      status: value,
                    }));
                  }}
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-medium">
                      {devicePayload.status === true
                        ? "Выключить"
                        : " Включить"}
                    </p>
                    <p className="text-tiny text-default-400">
                      {devicePayload.status === true
                        ? "Устройство включено"
                        : "Устройство выключено"}
                    </p>
                  </div>
                </Switch>
                {error && (
                  <Alert
                    color={"danger"}
                    title={"Ошибка добавления устройства"}
                    description={error}
                  />
                )}
                {success && <Alert color={"success"} title={success} />}
              </ModalBody>
              <ModalFooter>
                <Button color="success" onPress={handleAddDevice}>
                  Добавить
                </Button>
                <Button color="primary" onPress={onClose}>
                  Отменить
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <DevicesTable />
    </div>
  );
}

export default AddDevice;
