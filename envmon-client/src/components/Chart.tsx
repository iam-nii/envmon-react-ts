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
function Chart({ data, roomNumber }: ChartProps) {
  const seriesData = Array.isArray(data[0])
    ? (data as SeriesData[][])
    : ([data] as SeriesData[][]);

  // const DATA: DataItem[] = [
  //   // {
  //   //     id: 20,
  //   //     dateTime: "2023-10-01 12:00",
  //   //     temperature: 23.2,
  //   //     humidity: 51,
  //   //     light: 105,
  //   //     voc: 0,
  //   //     co2: 414,
  //   // },
  //   {
  //     batch_num: 19,
  //     dateTime: "2023-10-01 12:00",
  //     temperature: 23.2,
  //     humidity: 51,
  //     light: 105,
  //     voc: 3,
  //     co2: 414,
  //   },
  //   {
  //     batch_num: 18,
  //     dateTime: "2023-10-01 12:00",
  //     temperature: 23.0,
  //     humidity: 51,
  //     light: 105,
  //     voc: 1,
  //     co2: 414,
  //   },
  //   {
  //     batch_num: 17,
  //     dateTime: "2023-10-01 12:00",
  //     temperature: 23.1,
  //     humidity: 51,
  //     light: 105,
  //     voc: 4,
  //     co2: 414,
  //   },
  //   {
  //     batch_num: 16,
  //     dateTime: "2023-10-01 12:00",
  //     temperature: 22.9,
  //     humidity: 51,
  //     light: 105,
  //     voc: 1,
  //     co2: 414,
  //   },
  //   {
  //     batch_num: 15,
  //     dateTime: "2023-10-01 12:00",
  //     temperature: 23.2,
  //     humidity: 51,
  //     light: 105,
  //     voc: 0,
  //     co2: 414,
  //   },
  //   {
  //     batch_num: 14,
  //     dateTime: "2023-10-01 12:00",
  //     temperature: 23.0,
  //     humidity: 51,
  //     light: 105,
  //     voc: 4,
  //     co2: 414,
  //   },
  //   {
  //     batch_num: 13,
  //     dateTime: "2023-10-01 12:00",
  //     temperature: 23.1,
  //     humidity: 51,
  //     light: 105,
  //     voc: 3,
  //     co2: 414,
  //   },
  //   {
  //     batch_num: 12,
  //     dateTime: "2023-10-01 12:00",
  //     temperature: 22.8,
  //     humidity: 51,
  //     light: 105,
  //     voc: 7,
  //     co2: 414,
  //   },
  //   {
  //     batch_num: 11,
  //     dateTime: "2023-10-01 12:00",
  //     temperature: 23.0,
  //     humidity: 51,
  //     light: 105,
  //     voc: 4,
  //     co2: 414,
  //   },
  //   {
  //     batch_num: 10,
  //     dateTime: "2023-10-01 12:00",
  //     temperature: 23.1,
  //     humidity: 51,
  //     light: 105,
  //     voc: 2,
  //     co2: 414,
  //   },
  //   {
  //     batch_num: 9,
  //     dateTime: "2023-10-01 12:00",
  //     temperature: 23.2,
  //     humidity: 50,
  //     light: 105,
  //     voc: 5,
  //     co2: 414,
  //   },
  //   {
  //     batch_num: 8,
  //     dateTime: "2023-10-01 12:00",
  //     temperature: 23.3,
  //     humidity: 51,
  //     light: 105,
  //     voc: 1,
  //     co2: 414,
  //   },
  //   {
  //     batch_num: 7,
  //     dateTime: "2023-10-01 12:00",
  //     temperature: 23.0,
  //     humidity: 51,
  //     light: 105,
  //     voc: 0,
  //     co2: 414,
  //   },
  //   {
  //     batch_num: 6,
  //     dateTime: "2023-10-01 12:00",
  //     temperature: 23.1,
  //     humidity: 51,
  //     light: 105,
  //     voc: 0,
  //     co2: 414,
  //   },
  //   {
  //     batch_num: 5,
  //     dateTime: "2023-10-01 12:00",
  //     temperature: 23.2,
  //     humidity: 52,
  //     light: 105,
  //     voc: 2,
  //     co2: 414,
  //   },
  //   {
  //     batch_num: 4,
  //     dateTime: "2023-10-01 12:00",
  //     temperature: 22.9,
  //     humidity: 52,
  //     light: 105,
  //     voc: 5,
  //     co2: 414,
  //   },
  //   {
  //     batch_num: 3,
  //     dateTime: "2023-10-01 12:00",
  //     temperature: 23.0,
  //     humidity: 53,
  //     light: 105,
  //     voc: 7,
  //     co2: 414,
  //   },
  //   {
  //     batch_num: 2,
  //     dateTime: "2023-10-01 12:00",
  //     temperature: 23.1,
  //     humidity: 53,
  //     light: 105,
  //     voc: 7,
  //     co2: 414,
  //   },
  //   {
  //     batch_num: 1,
  //     dateTime: "2023-10-01 12:00",
  //     temperature: 23.0,
  //     humidity: 52,
  //     light: 105,
  //     voc: 0,
  //     co2: 414,
  //   },
  // ];
  const options = {
    chart: {
      type: "spline",
      animation: false,
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
          text: "Parameter 1",
          align: "middle", // Vertically center the title
          rotation: 270, // Rotate text vertically
          offset: 100, // Distance from axis line
          x: -40, // Shift title left (increase if needed)
          style: {
            color: "#333",
            fontWeight: "bold",
          },
        },
        plotLines: [
          {
            color: "red", // Red line
            value: 23, // Value at which to draw the line
            width: 2, // Line thickness
            zIndex: 5, // Keep above gridlines
            dashStyle: "Solid", // Optional: can be "Dash", "Dot", etc.
            label: {
              text: "min: 20",
              align: "left",
              x: 10,
              style: {
                color: "red",
                // fontWeight: "bold",
              },
            },
          },
        ],
        top: "0%",
        height: "30%",
        offset: 0,
        lineWidth: 1,
      },
      {
        title: {
          text: "Parameter 2",
          align: "middle", // Vertically center the title
          rotation: 270, // Rotate text vertically
          offset: 0, // Distance from axis line
          x: -40, // Shift title left (increase if needed)
          style: {
            color: "#333",
            fontWeight: "bold",
          },
        },
        top: "33%",
        height: "30%",
        offset: 0,
        lineWidth: 1,
      },
      {
        title: {
          text: "Parameter 3",
          align: "middle", // Vertically center the title
          rotation: 270, // Rotate text vertically
          offset: 0, // Distance from axis line
          x: -40,
          style: {
            color: "#333",
            fontWeight: "bold",
          },
        },
        top: "66%",
        height: "30%",
        offset: 0,
        lineWidth: 1,
      },
    ],
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
    series: [
      {
        name: "parameter_alias, unit of measurement",
        width: 3,
        color: "",
        data: seriesData[0],
        yAxis: 0, //0,1,2,3,4
      },
      {
        name: "parameter_alias, unit of measurement",
        width: 3,
        color: "",
        data: seriesData[1],
        yAxis: 1, //0,1,2,3,4
      },

      {
        name: "parameter_alias, unit of measurement",
        width: 3,
        color: "",
        data: seriesData[2],
        yAxis: 2, //0,1,2,3,4
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
