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
import { useState } from "react";
import RegulationsTable from "../Tables/RegulationsTable";
import axiosClient from "../axiosClient";
import { useParameterContext } from "../context/ParameterContextProvider";

interface AddRegulationType {
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
  setSelected: (selected: string) => void;
  // isLoading: boolean;
  error: string | null;
  success: string | null;
}

interface regulationPayloadType {
  techReg_id: number;
  parameter_name: string;
  minValue: number | string;
  maxValue: number | string;
  device_id: number | string;
}

function AddRegulation({
  setError,
  setSuccess,
  error,
  success,
}: AddRegulationType) {
  const [regulationPayload, setRegulationPayload] =
    useState<regulationPayloadType>({
      techReg_id: 0,
      parameter_name: "",
      minValue: "",
      maxValue: "",
      device_id: "",
    });
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { parameters, setParameters } = useParameterContext();

  // useEffect(() => {
  //   const minValue = Number(regulationPayload.minValue);
  //   const maxValue = Number(regulationPayload.maxValue);

  //   // Reset error and success states
  //   setError(null);
  //   setSuccess(null);

  //   // Calculate area only if height, width, and length are valid numbers
  //   if (!isNaN(minValue) && !isNaN(maxValue)) {
  //     setRegulationPayload((prev) => ({
  //       ...prev,
  //       minValue: minValue,
  //       maxValue: maxValue,
  //     }));
  //   }
  // }, [paramPayload.minValue, paramPayload.maxValue]);

  const handleAddRegulation = () => {
    setError(null);
    console.log("Regulation payload", regulationPayload);
    axiosClient
      .get(
        `/api/settings/?method=POST&parameter_name=${regulationPayload.parameter_name}&minValue=${regulationPayload.minValue}&maxValue=${regulationPayload.maxValue}&device_id=${regulationPayload.device_id}`
      )
      .then(({ data }) => {
        console.log(data);
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
                  label="Идентификатор регламента"
                  variant="bordered"
                  type="text"
                  value={regulationPayload.techReg_id.toString()}
                  onChange={(e) => {
                    setRegulationPayload((prev) => ({
                      ...prev,
                      techReg_id: parseInt(e.target.value),
                    }));
                  }}
                />
                <Input
                  label="Наименование параметра"
                  variant="bordered"
                  value={regulationPayload.parameter_name}
                  onChange={(e) => {
                    setRegulationPayload((prev) => ({
                      ...prev,
                      parameter_name: e.target.value,
                    }));
                  }}
                />
                <Input
                  label="Минимальное значение"
                  variant="bordered"
                  value={regulationPayload.minValue.toString()}
                  onChange={(e) => {
                    setRegulationPayload((prev) => ({
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
                    value={regulationPayload.maxValue.toString()}
                    onChange={(e) => {
                      setRegulationPayload((prev) => ({
                        ...prev,
                        maxValue: e.target.value,
                      }));
                    }}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="success" onPress={handleAddRegulation}>
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
      <RegulationsTable isAdmin={true} />
    </div>
  );
}

export default AddRegulation;
