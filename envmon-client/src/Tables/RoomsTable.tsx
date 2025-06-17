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
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";
import { DeleteIcon, EditIcon, EyeIcon } from "../Icons/Icons";
import { useState } from "react";
import axiosClient from "../axiosClient";
import { useUserContext } from "../context/UserContextProvider";
import { useRoomContext } from "../context/RoomContextProvider";
import { useDeviceContext } from "../context/DeviceContextProvider";
// import { useNavigate } from "react-router-dom";
import { Room } from "../Types";
const COLUMNS = [
  { name: "Номер помещения", uid: "roomNumber" },
  { name: "ФИО ответственного", uid: "frPerson" },
  { name: "Местоположение", uid: "location" },
  {
    name: (
      <>
        Площадь, м<sup>2</sup>
      </>
    ),
    uid: "area",
  },
  { name: "Длина, м", uid: "length" },
  { name: "Ширина, м", uid: "width" },
  { name: "Высота, м", uid: "height" },
  { name: "Действия", uid: "actions" },
];
import { Selection } from "@react-types/shared";

type RoomPropsType = {
  isAdmin: boolean;
};

function RoomsTable({ isAdmin }: RoomPropsType) {
  // const navigate = useNavigate();
  const { users } = useUserContext();
  const { rooms, setRooms } = useRoomContext();
  const { devices, setDevices } = useDeviceContext();
  const [devicesString, setDevicesString] = useState("");
  const [error, setError] = useState<string | boolean | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [success, setSuccess] = useState<string | boolean | null>(null);

  // View Modal
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onOpenChange: onViewOpenChange,
    // onClose: onViewClose,
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

  const [editedRoom, setEditedRoom] = useState<Room>({
    roomNumber: 0,
    frPerson: "",
    location: "",
    room_id: 0,
    length: 0,
    width: 0,
    height: 0,
    area: 0,
  });

  useEffect(() => {
    console.log("editedRoom", editedRoom);
  }, [editedRoom]);
  // const [devicePayload, setDevicePayload] = useState<device>({
  //   device_id: 0,
  //   deviceName: null,
  // });
  // const [devicesString, setDevicesString] = useState("");

  // useEffect(() => {
  //   setFreeDevices(devices!.filter((device) => device.room_id === null));
  //   console.log("freeDevices", freeDevices);

  //   const usedDevices = devices!.filter((device) => device.room_id);
  //   console.log("usedDevices", usedDevices);

  //   const roomsWithDevicesIds = new Set(
  //     usedDevices
  //       .map((device) => device.room_id)
  //       .filter((room_id): room_id is number => room_id !== undefined) //filter out undefined room_ids
  //   );
  //   setRoomsWithDevices(roomsWithDevicesIds);
  // }, [devices, rooms]);

  //console log devicePayload when a device is selected
  // useEffect(() => {
  //   console.log(devicePayload);
  // }, [devicePayload]);

  const renderCell = React.useCallback(
    (room: Room, columnKey: keyof Room | "actions"): React.ReactNode => {
      const cellValue = room[columnKey as keyof Room];
      switch (columnKey) {
        case "roomNumber":
          return (
            <p className="font-bold text-small capitalize">{room.roomNumber}</p>
          );
        case "frPerson":
          return <p className="text-small">{room.frPerson}</p>;
        case "location":
          return <p className="text-small">{room.location}</p>;
        case "length":
          return <p className="text-small">{room.length}</p>;
        case "width":
          return <p className="text-small">{room.width}</p>;
        case "height":
          return <p className="text-small">{room.height}</p>;
        case "area":
          return <p className="text-small">{room.area}</p>;
        case "actions":
          return (
            <div className="relative flex items-center gap-5 justify-end">
              <Tooltip content="Просмотр">
                <span
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                  onClick={() => {
                    setSelectedRoom(room);
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
                        setSelectedRoom(room);
                        setEditedRoom({
                          roomNumber: room.roomNumber,
                          frPerson: room.frPerson,
                          location: room.location,
                          room_id: room.room_id,
                          length: room.length || 0,
                          width: room.width || 0,
                          height: room.height || 0,
                          area: room.area || 0,
                        });
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
                        setSelectedRoom(room);
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
  const handleSelectionChange = (keys: Selection) => {
    // setFreeDevices(devices!.filter((device) => device.room_id === null));

    // Convert Selection to string array safely
    let selectedKeysArray: string[] = [];

    if (typeof keys === "string") {
      // Handle "all" case (unlikely with selectionMode="single")
      selectedKeysArray = [];
    } else {
      // First convert to array of unknown, then to string
      selectedKeysArray = Array.from(keys).map((key) => String(key));
    }

    // Find the selected row(s)
    const selectedRows = rooms!.filter((room) =>
      selectedKeysArray.includes(String(room.room_id))
    );

    const NO_DEVICES_MESSAGE = "Нет устройств";
    if (selectedRows.length > 0) {
      const selectedRoom = selectedRows[0];

      // find devices associated with the selected room
      const selectedRoomDevices_array = devices!.filter(
        (device) => device.room_id === selectedRoom.room_id
      );

      // Create an array of device IDs
      // const roomDevices_Ids = new Set<number | null>(
      //   selectedRoomDevices_array.map(
      //     (device) => device.device_id ?? null //Extract device IDs
      //   )
      // );
      // setRoomDevices_IDs(roomDevices_Ids);
      // setSelectedRoomDevices(roomDevices_Ids as Set<number>);
      // console.log(roomDevices_Ids);

      let deviceString;
      if (selectedRoomDevices_array.length > 0) {
        const deviceNames = selectedRoomDevices_array.map(
          (device) => device.deviceName
        );
        deviceString = deviceNames.join(", ");
      } else {
        deviceString = NO_DEVICES_MESSAGE;
      }
      console.log(deviceString);
      setDevicesString(deviceString);
      setEditedRoom(selectedRoom);
      // setFreeDevices((prev) => [
      //   ...prev,
      //   ...devices!.filter((device) =>
      //     selectedRoomDevices.has(device.device_id!)
      //   ),
      // ]);
    } else {
      setDevicesString(NO_DEVICES_MESSAGE); //clear the devicesString
      // setSelectedRoomDevices(new Set());
      setEditedRoom({
        roomNumber: 0,
        frPerson: "",
        location: "",
        room_id: 0,
        length: 0,
        width: 0,
        height: 0,
        area: 0,
      });
    }
  };

  useEffect(() => {
    console.log(devices);
  }, [devices]);

  const handleEditRoom = () => {
    // console.log(devicePayload);
    setEditedRoom({
      ...editedRoom,
      area: editedRoom.height * editedRoom.width * editedRoom.length,
    });
    console.log("Edited Room:", editedRoom);
    axiosClient
      .get(
        `/api/rooms/?method=PATCH&id=${editedRoom.room_id}&roomNumber=${editedRoom.roomNumber}
        &frPerson=${editedRoom.frPerson}&location=${editedRoom.location}&length=${editedRoom.length}
        &width=${editedRoom.width}&height=${editedRoom.height}&area=${editedRoom.area}`
      )
      .then((response) => {
        // log the response

        //update only the edited room
        const index = rooms!.findIndex(
          (room) => room.room_id === editedRoom.room_id
        );
        response.data.data.roomNumber = editedRoom.roomNumber;
        console.log(response);
        rooms![index] = response.data.data;
        console.log(response.data.data);
        setRooms(rooms!);
        //show success alert for 3 seconds
        setSuccess("Помещение успешно обновлено");
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
          setError(`Номер помещения ${duplicateRoomNumber} уже существует.`);
          //show error alert for 3 seconds
          setError(true);
          setSuccess(null);
          setTimeout(() => {
            setError(null);
          }, 3000);
        } else {
          setError("Ошибка при обновлении помещения");
          //show error alert for 3 seconds
          setError(true);
          setSuccess(null);
          setTimeout(() => {
            setError(null);
          }, 3000);
        }
      });
  };
  // const handleShowParams = () => {
  //   onViewClose();
  //   navigate(`/admin/data/${selectedRoom!.room_id}`);
  // };
  const handleDeleteRoom = () => {
    axiosClient
      .get(`/api/rooms/?method=DELETE&id=${selectedRoom!.room_id}`)
      .then((response) => {
        console.log(response);

        setRooms(
          rooms!.filter((room) => room.room_id !== selectedRoom!.room_id)
        );
        DeleteDevice();
        setSuccess(true);
        setTimeout(() => {
          setSuccess(null);
          onDeleteClose();
        }, 3000);
      })
      .catch((error) => {
        console.log(error.response.data.message);
        setError(error.response.data.message);
        setTimeout(() => {
          setError(null);
        }, 3000);
      });
  };
  const DeleteDevice = () => {
    if (selectedRoom) {
      console.log(selectedRoom);
      const targetRoom = selectedRoom.room_id;
      //find all devices linked to the selected room
      const linkedDevices = devices!.filter(
        (device) => device.room_id === targetRoom
      );
      console.log(linkedDevices);
      if (linkedDevices) {
        //create a new array with updated devices
        setDevices(
          devices!.map((device) =>
            device.room_id === targetRoom
              ? { ...device, room_id: null }
              : device
          )
        );
        linkedDevices.forEach((device) => {
          axiosClient
            .patch(`/api/devices/?id=${device.device_id}`, {
              room_id: null,
            })
            .then((response) => {
              console.log(response);
              setError(null);
              setSuccess(true);
              setTimeout(() => {
                setSuccess(null);
              }, 3000);
            })
            .catch((error) => {
              console.log(error);
              setSuccess(null);
              setError(true);
              setTimeout(() => {
                setError(null);
              }, 3000);
            });
        });
      }
    }
  };
  return (
    <div className="-auto mt-5">
      {success && <Alert color="success">{success}</Alert>}
      {error && <Alert color="danger">{error}</Alert>}
      <Table
        aria-label="Учетные записи пользователей"
        selectionMode="single"
        onSelectionChange={handleSelectionChange}
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
          items={rooms}
          emptyContent={"Справочник помещений пустой"}
        >
          {(item) => (
            <TableRow key={item.room_id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(item, columnKey as keyof Room)}
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
                <h1>Просмотр помещения</h1>
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Номер помещения"
                  value={selectedRoom!.roomNumber.toString()}
                  disabled
                />
                <Input
                  label="ФИО ответственного"
                  value={selectedRoom!.frPerson}
                  disabled
                />
                <Input
                  label="Местоположение"
                  value={selectedRoom!.location}
                  disabled
                />
                <Input
                  label={
                    <>
                      Площадь, м<sup>2</sup>
                    </>
                  }
                  value={selectedRoom!.area.toString()}
                  disabled
                />
                <Input label="Устройства" value={devicesString} disabled />
              </ModalBody>
              <ModalFooter>
                {/* <Button color="primary" onPress={handleShowParams}>
                  Показать изменения параметров
                </Button> */}
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
                <h1>Редактировать помещение</h1>
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Номер помещения"
                  type="number"
                  value={editedRoom.roomNumber.toString()}
                  onChange={(e) =>
                    setEditedRoom({
                      ...editedRoom,
                      roomNumber: parseInt(e.target.value),
                    })
                  }
                />
                <Autocomplete
                  label="ФИО ответственного"
                  value={editedRoom.frPerson}
                  defaultItems={users}
                  defaultInputValue={editedRoom.frPerson}
                  onInputChange={(value) =>
                    setEditedRoom({
                      ...editedRoom,
                      frPerson: value,
                    })
                  }
                >
                  {users?.map((user) => (
                    <AutocompleteItem
                      key={user.user_id}
                      textValue={user.userName!.trim()}
                    >
                      {user.userName}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
                <Input
                  label="Местоположение"
                  value={editedRoom.location}
                  onChange={(e) =>
                    setEditedRoom({
                      ...editedRoom,
                      location: e.target.value,
                    })
                  }
                />
                <div className="flex flex-row gap-2">
                  <Input
                    label={
                      <>
                        Площадь, м<sup>2</sup>
                      </>
                    }
                    type="number"
                    disabled
                    value={editedRoom.area.toString()}
                  />
                  <Input
                    label="Длина, м"
                    value={editedRoom.length.toString()}
                    type="number"
                    onChange={(e) => {
                      const length = parseFloat(e.target.value) || 0;
                      setEditedRoom((prev) => {
                        const newState = {
                          ...prev,
                          length: length,
                        };
                        newState.area =
                          newState.height * newState.width * newState.length;
                        return newState;
                      });
                    }}
                  />
                </div>
                <div className="flex flex-row gap-2">
                  <Input
                    label="Ширина, м"
                    value={editedRoom.width.toString()}
                    type="number"
                    onChange={(e) => {
                      const width = parseFloat(e.target.value) || 0;
                      setEditedRoom((prev) => {
                        const newState = {
                          ...prev,
                          width: width,
                        };
                        newState.area =
                          newState.height * newState.width * newState.length;
                        return newState;
                      });
                    }}
                  />
                  <Input
                    label="Высота, м"
                    value={editedRoom.height.toString()}
                    type="number"
                    onChange={(e) => {
                      const height = parseFloat(e.target.value) || 0;
                      setEditedRoom((prev) => {
                        const newState = {
                          ...prev,
                          height: height,
                        };
                        newState.area =
                          newState.height * newState.width * newState.length;
                        return newState;
                      });
                    }}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button onPress={handleEditRoom} color="primary">
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
                <h1>Удалить пемещение</h1>
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Номер помещения"
                  value={selectedRoom!.roomNumber.toString()}
                  disabled
                />
                <Input label="ФИО" value={selectedRoom!.frPerson} disabled />
                <Input
                  label="Местоположение"
                  value={selectedRoom!.location}
                  disabled
                />
                <div className="flex flex-row gap-2">
                  <Input
                    label={
                      <>
                        Площадь, м<sup>2</sup>
                      </>
                    }
                    type="number"
                    disabled
                    value={selectedRoom!.area.toString()}
                  />
                  <Input
                    label="Длина, м"
                    value={selectedRoom!.length.toString()}
                    type="number"
                    disabled
                  />
                </div>
                <div className="flex flex-row gap-2">
                  <Input
                    label="Ширина, м"
                    value={selectedRoom!.width.toString()}
                    type="number"
                    disabled
                  />
                  <Input
                    label="Высота, м"
                    value={selectedRoom!.height.toString()}
                    type="number"
                    disabled
                  />
                </div>
                {success && (
                  <Alert color="success">Помещение успешно удалено</Alert>
                )}
                {error && <Alert color="danger">{error}</Alert>}
                <Alert color="warning">
                  Вы действительно хотите удалите это помещение?
                </Alert>
              </ModalBody>
              <ModalFooter>
                <Button onPress={handleDeleteRoom} color="danger">
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

export default RoomsTable;
