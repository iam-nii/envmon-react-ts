// import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { CalendarDays } from "lucide-react";

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface CustomDateRangePickerProps {
  defaultValue?: DateRange;
  onChange: (range: DateRange) => void;
}
// const formatDate = (date: Date) => format(date, "yyyy.MM.dd HH:mm:ss");

function CustomDateRangePicker({
  defaultValue,
  onChange,
}: CustomDateRangePickerProps) {
  const [startDate, setStartDate] = useState<Date | null>(
    defaultValue?.start || null
  );
  const [startOpen, setStartOpen] = useState<boolean>(false);
  const startDatePicketRef = useRef(null);

  const [endDate, setEndDate] = useState<Date | null>(
    defaultValue?.end || null
  );
  const [endOpen, setEndOpen] = useState<boolean>(false);
  const endDatePicketRef = useRef(null);

  const handleStartChange = (date: Date | null) => {
    setStartDate(date);
    if (date && endDate) {
      onChange({ start: date, end: endDate });
    }
  };
  const handleEndChange = (date: Date | null) => {
    setEndDate(date);
    if (startDate && date) {
      onChange({ start: startDate, end: date });
    }
  };
  const handleStartCalendarClick = () => {
    setStartOpen(true);
  };
  const handleEndCalendarClick = () => {
    setEndOpen(true);
  };
  return (
    <div className="flex gap-2 items-center">
      {/* Start Date */}
      <div className="flex w-68 border-large items-center px-2 border-slate-500 rounded-md">
        <DatePicker
          id="start-date"
          selected={startDate}
          onChange={handleStartChange}
          showTimeSelect
          timeFormat="HH:mm:ss"
          timeIntervals={1}
          dateFormat="dd.MM.yyyy HH:mm:ss"
          timeCaption="Время"
          open={startOpen}
          onClickOutside={() => setStartOpen(false)}
          startDate={startDate}
          endDate={endDate}
          placeholderText="dd.MM.yyyy HH:mm:ss"
          ref={startDatePicketRef}
          className="py-2 cursor-pointer outline-none"
        />
        <CalendarDays
          className="cursor-pointer"
          onClick={handleStartCalendarClick}
        />
      </div>
      <div className="bg-slate-500 ml-1 w-3 h-[3px] rounded-lg mr-1"></div>
      {/* End Date */}
      <div className="flex w-68 border-large items-center px-2 border-slate-500 rounded-md">
        <DatePicker
          id="end-date"
          selected={endDate}
          onChange={handleEndChange}
          showTimeSelect
          timeFormat="HH:mm:ss"
          timeIntervals={1}
          dateFormat="dd.MM.yyyy HH:mm:ss"
          timeCaption="Время"
          open={endOpen}
          startDate={startDate}
          onClickOutside={() => setEndOpen(false)}
          endDate={endDate}
          minDate={startDate!}
          placeholderText="dd.MM.yyyy HH:mm:ss"
          ref={endDatePicketRef}
          className="py-2 cursor-pointer outline-none"
        />
        <CalendarDays
          className="cursor-pointer"
          onClick={handleEndCalendarClick}
        />
      </div>
    </div>
  );
}

export default CustomDateRangePicker;
