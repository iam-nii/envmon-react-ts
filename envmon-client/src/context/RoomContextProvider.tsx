import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../axiosClient";
import { RoomsT as Rooms, RoomsT } from "../Types";

interface RoomContextProviderType {
  children: React.ReactNode;
}

interface RoomContextType {
  rooms: Rooms | null;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  setRooms: (value: RoomsT) => void;
}

const RoomContext = createContext<RoomContextType>({
  rooms: null,
  isLoading: false,
  setIsLoading: () => {},
  setRooms: () => {},
});

export const RoomContextProvider = ({ children }: RoomContextProviderType) => {
  const [rooms, setRooms] = useState<RoomsT>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    axiosClient
      .get("/rooms")
      .then(({ data }) => {
        console.log(data);
        setRooms(data.data);
        // console.log(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setIsLoading(false);
  }, []);

  return (
    <RoomContext.Provider value={{ rooms, setRooms, isLoading, setIsLoading }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomContext = () => useContext(RoomContext);
