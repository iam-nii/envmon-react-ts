import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  useDisclosure,
  Switch,
} from "@heroui/react";
import { useUserContext } from "../../context/UserContextProvider";
import { useDeviceContext } from "../../context/DeviceContextProvider";
import { useEffect, useState } from "react";
import { User } from "../../Types";
// import axiosClient from "../../axiosClient";

function SetRegulations() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { user } = useUserContext();
  const { devices } = useDeviceContext();
  const [userData, setUserData] = useState<User | null>(null);
  const [error, setError] = useState(false);
  const [payload, setPayload] = useState({
    userID: "",
    parameter_name: "",
    send_msg: false,
    minValue: "",
    maxValue: "",
    deviceID: "",
  });
  useEffect(() => {
    console.log("Current payload", payload);
  }, [payload]);
  useEffect(() => {
    setUserData(user);
  }, [user]);

  const validatePayload = () => {
    setError(false);
    if (payload.parameter_name === "") {
      setError(true);
      return true;
    }
    if (payload.minValue === "") {
      setError(true);
      return true;
    }
    if (payload.maxValue === "") {
      setError(true);
      return true;
    }
    if (payload.deviceID === "") {
      setError(true);
      return true;
    }
    return false;
  };

  const handleSubmit = () => {
    if (!validatePayload()) {
      return;
    }
    setPayload((prev) => ({
      ...prev,
      userID: userData!.user_id!.toString(),
    }));
    console.log(payload);
  };
  return (
    <div className="w-[70%] mx-auto flex flex-col gap-2">
      <Button onPress={onOpen} className="text-lg font-bold">
        Настройки регламента
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onclose) => (
            <>
              <ModalHeader>Настройки регламента</ModalHeader>
              <ModalBody>
                <div>
                  <Input
                    label="ФИО пользователя"
                    variant="bordered"
                    isDisabled
                    value={userData!.userName!}
                  />
                </div>
                <div>
                  <Select
                    label="ID устройства"
                    onSelectionChange={(keys) => {
                      const newDeviceID =
                        Array.from(keys)[0]!.toString() || " ";
                      setPayload((prev) => ({
                        ...prev,
                        deviceID: newDeviceID,
                      }));
                      validatePayload();
                    }}
                  >
                    {devices!.map((device) => (
                      <SelectItem key={device.device_id}>
                        {device.deviceName}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="flex flex-row gap-2">
                  <Input
                    label="Минимальное значение"
                    type="number"
                    value={payload.minValue}
                    onChange={(e) => {
                      setPayload((prev) => ({
                        ...prev,
                        minValue: e.target.value,
                      }));
                      validatePayload();
                    }}
                  />
                  <Input
                    label="Максимальное значение"
                    type="number"
                    value={payload.maxValue}
                    onChange={(e) => {
                      setPayload((prev) => ({
                        ...prev,
                        maxValue: e.target.value,
                      }));
                      validatePayload();
                    }}
                  />
                </div>

                <div className="mt-2 ">
                  <Switch
                    isSelected={payload.send_msg}
                    onValueChange={() => {
                      setPayload((prev) => ({
                        ...prev,
                        send_msg: !prev.send_msg,
                      }));
                    }}
                  >
                    <p className="text-sm">Отправить сообщение</p>
                  </Switch>
                </div>
                <div className="text-red-500 text-sm">
                  {error ? "Заполните все поля" : ""}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="success"
                  isDisabled={error}
                  onPress={handleSubmit}
                >
                  Сохранить
                </Button>
                <Button color="primary" onPress={onclose}>
                  Закрыть
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default SetRegulations;
