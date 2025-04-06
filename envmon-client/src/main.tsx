import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import router from "./router.tsx";
import { RouterProvider } from "react-router-dom";
import { HeroUIProvider } from "@heroui/react";
import { UserContextProvider } from "./context/UserContextProvider.tsx";
// import { RoomContextProvider } from "./context/RoomContextProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserContextProvider>
      {/* <RoomContextProvider> */}
      <HeroUIProvider>
        <RouterProvider router={router} />
      </HeroUIProvider>
      {/* </RoomContextProvider> */}
    </UserContextProvider>
  </StrictMode>
);
