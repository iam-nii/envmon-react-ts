import {
  Alert,
  Button,
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
  useDisclosure,
} from "@heroui/react";
import { useEffect, useState } from "react";
import RegulationsTable from "../Tables/RegulationsTable";
import axiosClient from "../axiosClient";
import { useUserContext } from "../context/UserContextProvider";
// import { useDeviceContext } from "../context/DeviceContextProvider";
import { Params, Regulation, User } from "../Types";
import { useParameterContext } from "../context/ParameterContextProvider";
type AddRegulationProps = {
  device_id: string;
};
function AddRegulation({ device_id }: AddRegulationProps) {
  type Payload = {
    user_id: string;
    param_id: string | number;
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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { user } = useUserContext();
  // const { devices } = useDeviceContext();
  const { parameters: parameters_ } = useParameterContext();
  const [deviceId, setDeviceId] = useState<string>(device_id);

  const [userData, setUserData] = useState<User | null>(null);
  const [parameters, setParameters] = useState<Params[]>([{}]);
  const [paramNames, setParamNames] = useState<(string | undefined)[]>([]);
  const [error, setError] = useState<string | boolean>(false);
  const [success, setSuccess] = useState<string | boolean>(false);
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  // const [testParam, setTestParam] = useState<Selection>(new Set([]));

  //get all regulations
  useEffect(() => {
    setDeviceId(device_id);
    setPayload((prev) => ({ ...prev, device_id: device_id }));
  }, [device_id]);
  useEffect(() => {
    axiosClient
      .get(`/api/settings/?method=GET&id=${deviceId}&query=settings`)
      .then(({ data }) => {
        // console.log("Regulations", data.data);
        data.data.forEach((regulation: Regulation) => {
          const parameter = parameters_.find(
            (param) => param.param_id === regulation.param_id
          );
          regulation["parameter_name"] = parameter?.parameter_name?.trim();
          // regulation["param_id"] = parameter?.param_id;
          regulation.param_id = Number(regulation.param_id).toString();
          console.log(regulation);
        });
        console.log("Regulations", data.data);
        setRegulations(data.data);
      });
  }, []);

  useEffect(() => {
    // console.log("Parameters", parameters_);
    setParamNames(parameters_.map((param) => param.parameter_name?.trim()));
  }, [parameters_]);
  useEffect(() => {
    // console.log("Param names", paramNames);
    getDeviceParameters(deviceId);
  }, [paramNames, deviceId]);

  // useEffect(() => {
  //   // console.log("Current payload", payload);
  //   console.log("Current deviceId", deviceId);
  //   getDeviceParameters(deviceId);
  // }, [deviceId]);
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
  // useEffect(() => {
  //   setPayload((payload) => ({
  //     ...payload,
  //     device_id: deviceId,
  //   }));
  // }, [deviceId]);
  // useEffect(() => {
  //   // console.log(paramNames[parseInt(payload.param_id)]);
  //   console.log(payload.param_id);
  // }, [payload.param_id]);

  const getDeviceParameters = async (device_id: string) => {
    const response = await axiosClient.get(
      `/api/settings/?method=GET&id=${device_id}&query=parameters`
    );
    if (response.status === 204) {
      console.log("No content");
      const missingParams = [];
      for (let i = 0; i < paramNames.length; i++) {
        missingParams.push({ param_id: i, parameter_name: paramNames[i] });
      }
      // console.log("Missing params", missingParams);

      setParameters(missingParams);
    } else {
      // console.log(response.data.data);
      type recievedData = {
        param_id: number;
        parameter_name: string;
      };
      const deviceParams = response.data.data.map((devParam: recievedData) =>
        devParam.parameter_name?.trim()
      );

      // console.log("Device params:", deviceParams);
      // console.log("All Params", paramNames);

      // Filter deviceParameters to find those not in parameters_
      const missingParams = [];
      for (let i = 0; i < paramNames.length; i++) {
        if (deviceParams.includes(paramNames[i])) {
          continue;
        } else {
          missingParams.push({ param_id: i, parameter_name: paramNames[i] });
        }
      }
      // paramNames.forEach((param: string | undefined) => {
      //   if (deviceParams.includes(param)) {
      //     console.log(param);
      //   } else {
      //     missingParams.push(param!);
      //   }
      // });
      console.log("Missing params", missingParams);

      setParameters(missingParams);
    }
  };
  // useEffect(() => {
  //   // const paramsSet = new Set(parameters_);
  //   // console.log(paramsSet);
  //   console.log(payload.param_id);
  // }, [payload.param_id]);

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
  // useEffect(() => {
  //   invalidPayload();
  // }, [payload]);

  const handleSubmit = () => {
    if (invalidPayload()) {
      // console.log("Payload is invalid");
      return;
    } else {
      // console.log("Payload is valid");
      if (payload.send_msg === true) {
        payload.send_msg = 1;
      } else {
        payload.send_msg = 0;
      }
      // console.log(payload);
      axiosClient
        .get(
          `/api/settings/?method=POST&id=${payload.device_id}&query=parameters`,
          {
            params: payload,
          }
        )
        .then(({ data }) => {
          console.log("Regulation added", data);
          const data_param = parameters_.find(
            (param) => param.param_id === data.data.param_id
          );
          data.data.parameter_name = data_param?.parameter_name;
          data.data.techReg_id = data.data.techreg_id;
          setRegulations((prev) => [...prev, data.data]);

          setSuccess("Регламент добавлен");
          setError(false);
          setTimeout(() => {
            setSuccess(false);
          }, 3000);
          // console.log(response);
        })
        .catch((error) => {
          setError("Ошибка добавления регламента");
          console.error(error);
          setTimeout(() => {
            setError(false);
          }, 3000);
        });
    }
  };
  return (
    <div>
      <div className="flex justify-center items-center ">
        <Button onPress={onOpen} color="primary" className="text-lg w-[95%]">
          Добавить регламент
        </Button>
      </div>
      {success && (
        <Alert
          color={"success"}
          title={"Регламент добавлен"}
          description={success}
        />
      )}
      {error && (
        <Alert
          color={"danger"}
          title={"Ошибка добавления регламента"}
          description={error}
        />
      )}

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
                  <Input
                    label="Идентификатор устройства"
                    value={deviceId}
                    isDisabled
                    variant="bordered"
                  />
                  {/* <Select
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
                  </Select> */}
                </div>
                <Select
                  label="Параметры"
                  description={
                    parameters.length === 0
                      ? "Существуют регламенты для всех параметров выбранного устройства"
                      : "Выберите сначала устройство, чтобы видеть список параметров"
                  }
                  onChange={(e) => {
                    setPayload((prev) => ({
                      ...prev,
                      param_id: parseInt(e.target.value) + 1,
                    }));
                  }}
                  // onSelectionChange={setTestParam}
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
      <RegulationsTable
        isAdmin={true}
        setRegulations={setRegulations}
        regulations={regulations}
      />
    </div>
  );
}

export default AddRegulation;
