import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Input,
} from "@heroui/react";
import { useState } from "react";

function SetRequestInterval() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [interval, setInterval] = useState(0);
    const handleSubmit = () => {
        console.log(interval);
    };
    return (
        <div className="w-[70%] mx-auto flex flex-col gap-2">
            <Button onPress={onOpen} className="text-lg font-bold">
                Настройки интервала запроса
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Интервал запроса</ModalHeader>
                            <ModalBody>
                                <Input
                                    label="Интервал запроса"
                                    type="number"
                                    value={interval}
                                    onChange={(e) =>
                                        setInterval(e.target.value)
                                    }
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="success" onPress={handleSubmit}>
                                    Сохранить
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    Закрыть
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}

export default SetRequestInterval;
