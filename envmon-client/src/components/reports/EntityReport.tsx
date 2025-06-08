import ParameterReport from "./ParameterReport";

interface ReportEntry {
  logId: string | number;
  logValue: string | number;
  mdt: string; // assuming this is a date/time string
}

interface Parameter {
  parameter_name: string;
  parameter_alias: string;
  unitOfMeasure: string;
  trMin: number;
  trMax: number;
  report: ReportEntry[];
}
interface Entity {
  device_id: string | number;
  zone_num: number;
  parameters: Parameter[];
}
interface EntityReportProps {
  entity: Entity;
}
const EntityReport = ({ entity }: EntityReportProps) => (
  <div key={entity.device_id} id={entity.device_id.toString()}>
    <h1 className="font-semibold">
      Идентификация устройства: {entity.device_id}
    </h1>
    <h1 className="font-semibold">Номер зоны: {entity.zone_num}</h1>
    <h1 className="font-semibold">Параметры микроклимата</h1>

    {entity.parameters.map((parameter) => (
      <ParameterReport parameter={parameter} key={parameter.parameter_name} />
    ))}
  </div>
);

export default EntityReport;
