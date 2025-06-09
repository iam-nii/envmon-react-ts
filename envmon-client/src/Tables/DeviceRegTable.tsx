import { useEffect, useState } from "react";
import { useDeviceContext } from "../context/DeviceContextProvider";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@heroui/react";
import { device } from "../Types";
import AddRegulation from "../components/AddRegulation";

function DeviceReg() {
  const { devices } = useDeviceContext();
  const [deviceId, setDeviceId] = useState<string>("");
  const { isOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    console.log(devices);
  }, [devices]);

  const handleDevicePress = (device: device) => {
    setDeviceId(device!.device_id!);
    onOpenChange();
  };
  useEffect(() => {
    console.log(deviceId);
  }, [deviceId]);
  return (
    <div className="flex gap-5">
      {devices!.map((device) => (
        <Card
          isPressable
          key={device.device_id}
          className="h-[120px] w-[30%] mt-10"
          onPress={() => {
            handleDevicePress(device);
          }}
        >
          <CardHeader>
            <div className="text-lg font-bold text-center w-full">
              {device.deviceName}
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="flex h-5 text-small">
            <div>
              <span className="font-bold">Идентификатор: </span>{" "}
              {device.device_id}
            </div>
            <div>
              <span className="font-bold">Номер зоны:</span> {device.zoneNum}
            </div>
          </CardBody>
        </Card>
      ))}
      <div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl">
          <ModalContent>
            <ModalBody className="p-7">
              <AddRegulation device_id={deviceId} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}

export default DeviceReg;
