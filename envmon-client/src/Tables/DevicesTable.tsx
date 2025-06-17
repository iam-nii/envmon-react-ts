import {
  Alert,
  Button,
  Chip,
  cn,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
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
import axiosClient from "../axiosClient";
import { useDeviceContext } from "../context/DeviceContextProvider";
import { useRoomContext } from "../context/RoomContextProvider";
import { DeleteIcon, EditIcon, EyeIcon } from "../Icons/Icons";

const COLUMNS = [
  { name: "ID устройства", uid: "device_id" },
  { name: "Название устройства", uid: "deviceName" },
  { name: "Номер зоны", uid: "zoneNum" },
  { name: "Интервал опроса, с", uid: "reqInterval" },
  { name: "Помещение", uid: "roomNumber" },
  { name: "Статус", uid: "status" },
  { name: "Действия", uid: "actions" },
];

function DevicesTable() {
  const { devices, setDevices } = useDeviceContext();
  const { rooms } = useRoomContext();
  const [selectedItem, setSelectedItem] = useState<device | null>(null);
  const [editDevice, setEditDevice] = useState<device | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   console.log(devices);
  // }, [devices]);

  // useEffect(() => {
  //   console.log(selectedItem);
  // }, [selectedItem]);

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
    console.log(device.room_id);
    const room = rooms?.find((room) => room.room_id == device.room_id);
    const roomNumber = room?.roomNumber;
    const location = room?.location;
    const status = device.status == 1 ? "активно" : "не активно";
    console.log(room);
    switch (columnKey) {
      case "device_id":
        return <p className="text-small">{device.device_id}</p>;
      case "deviceName":
        return <p className="text-small">{device.deviceName}</p>;
      case "zoneNum":
        return <p className="text-small">{device.zoneNum}</p>;
      case "reqInterval":
        return <p className="text-small">{device.reqInterval}</p>;
      case "roomNumber":
        return (
          <p className="text-small">
            {roomNumber} ({location})
          </p>
        );
      case "status":
        return (
          <Chip
            color={device.status == 1 ? "success" : "danger"}
            variant="flat"
          >
            {status}
          </Chip>
        );
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
                  setEditDevice({ ...device, old_device_id: device.device_id });
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
                  setSelectedItem(device);
                  onDeleteOpen();
                }}
              >
                <DeleteIcon />
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
          label="ID устройства"
          value={device.device_id ?? ""}
          disabled
        ></Input>
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
          label="Интервал опроса"
          value={device.reqInterval?.toString() ?? ""}
          disabled
        ></Input>
        <Input
          label="Помещения"
          value={
            rooms
              .find((room) => room.room_id === device.room_id)
              ?.roomNumber.toString() ?? ""
          }
          disabled
        ></Input>
        <Switch
          isDisabled={true}
          isSelected={Number(device.status) === 1}
        ></Switch>
      </>
    );
  };
  const editModalContent = (device: device) => {
    return (
      <>
        <Input
          label="Идентификатор устройства"
          variant="bordered"
          value={device.device_id ?? ""}
          onChange={(e) =>
            setEditDevice({ ...editDevice, device_id: e.target.value })
          }
          // isDisabled
        ></Input>
        <Input
          label="Название устройства"
          variant="bordered"
          value={device?.deviceName ?? ""}
          onChange={(e) =>
            setEditDevice({ ...editDevice, deviceName: e.target.value })
          }
        ></Input>
        <Input
          label="Номер зоны"
          variant="bordered"
          value={device?.zoneNum?.toString() ?? ""}
          type="number"
          onChange={(e) =>
            setEditDevice({ ...editDevice, zoneNum: parseInt(e.target.value) })
          }
        ></Input>
        <Input
          label="Интервал опроса, с"
          variant="bordered"
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
        <Select
          label="Помещение"
          placeholder="Выберите помещение"
          variant="bordered"
          onChange={(e) => {
            // console.log(e.target.value);
            setEditDevice({
              ...editDevice,
              room_id: parseInt(e.target.value),
            });
          }}
          // selectedKeys={editDevice?.room_id?.toString()}
          defaultSelectedKeys={[editDevice?.room_id?.toString() ?? ""]}
        >
          {rooms?.map((room) => (
            <SelectItem
              key={String(room.room_id)}
              // textValue={String(room.roomNumber)}
              textValue={`${room.roomNumber} (${room.location})`}
            >
              {room.roomNumber} ({room.location})
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
            setEditDevice({ ...editDevice, status: value });
          }}
          isSelected={Number(editDevice?.status) === 1}
        >
          <div className="flex flex-col gap-1">
            <p className="text-medium">
              {/* {Number(editDevice?.status) === 1 ? "Выключить" : " Включить"} */}
              Состояние
            </p>
            <p className="text-tiny text-default-400">
              {Number(editDevice?.status) === 1
                ? "Устройство включено"
                : "Устройство выключено"}
            </p>
          </div>
        </Switch>
      </>
    );
  };

  const deleteModalContent = (device: device) => {
    return (
      <>
        <Input
          label="ID устройства"
          value={device.device_id ?? ""}
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
    // console.log(editDevice);
    try {
      if (editDevice.status === true) {
        editDevice.status = 1;
      } else {
        editDevice.status = 0;
      }
      axiosClient
        .get(`/api/devices/?method=PATCH&id=${editDevice.old_device_id}`, {
          params: {
            device_id: editDevice.device_id,
            deviceName: editDevice.deviceName,
            zoneNum: editDevice.zoneNum,
            reqInterval: editDevice.reqInterval,
            room_id: editDevice.room_id,
            status: editDevice.status,
            old_device_id: editDevice.old_device_id,
          },
        })
        .then(({ data }) => {
          console.log(data);
          const index = devices.findIndex(
            (device) => device.device_id === editDevice.old_device_id
          );
          devices[index] = data.data;
          devices[index].device_id = editDevice.old_device_id;
          setDevices(devices);

          setSuccess(
            "Устройство успешно обновлено. Перезагрузите страницу чтобы обновить список устройств"
          );
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
        .get(`/api/devices/?method=DELETE&id=${selectedItem.device_id}`)
        .then(() => {
          // console.log(data);
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
