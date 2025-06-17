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
  // Selection,
  SelectItem,
  Switch,
  // Spinner,
  useDisclosure,
} from "@heroui/react";
import { useState } from "react";
import DevicesTable from "../Tables/DevicesTable";
import axiosClient from "../axiosClient";
import { useRoomContext } from "../context/RoomContextProvider";
import { useParameterContext } from "../context/ParameterContextProvider";

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

  // useEffect(() => {
  //   console.log("rooms:", rooms);
  // }, [rooms]);
  //   const [freeDevices, setFreeDevices] = useState<Devices | null>(null);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { parameters } = useParameterContext();
  // const [selectedParameters, setSelectedParameters] = useState<Selection>();

  const handleAddDevice = () => {
    setError(null);
    // console.log("devicePayload", devicePayload);
    if (devicePayload.status === true) {
      devicePayload.status = 1;
    } else {
      devicePayload.status = 0;
    }
    if (devicePayload.device_id.length !== 16) {
      setError("Идентификатор устройства должен быть 16 символов");
      return;
    }
    if (devicePayload.deviceName.length < 3) {
      setError("Название устройства должно быть не менее 3 символов");
      return;
    }
    if (Number(devicePayload.zoneNum) < 0 || devicePayload.zoneNum === "") {
      setError("Номер зоны должен быть больше 0");
      return;
    }
    if (Number(devicePayload.reqInterval) < 10) {
      setError("Интервал опроса должен быть больше 10");
      return;
    }
    axiosClient.post("/api/devices/", devicePayload).then(({ data }) => {
      // console.log(data);
      setDevices([...devices, data.data]);
      setError(null);
      setSuccess(data.message);
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      onClose();
    });
  };
  // useEffect(() => {
  //   console.log(selectedParameters);
  // }, [selectedParameters]);
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
                  label="Интервал опроса, с"
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
                  label="Помещение"
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
                      textValue={`${room.roomNumber} (${room.location})`}
                    >
                      {room.roomNumber} ({room.location})
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  label="Выберите параметры"
                  placeholder="Отслеживаемые параметры"
                  variant="bordered"
                  selectionMode="multiple"
                  // onSelectionChange={setSelectedParameters}
                >
                  {parameters!.map((parameter) => (
                    <SelectItem
                      key={parameter.param_id}
                      textValue={parameter.parameter_name}
                    >
                      {parameter.parameter_name}
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
                      {/* {devicePayload.status === true
                        ? "Выключить"
                        : " Включить"} */}
                      Состояние
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
