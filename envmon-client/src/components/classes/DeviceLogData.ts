import axiosClient from "../../axiosClient";

export class DeviceLogData {
  device_id: string;
  room_number: number;
  reqInterval: number = 10;
  param_aliases: Array<string> = [];
  logData: Array<object> = [];

  public constructor(
    device_id: string,
    room_number: number,
    reqInterval: number,
    param_aliases: Array<string>
  ) {
    this.device_id = device_id;
    this.room_number = room_number;
    this.reqInterval = reqInterval;
    this.param_aliases = param_aliases;
  }

  public getLogData() {
    // http://localhost/pdn1/envmon/?id=n0G79nWmp6sm3ZYO
    setInterval(() => {
      axiosClient
        .get(`/envmon/?id=${this.device_id}`)
        .then(({ data }) => {
          type LogData = {
            [key: string]: number | string;
          };
          // get only the parameters that are in the param_aliases array
          const filteredData = this.param_aliases.reduce(
            (result: LogData, prop: string) => {
              if (data.data[prop] != undefined) {
                result[prop] = data.data[prop];
              }
              return result;
            },
            {}
          );
          // add id and dateTime to the filteredData
          filteredData["id"] = data.data["devID"];
          filteredData["dateTime"] = data.data["timestamp"];
          this.logData.push(filteredData);
          console.log("LogData", this.logData);
        })
        .catch((error) => {
          console.log(error);
        });
    }, this.reqInterval * 1000);
  }
}
