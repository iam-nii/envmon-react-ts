import {
  Alert,
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  // Select,
  // SelectItem,
  // Spinner,
  useDisclosure,
} from "@heroui/react";
import { useEffect, useState } from "react";
import RoomsTable from "../Tables/RoomsTable";
import axiosClient from "../axiosClient";
import { useRoomContext } from "../context/RoomContextProvider";
import { useUserContext } from "../context/UserContextProvider";
// import { Rooms } from "../Types";
// import RoomsTable from "../../components/Tables/RoomsTable";
// import { useDeviceContext } from "../../context/DeviceContexProvider";
// import { device, Devices } from "../Types";

interface AddRoomType {
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
  setSelected: (selected: string) => void;
  // isLoading: boolean;
  error: string | null;
  success: string | null;
}

interface roomPayloadType {
  roomNumber: string;
  frPerson: string;
  location: string;
  height: number | string;
  width: number | string;
  length: number | string;
  area: number | string;
}

function AddRoom({ setError, setSuccess, error, success }: AddRoomType) {
  const [roomPayload, setRoomPayload] = useState<roomPayloadType>({
    roomNumber: "",
    frPerson: "",
    location: "",
    height: "",
    width: "",
    length: "",
    area: "",
  });
  const { rooms, setRooms } = useRoomContext();
  const { users } = useUserContext();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  useEffect(() => {
    const height = Number(roomPayload.height);
    const width = Number(roomPayload.width);
    const length = Number(roomPayload.length);

    // Reset error and success states
    setError(null);
    setSuccess(null);

    // Calculate area only if height, width, and length are valid numbers
    if (!isNaN(height) && !isNaN(width) && !isNaN(length)) {
      setRoomPayload((prev) => ({
        ...prev,
        area: width * length,
      }));
    }
  }, [roomPayload.width, roomPayload.length]);

  const handleAddRoom = () => {
    setError(null);
    // console.log("roomPayload", roomPayload);
    axiosClient.post("/api/rooms/", roomPayload).then(({ data }) => {
      // console.log(data);
      setRooms([...rooms, data.data]);
      setError(null);
      setSuccess(data.message);
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
          Добавить помещение
        </Button>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Добавить помещение</ModalHeader>
              <ModalBody>
                <Input
                  label="Номер помещения"
                  variant="bordered"
                  type="number"
                  value={roomPayload.roomNumber}
                  onChange={(e) => {
                    setRoomPayload((prev) => ({
                      ...prev,
                      roomNumber: e.target.value,
                    }));
                  }}
                />
                {/* <Input
                  label="ФИО ответственного лица"
                  variant="bordered"
                  value={roomPayload.frPerson}
                  onChange={(e) => {
                    setRoomPayload((prev) => ({
                      ...prev,
                      frPerson: e.target.value,
                    }));
                  }}
                /> */}
                <Autocomplete
                  label="ФИО ответственного"
                  value={roomPayload.frPerson}
                  defaultItems={users}
                  defaultInputValue={roomPayload.frPerson}
                  onInputChange={(value) =>
                    setRoomPayload((prev) => ({
                      ...prev,
                      frPerson: value,
                    }))
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
                  variant="bordered"
                  value={roomPayload.location}
                  onChange={(e) => {
                    setRoomPayload((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }));
                  }}
                />
                <div className="flex flex-row gap-2">
                  <Input
                    label={
                      <>
                        Площадь, м<sup>2</sup>
                      </>
                    }
                    disabled
                    variant="bordered"
                    value={roomPayload.area.toString()}
                  />
                  <Input
                    label="Высота, м"
                    type="number"
                    variant="bordered"
                    value={roomPayload.height.toString()}
                    onChange={(e) => {
                      setRoomPayload((prev) => ({
                        ...prev,
                        height: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="flex flex-row gap-2">
                  <Input
                    label="Ширина, м"
                    type="number"
                    variant="bordered"
                    value={roomPayload.width.toString()}
                    onChange={(e) => {
                      setRoomPayload((prev) => ({
                        ...prev,
                        width: e.target.value,
                      }));
                    }}
                  />
                  <Input
                    label="Длина, м"
                    type="number"
                    variant="bordered"
                    value={roomPayload.length.toString()}
                    onChange={(e) => {
                      setRoomPayload((prev) => ({
                        ...prev,
                        length: e.target.value,
                      }));
                    }}
                  />
                </div>
                {error && (
                  <Alert
                    color={"danger"}
                    title={"Ошибка добавления помещения"}
                    description={error}
                  />
                )}
                {success && <Alert color={"success"} title={success} />}
              </ModalBody>
              <ModalFooter>
                <Button color="success" onPress={handleAddRoom}>
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
      <RoomsTable isAdmin={true} />
    </div>
  );
}

export default AddRoom;
