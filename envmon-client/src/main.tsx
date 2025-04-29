import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import router from "./router.tsx";
import { RouterProvider } from "react-router-dom";
import { HeroUIProvider } from "@heroui/react";
import { UserContextProvider } from "./context/UserContextProvider.tsx";
import { RoomContextProvider } from "./context/RoomContextProvider.tsx";
import { DeviceContextProvider } from "./context/DeviceContextProvider.tsx";
import { ParameterContextProvider } from "./context/ParameterContextProvider.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserContextProvider>
      <RoomContextProvider>
        <DeviceContextProvider>
          <ParameterContextProvider>
            <HeroUIProvider>
              <RouterProvider router={router} />
            </HeroUIProvider>
          </ParameterContextProvider>
        </DeviceContextProvider>
      </RoomContextProvider>
    </UserContextProvider>
  </StrictMode>
);
