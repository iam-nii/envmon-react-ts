import { useRoomContext } from "../../context/RoomContextProvider";
import { Card, CardHeader, CardBody, Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Room } from "../../Types";
import { useUserContext } from "../../context/UserContextProvider";

function Dashboard() {
  const { rooms } = useRoomContext();
  const { users } = useUserContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const handlePress = (room: Room) => {
    navigate(`/admin/room/devices/${room.room_id}`);
  };

  useEffect(() => {
    if (rooms == null) setIsLoading(true);
    else setIsLoading(false);
    console.log(rooms);
  }, []);
  return (
    <div className="flex flex-col gap-2">
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
        {isLoading ? (
          <Spinner size="lg" />
        ) : (
          rooms.map((room) => (
            <Card
              key={room.room_id}
              isPressable
              shadow="sm"
              onPress={() => {
                handlePress(room);
              }}
            >
              <CardHeader className="flex justify-center items-center">
                <p className="text-2xl">
                  <span className="text-primary font-bold">
                    {room.roomNumber}
                  </span>
                </p>
              </CardHeader>
              <CardBody className="overflow-visible">
                <div className="flex gap-2">
                  <p className="text-md font-bold">Ответственный:</p>
                  <p className="text-md">{room.frPerson}</p>a
                </div>
                <div className="flex gap-5 w-full">
                  <p className="text-md font-bold">телефон:</p>
                  <p className="text-md">
                    {users?.find(
                      (user) => user.userName?.trim() === room.frPerson?.trim()
                    )?.uPhone || "Нет телефона"}
                  </p>
                </div>
                {/* make a line seperator */}
                <div className="w-full h-px bg-gray-300"></div>

                <div className="flex gap-2">
                  <p className="text-lg font-bold">Л,лм:</p>
                  <p className="text-xl">
                    <span className="pl-2 text-md">105 </span>
                    <span className="text-lg font-bold">106</span>
                    <span className="pl-2 text-md"> 107</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <p className="text-lg font-bold">VOC, ppm:</p>
                  <p className="text-xl">
                    <span className="pl-2 text-md">61 </span>
                    <span className="text-lg font-bold">70</span>
                    <span className="pl-2 text-md"> 75</span>
                  </p>
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

{
  /* <Card isPressable shadow="sm" onPress={handlePress}>
                    <CardHeader className="flex justify-center items-center">
                        <p className="text-2xl">
                            <span className="text-primary font-bold">401</span>
                        </p>
                    </CardHeader>
                    <CardBody className="overflow-visible">
                        <div className="flex gap-2">
                            <p className="text-lg font-bold">Ответственный:</p>
                            <p className="text-xl">Miron</p>
                        </div>
                        <div className="flex gap-10 w-full">
                            <p className="text-md font-bold">телефон:</p>
                            <p className="text-xl">+79999999999</p>
                        </div>
                        {/* make a line seperator *
                        <div className="w-full h-px bg-gray-300"></div>

                        <div className="flex gap-2">
                            <p className="text-lg font-bold">Л,лм:</p>
                            <p className="text-xl">
                                <span className="pl-2 text-md">105 </span>
                                <span className="text-lg font-bold">106</span>
                                <span className="pl-2 text-md"> 107</span>
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <p className="text-lg font-bold">Voc,ppm:</p>
                            <p className="text-xl">
                                <span className="pl-2 text-md">3 </span>
                                <span className="text-lg font-bold">1</span>
                                <span className="pl-2 text-md"> 1</span>
                            </p>
                        </div>
                    </CardBody>
                </Card>
                <Card isPressable shadow="sm" onPress={handlePress}>
                    <CardHeader className="flex justify-center items-center">
                        <p className="text-2xl">
                            <span className="text-primary font-bold">402</span>
                        </p>
                    </CardHeader>
                    <CardBody className="overflow-visible">
                        <div className="flex gap-2">
                            <p className="text-lg font-bold">Ответственный:</p>
                            <p className="text-xl">Maxim</p>
                        </div>
                        <div className="flex gap-10 w-full">
                            <p className="text-md font-bold">телефон:</p>
                            <p className="text-xl">+79999889999</p>
                        </div>
                        {/* make a line seperator *
                        <div className="w-full h-px bg-gray-300"></div>

                        <div className="flex gap-2">
                            <p className="text-lg font-bold">Л,лм:</p>
                            <p className="text-xl">
                                <span className="pl-2 text-md">105 </span>
                                <span className="text-lg font-bold">106</span>
                                <span className="pl-2 text-md"> 107</span>
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <p className="text-lg font-bold">Voc,ppm:</p>
                            <p className="text-xl">
                                <span className="pl-2 text-md">3 </span>
                                <span className="text-lg font-bold">1</span>
                                <span className="pl-2 text-md"> 1</span>
                            </p>
                        </div>
                    </CardBody>
                </Card>
                <Card isPressable shadow="sm" onPress={handlePress}>
                    <CardHeader className="flex justify-center items-center">
                        <p className="text-2xl">
                            <span className="text-primary font-bold">403</span>
                        </p>
                    </CardHeader>
                    <CardBody className="overflow-visible">
                        <div className="flex gap-2">
                            <p className="text-lg font-bold">Ответственный:</p>
                            <p className="text-xl">Abel</p>
                        </div>
                        <div className="flex gap-10 w-full">
                            <p className="text-md font-bold">телефон:</p>
                            <p className="text-xl">+7779999999</p>
                        </div>
                        {/* make a line seperator *
                        <div className="w-full h-px bg-gray-300"></div>

                        <div className="flex gap-2">
                            <p className="text-lg font-bold">Л,лм:</p>
                            <p className="text-xl">
                                <span className="pl-2 text-md">105 </span>
                                <span className="text-lg font-bold">106</span>
                                <span className="pl-2 text-md"> 107</span>
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <p className="text-lg font-bold">Voc,ppm:</p>
                            <p className="text-xl">
                                <span className="pl-2 text-md">3 </span>
                                <span className="text-lg font-bold">1</span>
                                <span className="pl-2 text-md"> 1</span>
                            </p>
                        </div>
                    </CardBody>
                </Card> */
}

export default Dashboard;
