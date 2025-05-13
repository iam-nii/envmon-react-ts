import { useEffect, useState } from "react";
import axiosClient from "../axiosClient";

type ParameterReadingType = {
  techReg_id: number | undefined;
};
type Reading = {
  batch_num: number;
  logValue: number;
  log_id: number;
  mdt: Date;
  techReg_id: number;
};
type ParameterData = {
  reading: number;
  color: string;
};
function ParameterReading({ techReg_id }: ParameterReadingType) {
  const [paramReadings, setParamReadings] = useState<ParameterData[]>();
  const [maxReading, setMaxReading] = useState<number>();
  const [minReading, setMinReading] = useState<number>();
  useEffect(() => {
    // Get the last 3 values from the logs table given the techReg_id
    // http:///localhost/pdn1/api/logs/?method=GET&id=1&query=3
    axiosClient
      .get(`/api/logs/?method=GET&id=${techReg_id}&query=3`)
      .then(({ data }) => {
        console.log(`${techReg_id}:`, data.data);

        const readings: ParameterData[] = data.data.map((reading: Reading) => ({
          reading: reading.logValue,
          color:
            reading.logValue > maxReading! || reading.logValue < minReading!
              ? "text-red-700"
              : "text-green-500",
        }));
        // console.log(readings);

        setParamReadings(readings);
      });
  }, []);

  useEffect(() => {
    // Get the max an min values of the tech reg
    axiosClient
      // http:///localhost/pdn1/api/settings/?method=GET&query=maxmin&id=2
      .get(`/api/settings/?method=GET&query=maxmin&id=${techReg_id}`)
      .then(({ data }) => {
        console.log(data.data);
        setMaxReading(data.data.maxValue);
        setMinReading(data.data.minValue);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <span className="pl-5">
      {paramReadings?.map((reading, index) => (
        <span
          className={`text-md mr-2 ${index === 2 ? "text-lg font-bold" : ""} ${
            reading.color
          }`}
          key={index}
        >
          {reading.reading}
        </span>
      ))}
    </span>
  );
}

export default ParameterReading;
