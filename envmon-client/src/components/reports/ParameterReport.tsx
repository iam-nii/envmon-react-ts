interface ReportEntry {
  logId: string | number;
  logValue: string | number;
  mdt: string;
}
interface Parameter {
  parameter_name: string;
  parameter_alias: string;
  unitOfMeasure: string;
  trMin: number;
  trMax: number;
  report: ReportEntry[];
}
interface ParameterReportProps {
  parameter: Parameter;
}

const ParameterReport = ({ parameter }: ParameterReportProps) => {
  if (parameter.report.length === 0) return null;

  return (
    <>
      <h1 className="font-bold mt-2 mb-2">
        {parameter.parameter_name} {parameter.parameter_alias},{" "}
        {parameter.unitOfMeasure} [{parameter.trMin} - {parameter.trMax}]
      </h1>
      <div className="flex flex-row flex-wrap gap-1 w-[75%] bg-slate-500 rounded-lg p-1">
        {parameter.report.map((report) => (
          <div className="bg-slate-50 p-1 w-[33%]" key={report.logId}>
            <p className="text-red-600 font-bold break-words ">
              {report.logValue} <span className="text-black">{report.mdt}</span>
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default ParameterReport;
