import {
  Alert,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { useEffect, useState } from "react";
import ParamsTable from "../Tables/ParamsTable";
import axiosClient from "../axiosClient";
import { useParameterContext } from "../context/ParameterContextProvider";

interface AddParamType {
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
  setSelected: (selected: string) => void;

  error: string | null;
  success: string | null;
}

interface paramPayloadType {
  paramName: string;
  unitOfMeasurement: string;
  minValue: number | string;
  maxValue: number | string;
  parameter_alias: string;
}

function AddParam({ setError, setSuccess, error, success }: AddParamType) {
  const [paramPayload, setParamPayload] = useState<paramPayloadType>({
    paramName: "",
    unitOfMeasurement: "",
    minValue: "",
    maxValue: "",
    parameter_alias: "",
  });
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { parameters, setParameters } = useParameterContext();

  useEffect(() => {
    const minValue = Number(paramPayload.minValue);
    const maxValue = Number(paramPayload.maxValue);

    // Reset error and success states
    setError(null);
    setSuccess(null);

    // Calculate area only if height, width, and length are valid numbers
    if (!isNaN(minValue) && !isNaN(maxValue)) {
      setParamPayload((prev) => ({
        ...prev,
        minValue: minValue,
        maxValue: maxValue,
      }));
    }
  }, [paramPayload.minValue, paramPayload.maxValue]);

  const handleAddParam = () => {
    setError(null);
    // console.log("paramPayload", paramPayload);
    axiosClient
      .get(
        `/api/parameters/?method=POST&parameter_name=${paramPayload.paramName}
        &unitOfMeasure=${paramPayload.unitOfMeasurement}
        &pminValue=${paramPayload.minValue}
        &pmaxValue=${paramPayload.maxValue}
        &parameter_alias=${paramPayload.parameter_alias}`
      )
      .then(({ data }) => {
        // console.log(data);
        setParameters([...parameters, data.params]);
        setSuccess(data.message);
        setError(null);
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
        onClose();
      });
  };
  return (
    <div>
      <div className="flex justify-center items-center">
        <Button onPress={onOpen} color="primary" className="text-lg w-full">
          Добавить параметр
        </Button>
      </div>
      {success && (
        <Alert
          color={"success"}
          title={"Параметр добавлен"}
          description={success}
        />
      )}
      {error && (
        <Alert
          color={"danger"}
          title={"Ошибка добавления параметра"}
          description={error}
        />
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Добавить параметр</ModalHeader>
              <ModalBody>
                <Input
                  label="Наименование параметра"
                  variant="bordered"
                  type="text"
                  value={paramPayload.paramName}
                  onChange={(e) => {
                    setParamPayload((prev) => ({
                      ...prev,
                      paramName: e.target.value,
                    }));
                  }}
                />
                <Input
                  label="Краткое наименование"
                  variant="bordered"
                  description="Не более 5 символов"
                  maxLength={5}
                  value={paramPayload.parameter_alias}
                  onChange={(e) => {
                    setParamPayload((prev) => ({
                      ...prev,
                      parameter_alias: e.target.value,
                    }));
                  }}
                />
                <Input
                  label="Ед. измерения"
                  variant="bordered"
                  value={paramPayload.unitOfMeasurement}
                  onChange={(e) => {
                    setParamPayload((prev) => ({
                      ...prev,
                      unitOfMeasurement: e.target.value,
                    }));
                  }}
                />
                <Input
                  label="Минимальное значение"
                  variant="bordered"
                  value={paramPayload.minValue.toString()}
                  onChange={(e) => {
                    setParamPayload((prev) => ({
                      ...prev,
                      minValue: e.target.value,
                    }));
                  }}
                />
                <div className="flex flex-row gap-2">
                  <Input
                    label="Максимальное значение"
                    type="number"
                    variant="bordered"
                    value={paramPayload.maxValue.toString()}
                    onChange={(e) => {
                      setParamPayload((prev) => ({
                        ...prev,
                        maxValue: e.target.value,
                      }));
                    }}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="success" onPress={handleAddParam}>
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
      <ParamsTable isAdmin={true} />
    </div>
  );
}

export default AddParam;
