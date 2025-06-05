import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
// import axiosClient from "../axiosClient";
import { Reports, Report } from "../Types";

interface ReportContextProviderType {
  children: React.ReactNode;
}

interface ReportContextType {
  Reports: Report[]; // Array of Report objects
  setReports: Dispatch<SetStateAction<Report[]>>; // Function to update Reports
  ReportRef: { current: Report[] };
}

const ReportContext = createContext<ReportContextType>({
  Reports: [],
  setReports: () => {},
  ReportRef: { current: [] },
});

export const ReportContextProvider = ({
  children,
}: ReportContextProviderType) => {
  // Load initial reports from localStorage or default to empty array
  const [Reports, setReports] = useState<Reports>(() => {
    const savedReports = localStorage.getItem("reports");
    return savedReports ? JSON.parse(savedReports) : [];
  });

  const ReportRef = useRef<Reports>([]);

  useEffect(() => {
    ReportRef.current = Reports;
    // console.log("ReportRef updated:", ReportRef.current);
    // Save reports to localStorage on every change
    localStorage.setItem("reports", JSON.stringify(Reports));
  }, [Reports]);

  return (
    <ReportContext.Provider value={{ Reports, setReports, ReportRef }}>
      {children}
    </ReportContext.Provider>
  );
};

export const useReportContext = () => useContext(ReportContext);
