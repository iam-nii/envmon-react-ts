import React, { useEffect } from "react";
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
} from "@heroui/react";
import { DeleteIcon, EditIcon, EyeIcon } from "../Icons/Icons";
import { useState } from "react";
import axiosClient from "../axiosClient";
import { useParameterContext } from "../context/ParameterContextProvider";
import { Params } from "../Types";
const COLUMNS = [
  { name: "Наименование параметра", uid: "parameter_name" },
  { name: "Ед. измерения", uid: "unitOfMeasure" },
  { name: "Мин. значение", uid: "pminValue" },
  { name: "Макс. значение", uid: "pmaxValue" },
  { name: "Действия", uid: "actions" },
];
// import { Selection } from "@react-types/shared";

type ParamsPropsType = {
  isAdmin: boolean;
};

function ParamsTable({ isAdmin }: ParamsPropsType) {
  const { parameters, setParameters } = useParameterContext();
  const [error, setError] = useState<string | boolean | null>(null);
  const [selectedParam, setSelectedParam] = useState<Params | null>(null);
  const [editedParam, setEditedParam] = useState<Params | null>(null);
  const [success, setSuccess] = useState<string | boolean | null>(null);

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

  useEffect(() => {
    console.log("editedParam", editedParam);
  }, [editedParam]);

  useEffect(() => {
    console.log("selectedParam", selectedParam);
  }, [selectedParam]);

  const renderCell = React.useCallback(
    (param: Params, columnKey: keyof Params | "actions"): React.ReactNode => {
      const cellValue = param[columnKey as keyof Params];
      console.log(param.parameter_name);
      switch (columnKey) {
        case "parameter_name":
          return (
            <p className="font-bold text-small ">
              {/* capitalize only the first letter of the parameter name */}
              {param.parameter_name?.trim()}
            </p>
          );
        case "unitOfMeasure":
          return (
            <p className="text-small text-center">{param.unitOfMeasure}</p>
          );
        case "pmaxValue":
          return <p className="text-small text-center">{param.pmaxValue}</p>;
        case "pminValue":
          return <p className="text-small text-center">{param.pminValue}</p>;
        case "actions":
          return (
            <div className="relative flex items-center gap-5 justify-end">
              <Tooltip content="Просмотр">
                <span
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                  onClick={() => {
                    setSelectedParam(param);
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
                        setSelectedParam(param);
                        setEditedParam(param);
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
                        setSelectedParam(param);
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
    []
  );
  //   const handleSelectionChange = (keys: Selection) => {
  //     // setFreeDevices(devices!.filter((device) => device.room_id === null));

  //     // Convert Selection to string array safely
  //     let selectedKeysArray: string[] = [];

  //     if (typeof keys === "string") {
  //       // Handle "all" case (unlikely with selectionMode="single")
  //       selectedKeysArray = [];
  //     } else {
  //       // First convert to array of unknown, then to string
  //       selectedKeysArray = Array.from(keys).map((key) => String(key));
  //     }

  //     // Find the selected row(s)
  //     const selectedRows = parameters!.filter((param) =>
  //       selectedKeysArray.includes(String(param.param_id))
  //     );
  //     const selectedParam = selectedRows[0];

  //     setEditedParam(selectedParam);
  //   };

  useEffect(() => {
    console.log(parameters);
  }, [parameters]);

  const handleEditParam = () => {
    console.log(editedParam);

    console.log("Edited Param:", editedParam);
    axiosClient
      .get(
        `/api/parameters/?method=PATCH&id=${
          editedParam!.param_id
        }&parameter_name=${editedParam!.parameter_name}
        &unitOfMeasure=${editedParam!.unitOfMeasure}&pminValue=${
          editedParam!.pminValue
        }&pmaxValue=${editedParam!.pmaxValue}`
      )
      .then(({ data }) => {
        // log the response
        console.log(data);
        //update only the edited room
        const index = parameters!.findIndex(
          (param) => param.param_id === editedParam!.param_id
        );
        parameters![index] = data.data;
        setParameters(parameters!);
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

  const handleDeleteParam = () => {
    console.log(selectedParam);
    axiosClient
      .get(`/api/parameters/?method=DELETE&id=${selectedParam!.param_id}`)
      .then(({ data }) => {
        console.log(data);

        setParameters(
          parameters!.filter(
            (param) => param.param_id !== selectedParam!.param_id
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
    <div className="-auto mt-5">
      {success && <Alert color="success">{success}</Alert>}
      {error && <Alert color="danger">{error}</Alert>}
      <Table
        aria-label="Справочник параметров"
        selectionMode="single"
        // onSelectionChange={handleSelectionChange}
      >
        <TableHeader columns={COLUMNS}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "end" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          // items={rooms!.sort((a, b) => a.roomNumber - b.roomNumber)}
          items={parameters}
          emptyContent={"Справочник параметров пустой"}
        >
          {(item) => (
            <TableRow key={item.param_id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(item, columnKey as keyof Params)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Modal for viewing room */}
      <Modal isOpen={isViewOpen} onOpenChange={onViewOpenChange}>
        <ModalContent>
          {(onViewClose) => (
            <>
              <ModalHeader>
                <h1>Просмотр параметра</h1>
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Наименование параметра"
                  value={selectedParam!.parameter_name}
                  disabled
                />
                <Input
                  label="Ед. измерения"
                  value={selectedParam!.unitOfMeasure}
                  disabled
                />
                <Input
                  label="Минимальное значение"
                  value={selectedParam!.pminValue!.toString()}
                  disabled
                />
                <Input
                  label="Максимальное значение"
                  value={selectedParam!.pmaxValue!.toString()}
                  disabled
                />
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

      {/* Modal for editing room */}
      <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange}>
        <ModalContent>
          {(onEditClose) => (
            <>
              <ModalHeader>
                <h1>Редактировать параметр</h1>
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Наименование параметра"
                  value={editedParam!.parameter_name}
                  onChange={(e) =>
                    setEditedParam({
                      ...editedParam,
                      parameter_name: e.target.value,
                    })
                  }
                />

                <Input
                  label="Ед. измерения"
                  value={editedParam!.unitOfMeasure}
                  onChange={(e) =>
                    setEditedParam({
                      ...editedParam,
                      unitOfMeasure: e.target.value,
                    })
                  }
                />
                <div className="flex flex-row gap-2">
                  <Input
                    label="Минимальное значение"
                    value={editedParam!.pminValue!.toString()}
                    type="number"
                    onChange={(e) => {
                      const minValue = parseFloat(e.target.value) || 0;
                      setEditedParam((prev) => {
                        const newState = {
                          ...prev,
                          pminValue: minValue,
                        };
                        return newState;
                      });
                    }}
                  />
                </div>
                <div className="flex flex-row gap-2">
                  <Input
                    label="Максимальное значение"
                    value={editedParam!.pmaxValue!.toString()}
                    type="number"
                    onChange={(e) => {
                      const maxValue = parseFloat(e.target.value) || 0;
                      setEditedParam((prev) => {
                        const newState = {
                          ...prev,
                          pmaxValue: maxValue,
                        };
                        return newState;
                      });
                    }}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button onPress={handleEditParam} color="primary">
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

      {/* Modal for deleting room */}
      <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange}>
        <ModalContent>
          {(onDeleteClose) => (
            <>
              <ModalHeader>
                <h1>Удалить параметр</h1>
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Наименование параметра"
                  value={selectedParam!.parameter_name}
                  disabled
                />
                <Input
                  label="Ед. измерения"
                  value={selectedParam!.unitOfMeasure}
                  disabled
                />
                <Input
                  label="Минимальное значение"
                  value={selectedParam!.pminValue!.toString()}
                  disabled
                />
                <Input
                  label="Максимальное значение"
                  value={selectedParam!.pmaxValue!.toString()}
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
                <Button onPress={handleDeleteParam} color="danger">
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

export default ParamsTable;
