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
import { MailIcon } from "../../../public/Icons/Icons";
import { useState } from "react";

function SetNotifications() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [email, setEmail] = useState("");
    const handleSubmit = () => {
        console.log(email);
    };
    return (
        <div className="w-[70%] mx-auto flex flex-col gap-2">
            <Button onPress={onOpen} className="text-lg font-bold">
                Настройки уведомлений
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Настройки уведомлений</ModalHeader>
                            <ModalBody>
                                <Input
                                    endContent={
                                        <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                    }
                                    label="Почта"
                                    labelPlacement="outside"
                                    placeholder="you@example.com"
                                    type="email"
                                    className="w-full h-10"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onPress={handleSubmit}>
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

export default SetNotifications;
