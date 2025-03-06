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
// import axiosClient from "../axiosClient";
// import RoomsTable from "../../components/Tables/RoomsTable";
// import { useDeviceContext } from "../../context/DeviceContexProvider";
// import { device, Devices } from "../Types";

interface AddRoomType {
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
  setSelected: (selected: string) => void;
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

interface roomPayloadType {
  roomNumber: string;
  frPerson: string;
  location: string;
  height: number | string;
  width: number | string;
  length: number | string;
  area: number | string;
}

function AddRoom({
  setError,
  setSuccess,
  setSelected,
  isLoading,
  error,
  success,
}: AddRoomType) {
  const [roomPayload, setRoomPayload] = useState<roomPayloadType>({
    roomNumber: "",
    frPerson: "",
    location: "",
    height: "",
    width: "",
    length: "",
    area: "",
  });
  //   const { devices, setDevices } = useDeviceContext();
  //   const [freeDevices, setFreeDevices] = useState<Devices | null>(null);
  // const [devicePayload, setDevicePayload] = useState({
  //   deviceID: "null",
  //   deviceName: "",
  //   zoneNum: "0",
  //   status: "0",
  //   roomID: "0",
  // });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  //   useEffect(() => {
  //     setFreeDevices(devices.filter((device: device) => device.roomID === null));
  //   }, [devices]);
  useEffect(() => {
    const height = Number(roomPayload.height);
    const width = Number(roomPayload.width);
    const length = Number(roomPayload.length);
    setError(null);
    setSuccess(null);
    console.log(isLoading);
    setSelected("");
    console.log(error);
    if (!isNaN(height) && !isNaN(width) && !isNaN(length)) {
      setRoomPayload((prev) => ({
        ...prev,
        area: height * width * length,
      }));
    }
  }, [roomPayload.height, roomPayload.width, roomPayload.length]);

  const handleAddRoom = () => {
    setError(null);
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
    //         roomID: data.room.roomID,
    //       }));
    //       setError(null);
    //       setSuccess(data.message);
    //       setTimeout(() => {
    //         setSuccess(null);
    //       }, 3000);

    //       const updatedDevices = devices.map((device: device) =>
    //         devicePayload.deviceID.includes(device.device_id)
    //           ? { ...device, roomID: data.room.roomID }
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
        <Button onPress={onOpen} color="primary" className="text-lg w-[90%]">
          Добавить помещение
        </Button>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Добавить помещение</ModalHeader>
              <ModalBody>
                <Input
                  label="Номер помещения"
                  variant="bordered"
                  type="number"
                  value={roomPayload.roomNumber}
                  onChange={(e) => {
                    setRoomPayload((prev) => ({
                      ...prev,
                      roomNumber: e.target.value,
                    }));
                  }}
                />
                <Input
                  label="ФИО ответственного лица"
                  variant="bordered"
                  value={roomPayload.frPerson}
                  onChange={(e) => {
                    setRoomPayload((prev) => ({
                      ...prev,
                      frPerson: e.target.value,
                    }));
                  }}
                />
                <Input
                  label="Местоположение"
                  variant="bordered"
                  value={roomPayload.location}
                  onChange={(e) => {
                    setRoomPayload((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }));
                  }}
                />
                <div className="flex flex-row gap-2">
                  <Input
                    label="Площадь"
                    disabled
                    variant="bordered"
                    value={roomPayload.area.toString()}
                  />
                  <Input
                    label="Высота"
                    type="number"
                    variant="bordered"
                    value={roomPayload.height.toString()}
                    onChange={(e) => {
                      setRoomPayload((prev) => ({
                        ...prev,
                        height: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="flex flex-row gap-2">
                  <Input
                    label="Ширина"
                    type="number"
                    variant="bordered"
                    value={roomPayload.width.toString()}
                    onChange={(e) => {
                      setRoomPayload((prev) => ({
                        ...prev,
                        width: e.target.value,
                      }));
                    }}
                  />
                  <Input
                    label="Длина"
                    type="number"
                    variant="bordered"
                    value={roomPayload.length.toString()}
                    onChange={(e) => {
                      setRoomPayload((prev) => ({
                        ...prev,
                        length: e.target.value,
                      }));
                    }}
                  />
                </div>
                {error && (
                  <Alert
                    color={"danger"}
                    title={"Ошибка добавления помещения"}
                    description={error}
                  />
                )}
                {success && <Alert color={"success"} title={success} />}
              </ModalBody>
              <ModalFooter>
                <Button color="success" onPress={handleAddRoom}>
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
      {/* {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner size="lg" />
        </div>
      ) : (
        <RoomsTable isAdmin={true} />
      )} */}
    </div>
  );
}

export default AddRoom;
