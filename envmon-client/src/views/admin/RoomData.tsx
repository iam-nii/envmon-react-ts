import { useEffect, useRef } from "react";
// import Chart from "../../components/Chart";
import RoomDetails from "./RoomDetails";

// Define type for the chart reference
interface ChartRef {
  chart?: {
    reflow: () => void;
  };
}

// const tempData = [
//   { y: 23.0, dateTime: "2023.10.01" },
//   { y: 23.1, dateTime: "2023.10.01" },
//   { y: 23.0, dateTime: "2023.10.01" },
//   { y: 22.9, dateTime: "2023.10.01" },
//   { y: 23.2, dateTime: "2023.10.01" },
//   { y: 23.1, dateTime: "2023.10.01" },
//   { y: 23.0, dateTime: "2023.10.01" },
//   { y: 23.3, dateTime: "2023.10.01" },
//   { y: 23.2, dateTime: "2023.10.01" },
//   { y: 23.1, dateTime: "2023.10.01" },
//   { y: 23.0, dateTime: "2023.10.01" },
//   { y: 22.8, dateTime: "2023.10.01" },
//   { y: 23.1, dateTime: "2023.10.01" },
//   { y: 23.0, dateTime: "2023.10.01" },
//   { y: 23.2, dateTime: "2023.10.01" },
//   { y: 22.9, dateTime: "2023.10.01" },
//   { y: 23.1, dateTime: "2023.10.01" },
//   { y: 23.0, dateTime: "2023.10.01" },
//   { y: 23.3, dateTime: "2023.10.01" },
//   { y: 23.2, dateTime: "2023.10.01" },
// ];

function RoomData() {
  const chartRefs = useRef<(HTMLDivElement & ChartRef)[]>([]);
  //An array of objects of arrays of data
  // type DataPoint = {
  //   y: number;
  //   dateTime: string;
  // };
  // type Data = {
  //   [key: string]: DataPoint[];
  // };
  // type DataArray = Data[];
  // const [data, setData] = useState<DataArray>([]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        // Reflow charts when exiting fullscreen
        chartRefs.current.forEach((chartRef) => {
          if (chartRef?.chart) {
            chartRef.chart.reflow();
          }
        });
        document.body.style.overflow = ""; // Restore scrolling
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  const toggleFullScreen = (current: HTMLDivElement | null) => {
    if (current) {
      if (!document.fullscreenElement) {
        // Enter fullscreen mode
        current.requestFullscreen().catch((err) => {
          console.error("Error entering fullscreen mode", err);
        });
      } else {
        // Exit fullscreen mode
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 h-screen min-w-full">
      <div className="w-full mb-5">
        <RoomDetails />
      </div>

      {/* Temperature Chart */}
      <div
        ref={(el) => {
          if (el) {
            chartRefs.current[0] = el;
          }
        }}
        className="w-[75vw] h-[800px] cursor-pointer"
        // onClick={() => toggleFullScreen(chartRefs.current[0])}
        onDoubleClick={() => toggleFullScreen(chartRefs.current[0])}
      >
        {/* <Chart
          roomNumber="1"
          data={[tempData, humidityData, lightData, vocData, co2Data]}
          // max={[25, 60, 110, 10, 500]}
          // min={[22, 40, 100, 0, 400]}
          // yAxisTitle={[
          //   "Температура, °C",
          //   "Влажность, %",
          //   "Освещенность, лк",
          //   "VOC, ppm",
          //   "CO₂, ppm",
          // ]}
        /> */}
      </div>

      {/* Humidity Chart
      <div
        ref={(el) => {
          if (el) {
            chartRefs.current[1] = el;
          }
        }}
        className="w-[75vw] h-[800px] cursor-pointer"
        onClick={() => toggleFullScreen(chartRefs.current[1])}
      >
        <Chart
          type="spline"
          title="График изменения влажности"
          data={humidityData}
          max={60}
          min={40}
          yAxisTitle="Влажность, %"
        />
      </div>

      {/* Light Chart */}
      {/* <div
        ref={(el) => {
          if (el) {
            chartRefs.current[2] = el;
          }
        }}
        className="w-[75vw] h-[800px] cursor-pointer"
        onClick={() => toggleFullScreen(chartRefs.current[2])}
      >
        <Chart
          type="spline"
          title="График изменения освещенности"
          data={lightData}
          max={110}
          min={100}
          yAxisTitle="Освещенность, лк"
        />
      </div> */}

      {/* Wind Speed Chart */}
      {/* <div
        ref={(el) => {
          if (el) {
            chartRefs.current[3] = el;
          }
        }}
        className="w-[75vw] h-[800px] cursor-pointer"
        onClick={() => toggleFullScreen(chartRefs.current[3])}
      >
        <Chart
          type="spline"
          title="График изменения VOC"
          data={vocData}
          max={10}
          min={0}
          yAxisTitle="VOC, ppm"
        />
      </div> */}

      {/* CO2 Chart */}
      {/* <div
        ref={(el) => {
          if (el) {
            chartRefs.current[4] = el;
          }
        }}
        className="w-[75vw] h-[800px] cursor-pointer"
        onClick={() => toggleFullScreen(chartRefs.current[4])}
      >
        <Chart
          type="spline"
          title="График изменения CO2"
          data={co2Data}
          max={500}
          min={400}
          yAxisTitle="CO2, ppm"
        />
      </div> */}
    </div>
  );
}

export default RoomData;
