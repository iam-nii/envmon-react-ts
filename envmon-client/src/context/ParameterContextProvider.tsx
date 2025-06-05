import { createContext, useContext, useEffect, useState } from "react";
// import axiosClient from "../axiosClient";
import { Parameters, Params } from "../Types";
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
        const params = data.data.map((param: Params) => {
          param.parameter_name = param.parameter_name?.trim();
          return param;
        });
        setParameters(params);
        // console.log(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  // useEffect(() => {
  //   console.log("parameters", parameters);
  // }, [parameters]);

  return (
    <ParameterContext.Provider value={{ parameters, setParameters }}>
      {children}
    </ParameterContext.Provider>
  );
};

export const useParameterContext = () => useContext(ParameterContext);
