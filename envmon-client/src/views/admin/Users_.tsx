// import React from "react";

import { useState } from "react";
import {
  Alert,
  // Autocomplete,
  // AutocompleteItem,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@heroui/react";
import { v4 as uuidv4 } from "uuid";
import { Eye, EyeClosed } from "lucide-react";
import UserT from "../../Tables/UserT";
const Users = () => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [userData, setUserData] = useState({
    user_id: uuidv4(),
    userName: "",
    uEmail: "",
    uRole: "",
    uPosition: "",
    uPassword: "",
    uPassword_confirmation: "",
  });
  const toggleVisibility = () => setPasswordVisible(!passwordVisible);

  const handleAddUser = () => {
    console.log(userData);
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <div className="h-screen">
            <h1 className="text-2xl text-center font-bold">
              Справочник пользователей
            </h1>
            <div className="w-[90%] mt-5 flex justify-end">
              <Button onPress={onOpen} color="primary">
                Добавить пользователя
              </Button>
            </div>
            <UserT />
            {success && (
              <div className="flex justify-center items-center mt-5 w-[80%] mx-auto">
                <Alert color={"success"} title={success} />
              </div>
            )}
          </div>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader>Добавить пользователя</ModalHeader>
                  <ModalBody>
                    <Input
                      label="ФИО пользователя"
                      isRequired
                      variant="bordered"
                      value={userData.userName}
                      onChange={(e) => {
                        setUserData((prev) => ({
                          ...prev,
                          userName: e.target.value,
                        }));
                      }}
                    />
                    <Input
                      label="Почта"
                      isRequired
                      variant="bordered"
                      type="email"
                      value={userData.uEmail}
                      onChange={(e) => {
                        setUserData((prev) => ({
                          ...prev,
                          uEmail: e.target.value,
                        }));
                      }}
                    />
                    {/* <div className="">
                      <Autocomplete
                        className="w-full"
                        label="Роль"
                        value={userData.uRole}
                        isRequired
                        // onSelectionChange={(e) => {
                        //   setUserData((prev) => ({
                        //     ...prev,
                        //     uRole: e,
                        //   }));
                        // }}
                      >
                        {ROLES.map((role) => (
                          <AutocompleteItem key={role.key} value={role.key}>
                            {role.label}
                          </AutocompleteItem>
                        ))}
                      </Autocomplete>
                    </div> */}
                    <Input
                      label="Должность"
                      variant="bordered"
                      isRequired
                      maxLength={16}
                      value={userData.uPosition}
                      onChange={(e) => {
                        setUserData((prev) => ({
                          ...prev,
                          uPosition: e.target.value,
                        }));
                      }}
                    />
                    {/* Add toggle password visibility */}
                    <Input
                      label="Пароль"
                      variant="bordered"
                      type={passwordVisible ? "text" : "password"}
                      isRequired
                      value={userData.uPassword}
                      onChange={(e) => {
                        setUserData((prev) => ({
                          ...prev,
                          uPassword: e.target.value,
                        }));
                      }}
                      endContent={
                        <button
                          aria-label="toggle password visibility"
                          className="focus:outline-none"
                          type="button"
                          onClick={toggleVisibility}
                        >
                          {passwordVisible ? (
                            <EyeClosed className="text-2xl text-default-400 pointer-events-none" />
                          ) : (
                            <Eye className="text-2xl text-default-400 pointer-events-none" />
                          )}
                        </button>
                      }
                    />
                    <Input
                      label="Подтвердить пароль"
                      variant="bordered"
                      type={passwordVisible ? "text" : "password"}
                      isRequired
                      value={userData.uPassword_confirmation}
                      onChange={(e) => {
                        setUserData((prev) => ({
                          ...prev,
                          uPassword_confirmation: e.target.value,
                        }));
                      }}
                      endContent={
                        <button
                          aria-label="toggle password visibility"
                          className="focus:outline-none"
                          type="button"
                          onClick={toggleVisibility}
                        >
                          {passwordVisible ? (
                            <EyeClosed className="text-2xl text-default-400 pointer-events-none" />
                          ) : (
                            <Eye className="text-2xl text-default-400 pointer-events-none" />
                          )}
                        </button>
                      }
                    />
                    {error && (
                      <Alert
                        color={"danger"}
                        title={"Ошибка добавления пользователя"}
                        description={error}
                      />
                    )}
                  </ModalBody>
                  <ModalFooter>
                    <Button color="success" onPress={handleAddUser}>
                      Добавить
                    </Button>
                    <Button color="primary" onPress={onClose}>
                      Отменить
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  );
};

export default Users;
