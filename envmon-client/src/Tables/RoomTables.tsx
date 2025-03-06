// import React, { useEffect } from "react";
// import {
//   Table,
//   TableHeader,
//   TableColumn,
//   TableBody,
//   TableRow,
//   TableCell,
//   Tooltip,
//   useDisclosure,
//   ModalContent,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Button,
//   Input,
//   Alert,
//   Select,
//   SelectItem,
// } from "@heroui/react";
// import { DeleteIcon, EditIcon, EyeIcon } from "../../public/Icons/Icons";
// import { useState } from "react";
// import axiosClient from "../axiosClient";
// import { useDeviceContext } from "../context/DeviceContextProvider";
// import { useNavigate } from "react-router-dom";
// import { useRoomContext } from "../context/RoomContextProvider";
// import { device, Devices, Room } from "../Types";
// const COLUMNS = [
//   { name: "Номер помещения", uid: "roomNumber" },
//   { name: "ФИО ответственного", uid: "frPerson" },
//   { name: "Местоположение", uid: "location" },
//   { name: "Площадь, м2", uid: "area" },
//   { name: "Длина, м", uid: "length" },
//   { name: "Ширина, м", uid: "width" },
//   { name: "Высота, м", uid: "height" },
//   { name: "Действия", uid: "actions" },
// ];

// interface RoomTableType {
//   isAdmin: boolean | null;
// }

// // function RoomTable({ isAdmin }: RoomTableType) {
// //   const navigate = useNavigate();
// //   const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
// //   const [selectedRoomDevices, setSelectedRoomDevices] = useState(new Set());
// //   const [devicesString, setDevicesString] = useState("");
// //   const [success, setSuccess] = useState<string | null | boolean>(null);
// //   const [error, setError] = useState<string | null | boolean>(null);
// //   const { devices, setDevices } = useDeviceContext();
// //   const [freeDevices, setFreeDevices] = useState<Devices | null>([]);
// //   const [roomsWithDevices, setRoomsWithDevices] = useState<Set<
// //     number | undefined
// //   > | null>(null);
// //   const { rooms, setRooms } = useRoomContext();
// //   const [roomDevices_IDs, setRoomDevices_IDs] = useState<string[]>([]);

// //   // View Modal
// //   const {
// //     isOpen: isViewOpen,
// //     onOpen: onViewOpen,
// //     onOpenChange: onViewOpenChange,
// //     onClose: onViewClose,
// //   } = useDisclosure();

// //   // Edit Modal
// //   const {
// //     isOpen: isEditOpen,
// //     onOpen: onEditOpen,
// //     onOpenChange: onEditOpenChange,
// //     onClose: onEditClose,
// //   } = useDisclosure();

// //   // Delete Modal
// //   const {
// //     isOpen: isDeleteOpen,
// //     onOpen: onDeleteOpen,
// //     onOpenChange: onDeleteOpenChange,
// //     onClose: onDeleteClose,
// //   } = useDisclosure();

// //   const [editedRoom, setEditedRoom] = useState<Room | null>({
// //     roomNumber: "",
// //     frPerson: "",
// //     location: "",
// //     room_id: 0,
// //     length: 0,
// //     width: 0,
// //     height: 0,
// //     area: 0,
// //   });
// //   const [devicePayload, setDevicePayload] = useState<device>({
// //     device_id: null,
// //     deviceName: null,
// //   });
// //   // const [devicesString, setDevicesString] = useState("");

// //   useEffect(() => {
// //     setFreeDevices(devices!.filter((device: device) => device.roomID === null));
// //     console.log("freeDevices", freeDevices);

// //     const usedDevices = devices!.filter((device) => device.roomID);
// //     console.log("usedDevices", usedDevices);

// //     const roomsWithDevicesIds: Set<number | undefined> = new Set(
// //       usedDevices.map((device) => device.roomID)
// //     );
// //     setRoomsWithDevices(roomsWithDevicesIds);
// //   }, [devices, rooms]);

// //   //console log devicePayload when a device is selected
// //   useEffect(() => {
// //     console.log(devicePayload);
// //   }, [devicePayload]);

// //   const renderCell = React.useCallback(
// //     (room: Room, columnKey: keyof Room | "actions") => {
// //       const cellValue = room[columnKey as keyof Room];
// //       switch (columnKey) {
// //         case "roomNumber":
// //           return (
// //             <p className="font-bold text-small capitalize">{room.roomNumber}</p>
// //           );
// //         case "frPerson":
// //           return <p className="text-small">{room.frPerson}</p>;
// //         case "location":
// //           return <p className="text-small">{room.location}</p>;
// //         case "length":
// //           return <p className="text-small">{room.length}</p>;
// //         case "width":
// //           return <p className="text-small">{room.width}</p>;
// //         case "height":
// //           return <p className="text-small">{room.height}</p>;
// //         case "area":
// //           return <p className="text-small">{room.area}</p>;
// //         case "actions":
// //           return (
// //             <div className="relative flex items-center gap-5 justify-end">
// //               <Tooltip content="Просмотр">
// //                 <span
// //                   className="text-lg text-default-400 cursor-pointer active:opacity-50"
// //                   onClick={() => {
// //                     setSelectedRoom(room);
// //                     onViewOpen();
// //                   }}
// //                 >
// //                   <EyeIcon />
// //                 </span>
// //               </Tooltip>
// //               {isAdmin && (
// //                 <>
// //                   <Tooltip content="Редактировать">
// //                     <span
// //                       className="text-lg text-default-400 cursor-pointer active:opacity-50"
// //                       onClick={() => {
// //                         setSelectedRoom(room);
// //                         setEditedRoom({
// //                           roomNumber: room.roomNumber,
// //                           frPerson: room.frPerson,
// //                           location: room.location,
// //                           room_id: room.room_id,
// //                           length: room.length || 0,
// //                           width: room.width || 0,
// //                           height: room.height || 0,
// //                           area: room.area || 0,
// //                         });
// //                         onEditOpen();
// //                       }}
// //                     >
// //                       <EditIcon />
// //                     </span>
// //                   </Tooltip>
// //                   <Tooltip color="danger" content="Удалить">
// //                     <span
// //                       className="text-lg text-danger cursor-pointer active:opacity-50"
// //                       onClick={() => {
// //                         setSelectedRoom(room);
// //                         onDeleteOpen();
// //                       }}
// //                     >
// //                       <DeleteIcon />
// //                     </span>
// //                   </Tooltip>
// //                 </>
// //               )}
// //             </div>
// //           );

// //         default:
// //           return cellValue;
// //       }
// //     },
// //     []
// //   );
// //   const handleSelectionChange = (keys: string) => {
// //     setFreeDevices(devices!.filter((device) => device.roomID === null));

// //     // Convert keys to an array (in case it's a Set)
// //     const selectedKeysArray = Array.from(keys);

// //     // Find the selected row(s) from the ROOMS array
// //     const selectedRows = rooms!.filter((room) =>
// //       selectedKeysArray.includes(room.room_id.toString())
// //     );

// //     const NO_DEVICES_MESSAGE = "Нет устройств";
// //     if (selectedRows.length > 0) {
// //       const selectedRoom = selectedRows[0];

// //       // find devices associated with the selected room
// //       const selectedRoomDevices_array = devices!.filter(
// //         (device: device) => device.roomID === selectedRoom.room_id
// //       );

// //       // Create an array of device IDs
// //       const roomDevices_Ids = selectedRoomDevices_array.map(
// //         (device) => device.device_id as string //Extract device IDs and Assert that device_id is always a string
// //       );
// //       setRoomDevices_IDs(roomDevices_Ids);

// //       setSelectedRoomDevices(new Set(roomDevices_Ids));
// //       console.log(roomDevices_Ids);

// //       let deviceString;
// //       if (selectedRoomDevices_array.length > 0) {
// //         const deviceNames = selectedRoomDevices_array.map(
// //           (device) => device.deviceName
// //         );
// //         deviceString = deviceNames.join(", ");
// //       } else {
// //         deviceString = NO_DEVICES_MESSAGE;
// //       }
// //       console.log(deviceString);
// //       setDevicesString(deviceString);
// //       setEditedRoom(selectedRoom);
// //       setFreeDevices((prev) => [
// //         ...(prev || []),
// //         ...devices!.filter((device) =>
// //           selectedRoomDevices.has(device.device_id)
// //         ),
// //       ]);
// //     } else {
// //       setDevicesString(NO_DEVICES_MESSAGE); //clear the devicesString
// //       setSelectedRoomDevices(new Set());
// //       setEditedRoom(null);
// //     }
// //   };

// //   useEffect(() => {
// //     console.log(devices);
// //   }, [devices]);
// //   const handleEditRoom = () => {
// //     console.log(devicePayload);
// //     setEditedRoom({
// //       ...editedRoom,
// //       area: editedRoom.height * editedRoom.width * editedRoom.length,
// //     });
// //     console.log("Edited Room:", editedRoom);
// //     axiosClient
// //       .patch(`/updateRoom/${editedRoom.roomID}`, editedRoom)
// //       .then((response) => {
// //         // log the response
// //         console.log(response);
// //         //update only the edited room
// //         const index = rooms.findIndex(
// //           (room) => room.roomID === editedRoom.roomID
// //         );
// //         rooms[index] = response.data.room;
// //         setRooms(rooms);

// //         //update devices if necessary
// //         if (
// //           devicePayload.deviceID !== null &&
// //           devicePayload.deviceID.trim() !== ""
// //         ) {
// //           console.log(devicePayload);
// //           //Split deviceID if it contains commas
// //           const deviceIDs = devicePayload.deviceID.includes(",")
// //             ? devicePayload.deviceID.split(",").map((id) => id.trim())
// //             : [devicePayload.deviceID];
// //           // const updatedDevices = devices.map((device) =>
// //           //     deviceIDs.includes(device.deviceID)
// //           //         ? { ...device, roomID: editedRoom.roomID }
// //           //         : device
// //           // );
// //           console.log(deviceIDs);
// //           if (deviceIDs.length > 0) {
// //             const removedDevices = roomDevices_IDs.filter((device) => {
// //               return !deviceIDs.includes(device);
// //             });
// //             console.log("removedDevices", removedDevices);
// //             if (removedDevices.length > 0) {
// //               Promise.all(
// //                 removedDevices.map((deviceID) =>
// //                   axiosClient
// //                     .patch(`/updateDevice/${deviceID}`, {
// //                       roomID: null,
// //                     })
// //                     .then((response) => {
// //                       console.log(response);
// //                       const index = devices.findIndex(
// //                         (device) => device.deviceID === deviceID
// //                       );
// //                       devices[index] = response.data.device;
// //                       setDevices(devices);
// //                     })
// //                     .catch((error) => {
// //                       console.log(error);
// //                     })
// //                 )
// //               );
// //             }
// //           }

// //           // Send API patch for all selected devices
// //           Promise.all(
// //             deviceIDs.map((deviceID) =>
// //               axiosClient
// //                 .patch(`/updateDevice/${deviceID}`, {
// //                   roomID: editedRoom.roomID,
// //                 })
// //                 .then((response) => {
// //                   console.log(response);
// //                   const index = devices.findIndex(
// //                     (device) => device.deviceID === deviceID
// //                   );
// //                   devices[index] = response.data.device;
// //                   setDevices(devices);
// //                 })
// //                 .catch((error) => {
// //                   console.log(error);
// //                 })
// //             )
// //           )
// //             .then((responses) => {
// //               console.log("Devices updated:", responses);
// //               setError(null);
// //               setSuccess(true);
// //               setTimeout(() => {
// //                 setSuccess(null);
// //               }, 3000);
// //             })
// //             .catch((error) => {
// //               console.log("Error updating devices:", error);
// //               setError(true);
// //               setTimeout(() => {
// //                 setError(null);
// //               }, 3000);
// //             });
// //         } else {
// //           DeleteDevice();
// //         }

// //         //show success alert for 3 seconds
// //         setSuccess(true);
// //         setError(null);
// //         setTimeout(() => {
// //           setSuccess(null);
// //         }, 3000);
// //         onEditClose();
// //       })
// //       .catch((error) => {
// //         console.log(error);
// //         const errorError = error.response.data.error;
// //         if (errorError.includes("Duplicate entry")) {
// //           const duplicateRoomNumber = errorError.match(/'([^']+)'/)[1];
// //           setError(`Номер помещения ${duplicateRoomNumber} уже существует.`);
// //           //show error alert for 3 seconds
// //           setError(true);
// //           setSuccess(null);
// //           setTimeout(() => {
// //             setError(null);
// //           }, 3000);
// //         } else {
// //           setError("Ошибка при обновлении помещения");
// //           //show error alert for 3 seconds
// //           setError(true);
// //           setSuccess(null);
// //           setTimeout(() => {
// //             setError(null);
// //           }, 3000);
// //         }
// //       });
// //   };
// //   const handleShowParams = () => {
// //     onViewClose();
// //     navigate(`/admin/data/${selectedRoom!.room_id}`);
// //   };
// //   const handleDeleteRoom = () => {
// //     axiosClient
// //       .delete(`/deleteRoom/${selectedRoom!.room_id}`)
// //       .then((response) => {
// //         console.log(response);

// //         setRooms(rooms!.filter((room) => room.room_id !== selectedRoom!.room_id));
// //         DeleteDevice();
// //         setSuccess(true);
// //         setTimeout(() => {
// //           setSuccess(null);
// //           onDeleteClose();
// //         }, 3000);
// //       })
// //       .catch((error) => {
// //         console.log(error);
// //         setError(true);
// //         setTimeout(() => {
// //           setError(null);
// //         }, 3000);
// //       });
// //   };
// //   const DeleteDevice = () => {
// //     if (selectedRoom) {
// //       console.log(selectedRoom);
// //       const targetRoom = selectedRoom.room_id;
// //       //find all devices linked to the selected room
// //       const linkedDevices = devices!.filter(
// //         (device) => device.roomID === targetRoom
// //       );
// //       console.log(linkedDevices);
// //       if (linkedDevices) {
// //         //create a new array with updated devices
// //         setDevices(
// //           devices!.map((device) =>
// //             device.roomID === targetRoom ? { ...device, roomID: "" } : device
// //           )
// //         );
// //         linkedDevices.forEach((device) => {
// //           axiosClient
// //             .patch(`/updateDevice/${device.deviceID}`, {
// //               roomID: null,
// //             })
// //             .then((response) => {
// //               console.log(response);
// //               setError(null);
// //               setSuccess(true);
// //               setTimeout(() => {
// //                 setSuccess(null);
// //               }, 3000);
// //             })
// //             .catch((error) => {
// //               console.log(error);
// //               setSuccess(null);
// //               setError(true);
// //               setTimeout(() => {
// //                 setError(null);
// //               }, 3000);
// //             });
// //         });
// //       }
// //     }
// //   };
// //   return (
// //     <div className="w-[90%] mx-auto mt-5">
// //       <Table
// //         aria-label="Учетные записи пользователей"
// //         selectionMode="single"
// //         onSelectionChange={handleSelectionChange}
// //       >
// //         <TableHeader columns={COLUMNS}>
// //           {(column) => (
// //             <TableColumn
// //               key={column.uid}
// //               align={column.uid === "actions" ? "end" : "start"}
// //             >
// //               {column.name}
// //             </TableColumn>
// //           )}
// //         </TableHeader>
// //         {isLoading ? (
// //           <TableBody>
// //             <TableRow>
// //               <TableCell>Загрузка...</TableCell>
// //             </TableRow>
// //           </TableBody>
// //         ) : (
// //           <TableBody
// //             items={rooms.sort((a, b) => a.roomNumber - b.roomNumber)}
// //             emptyContent={"Справочник помещений пустой"}
// //           >
// //             {(item) => (
// //               <TableRow key={item.roomID}>
// //                 {(columnKey) => (
// //                   <TableCell>{renderCell(item, columnKey)}</TableCell>
// //                 )}
// //               </TableRow>
// //             )}
// //           </TableBody>
// //         )}
// //       </Table>

// //       {/* Modal for viewing room */}
// //       <Modal isOpen={isViewOpen} onOpenChange={onViewOpenChange}>
// //         <ModalContent>
// //           {(onViewClose) => (
// //             <>
// //               <ModalHeader>
// //                 <h1>Просмотр помещения</h1>
// //               </ModalHeader>
// //               <ModalBody>
// //                 <Input
// //                   label="Номер помещения"
// //                   value={selectedRoom.roomNumber}
// //                   disabled
// //                 />
// //                 <Input
// //                   label="ФИО ответственного"
// //                   value={selectedRoom.frPerson}
// //                   disabled
// //                 />
// //                 <Input
// //                   label="Местоположение"
// //                   value={selectedRoom.location}
// //                   disabled
// //                 />
// //                 <Input label="Площадь, м2" value={selectedRoom.area} disabled />
// //                 <Input label="Устройства" value={devicesString} disabled />
// //               </ModalBody>
// //               <ModalFooter>
// //                 <Button color="primary" onPress={handleShowParams}>
// //                   Показать изменения параметров
// //                 </Button>
// //                 <Button onPress={onViewClose} color="success">
// //                   Закрыть
// //                 </Button>
// //               </ModalFooter>
// //             </>
// //           )}
// //         </ModalContent>
// //       </Modal>

// //       {/* Modal for editing room */}
// //       <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange}>
// //         <ModalContent>
// //           {(onEditClose) => (
// //             <>
// //               <ModalHeader>
// //                 <h1>Редактировать помещение</h1>
// //               </ModalHeader>
// //               <ModalBody>
// //                 <Input
// //                   label="Номер помещения"
// //                   value={editedRoom!.roomNumber}
// //                   onChange={(e) =>
// //                     setEditedRoom({
// //                       ...editedRoom,
// //                       roomNumber: e.target.value,
// //                     })
// //                   }
// //                 />
// //                 <Input
// //                   label="ФИО"
// //                   value={editedRoom.frPerson}
// //                   onChange={(e) =>
// //                     setEditedRoom({
// //                       ...editedRoom,
// //                       frPerson: e.target.value,
// //                     })
// //                   }
// //                 />
// //                 <Input
// //                   label="Местоположение"
// //                   value={editedRoom.location}
// //                   onChange={(e) =>
// //                     setEditedRoom({
// //                       ...editedRoom,
// //                       location: e.target.value,
// //                     })
// //                   }
// //                 />
// //                 <div className="flex flex-row gap-2">
// //                   <Input
// //                     label="Площадь"
// //                     type="number"
// //                     disabled
// //                     value={editedRoom.area}
// //                   />
// //                   <Input
// //                     label="Длина"
// //                     value={editedRoom.length}
// //                     type="number"
// //                     onChange={(e) => {
// //                       const length = parseFloat(e.target.value) || 0;
// //                       setEditedRoom((prev) => ({
// //                         ...prev,
// //                         length: length,
// //                         area: prev.height * prev.width * length,
// //                       }));
// //                     }}
// //                   />
// //                 </div>
// //                 <div className="flex flex-row gap-2">
// //                   <Input
// //                     label="Ширина"
// //                     value={editedRoom.width}
// //                     type="number"
// //                     onChange={(e) => {
// //                       const width = parseFloat(e.target.value) || 0;
// //                       setEditedRoom((prev) => ({
// //                         ...prev,
// //                         width: width,
// //                         area: prev.height * prev.width * prev.length,
// //                       }));
// //                     }}
// //                   />
// //                   <Input
// //                     label="Высота"
// //                     value={editedRoom.height}
// //                     type="number"
// //                     onChange={(e) => {
// //                       const height = parseFloat(e.target.value) || 0;
// //                       setEditedRoom((prev) => ({
// //                         ...prev,
// //                         height: height,
// //                         area: prev.height * prev.width * prev.length,
// //                       }));
// //                     }}
// //                   />
// //                 </div>
// //                 {/* Check if the room is in the roomsWithDevices array */}
// //                 <Select
// //                   label="Выберите устройство"
// //                   selectionMode="multiple"
// //                   selectedKeys={selectedRoomDevices}
// //                   onSelectionChange={(keys) => {
// //                     setSelectedRoomDevices(new Set(keys));
// //                     console.log(selectedRoomDevices);
// //                   }}
// //                   onChange={(e) => {
// //                     setDevicePayload((prev) => ({
// //                       ...prev,
// //                       deviceID: e.target.value,
// //                     }));
// //                   }}
// //                 >
// //                   {roomsWithDevices.has(selectedRoom.roomID)
// //                     ? devices
// //                         .filter(
// //                           (device) =>
// //                             !roomsWithDevices.has(device.roomID) ||
// //                             device.roomID === selectedRoom.roomID
// //                         )
// //                         .map((device) => (
// //                           <SelectItem
// //                             key={device.deviceID}
// //                             value={device.deviceID}
// //                           >
// //                             {device.deviceName}
// //                           </SelectItem>
// //                         ))
// //                     : freeDevices.map((device) => (
// //                         <SelectItem
// //                           key={device.deviceID}
// //                           value={device.deviceID}
// //                         >
// //                           {device.deviceName}
// //                         </SelectItem>
// //                       ))}
// //                 </Select>

// //                 {success && (
// //                   <Alert color="success">Помещение успешно обновлено</Alert>
// //                 )}
// //                 {error && (
// //                   <Alert color="danger">Ошибка при обновлении помещения</Alert>
// //                 )}
// //               </ModalBody>
// //               <ModalFooter>
// //                 <Button onPress={handleEditRoom} color="primary">
// //                   Сохранить
// //                 </Button>
// //                 <Button onPress={onEditClose} color="danger">
// //                   Закрыть
// //                 </Button>
// //               </ModalFooter>
// //             </>
// //           )}
// //         </ModalContent>
// //       </Modal>

// //       {/* Modal for deleting room */}
// //       <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange}>
// //         <ModalContent>
// //           {(onDeleteClose) => (
// //             <>
// //               <ModalHeader>
// //                 <h1>Удалить пемещение</h1>
// //               </ModalHeader>
// //               <ModalBody>
// //                 <Input
// //                   label="Номер помещения"
// //                   value={selectedRoom.roomNumber}
// //                   disabled
// //                 />
// //                 <Input label="ФИО" value={selectedRoom.frPerson} disabled />
// //                 <Input
// //                   label="Местоположение"
// //                   value={selectedRoom.location}
// //                   disabled
// //                 />
// //                 <div className="flex flex-row gap-2">
// //                   <Input
// //                     label="Площадь"
// //                     type="number"
// //                     disabled
// //                     value={selectedRoom.area}
// //                   />
// //                   <Input
// //                     label="Длина"
// //                     value={selectedRoom.length}
// //                     type="number"
// //                     disabled
// //                   />
// //                 </div>
// //                 <div className="flex flex-row gap-2">
// //                   <Input
// //                     label="Ширина"
// //                     value={selectedRoom.width}
// //                     type="number"
// //                     disabled
// //                   />
// //                   <Input
// //                     label="Высота"
// //                     value={selectedRoom.height}
// //                     type="number"
// //                     disabled
// //                   />
// //                 </div>
// //                 {success && (
// //                   <Alert color="success">Помещение успешно удалено</Alert>
// //                 )}
// //                 {error && (
// //                   <Alert color="danger">Ошибка при удалении помещения</Alert>
// //                 )}
// //                 <Alert color="warning">
// //                   Вы действительно хотите удалите это помещение?
// //                 </Alert>
// //               </ModalBody>
// //               <ModalFooter>
// //                 <Button onPress={handleDeleteRoom} color="danger">
// //                   Удалить
// //                 </Button>
// //                 <Button onPress={onDeleteClose} color="primary">
// //                   Закрыть
// //                 </Button>
// //               </ModalFooter>
// //             </>
// //           )}
// //         </ModalContent>
// //       </Modal>
// //     </div>
// //   );
// // }

// export default RoomTable;
