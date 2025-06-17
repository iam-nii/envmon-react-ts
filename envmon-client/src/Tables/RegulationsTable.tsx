import React, { Dispatch, SetStateAction, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  useDisclosure,
  ModalContent,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Alert,
  Selection,
  Switch,
} from "@heroui/react";
import { DeleteIcon, EditIcon, EyeIcon } from "../Icons/Icons";
import { useState } from "react";
import axiosClient from "../axiosClient";
import { Regulation } from "../Types";
import { useDeviceContext } from "../context/DeviceContextProvider";
import { useParameterContext } from "../context/ParameterContextProvider";

const COLUMNS = [
  { name: "ID", uid: "techReg_id" },
  { name: "Параметр", uid: "parameter_name" },
  { name: "Мин. значение", uid: "minValue" },
  { name: "Макс. значение", uid: "maxValue" },
  { name: "Отправить сообщение", uid: "sendMsg" },
  // { name: "Идентификатор устройства", uid: "device_id" },
  { name: "Действия", uid: "actions" },
];
// import { Selection } from "@react-types/shared";

type RegulationPropsType = {
  isAdmin: boolean;
  setRegulations: Dispatch<SetStateAction<Regulation[]>>;
  regulations: Regulation[];
};

function RegulationTable({
  isAdmin,
  regulations,
  setRegulations,
}: RegulationPropsType) {
  // const { devices } = useDeviceContext();
  const [error, setError] = useState<string | boolean | null>(null);
  const [selectedRegulation, setSelectedRegulation] =
    useState<Regulation | null>(null);
  const [editedRegulation, setEditedRegulation] = useState<Regulation | null>({
    sendMsg: false,
  });
  const { devices } = useDeviceContext();
  const { parameters } = useParameterContext();
  const [success, setSuccess] = useState<string | boolean | null>(null);
  const [selectedDeviceValues, setSelectedDeviceValues] = useState<Selection>(
    new Set([])
  );
  useEffect(() => {
    console.log(devices);
  }, [devices]);
  useEffect(() => {
    if (selectedRegulation) {
      setSelectedDeviceValues(
        new Set([selectedRegulation.device_id!.toString()])
      );
    }
    console.log(selectedRegulation);
  }, [selectedRegulation]);

  // View Modal
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onOpenChange: onViewOpenChange,
  } = useDisclosure();

  // Edit Modal
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onOpenChange: onEditOpenChange,
    onClose: onEditClose,
  } = useDisclosure();

  // Delete Modal
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
    onClose: onDeleteClose,
  } = useDisclosure();

  const renderCell = React.useCallback(
    (
      regulation: Regulation,
      columnKey: keyof Regulation | "actions"
    ): React.ReactNode => {
      const cellValue = regulation[columnKey as keyof Regulation];
      switch (columnKey) {
        case "techReg_id":
          return (
            <p className="font-bold text-small">{regulation.techReg_id}</p>
          );
        case "parameter_name":
          return (
            <p className="text-small">
              {
                parameters?.find((p) => p.param_id === regulation.param_id)
                  ?.parameter_name
              }
              ,{" "}
              {
                parameters?.find((p) => p.param_id === regulation.param_id)
                  ?.unitOfMeasure
              }
            </p>
          );
        case "sendMsg":
          return (
            <p className="text-small">
              {regulation.sendMsg == 1 ? "вкл." : "выкл."}
            </p>
          );
        case "maxValue":
          return <p className="text-small">{regulation.maxValue}</p>;
        case "minValue":
          return <p className="text-small">{regulation.minValue}</p>;
        case "actions":
          return (
            <div className="relative flex items-center gap-5 justify-end">
              <Tooltip content="Просмотр">
                <span
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                  onClick={() => {
                    setSelectedRegulation(regulation);
                    onViewOpen();
                  }}
                >
                  <EyeIcon />
                </span>
              </Tooltip>
              {isAdmin && (
                <>
                  <Tooltip content="Редактировать">
                    <span
                      className="text-lg text-default-400 cursor-pointer active:opacity-50"
                      onClick={() => {
                        setSelectedRegulation(regulation);
                        setEditedRegulation(regulation);
                        onEditOpen();
                      }}
                    >
                      <EditIcon />
                    </span>
                  </Tooltip>
                  <Tooltip color="danger" content="Удалить">
                    <span
                      className="text-lg text-danger cursor-pointer active:opacity-50"
                      onClick={() => {
                        setSelectedRegulation(regulation);
                        onDeleteOpen();
                      }}
                    >
                      <DeleteIcon />
                    </span>
                  </Tooltip>
                </>
              )}
            </div>
          );

        default:
          return <p className="text-small">{String(cellValue)}</p>;
      }
    },
    [regulations, parameters]
  );

  useEffect(() => {
    console.log(editedRegulation?.sendMsg);
  }, [editedRegulation?.sendMsg]);

  const handleEditRegulations = () => {
    setEditedRegulation({
      ...editedRegulation,
      device_id: selectedDeviceValues.toString(),
    });

    let sendMsg;
    if (editedRegulation?.sendMsg === true) sendMsg = 1;
    else sendMsg = 0;

    console.log("Edited Regulation:", editedRegulation);
    axiosClient
      .get(
        `/api/settings/?method=PATCH&techReg_id=${
          editedRegulation!.techReg_id
        }&param_id=${editedRegulation!.param_id?.toString().trim()}
        &minValue=${editedRegulation!.minValue}&maxValue=${
          editedRegulation!.maxValue
        }&device_id=${editedRegulation!.device_id}
        &sendMsg=${sendMsg}`
      )
      .then(({ data }) => {
        // log the response
        console.log(data);
        //update only the edited room
        const index = regulations!.findIndex(
          (reg) => reg.techReg_id === editedRegulation!.techReg_id
        );
        data.data["parameter_name"] = editedRegulation?.parameter_name;
        data.data["param_id"] = editedRegulation?.param_id;
        regulations![index] = data.data;
        setRegulations(regulations!);
        //show success alert for 3 seconds
        setSuccess("Параметр успешно обновлен");
        setError(null);
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
        onEditClose();
      })
      .catch((error) => {
        console.log(error);
        const errorError = error.response.data.error;
        if (errorError.includes("Duplicate entry")) {
          const duplicateRoomNumber = errorError.match(/'([^']+)'/)[1];
          setError(`Параметр ${duplicateRoomNumber} уже существует.`);

          //show error alert for 3 seconds
          setError(true);
          setSuccess(null);
          setTimeout(() => {
            setError(null);
          }, 3000);
        } else {
          setError("Ошибка при обновлении параметра");

          //show error alert for 3 seconds
          setError(true);
          setSuccess(null);
          setTimeout(() => {
            setError(null);
          }, 3000);
        }
      });
  };

  const handleDeleteRegulation = () => {
    console.log(selectedRegulation);
    axiosClient
      .get(`/api/settings/?method=DELETE&id=${selectedRegulation!.techReg_id}`)
      .then(({ data }) => {
        console.log(data);

        setRegulations(
          regulations!.filter(
            (reg) => reg.techReg_id !== selectedRegulation!.techReg_id
          )
        );
        setSuccess(true);
        setTimeout(() => {
          setSuccess(null);
          onDeleteClose();
        }, 3000);
      })
      .catch((error) => {
        console.log(error);
        setError(true);
        setTimeout(() => {
          setError(null);
        }, 3000);
      });
  };
  return (
    <div className="w-full items-center  mt-5">
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

      <Table
        aria-label="Справочник регламентов"
        selectionMode="single"
        className=" self-center"
        // onSelectionChange={handleSelectionChange}
      >
        <TableHeader columns={COLUMNS}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "end" : "start"}
              // className="text-center"
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          // items={rooms!.sort((a, b) => a.roomNumber - b.roomNumber)}
          items={regulations}
          emptyContent={"Справочник регламентов пустой"}
          // className="text-center"
        >
          {(item) => (
            <TableRow key={item.techReg_id || item.techreg_id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(item, columnKey as keyof Regulation)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Modal for viewing regulation */}
      <Modal isOpen={isViewOpen} onOpenChange={onViewOpenChange}>
        <ModalContent>
          {(onViewClose) => (
            <>
              <ModalHeader>
                <h1>Просмотр параметра</h1>
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Идентификатор регламента"
                  value={selectedRegulation!.techReg_id!.toString()}
                  disabled
                />
                <Input
                  label="Параметр"
                  value={selectedRegulation!.parameter_name}
                  disabled
                />
                <Input
                  label="Минимальное значение"
                  value={selectedRegulation!.minValue!.toString()}
                  disabled
                />
                <Input
                  label="Максимальное значение"
                  value={selectedRegulation!.maxValue!.toString()}
                  disabled
                />
                <Input
                  label="Идентификатор устройства"
                  value={selectedRegulation!.device_id!.toString()}
                  disabled
                />
                <Switch
                  disabled
                  isSelected={selectedRegulation?.sendMsg === 1 ? true : false}
                >
                  <p className="text-sm">Отправить сообщение</p>
                </Switch>
              </ModalBody>
              <ModalFooter>
                <Button onPress={onViewClose} color="success">
                  Закрыть
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal for editing regulation */}
      <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange}>
        <ModalContent>
          {(onEditClose) => (
            <>
              <ModalHeader>
                <h1>Редактировать регламент</h1>
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Идентификатор регламента"
                  disabled
                  value={editedRegulation?.techReg_id?.toString()}
                  onChange={(e) =>
                    setEditedRegulation({
                      ...editedRegulation,
                      techReg_id: parseInt(e.target.value),
                    })
                  }
                />
                <div>
                  <Input
                    label={"Идентификатор устройства"}
                    variant="bordered"
                    disabled
                    value={selectedRegulation?.device_id}
                    onChange={(e) => {
                      setEditedRegulation({
                        ...editedRegulation,
                        device_id: e.target.value,
                      });
                    }}
                  />
                </div>

                <Input
                  label="Параметр"
                  value={editedRegulation!.parameter_name}
                  disabled
                />
                <div className="flex flex-row gap-2">
                  <Input
                    label="Максимальное значение"
                    value={editedRegulation!.maxValue!.toString()}
                    type="number"
                    onChange={(e) => {
                      const maxValue = parseFloat(e.target.value) || 0;
                      setEditedRegulation((prev) => {
                        const newState = {
                          ...prev,
                          maxValue: maxValue,
                        };
                        return newState;
                      });
                    }}
                  />
                </div>
                <div className="flex flex-row gap-2">
                  <Input
                    label="Минимальное значение"
                    value={editedRegulation!.minValue!.toString()}
                    type="number"
                    onChange={(e) => {
                      const minValue = parseFloat(e.target.value) || 0;
                      setEditedRegulation((prev) => {
                        const newState = {
                          ...prev,
                          minValue: minValue,
                        };
                        return newState;
                      });
                    }}
                  />
                </div>
                <Switch
                  // disabled
                  // isSelected={editedRegulation!.sendMsg! === 1 ? true : false}
                  isSelected={editedRegulation?.sendMsg == 1 ? true : false}
                  onValueChange={(value) => {
                    setEditedRegulation((prev) => ({
                      ...prev,
                      sendMsg: value,
                    }));
                  }}
                >
                  <p className="text-sm">Отправить сообщение</p>
                </Switch>
              </ModalBody>
              <ModalFooter>
                <Button onPress={handleEditRegulations} color="primary">
                  Сохранить
                </Button>
                <Button onPress={onEditClose} color="danger">
                  Закрыть
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal for deleting regulation */}
      <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange}>
        <ModalContent>
          {(onDeleteClose) => (
            <>
              <ModalHeader>
                <h1>Удалить параметр</h1>
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Идентификатор регламента"
                  value={selectedRegulation!.techReg_id!.toString()}
                  disabled
                />
                <Input
                  label="Параметр"
                  value={selectedRegulation!.parameter_name}
                  disabled
                />
                <Input
                  label="Минимальное значение"
                  value={selectedRegulation!.minValue!.toString()}
                  disabled
                />
                <Input
                  label="Максимальное значение"
                  value={selectedRegulation!.maxValue!.toString()}
                  disabled
                />
                {success && (
                  <Alert color="success">Параметр успешно удален</Alert>
                )}
                {error && (
                  <Alert color="danger">Ошибка при удалении параметра</Alert>
                )}
                <Alert color="warning">
                  Вы действительно хотите удалите этот параметр?
                </Alert>
              </ModalBody>
              <ModalFooter>
                <Button onPress={handleDeleteRegulation} color="danger">
                  Удалить
                </Button>
                <Button onPress={onDeleteClose} color="primary">
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

export default RegulationTable;
