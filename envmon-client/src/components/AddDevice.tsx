import {
  Alert,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  // Select,
  // SelectItem,
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
  deviceName: string;
  zoneNum: number | string;
  reqInterval: number | string;
  room_id: number | string;
}

function AddDevice({
  setError,
  setSuccess,
  //   isLoading,
  error,
  success,
}: AddDeviceType) {
  const [devicePayload, setDevicePayload] = useState<devicePayloadType>({
    deviceName: "",
    zoneNum: "",
    reqInterval: "",
    room_id: "",
  });
  const { rooms } = useRoomContext();
  const { devices, setDevices } = useDeviceContext();

  useEffect(() => {
    console.log("rooms:", rooms);
  }, [rooms]);

  //   const { devices, setDevices } = useDeviceContext();
  //   const [freeDevices, setFreeDevices] = useState<Devices | null>(null);
  // const [devicePayload, setDevicePayload] = useState({
  //   deviceID: "null",
  //   deviceName: "",
  //   zoneNum: "0",
  //   status: "0",
  //   room_id: "0",
  // });
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  //   useEffect(() => {
  //     setFreeDevices(devices.filter((device: device) => device.room_id === null));
  //   }, [devices]);

  const handleAddDevice = () => {
    setError(null);
    console.log("devicePayload", devicePayload);
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
                <Input
                  label="Номер помещения"
                  disabled
                  type="number"
                  variant="bordered"
                  value={devicePayload.room_id.toString()}
                />
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
