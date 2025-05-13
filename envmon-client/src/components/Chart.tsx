import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import { useEffect, useRef, useState } from "react";

type DataPoint = {
  y: number;
  batch_num: number;
};
type GraphData = {
  [title: string]: {
    data?: DataPoint[] | null;
    max: number;
    min: number;
  };
};
type ChartProps = {
  data: GraphData[];
  // max: number | number[];
  // min: number | number[];
  // yAxisTitle?: string | string[];
  roomNumber: string;
  // colors?: string[];
};
function Chart({ data, roomNumber }: ChartProps) {
  const [DATA, setDATA] = useState<GraphData[]>([]);
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  useEffect(() => {
    console.log(data);
  }, []);
  useEffect(() => {
    if (!DATA.length) return;

    // Find max batch_num across all series
    const maxBatch = Math.max(
      ...DATA.flatMap((item) => {
        const title = Object.keys(item)[0];
        return item[title[0]]?.data?.map((dp) => dp.batch_num) || [];
      }).flat()
    );

    // Access chart instance via ref (you need to add a ref to HighchartsReact)
    if (chartRef.current) {
      const chart = chartRef.current.chart;
      const xAxis = chart.xAxis[0];
      const visibleCount = 10; // or 20, 30 depending on your default

      xAxis.setExtremes(maxBatch - visibleCount + 1, maxBatch);
    }
  }, [DATA]);

  useEffect(() => {
    setDATA(data);
  }, [data]);

  const options = {
    chart: {
      type: "spline",
      animation: false,
      height: "65%",
      events: {
        load: function (this: Highcharts.Chart) {
          // Defensive checks
          if (!this.series || this.series.length === 0) return;

          // Filter series that have data and non-empty data arrays
          const allDataPoints = this.series
            .filter((s) => s && s.data && s.data.length > 0)
            .flatMap((s) => s.data.map((point) => point.x));

          if (allDataPoints.length === 0) return;

          const maxBatch = Math.max(...allDataPoints);
          const minBatch = maxBatch - 10 + 1;

          this.xAxis[0].setExtremes(minBatch, maxBatch);
        },
      },
    },
    title: {
      text: `Тренд измерения параметров микроклимата производственного помещения ${roomNumber}`,
    },
    xAxis: {
      type: "linear",
      allowDecimals: false,
      tickPixelInterval: 1.0,
    },
    yAxis: DATA.map((item, index) => {
      const title = Object.keys(item);
      const numberOfAxes = DATA.length;
      const spacing = 0;
      const totalSpacing = spacing * (numberOfAxes - 1);
      const heightPerAxis = (100 - totalSpacing) / numberOfAxes;

      // console.log(title);
      return {
        title: {
          text: title,
          align: "middle",
          rotation: 270,
          offset: 100,
          x: -40,
          style: {
            color: "#333",
            fontWeight: "bold",
          },
        },
        plotLines: [
          {
            color: "red", // Red line
            value: item[title[0]].min, // Value at which to draw the line
            width: 2, // Line thickness
            zIndex: 5, // Keep above gridlines
            dashStyle: "Solid", // Optional: can be "Dash", "Dot", etc.
            label: {
              text: `min: ${item[title[0]].min}`,
              align: "left",
              x: 10,
              style: {
                color: "red",
                // fontWeight: "bold",
              },
            },
          },
          {
            color: "red", // Red line
            value: item[title[0]].max, // Value at which to draw the line
            width: 2, // Line thickness
            zIndex: 5, // Keep above gridlines
            dashStyle: "Solid", // Optional: can be "Dash", "Dot", etc.
            label: {
              text: `max: ${item[title[0]].max}`,
              align: "left",
              x: 10,
              style: {
                color: "red",
                // fontWeight: "bold",
              },
            },
          },
        ],
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
    series: DATA.map((item, index) => {
      const title = Object.keys(item);
      console.log(item[title[0]]);
      return {
        name: `${title}`,
        width: 3,
        color: "",
        data:
          item[title[0]]?.data?.map((dp: DataPoint) => ({
            x: dp.batch_num,
            y: dp.y,
          })) || [],
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
      verticalAlign: "bottom",
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
      pointFormat: "Batch: {point.x} <b>{point.y:.2f}</b>",
    },
    rangeSelector: {
      enabled: true,
      allButtonsEnabled: true,
      selected: 0, // Default selected button (0 = first button)
      buttons: [
        {
          type: "x",
          count: 10,
          text: "10",
        },
        {
          type: "x",
          count: 20,
          text: "20",
        },
        {
          type: "x",
          count: 30,
          text: "30",
        },
        {
          type: "all",
          text: "All",
        },
      ],
      buttonTheme: {
        // Optional: style your buttons
        width: 40,
      },
      inputEnabled: false, // Hide date inputs if not needed
    },
  };
  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType={"stockChart"}
      options={options}
    />
  );
}

export default Chart;
