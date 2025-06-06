import { useEffect, useRef } from "react";
// import RoomDetails from "./RoomDetails";
import RoomDetailsUpd from "./RoomDetailsUpd";

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

  // const toggleFullScreen = (current: HTMLDivElement | null) => {
  //   if (current) {
  //     if (!document.fullscreenElement) {
  //       // Enter fullscreen mode
  //       current.requestFullscreen().catch((err) => {
  //         console.error("Error entering fullscreen mode", err);
  //       });
  //     } else {
  //       // Exit fullscreen mode
  //       document.exitFullscreen();
  //     }
  //   }
  // };

  return (
    <div className="flex flex-col gap-4 h-screen min-w-full">
      <div className="w-full mb-5">
        {/* <RoomDetails /> */}
        <RoomDetailsUpd />
      </div>

      {/* Chart */}
      {/* <div
        ref={(el) => {
          if (el) {
            chartRefs.current[0] = el;
          }
        }}
        className="w-[75vw] h-[800px] cursor-pointer"
        // onClick={() => toggleFullScreen(chartRefs.current[0])}
        onDoubleClick={() => toggleFullScreen(chartRefs.current[0])}
      ></div> */}
    </div>
  );
}

export default RoomData;
