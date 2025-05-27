import { Select, SelectItem, DateRangePicker, Button } from "@heroui/react";
import { useRoomContext } from "../../context/RoomContextProvider";
import { parseZonedDateTime } from "@internationalized/date";
import { useState } from "react";
import { useReportContext } from "../../context/ReportContextProvider";
import { Report } from "../../Types";

function Reports() {
  const { rooms } = useRoomContext();
  const [roomNumber, setRoomNumber] = useState<number>(0);
  const { ReportRef } = useReportContext();
  const [roomReport, setRoomReport] = useState<Report | null>(null);
  // const [isGeneratedReport, setIsGeneratedReport] = useState<boolean>(false);

  const handleRoomSelectionChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRoomReport(null);
    const roomNumber = rooms.find(
      (room) => room.room_id === Number(e.target.value)
    )?.roomNumber;
    setRoomNumber(roomNumber!);
  };
  const generateReport = () => {
    const report = ReportRef.current.find(
      (report: Report) => report.room_number === roomNumber
    );

    if (report) {
      setRoomReport(report);
      // console.log("report", report);
      const param_names = report?.room_report.map((param) => param.param_name);
      console.log("param_names", param_names);
      // setIsGeneratedReport(true);
    }
  };
  return (
    <>
      <div className="flex gap-2">
        <h1 className="w-[45%] my-auto font-bold text-lg">
          ОТЧЕТ О МОНИТОРИНГЕ МИКРОКЛИМАТА ЗА ПЕРИОД
        </h1>
        <div className="w-">
          <DateRangePicker
            aria-label="Период отчета"
            hideTimeZone
            variant="underlined"
            label={"Период отчета"}
            onChange={(value) => {
              console.log("value", value);
            }}
            defaultValue={{
              start: parseZonedDateTime("2025-05-01T00:45[Europe/Moscow]"),
              end: parseZonedDateTime("2025-05-08T11:15[Europe/Moscow]"),
            }}
            visibleMonths={2}
            hourCycle={24}
          />
        </div>
      </div>
      <div className="mt-10 flex gap-5 items-center">
        <Select
          label="Помещение"
          placeholder="Выберите помещение"
          variant="bordered"
          className="w-52"
          onChange={handleRoomSelectionChange}
        >
          {rooms?.map((room) => (
            <SelectItem
              key={String(room.room_id)}
              textValue={String(room.roomNumber)}
            >
              {room.roomNumber} ({room.location})
            </SelectItem>
          ))}
        </Select>
        <Button
          isDisabled={!roomNumber}
          size="lg"
          color="primary"
          className="py-7 font-bold"
          onPress={() => generateReport()}
        >
          Генерировать отчет
        </Button>
      </div>
      {roomReport && (
        <>
          <div className="mt-10">
            <h1 className="font-bold text-lg mb-5">
              Параметры микроклимата помещения №{roomNumber}
            </h1>
            {roomReport.room_report.map((param) => (
              <div key={param.param_name}>
                <h2 className="text-md font-bold">
                  {param.param_name}, {param.param_uom}{" "}
                  <span>[{param.range}]</span>
                </h2>
                <div className="grid grid-rows-3 grid-flow-col gap-1 w-[70%] bg-black p-1">
                  {param.values.map((value, index) => (
                    <div key={index} className="bg-slate-50 p-1">
                      <span className="font-bold text-red-600">{value}</span> (
                      {param.date[index]})
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default Reports;
