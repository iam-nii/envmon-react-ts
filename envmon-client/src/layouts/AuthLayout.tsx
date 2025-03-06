import { Outlet } from "react-router-dom";
import TransitionWrapper from "../TransitionWrapper";

const AuthLayout = () => {
  return (
    <div className="bg-blue-50">
      <TransitionWrapper>
        <div className="bg-blue-50 h-screen w-full flex justify-center items-center">
          <div className="bg-white w-[30rem] shadow-2xl rounded-xl p-10">
            <Outlet />
          </div>
        </div>
      </TransitionWrapper>
    </div>
  );
};

export default AuthLayout;
