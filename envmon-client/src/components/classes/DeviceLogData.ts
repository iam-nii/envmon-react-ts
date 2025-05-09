export class DeviceLogData {
  device_id: string;
  room_number: number;
  reqInterval: number = 10;

  public constructor(
    device_id: string,
    room_number: number,
    reqInterval: number
  ) {
    this.device_id = device_id;
    this.room_number = room_number;
    this.reqInterval = reqInterval;
  }

  public getLogData() {
    setInterval(() => {
      console.log("Getting log data");
    }, this.reqInterval * 1000);
  }
}
