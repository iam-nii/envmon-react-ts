import { useEffect, useRef } from "react";
import Chart from "../../components/Chart";
import RoomDetails from "./RoomDetails";

// Define type for the chart reference
interface ChartRef {
  chart?: {
    reflow: () => void;
  };
}

const tempData = [
  { y: 23.0, dateTime: "2023.10.01" },
  { y: 23.1, dateTime: "2023.10.01" },
  { y: 23.0, dateTime: "2023.10.01" },
  { y: 22.9, dateTime: "2023.10.01" },
  { y: 23.2, dateTime: "2023.10.01" },
  { y: 23.1, dateTime: "2023.10.01" },
  { y: 23.0, dateTime: "2023.10.01" },
  { y: 23.3, dateTime: "2023.10.01" },
  { y: 23.2, dateTime: "2023.10.01" },
  { y: 23.1, dateTime: "2023.10.01" },
  { y: 23.0, dateTime: "2023.10.01" },
  { y: 22.8, dateTime: "2023.10.01" },
  { y: 23.1, dateTime: "2023.10.01" },
  { y: 23.0, dateTime: "2023.10.01" },
  { y: 23.2, dateTime: "2023.10.01" },
  { y: 22.9, dateTime: "2023.10.01" },
  { y: 23.1, dateTime: "2023.10.01" },
  { y: 23.0, dateTime: "2023.10.01" },
  { y: 23.3, dateTime: "2023.10.01" },
  { y: 23.2, dateTime: "2023.10.01" },
];
//52, 53, 53, 52, 52, 51, 51, 51, 50, 51, 51
const humidityData = [
  { y: 52, dateTime: "2023-10-01 12:00" },
  { y: 53, dateTime: "2023-10-01 12:05" },
  { y: 53, dateTime: "2023-10-01 12:10" },
  { y: 52, dateTime: "2023-10-01 12:15" },
  { y: 52, dateTime: "2023-10-01 12:20" },
  { y: 51, dateTime: "2023-10-01 12:25" },
  { y: 51, dateTime: "2023-10-01 12:30" },
  { y: 51, dateTime: "2023-10-01 12:35" },
  { y: 50, dateTime: "2023-10-01 12:40" },
  { y: 51, dateTime: "2023-10-01 12:45" },
  { y: 52, dateTime: "2023-10-01 12:00" },
  { y: 53, dateTime: "2023-10-01 12:05" },
  { y: 53, dateTime: "2023-10-01 12:10" },
  { y: 52, dateTime: "2023-10-01 12:15" },
  { y: 52, dateTime: "2023-10-01 12:20" },
  { y: 51, dateTime: "2023-10-01 12:25" },
  { y: 51, dateTime: "2023-10-01 12:30" },
  { y: 51, dateTime: "2023-10-01 12:35" },
  { y: 50, dateTime: "2023-10-01 12:40" },
  { y: 51, dateTime: "2023-10-01 12:45" },
];
const lightData = [
  { y: 105, dateTime: "2023-10-01 12:00" },
  { y: 103, dateTime: "2023-10-01 12:05" },
  { y: 108, dateTime: "2023-10-01 12:10" },
  { y: 101, dateTime: "2023-10-01 12:15" },
  { y: 106, dateTime: "2023-10-01 12:20" },
  { y: 102, dateTime: "2023-10-01 12:25" },
  { y: 107, dateTime: "2023-10-01 12:30" },
  { y: 104, dateTime: "2023-10-01 12:35" },
  { y: 109, dateTime: "2023-10-01 12:40" },
  { y: 100, dateTime: "2023-10-01 12:45" },
  { y: 105, dateTime: "2023-10-01 12:50" },
  { y: 103, dateTime: "2023-10-01 12:55" },
  { y: 108, dateTime: "2023-10-01 13:00" },
  { y: 101, dateTime: "2023-10-01 13:05" },
  { y: 106, dateTime: "2023-10-01 13:10" },
  { y: 102, dateTime: "2023-10-01 13:15" },
  { y: 107, dateTime: "2023-10-01 13:20" },
  { y: 104, dateTime: "2023-10-01 13:25" },
];
const vocData = [
  { y: 2, dateTime: "2023-10-01 12:00" },
  { y: 5, dateTime: "2023-10-01 12:05" },
  { y: 8, dateTime: "2023-10-01 12:10" },
  { y: 3, dateTime: "2023-10-01 12:15" },
  { y: 6, dateTime: "2023-10-01 12:20" },
  { y: 9, dateTime: "2023-10-01 12:25" },
  { y: 1, dateTime: "2023-10-01 12:30" },
  { y: 4, dateTime: "2023-10-01 12:35" },
  { y: 7, dateTime: "2023-10-01 12:40" },
  { y: 0, dateTime: "2023-10-01 12:45" },
  { y: 2, dateTime: "2023-10-01 12:50" },
  { y: 5, dateTime: "2023-10-01 12:55" },
  { y: 8, dateTime: "2023-10-01 13:00" },
  { y: 3, dateTime: "2023-10-01 13:05" },
  { y: 6, dateTime: "2023-10-01 13:10" },
  { y: 9, dateTime: "2023-10-01 13:15" },
  { y: 1, dateTime: "2023-10-01 13:20" },
  { y: 4, dateTime: "2023-10-01 13:25" },
  { y: 7, dateTime: "2023-10-01 13:30" },
  { y: 0, dateTime: "2023-10-01 13:35" },
];
const co2Data = [
  { y: 414, dateTime: "2023-10-01 12:00" },
  { y: 412, dateTime: "2023-10-01 12:05" },
  { y: 401, dateTime: "2023-10-01 12:10" },
  { y: 402, dateTime: "2023-10-01 12:15" },
  { y: 403, dateTime: "2023-10-01 12:20" },
  { y: 401, dateTime: "2023-10-01 12:25" },
  { y: 405, dateTime: "2023-10-01 12:30" },
  { y: 404, dateTime: "2023-10-01 12:35" },
  { y: 400, dateTime: "2023-10-01 12:40" },
  { y: 407, dateTime: "2023-10-01 12:45" },
  { y: 403, dateTime: "2023-10-01 12:50" },
  { y: 401, dateTime: "2023-10-01 12:55" },
  { y: 405, dateTime: "2023-10-01 13:00" },
  { y: 404, dateTime: "2023-10-01 13:05" },
  { y: 400, dateTime: "2023-10-01 13:10" },
  { y: 407, dateTime: "2023-10-01 13:15" },
  { y: 403, dateTime: "2023-10-01 13:20" },
  { y: 401, dateTime: "2023-10-01 13:25" },
];

function RoomData() {
  const chartRefs = useRef<(HTMLDivElement & ChartRef)[]>([]);

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
        onClick={() => toggleFullScreen(chartRefs.current[0])}
      >
        <Chart
          type="spline"
          title="График изменения температуры"
          data={tempData}
          max={25}
          min={22}
          yAxisTitle="Температура, °C"
        />
      </div>

      {/* Humidity Chart */}
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
      <div
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
      </div>

      {/* Wind Speed Chart */}
      <div
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
      </div>

      {/* CO2 Chart */}
      <div
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
      </div>
    </div>
  );
}

export default RoomData;
