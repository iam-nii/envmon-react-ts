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
  SharedSelection,
} from "@heroui/react";
import { useUserContext } from "../../context/UserContextProvider";
import { useDeviceContext } from "../../context/DeviceContextProvider";
import { useEffect, useState } from "react";
import axiosClient from "../../axiosClient";
import { Parameters, User } from "../../Types";

function EditRegulations() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { user } = useUserContext();
  const { devices } = useDeviceContext();
  const [parameters, setParameters] = useState<Parameters | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [payload, setPayload] = useState({
    user_id: 0,
    param_id: 0,
    send_msg: false,
    minValue: "",
    maxValue: "",
    device_id: 0,
  });
  const [selectedParam, setSelectedParam] = useState<SharedSelection>(
    new Set([])
  );
  useEffect(() => {
    setUserData(user);
  }, [user]);
  //   useEffect(() => {
  //     axiosClient.get("/parameters").then(({ data }) => {
  //       setParameters(data);
  //     });
  //   }, []);
  //   const handleParamSelection = (keys: Selection) => {
  //     let selectedKeysArray: string[] = [];
  //     if (typeof keys === "string") {
  //       selectedKeysArray = [];
  //     } else {
  //       selectedKeysArray = Array.from(keys).map((key) => String(key));
  //     }
  //     const selectedParamID = parameters!.filter((param) =>
  //       selectedKeysArray.includes(String(param.param_id))
  //     );
  //     console.log(selectedParamID);
  //     setPayload((prev) => ({ ...prev, paramID: selectedParamID }));
  //     const selectedParam = parameters!.find(
  //       (param) => param.param_id === Number(selectedParamID)
  //     );
  //     if (selectedParam) {
  //       console.log(selectedParam);
  //       setPayload((prev) => ({
  //         ...prev,
  //         minValue: selectedParam.minValue.toString() || "",
  //         maxValue: selectedParam.maxValue.toString() || "",
  //       }));
  //     }
  //   };

  const handleSubmit = () => {
    setPayload((prev) => ({
      ...prev,
      user_id: userData!.user_id!,
    }));
    console.log(payload);
  };
  const getDeviceParams = () => {
    // Get the device params from the database given the device id through the tech regs
  };
  return (
    <div className="w-[70%] mx-auto flex flex-col gap-2">
      <Button onPress={onOpen} className="text-lg font-bold">
        Редактировать регламент
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onclose) => (
            <>
              <ModalHeader>Настройки регламента</ModalHeader>
              <ModalBody>
                <div>
                  <Input
                    label="ID пользователя"
                    variant="bordered"
                    isDisabled
                    value={userData!.user_id!.toString()}
                  />
                </div>
                <div>
                  <Select
                    label="Параметр"
                    selectedKeys={selectedParam}
                    variant="bordered"
                    onSelectionChange={setSelectedParam}
                  >
                    {parameters!.map((parameter) => (
                      <SelectItem
                        key={parameter.param_id}
                        // value={parameter.param_id.toString()}
                      >
                        {parameter.parameter_name}
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
                <div>
                  <Select
                    label="ID устройства"
                    onSelectionChange={(keys) => {
                      setPayload((prev) => ({
                        ...prev,
                        deviceID: Array.from(keys)[0].toString(),
                      }));
                      getDeviceParams();
                    }}
                  >
                    {devices!.map((device) => (
                      <SelectItem key={device.device_id}>
                        {device.deviceName}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div>
                  <Select
                    label="ID устройства"
                    onSelectionChange={(keys) => {
                      setPayload((prev) => ({
                        ...prev,
                        deviceID: Array.from(keys)[0],
                      }));
                    }}
                  >
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                  </Select>
                </div>
                <div>
                  <Switch
                    isSelected={payload.send_msg}
                    // value={payload.send_msg}
                    onValueChange={(value) => {
                      setPayload((prev) => ({
                        ...prev,
                        send_msg: value,
                      }));
                    }}
                  >
                    <p className="text-sm">Отправлять сообщение</p>
                  </Switch>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="success" onPress={handleSubmit}>
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

export default EditRegulations;
