import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";

interface SeriesData {
  y: number;
  dateTime: string;
}

type ChartProps = {
  data: SeriesData[] | SeriesData[][];
  max: number | number[];
  min: number | number[];
  yAxisTitle?: string | string[];
  roomNumber: string;
  colors?: string[];
};
function Chart({ data, max, min, yAxisTitle, roomNumber, colors }: ChartProps) {
  const seriesData = Array.isArray(data[0])
    ? (data as SeriesData[][])
    : ([data] as SeriesData[][]);

  // Noramilze other parameters
  const maxValues = Array.isArray(max) ? max : [max];
  const minValues = Array.isArray(min) ? min : [min];
  const yAxisTitles = Array.isArray(yAxisTitle) ? yAxisTitle : [yAxisTitle];

  const options = {
    chart: {
      type: "spline",
      height: "65%",
      events: {
        load: function () {
          // seriesData[0] = this.
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
    yAxis: [
      {
        title: {
          text: "",
          top: "25%",
          height: "24%",
          offset: 0,
          lineWidth: 1,
          min: 0,
          max: 80,
          plotLines: [
            {
              value: 0,
              width: 1,
              color: "#a5a5a5",
            },
          ],
          plotBands: [
            {
              color: "#FCFFC5",
              from: 0,
              to: 80,
              id: "",
              label: {
                text: "",
                y: -5,
                style: {
                  color: " blue",
                  fontWeight: "bold",
                  "z-index": 1,
                },
              },
            },
          ],
        },
      },
    ],
    // the series will be a list of objects passed in the props with the following properties
    series: [
      {
        name: "parameter_alias, unit of measurement",
        width: 3,
        color: "",
        data: seriesData[0],
        yAxis: 0, //0,1,2,3,4
      },
    ],
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
    tooltip: {
      headerFormat: "",
      pointFormat: "{point.x:%H:%M:%S} <b>{point.y:.2f}</b>",
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
