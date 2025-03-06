import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

interface TermsOfServiceProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({
  isOpen,
  onOpenChange,
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Terms of Service</ModalHeader>
            <ModalBody>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam, quos.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default TermsOfService;
