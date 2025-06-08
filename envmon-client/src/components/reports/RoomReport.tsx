import EntityReport from "./EntityReport";

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

interface Room {
  roomNumber: number;
  entities: Entity[];
}
interface RoomReportProps {
  room: Room;
}

const RoomReport = ({ room }: RoomReportProps) => (
  <div key={room.roomNumber} className="mt-5" id="room-report">
    <h1 className="text-xl font-bold">Помещение № {room.roomNumber}</h1>
    {room.entities.length > 0 && room.entities[0].parameters.length > 0 ? (
      room.entities.map((entity) => (
        <EntityReport entity={entity} key={entity.device_id} />
      ))
    ) : (
      <h1 className="font-semibold text-lg text-slate-700">
        За выбранный период нет данных
      </h1>
    )}
  </div>
);

export default RoomReport;
