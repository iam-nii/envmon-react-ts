import { createContext, useContext, useEffect, useState } from "react";
// import axiosClient from "../axiosClient";
import { Rooms } from "../Types";
import axiosClient from "../axiosClient";

interface RoomContextProviderType {
  children: React.ReactNode;
}

interface RoomContextType {
  rooms: Rooms;
  setRooms: (value: Rooms) => void;
}

const RoomContext = createContext<RoomContextType>({
  rooms: [],
  setRooms: () => {},
});

export const RoomContextProvider = ({ children }: RoomContextProviderType) => {
  const [rooms, setRooms] = useState<Rooms>([]);
  useEffect(() => {
    axiosClient
      .get("/api/rooms/?method=GET&query=getRooms")
      .then((response) => {
        // console.log("response", response);
        setRooms(response.data.data);
        // console.log(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <RoomContext.Provider value={{ rooms, setRooms }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomContext = () => useContext(RoomContext);
