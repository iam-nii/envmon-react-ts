import {
  Alert,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { device } from "../Types";
import { useState } from "react";
import { EyeIcon, Pencil, Trash2 } from "lucide-react";
import axiosClient from "../axiosClient";
import { useDeviceContext } from "../context/DeviceContextProvider";

const COLUMNS = [
  { name: "ID устройства", uid: "device_id" },
  { name: "Название устройства", uid: "deviceName" },
  { name: "Номер зоны", uid: "zoneNum" },
  { name: "Интервал запроса, с", uid: "reqInterval" },
  { name: "ID помещения", uid: "room_id" },
  { name: "Действие", uid: "actions" },
];

function DevicesTable() {
  const { devices, setDevices } = useDeviceContext();
  const [selectedItem, setSelectedItem] = useState<device | null>(null);
  const [editDevice, setEditDevice] = useState<device | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onOpenChange: onViewOpenChange,
  } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
    onOpenChange: onEditOpenChange,
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();

  const renderCell = (
    device: device,
    columnKey: keyof device | "actions"
  ): React.ReactNode => {
    switch (columnKey) {
      case "device_id":
        return <p className="text-small">{device.device_id}</p>;
      case "deviceName":
        return <p className="text-small">{device.deviceName}</p>;
      case "zoneNum":
        return <p className="text-small">{device.zoneNum}</p>;
      case "reqInterval":
        return <p className="text-small">{device.reqInterval}</p>;
      case "room_id":
        return <p className="text-small">{device.room_id}</p>;
      case "actions":
        return (
          <div className="relative flex items-center gap-5 justify-end">
            <Tooltip content="Просмотр">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => {
                  setSelectedItem(device);
                  onViewOpen();
                }}
              >
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content="Редактировать">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => {
                  setSelectedItem(device);
                  setEditDevice(device);
                  onEditOpen();
                }}
              >
                <Pencil />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Удалить">
              <span
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => {
                  setSelectedItem(device);
                  onDeleteOpen();
                }}
              >
                <Trash2 />
              </span>
            </Tooltip>
          </div>
        );

      default:
        return null;
    }
  };

  const viewModalContent = (device: device) => {
    return (
      <>
        <Input
          label="Название устройства"
          value={device.deviceName ?? ""}
          disabled
        ></Input>
        <Input
          label="Номер зоны"
          value={device.zoneNum?.toString() ?? ""}
          disabled
        ></Input>
        <Input
          label="Интервал запроса"
          value={device.reqInterval?.toString() ?? ""}
          disabled
        ></Input>
        <Input
          label="ID помещения"
          value={device.room_id?.toString() ?? ""}
          disabled
        ></Input>
      </>
    );
  };
  const editModalContent = (device: device) => {
    return (
      <>
        <Input
          label="Название устройства"
          value={device?.deviceName ?? ""}
          onChange={(e) =>
            setEditDevice({ ...editDevice, deviceName: e.target.value })
          }
        ></Input>
        <Input
          label="Номер зоны"
          value={device?.zoneNum?.toString() ?? ""}
          type="number"
          onChange={(e) =>
            setEditDevice({ ...editDevice, zoneNum: parseInt(e.target.value) })
          }
        ></Input>
        <Input
          label="Интервал запроса, сек"
          value={device?.reqInterval?.toString() ?? ""}
          type="number"
          step={10}
          min={10}
          onChange={(e) =>
            setEditDevice({
              ...editDevice,
              reqInterval: parseInt(e.target.value),
            })
          }
        ></Input>
        <Input
          label="ID помещения"
          value={device?.room_id?.toString() ?? ""}
          onChange={(e) =>
            setEditDevice({ ...editDevice, room_id: parseInt(e.target.value) })
          }
        ></Input>
      </>
    );
  };

  const deleteModalContent = (device: device) => {
    return (
      <>
        <Input
          label="ID устройства"
          value={device.device_id?.toString() ?? ""}
          disabled
        ></Input>
        <Input
          label="Название устройства"
          value={device.deviceName ?? ""}
          disabled
        ></Input>

        <Alert color="warning">
          Вы действительно хотите удалить это устройство?
        </Alert>
      </>
    );
  };
  const handleEdit = async () => {
    if (!editDevice) return;
    console.log(editDevice);
    try {
      axiosClient
        .patch(`/api/devices/?id=${editDevice.device_id}`, {
          deviceName: editDevice.deviceName,
          zoneNum: editDevice.zoneNum,
          reqInterval: editDevice.reqInterval,
          room_id: editDevice.room_id,
        })
        .then(({ data }) => {
          console.log(data.data);
          const index = devices.findIndex(
            (device) => device.device_id === editDevice.device_id
          );
          devices[index] = data.data;
          setDevices(devices);
          setSuccess("Устройство успешно обновлено");
          setTimeout(() => setSuccess(null), 3000);
          onEditClose();
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : "Произошла ошибка");
          setTimeout(() => setError(null), 3000);
        });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
      setTimeout(() => setError(null), 3000);
    }
  };
  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      axiosClient
        .delete(`/api/devices/?id=${selectedItem.device_id}`)
        .then(({ data }) => {
          console.log(data);
          setDevices(
            devices.filter(
              (device) => device.device_id !== selectedItem.device_id
            )
          );
          setSuccess("Устройство успешно удалено");
          setTimeout(() => setSuccess(null), 3000);
          onDeleteClose();
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : "Произошла ошибка");
          setTimeout(() => setError(null), 3000);
        });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
      setTimeout(() => setError(null), 3000);
    }
  };
  return (
    <div className="w-full mx-auto my-5">
      {success && <Alert color="success">{success}</Alert>}
      {error && <Alert color="danger">{error}</Alert>}

      <Table aria-label="Data table">
        <TableHeader columns={COLUMNS}>
          {(column) => (
            <TableColumn
              key={column.uid as string}
              align={column.uid === "actions" ? "end" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={devices} emptyContent="Данные не найдены">
          {(item) => (
            <TableRow key={item.device_id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(item, columnKey as keyof device | "actions")}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* View Modal */}
      <Modal isOpen={isViewOpen} onOpenChange={onViewOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Просмотр</ModalHeader>
              <ModalBody>
                {selectedItem && viewModalContent(selectedItem)}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Закрыть
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Редактирование</ModalHeader>
              <ModalBody>
                {editDevice && (
                  <>
                    {editModalContent(editDevice)}
                    {error && <Alert color="danger">{error}</Alert>}
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="success" onPress={handleEdit}>
                  Сохранить
                </Button>
                <Button color="danger" onPress={onClose}>
                  Отмена
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Удалить</ModalHeader>
              <ModalBody>
                {selectedItem && <>{deleteModalContent(selectedItem)}</>}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={handleDelete}>
                  Удалить
                </Button>
                <Button color="primary" onPress={onClose}>
                  Отмена
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default DevicesTable;
