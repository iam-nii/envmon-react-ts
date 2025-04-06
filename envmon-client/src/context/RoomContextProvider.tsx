import { createContext, useContext, useState } from "react";
// import axiosClient from "../axiosClient";
import { Rooms } from "../Types";

interface RoomContextProviderType {
  children: React.ReactNode;
}

interface RoomContextType {
  rooms: Rooms | null;
  setRooms: (value: Rooms) => void;
}

const RoomContext = createContext<RoomContextType>({
  rooms: null,
  setRooms: () => {},
});

export const RoomContextProvider = ({ children }: RoomContextProviderType) => {
  const [rooms, setRooms] = useState<Rooms>([]);
  // useEffect(() => {
  //   axiosClient
  //     .get("/rooms")
  //     .then(({ data }) => {
  //       // console.log(data);
  //       setRooms(data.data);
  //       // console.log(res.data.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  return (
    <RoomContext.Provider value={{ rooms, setRooms }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomContext = () => useContext(RoomContext);
