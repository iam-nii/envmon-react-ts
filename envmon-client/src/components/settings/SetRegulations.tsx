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
import { Params, User } from "../../Types";
import axiosClient from "../../axiosClient";
// import axiosClient from "../../axiosClient";

function SetRegulations() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { user } = useUserContext();
  const { devices } = useDeviceContext();
  const [userData, setUserData] = useState<User | null>(null);
  const [parameters, setParameters] = useState<Params[]>([{}]);
  const [error, setError] = useState<string | boolean>(false);
  type Payload = {
    user_id: string;
    param_id: string;
    send_msg: boolean | number;
    minValue: string;
    maxValue: string;
    device_id: string;
  };
  const [payload, setPayload] = useState<Payload>({
    user_id: "",
    param_id: "",
    send_msg: false,
    minValue: "",
    maxValue: "",
    device_id: "",
  });

  useEffect(() => {
    // console.log("Current payload", payload);
    getDeviceParameters(payload.device_id);
  }, [payload.device_id, payload.param_id]);
  useEffect(() => {
    // console.log("Current user", user);
    setUserData(user);
    if (user) {
      setPayload((payload) => ({
        ...payload,
        user_id: user!.user_id!.toString() || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    console.log("Current parameters", parameters);
  }, [parameters]);
  const invalidPayload = () => {
    setError(false);
    if (payload.param_id === "") {
      setError("Выберите параметр");
      return true;
    }
    if (payload.minValue === "") {
      setError("Введите минимальное значение");
      return true;
    }
    if (payload.maxValue === "") {
      setError("Введите максимальное значение");
      return true;
    }
    if (payload.device_id === "") {
      setError("Выберите устройство");
      return true;
    }
    if (Number(payload.minValue) > Number(payload.maxValue)) {
      setError("Минимальное значение не может быть больше максимального");
      return true;
    }

    return false;
  };
  useEffect(() => {
    invalidPayload();
  }, [payload]);

  const getDeviceParameters = async (device_id: string) => {
    //http:///localhost/pdn1/api/settings/?method=GET&id=n0G79nWmp6sm3ZYO&query=parameters
    const response = await axiosClient.get(
      `/api/settings/?method=GET&id=${device_id}&query=parameters`
    );
    if (response.status === 204) {
      setParameters([{}]);
    } else {
      console.log(response.data.data);
      setParameters(response.data.data);
    }
  };

  const handleSubmit = async () => {
    if (invalidPayload()) {
      console.log("Payload is invalid");
      return;
    } else {
      console.log("Payload is valid");
      if (payload.send_msg === true) {
        payload.send_msg = 1;
      } else {
        payload.send_msg = 0;
      }
      console.log(payload);
      const response = await axiosClient.get(
        `/api/settings/?method=POST&id=${payload.device_id}&query=parameters`,
        {
          params: payload,
        }
      );
      console.log(response);
    }
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
                    label="Идентификатор устройства"
                    onChange={(e) => {
                      setPayload((prev) => ({
                        ...prev,
                        device_id: e.target.value,
                      }));
                    }}
                  >
                    {devices!.map((device) => (
                      <SelectItem key={device.device_id}>
                        {device.deviceName}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <Select
                  label="Параметры"
                  description="Выберите сначала устройство, чтобы видеть список параметров"
                  onChange={(e) => {
                    setPayload((prev) => ({
                      ...prev,
                      param_id: e.target.value,
                    }));
                  }}
                >
                  {parameters!.map((parameter) => (
                    <SelectItem key={parameter.param_id}>
                      {parameter.parameter_name}
                    </SelectItem>
                  ))}
                </Select>
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
                    }}
                  />
                </div>

                <div className="mt-2 ">
                  <Switch
                    // isSelected={payload.send_msg === 1 ? true : false}
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
                <div className="text-red-500 text-sm">{error ? error : ""}</div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="success"
                  isDisabled={error ? true : false}
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
