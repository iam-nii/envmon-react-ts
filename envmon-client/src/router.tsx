import { createHashRouter } from "react-router-dom";
//Auth
import SignIn from "./views/auth/SignIn";
import SignUp from "./views/auth/SignUp";

//Layouts
import AuthLayout from "./layouts/AuthLayout";
import UserLayout from "./layouts/EngineerLayout";
import AdminLayout from "./layouts/AdminLayout";

//Admin
import Dashboard from "./views/admin/Dashboard";
import Users from "./views/admin/Users_";
import Rooms from "./views/admin/Rooms_";
import Settings from "./views/admin/Settings_";
import RoomDetails from "./views/admin/RoomDetails";
import RoomData from "./views/admin/RoomData";

//Engineer
import EngineerDashboard from "./views/engineer/Dashboard";
import EngineerRooms from "./views/engineer/Rooms";

//Views
import About from "./views/About";
import Welcome from "./views/Welcome";
import NotFound from "./views/NotFound";
import RoomDevices from "./views/admin/RoomDevices";

const router = createHashRouter([
  {
    path: "/",
    element: <Welcome />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/signin",
        element: <SignIn />,
      },
    ],
  },
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      {
        path: "/admin",
        element: <Dashboard />,
      },
      {
        path: "/admin/users",
        element: <Users />,
      },
      {
        path: "/admin/rooms",
        element: <Rooms />,
      },
      {
        path: "/admin/data/:room_id",
        element: <RoomData />,
      },
      {
        path: "/admin/room/devices/:room_id",
        element: <RoomDevices />,
      },
      {
        path: "/admin/settings",
        element: <Settings />,
      },
      {
        path: "/admin/rooms/:id",
        element: <RoomDetails />,
      },
    ],
  },
  {
    path: "/",
    element: <UserLayout />,
    children: [
      {
        path: "/engineer",
        element: <EngineerDashboard />,
      },
      {
        path: "/engineer/rooms",
        element: <EngineerRooms />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
