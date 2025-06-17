import { useEffect, useState } from "react";
import axiosClient from "../axiosClient";

type ParameterReadingType = {
  techReg_id: number | undefined;
};
// type Reading = {
//   batch_num: number;
//   logValue: number;
//   log_id: number;
//   mdt: Date;
//   techReg_id: number;
// };
type ParameterData = {
  reading: number;
  color: string;
};
function ParameterReading({ techReg_id }: ParameterReadingType) {
  // const [paramReadings, setParamReadings] = useState<ParameterData[]>();
  const [maxReading, setMaxReading] = useState<number>();
  const [minReading, setMinReading] = useState<number>();
  const [startLogging, setStartLogging] = useState<boolean>(false);

  useEffect(() => {
    getLastLogs();
    setStartLogging(true);
  }, [maxReading, minReading]);

  useEffect(() => {
    // Get the last 3 values from the logs table given the techReg_id
    // http:///localhost/pdn1/api/logs/?method=GET&id=1&query=3
    if (startLogging) {
      setInterval(() => {
        getLastLogs();
      }, 10000);
    }
  }, [startLogging, maxReading, minReading]);

  const [paramReading, setParamReading] = useState<ParameterData | null>(null);

  const getLastLogs = () => {
    axiosClient
      .get(`/api/logs/?method=GET&id=${techReg_id}&query=1`)
      .then(({ data }) => {
        const latest = data.data[0]; // Assuming the latest reading is first
        const newReading: ParameterData = {
          reading: latest.logValue,
          color: "text-blue-500", // Blue initially
        };
        setParamReading(newReading);

        const color =
          latest.logValue <= maxReading! && latest.logValue >= minReading!
            ? "text-green-700"
            : "text-red-700";

        setTimeout(() => {
          setParamReading({
            reading: latest.logValue,
            color: color,
          });
        }, 400); // 500ms blue flash
      });
  };

  useEffect(() => {
    // Get the max an min values of the tech reg
    axiosClient
      // http:///localhost/pdn1/api/settings/?method=GET&query=maxmin&id=2
      .get(`/api/settings/?method=GET&query=maxmin&id=${techReg_id}`)
      .then(({ data }) => {
        // console.log(data.data[0].maxValue);
        setMaxReading(data.data[0].maxValue);
        setMinReading(data.data[0].minValue);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  // useEffect(() => {
  //   console.log(maxReading);
  //   console.log(minReading);
  // }, [maxReading, minReading]);

  return (
    <div className="pl-2 flex gap-2">
      <p>{minReading} </p>
      {paramReading && (
        <p className={`font-bold  ${paramReading.color}`}>
          {paramReading.reading}
        </p>
      )}
      <p> {maxReading}</p>
    </div>
  );
}

export default ParameterReading;
