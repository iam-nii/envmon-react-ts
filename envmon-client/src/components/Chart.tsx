// import { Button, ButtonGroup } from "@heroui/react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import { useEffect, useRef, useState } from "react";

const COLORS = [
  "#0000FF",
  "#00FF00",
  "#e900ff",
  "#ff5200",
  "#ff0070",
  "#a74b4b",
  "#312e2e",
];
type DataPoint = {
  y: number;
  x: number | string;
};
type GraphData = {
  [title: string]: {
    data?: DataPoint[] | null;
    max: number;
    min: number;
    uom: string;
  };
};
type ChartProps = {
  data: GraphData[];
  // max: number | number[];
  // min: number | number[];
  // yAxisTitle?: string | string[];
  // roomNumber: string;
  // colors?: string[];
};
function Chart({ data }: ChartProps) {
  // const [DATA, setDATA] = useState<GraphData[]>([]);
  const [legend, setLegend] = useState<string[]>([]);
  // const [series, setSeries] = useState<GraphData[]>([]);
  // const chartRef = useRef<HighchartsReact.RefObject>(null);
  // const [windowSize, setWindowSize] = useState<number | "all">("all");
  const effectRan = useRef(false);
  // const [userZoomed, setUserZoomed] = useState(false);

  // const filteredData = useMemo(() => {
  //   return data.map((item) => {
  //     const title = Object.keys(item)[0];
  //     const allPoints = item[title].data || [];
  //     if (windowSize === "all") return item;
  //     return {
  //       ...item,
  //       [title]: {
  //         ...item[title],
  //         data: allPoints.slice(-windowSize),
  //       },
  //     };
  //   });
  // }, [data, windowSize]);
  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;
    // console.log(data);
    data.forEach((item) => {
      const title = Object.keys(item)[0];
      // console.log(item[title].uom);
      setLegend((prev) => [...prev, `${title} (${item[title].uom})`]);
    });
    // setSeries(data);
  }, [data]);
  useEffect(() => {
    console.log(legend);
  }, [legend]);

  useEffect(() => {}, []);

  const options = {
    chart: {
      type: "spline",
      labels: {
        align: "right",
        x: 60,
      },
      opposite: false,
      animation: false,
      height: "65%",
      // width: "100%",
      events: {
        // load: function (this: Highcharts.Chart) {
        //   // Defensive checks
        //   if (!this.series || this.series.length === 0) return;
        //   // Filter series that have data and non-empty data arrays
        //   const allDataPoints = this.series
        //     .filter((s) => s && s.data && s.data.length > 0)
        //     .flatMap((s) => s.data.map((point) => point.x));
        //   if (allDataPoints.length === 0) return;
        //   const maxBatch = Math.max(...allDataPoints);
        //   const minBatch = maxBatch - 10 + 1;
        //   this.xAxis[0].setExtremes(minBatch, maxBatch);
        // },
      },
    },
    title: {
      // text: `Тренд измерения параметров микроклимата производственного помещения ${roomNumber}`,
    },
    xAxis: {
      type: "category",
      allowDecimals: false,

      tickPixelInterval: 1.0,
      dateTimeLabelFormats: {
        hour: "%H:%M",
        minute: "%H:%M",
        second: "%H:%M:%S",
      },
      labels: {
        enabled: false, // This line disables the x-axis labels
      },

      // },
    },
    yAxis: data.map((item, index) => {
      const title = Object.keys(item);
      const numberOfAxes = data.length;
      const spacing = 0;
      const totalSpacing = spacing * (numberOfAxes - 1);
      const heightPerAxis = (100 - totalSpacing) / numberOfAxes;

      const max = item[title[0]].max;
      const min = item[title[0]].min;
      // const uom = item[title[0]].uom;

      // console.log(title);
      return {
        title: {
          text: `[${min} - ${max}]`,
          align: "middle",
          rotation: 270,
          offset: 25,
          x: -5,
          style: {
            color: "#333",
            fontWeight: "bold",
          },
        },
        // plotLines: [
        //   {
        //     color: "red", // Red line
        //     value: item[title[0]].min, // Value at which to draw the line
        //     width: 2, // Line thickness
        //     zIndex: 5, // Keep above gridlines
        //     dashStyle: "Solid", // Optional: can be "Dash", "Dot", etc.
        //     label: {
        //       text: `min: ${item[title[0]].min}`,
        //       align: "left",
        //       x: 10,
        //       style: {
        //         color: "red",
        //         // fontWeight: "bold",
        //       },
        //     },
        //   },
        //   {
        //     color: "red", // Red line
        //     value: item[title[0]].max, // Value at which to draw the line
        //     width: 2, // Line thickness
        //     zIndex: 5, // Keep above gridlines
        //     dashStyle: "Solid", // Optional: can be "Dash", "Dot", etc.
        //     label: {
        //       text: `max: ${item[title[0]].max}`,
        //       align: "left",
        //       x: 10,
        //       style: {
        //         color: "red",
        //         // fontWeight: "bold",
        //       },
        //     },
        //   },
        // ],
        top: `${index * (heightPerAxis + spacing)}%`,
        height: heightPerAxis + 60,
        offset: 0,
        lineWidth: 1,
      };
    }),

    plotOptions: {
      spline: {
        lineWidth: 2,
        states: {
          hover: {
            lineWidth: 3,
          },
        },
        marker: {
          enabled: false,
        },
      },
    },

    // the series will be a list of objects passed in the props with the following properties
    series: data.map((item, index) => {
      const title = Object.keys(item);
      // console.log(item[title[0]]);
      return {
        name: `${title}`,
        width: 3,
        color: COLORS[index],
        data:
          item[title[0]]?.data?.map((dp: DataPoint) => {
            console.log(dp);
            return {
              name: dp.x,
              y: dp.y,
              // x: index,
            };
          }) || [],
        yAxis: index,
      };
    }),
    legend: {
      enabled: true,
      itemStyle: {
        color: "#333",
        fontWeight: "bold",
      },

      itemHoverStyle: {
        color: "#000",
      },
      layout: "horizontal",
      align: "center",
      verticalAlign: "top",
    },
    exporting: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    navigator: {
      enabled: false,
    },
    tooltip: {
      headerFormat: "",
      pointFormat:
        "Дата/Время: <b>{point.name}</b><br>Значение: <b>{point.y:.0f}</b>",
    },
    rangeSelector: {
      enabled: false,
      // allButtonsEnabled: true,
      // selected: 0, // Default selected button (0 = first button)
      // buttons: [
      //   {
      //     type: "x",
      //     count: 10,
      //     text: "10",
      //     onclick: () => {
      //       setWindowSize(10);
      //     },
      //   },
      //   {
      //     type: "x",
      //     count: 20,
      //     text: "20",
      //   },
      //   {
      //     type: "x",
      //     count: 30,
      //     text: "30",
      //   },
      //   {
      //     type: "all",
      //     text: "All",
      //   },
      // ],
      // buttonTheme: {
      //   // Optional: style your buttons
      //   width: 40,
      // },
      // inputEnabled: false, // Hide date inputs if not needed
    },
    scrollbar: {
      enabled: false,
    },
  };
  return (
    <div className="mb-20 w-full overflow-x-hidden">
      <div className=" hidden gap-2 items-center ">
        <p className="text-[14px] text-gray-500 ml-2">Zoom</p>
        {/* <ButtonGroup>
          <Button size="sm" radius="sm" onPress={() => setWindowSize(10)}>
            10
          </Button>
          <Button size="sm" radius="sm" onPress={() => setWindowSize(20)}>
            20
          </Button>
          <Button size="sm" radius="sm" onPress={() => setWindowSize(30)}>
            30
          </Button>
          <Button size="sm" radius="sm" onPress={() => setWindowSize("all")}>
            all
          </Button>
        </ButtonGroup> */}
      </div>
      <div className="w-full h-full overflow-x-hidden">
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={"stockChart"}
          options={options}
        />
      </div>
      <div className="flex flex-wrap gap-5 w-full">
        {legend.map((item, index) => (
          <div className="flex items-center gap-2" key={item}>
            <div
              className={"w-5 h-[2px]"}
              style={{ backgroundColor: COLORS[index] }}
            ></div>
            <p key={item} className="text-[14px] text-gray-700 font-extrabold">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chart;
