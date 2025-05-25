import { useUserContext } from "../context/UserContextProvider";
import { useNavigate, Navigate, Outlet } from "react-router-dom";
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import Logo from "../../public/Icons/proto-2-light-short.svg";
import { useEffect } from "react";

const EngineerLayout = () => {
  const { token, setToken, user, setUser } = useUserContext();
  useEffect(() => {
    const userData = localStorage.getItem("USER_DATA");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  const navigate = useNavigate();
  if (!token) {
    return <Navigate to="/signin" />;
  }
  const onLogout = () => {
    // e.preventDefault();
    setToken(null);
    navigate("/signin");
  };

  return (
    <div className="flex">
      {/* <aside className="min-w-72 h-screen flex flex-col gap-4 bg-slate-100">
        <Link
          to="/engineer"
          className="hover:bg-slate-200 p-4 text-start font-bold rounded-lg"
        >
          Главная
        </Link>
        <Link
          to="/engineer/rooms"
          className="hover:bg-slate-200 p-4 text-start font-bold rounded-lg"
        >
          Помещение/Устройства
        </Link>
      </aside> */}
      <div className="w-full">
        <Navbar className="bg-slate-100 border-b-2 border-slate-200">
          <NavbarBrand>
            <img src={Logo} alt="University Logo" className="w-28 mx-4 mt-4" />
          </NavbarBrand>
          <NavbarContent className="hidden sm:flex gap-6 mt-" justify="end">
            <NavbarItem className="flex flex-row gap-2 items-center ">
              <div>{user && user.userName}</div>
              <Button onPress={onLogout} color="danger">
                Выйти
              </Button>
            </NavbarItem>
          </NavbarContent>
        </Navbar>

        <main className="w-[80%] h-full p-10 mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EngineerLayout;
