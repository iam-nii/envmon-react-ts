import { createContext, useContext, useEffect, useState } from "react";
// import axiosClient from "../axiosClient";
import { Parameters } from "../Types";
import axiosClient from "../axiosClient";

interface ParameterContextProviderType {
  children: React.ReactNode;
}

interface ParameterContextType {
  parameters: Parameters;
  setParameters: (parameters: Parameters) => void;
}

const ParameterContext = createContext<ParameterContextType>({
  parameters: [],
  setParameters: () => {},
});

export const ParameterContextProvider = ({
  children,
}: ParameterContextProviderType) => {
  const [parameters, setParameters] = useState<Parameters>([]);
  useEffect(() => {
    axiosClient
      .get("/api/parameters/?method=GET")
      .then(({ data }) => {
        // console.log("response", response);
        setParameters(data.data);
        // console.log(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <ParameterContext.Provider value={{ parameters, setParameters }}>
      {children}
    </ParameterContext.Provider>
  );
};

export const useParameterContext = () => useContext(ParameterContext);
