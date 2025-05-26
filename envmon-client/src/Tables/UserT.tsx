import {
  Alert,
  Button,
  Chip,
  Input,
  Select,
  SelectItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { useUserContext } from "../context/UserContextProvider";
import { User, userRole } from "../Types";
import { useState } from "react";
import { Eye, EyeClosed, EyeIcon, Pencil, Trash2 } from "lucide-react";
import axiosClient from "../axiosClient";

const COLUMNS = [
  { name: "ФИО пользователя", uid: "userName" },
  { name: "E-mail", uid: "uEmail" },
  { name: "Телефон", uid: "uPhone" },
  { name: "Роль", uid: "uRole" },
  { name: "Должность", uid: "uPosition" },
  { name: "Действия", uid: "actions" },
];

function UserT() {
  const { users, setUsers } = useUserContext();
  const [editUser, setEditUser] = useState<User | null>();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<User | null>(null);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const toggleVisibility = () => setPasswordVisible(!passwordVisible);

  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onOpenChange: onViewOpenChange,
  } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
    onOpenChange: onEditOpenChange,
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();

  const renderCell = (
    user: User,
    columnKey: keyof User | "actions"
  ): React.ReactNode => {
    switch (columnKey) {
      case "userName":
        return (
          <p className="font-bold text-small capitalize">{user.userName}</p>
        );
      case "uEmail":
        return <p className="text-small">{user.uEmail}</p>;
      case "uPhone":
        return <p className="text-small">{user?.uPhone ?? "-"}</p>;
      case "uRole": {
        console.log(user.uRole);
        return (
          <Chip
            className="capitalize"
            color={
              user.uRole?.trim() == "Администратор"
                ? "success"
                : user.uRole?.trim() == "Инженер по охране труда"
                ? "primary"
                : "danger"
            }
            variant="flat"
            size="sm"
          >
            {user.uRole?.trim()}
          </Chip>
        );
      }
      case "uPosition":
        return <p className="text-small">{user.uPosition}</p>;
      case "actions":
        return (
          <div className="relative flex items-center gap-5 justify-end">
            <Tooltip content="Просмотр">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => {
                  setSelectedItem(user);
                  onViewOpen();
                }}
              >
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content="Редактировать">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => {
                  setSelectedItem(user);
                  setEditUser(user);
                  onEditOpen();
                }}
              >
                <Pencil />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Удалить">
              <span
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => {
                  setSelectedItem(user);
                  onDeleteOpen();
                }}
              >
                <Trash2 />
              </span>
            </Tooltip>
          </div>
        );

      default:
        return null;
    }
  };

  const viewModalContent = (user: User) => {
    return (
      <>
        <Input
          label="ФИО пользователя"
          value={user.userName ?? ""}
          disabled
        ></Input>
        <Input label="Почта" value={user.uEmail ?? ""} disabled></Input>
        <Input label="Телефон" value={user.uPhone ?? ""} disabled></Input>
        <Input label="Роль" value={user.uRole ?? ""} disabled></Input>
        <Input label="Должность" value={user.uPosition ?? ""} disabled></Input>
      </>
    );
  };
  const editModalContent = (user: User) => {
    return (
      <>
        <Input
          label="ФИО пользователя"
          value={user?.userName ?? ""}
          onChange={(e) =>
            setEditUser({ ...editUser, userName: e.target.value })
          }
        ></Input>
        <Input
          label="Почта"
          value={user?.uEmail ?? ""}
          onChange={(e) =>
            setEditUser((prev) => ({ ...prev, uEmail: e.target.value }))
          }
        ></Input>
        <Input
          label="Новый пароль"
          type={passwordVisible ? "text" : "password"}
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
          onChange={(e) =>
            setEditUser((prev) => ({ ...prev, uPassword: e.target.value }))
          }
        ></Input>
        <Input
          label="Телефон"
          value={editUser?.uPhone ?? ""}
          type="tel"
          onChange={(e) => {
            //remove all non-digit characters
            const digits = e.target.value.replace(/\D/g, "");

            // Format the phone number
            let formatted = "";
            if (digits.length > 0) {
              formatted = digits;

              //Apply Russian phone number format: +7 (999) 999-99-99
              if (digits.length > 1) {
                formatted = `+7 (${digits.substring(1, 4)}) ${digits.substring(
                  4,
                  7
                )}-${digits.substring(7, 9)}-${digits.substring(9, 11)}`;
              }
              // Ensure the + is always present
              if (!e.target.value.startsWith("+")) {
                formatted = `+${formatted}`;
              }
            }

            setEditUser((prev) => ({ ...prev, uPhone: formatted }));
          }}
        ></Input>
        <Select
          label="Роль"
          // value={editUser?.uRole}
          defaultSelectedKeys={[editUser?.uRole ?? ""]}
          onChange={(e) =>
            setEditUser((prev) => ({
              ...prev,
              uRole: e.target.value as
                | "Администратор"
                | "Инженер по охране труда",
            }))
          }
        >
          {userRole.map((role) => (
            <SelectItem key={role.key} textValue={role.label}>
              {role.label}
            </SelectItem>
          ))}
        </Select>
        <Input
          label="Должность"
          value={editUser?.uPosition ?? ""}
          onChange={(e) =>
            setEditUser((prev) => ({ ...prev, uPosition: e.target.value }))
          }
        ></Input>
      </>
    );
  };

  const deleteModalContent = (user: User) => {
    return (
      <>
        <Input
          label="ФИО пользователя"
          value={user.userName ?? ""}
          disabled
        ></Input>
        <Input label="Почта" value={user.uEmail ?? ""} disabled></Input>
        <Alert color="warning">
          Вы действительно хотите удалить этого пользователя?
        </Alert>
      </>
    );
  };
  const handleEdit = async () => {
    if (!editUser) return;
    // console.log(editUser);
    try {
      axiosClient
        .get(
          `/api/users/?method=PATCH&id=${editUser.user_id}&userName=${editUser.userName}
          &uPassword=${editUser.uPassword}&uEmail=${editUser.uEmail}&uPhone=${editUser.uPhone}
          &uRole=${editUser.uRole}&uPosition=${editUser.uPosition}`
        )
        .then(({ data }) => {
          console.log(data.data);
          const index = users.findIndex(
            (user) => user.user_id === editUser.user_id
          );
          users[index] = data.data;
          setUsers(users);
          setSuccess("Пользователь успешно обновлен");
          setTimeout(() => setSuccess(null), 3000);
          onEditClose();
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : "Произошла ошибка");
          setTimeout(() => setError(null), 3000);
        });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
      setTimeout(() => setError(null), 3000);
    }
  };
  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      axiosClient
        .get(`/api/users/?method=DELETE&id=${selectedItem.user_id}`)
        .then(({ data }) => {
          console.log(data);
          setUsers(
            users.filter((user) => user.user_id !== selectedItem.user_id)
          );
          setSuccess("Пользователь успешно удален");
          setTimeout(() => setSuccess(null), 3000);
          onDeleteClose();
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : "Произошла ошибка");
          setTimeout(() => setError(null), 3000);
        });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
      setTimeout(() => setError(null), 3000);
    }
  };
  return (
    <div className="w-[90%] mx-auto my-5">
      {success && <Alert color="success">{success}</Alert>}
      {error && <Alert color="danger">{error}</Alert>}

      <Table aria-label="Data table">
        <TableHeader columns={COLUMNS}>
          {(column) => (
            <TableColumn
              key={column.uid as string}
              align={column.uid === "actions" ? "end" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={users} emptyContent="Данные не найдены">
          {(item) => (
            <TableRow key={item.user_id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(item, columnKey as keyof User | "actions")}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* View Modal */}
      <Modal isOpen={isViewOpen} onOpenChange={onViewOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Просмотр</ModalHeader>
              <ModalBody>
                {selectedItem && viewModalContent(selectedItem)}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Закрыть
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Редактирование</ModalHeader>
              <ModalBody>
                {editUser && (
                  <>
                    {editModalContent(editUser)}
                    {error && <Alert color="danger">{error}</Alert>}
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="success" onPress={handleEdit}>
                  Сохранить
                </Button>
                <Button color="danger" onPress={onClose}>
                  Отмена
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Удалить</ModalHeader>
              <ModalBody>
                {selectedItem && <>{deleteModalContent(selectedItem)}</>}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={handleDelete}>
                  Удалить
                </Button>
                <Button color="primary" onPress={onClose}>
                  Отмена
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default UserT;
