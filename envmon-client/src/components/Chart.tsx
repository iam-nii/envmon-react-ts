import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

type ChartProps = {
  type: string;
  title: string;
  data: Array<{ y: number; dateTime: string }>;
  max: number;
  min: number;
  yAxisTitle: string;
};
interface CustomTooltipContext extends Highcharts.Point {
  x: number;
  y: number;
  point: {
    index: number;
  };
}
function Chart({ type, title, data, max, min, yAxisTitle }: ChartProps) {
  const options = {
    chart: {
      type: type,
      height: "65%",
      legend: {
        enabled: false,
      },
    },
    title: {
      text: title,
      align: "left",
    },
    xAxis: {
      title: {
        text: "Номер замера",
      },
      tickInterval: 1, // Ensure the x-axis shows integers
      min: 1, // Start from 1
      max: data.length, // End at the length of the data
    },
    yAxis: {
      title: {
        text: yAxisTitle,
      },
      max: max + 1,
      min: min - 1,
      plotLines: [
        {
          color: "red",
          value: max,
          width: 2,
          zIndex: 5,
          label: {
            text: "Максимальное значение",
            align: "left",
            style: {
              color: "red",
            },
          },
        },
        {
          color: "red",
          value: min,
          width: 2,
          zIndex: 5,
          label: {
            text: "Минимальное значение",
            align: "left",
            style: {
              color: "red",
            },
          },
        },
      ],
    },
    series: [
      {
        data: data.map((point) => point.y),
      },
    ],
    tooltip: {
      formatter: function (this: CustomTooltipContext) {
        const dateTime = data[this.point.index].dateTime;
        return `<b>Замер ${this.x}</b><br/>${yAxisTitle}: ${this.y}<br/>Дата/Время: ${dateTime}`;
      },
    },
  };
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

export default Chart;
