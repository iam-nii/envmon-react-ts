import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@heroui/react";
import Logo from "../assets/21.svg";
import { Link, Navigate, useNavigate, Outlet } from "react-router-dom";
import { useUserContext } from "../context/UserContextProvider";
// import { useRoomContext } from "../context/RoomContextProvider";
// import { useDeviceContext } from "../context/DeviceContextProvider";
// import { useEffect } from "react";
// import axiosClient from "../axiosClient";
import { useEffect } from "react";

function AdminLayout() {
  const { user, setUser, setToken, token } = useUserContext();
  // const { rooms } = useRoomContext();
  // console.log(rooms);
  // const { setDevices } = useDeviceContext();
  useEffect(() => {
    const userData = localStorage.getItem("USER_DATA");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const navigate = useNavigate();
  if (!token) {
    return <Navigate to="/signin" />;
  } else {
    const onLogout = () => {
      // localStorage.removeItem("ACCESS_TOKEN");
      setToken(null);
      navigate("/signin");
    };
    return (
      <div className="flex">
        <aside className="min-w-72 h-screen flex flex-col gap-4 bg-blue-50">
          <img src={Logo} alt="University Logo" className="w-52 mx-4 mt-4" />
          <Link
            to="/admin"
            className="hover:bg-slate-200 p-4 text-start font-bold rounded-lg"
          >
            Главная
          </Link>
          <Link
            to="/admin/users"
            className="hover:bg-slate-200 p-4 text-start font-bold rounded-lg"
          >
            Пользователи
          </Link>
          <Link
            to="/admin/rooms"
            className="hover:bg-slate-200 p-4 text-start font-bold rounded-lg"
          >
            Помещение/Устройства
          </Link>
          <Link
            to="/admin/settings"
            className="hover:bg-slate-200 p-4 text-start font-bold rounded-lg"
          >
            Настройки
          </Link>
        </aside>
        <div className="w-full">
          <Navbar className="bg-blue-50 border-b-2 border-slate-200">
            <NavbarBrand>
              <p className="text-xl font-bold">EnvMon</p>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-6 " justify="end">
              <NavbarItem className="flex flex-row gap-2 items-center ">
                <div className="font-bold">{user?.userName}</div>
                <Button onPress={onLogout} color="danger">
                  Выйти
                </Button>
              </NavbarItem>
            </NavbarContent>
          </Navbar>

          <main className="w-full h-full p-10">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }
}

export default AdminLayout;
