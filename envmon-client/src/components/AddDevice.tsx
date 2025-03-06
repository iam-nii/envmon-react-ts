// import {
//   Alert,
//   Button,
//   Form,
//   Input,
//   Modal,
//   ModalBody,
//   ModalContent,
//   ModalFooter,
//   ModalHeader,
//   Spinner,
//   useDisclosure,
// } from "@heroui/react";
// import { useState } from "react";
// import axiosClient from "../axiosClient";
// // import DevicesTable from "../Tables/DevicesTable";
// // import { useDeviceContext } from "../../context/DeviceContexProvider";

// interface AddDeviceType {
//   setError: (error: string | null) => void;
//   setSuccess: (success: string | null) => void;
// }

// function AddDevice({ rooms, setError, setSuccess, isLoading, error, success }) {
//   const [devicePayload, setDevicePayload] = useState({
//     id: "null",
//     deviceID: "",
//     deviceName: "",
//     zoneNum: "",
//     status: "",
//     roomID: "",
//     reqInterval: "",
//   });
//   const [isAddingDevice, setIsAddingDevice] = useState(false);
//   const { isOpen, onOpen, onOpenChange } = useDisclosure();
//   const { setDevices } = useDeviceContext();

//   const handleAddDevice = (e) => {
//     e.preventDefault();

//     setIsAddingDevice(true);

//     axiosClient
//       .post("/insertDevice", devicePayload)
//       .then(({ data }) => {
//         //log response
//         console.log(data);

//         //set the states
//         setDevices((devices) => [...devices, data.device]);
//         setError(null);
//         setSuccess(data.message);

//         setTimeout(() => {
//           setSuccess(null);
//         }, 3000);
//         //reset the device payload
//         setDevicePayload({
//           deviceID: "",
//           deviceName: "",
//           zoneNum: "",
//           status: "",
//           roomID: "",
//           reqInterval: "",
//         });

//         setIsAddingDevice(false);
//       })
//       .catch((error) => {
//         setError(error.response.data.message);
//         setTimeout(() => {
//           setError(null);
//         }, 3000);
//         setSuccess(null);
//       })
//       .finally(() => {
//         setIsAddingDevice(false);
//       });
//   };

//   return (
//     <div>
//       <div className="flex justify-center items-center">
//         <Button onPress={onOpen} color="primary" className="text-lg w-[80%]">
//           Добавить устройство
//         </Button>
//       </div>

//       <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
//         <ModalContent>
//           {(onClose) => (
//             <>
//               <ModalHeader>Добавить устройство</ModalHeader>
//               <ModalBody>
//                 <Form onSubmit={handleAddDevice} validationBehavior="native">
//                   <Input
//                     label="Идентификатор устройства"
//                     variant="bordered"
//                     value={devicePayload.deviceID}
//                     maxLength={16}
//                     isRequired
//                     onChange={(e) => {
//                       setDevicePayload((prev) => ({
//                         ...prev,
//                         deviceID: e.target.value,
//                       }));
//                     }}
//                   />
//                   <Input
//                     label="Название устройства"
//                     variant="bordered"
//                     value={devicePayload.deviceName}
//                     isRequired
//                     onChange={(e) => {
//                       setDevicePayload((prev) => ({
//                         ...prev,
//                         deviceName: e.target.value,
//                       }));
//                     }}
//                   />
//                   <div className="flex flex-row gap-2 w-full">
//                     <Input
//                       label="Номер зоны"
//                       variant="bordered"
//                       type="number"
//                       value={devicePayload.zoneNum}
//                       isRequired
//                       onChange={(e) => {
//                         setDevicePayload((prev) => ({
//                           ...prev,
//                           zoneNum: e.target.value,
//                         }));
//                       }}
//                     />
//                     <Input
//                       label="Статус устройства"
//                       variant="bordered"
//                       type="number"
//                       min={0}
//                       max={1}
//                       value={devicePayload.status}
//                       isRequired
//                       onChange={(e) => {
//                         setDevicePayload((prev) => ({
//                           ...prev,
//                           status: e.target.value,
//                         }));
//                       }}
//                     />
//                   </div>
//                   <Input
//                     label="Интервал запроса (сек)"
//                     variant="bordered"
//                     type="number"
//                     className="w-56"
//                     value={devicePayload.reqInterval}
//                     isRequired
//                     onChange={(e) => {
//                       setDevicePayload((prev) => ({
//                         ...prev,
//                         reqInterval: e.target.value,
//                       }));
//                     }}
//                   />
//                   <div className="flex flex-row gap-2 w-full justify-end">
//                     <Button
//                       color="success"
//                       type="submit"
//                       disabled={isAddingDevice}
//                     >
//                       {isAddingDevice ? <Spinner size="sm" /> : "Добавить"}
//                     </Button>
//                     <Button color="primary" onPress={onClose}>
//                       Отменить
//                     </Button>
//                   </div>
//                 </Form>

//                 {error && <Alert color="danger">{error}</Alert>}
//                 {success && <Alert color="success">{success}</Alert>}
//               </ModalBody>
//               <ModalFooter></ModalFooter>
//             </>
//           )}
//         </ModalContent>
//       </Modal>
//       {isLoading ? (
//         <div className="flex justify-center items-center h-screen">
//           <Spinner size="lg" />
//         </div>
//       ) : (
//         <DevicesTable />
//       )}
//     </div>
//   );
// }

// AddDevice.propTypes = {
//   rooms: PropTypes.array.isRequired,
//   setError: PropTypes.func.isRequired,
//   setSuccess: PropTypes.func.isRequired,
//   isLoading: PropTypes.bool.isRequired,
//   error: PropTypes.string,
//   success: PropTypes.string,
//   setSelected: PropTypes.func.isRequired,
// };

// export default AddDevice;
