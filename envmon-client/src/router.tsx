import { createHashRouter } from "react-router-dom";
//Auth
import SignIn from "./views/auth/SignIn";
import SignUp from "./views/auth/SignUp";

//Layouts
import AuthLayout from "./layouts/AuthLayout";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/EngineerLayout";

//Admin
import Users from "./views/admin/Users_";
import Reports from "./views/admin/Reports";
import RoomData from "./views/admin/RoomData";
import Dashboard from "./views/admin/Dashboard";
import Rooms from "./views/admin/Rooms_Devices";
import RoomDetails from "./views/admin/RoomDetails";
import SystemSettings from "./views/admin/SystemSettings";
import ParamsRegulations from "./views/admin/ParamsRegulations";

//Engineer
import EngineerRooms from "./views/engineer/Rooms";
import EngineerDashboard from "./views/engineer/Dashboard";

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
        path: "/admin/system_settings",
        element: <SystemSettings />,
      },
      {
        path: "/admin/reports",
        element: <Reports />,
      },
      {
        path: "/admin/rooms_devices",
        element: <Rooms />,
      },
      {
        path: "admin/params_regulations",
        element: <ParamsRegulations />,
      },
      {
        path: "/admin/data/:room_id/:device_id",
        element: <RoomData />,
      },
      {
        path: "/admin/room/devices/:room_id/:device_id",
        element: <RoomDevices />,
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
      {
        path: "/engineer/reports",
        element: <Reports />,
      },
      {
        path: "/engineer/room/devices/:room_id/:device_id",
        element: <RoomDevices />,
      },
      {
        path: "/engineer/data/:room_id/:device_id",
        element: <RoomData />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
