import {
  Alert,
  Button,
  Chip,
  Input,
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
import GenericTable from "./GenericTable";
import { useUserContext } from "../context/UserContextProvider";
import { User, TableItem } from "../Types";
import { useEffect, useState } from "react";
import { EyeIcon, Pencil, Trash2 } from "lucide-react";
import axiosClient from "../axiosClient";

const statusColorMap = {
  admin: "success",
  user: "primary",
  unknown: "default",
} as const;

const COLUMNS = [
  { name: "ФИО пользователя", uid: "userName" },
  { name: "Почта", uid: "uEmail" },
  { name: "Телефон", uid: "uPhone" },
  { name: "Роль", uid: "uRole" },
  { name: "Должность", uid: "uPosition" },
  { name: "Действие", uid: "actions" },
];

function UserT() {
  const { users, setUsers } = useUserContext();
  const [selectedItem, setSelectedItem] = useState<User | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
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
    const role = user.uRole ?? "unknown";
    switch (columnKey) {
      case "userName":
        return (
          <p className="font-bold text-small capitalize">{user.userName}</p>
        );
      case "uEmail":
        return <p className="text-small">{user.uEmail}</p>;
      case "uPhone":
        return <p className="text-small">{user?.uPhone ?? "-"}</p>;
      case "uRole":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[role]}
            variant="flat"
            size="sm"
          >
            {user.uRole}
          </Chip>
        );
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
        <Input label="ФИО пользователя" value={user.userName ?? ""}></Input>
        <Input label="Почта" value={user.uEmail ?? ""}></Input>
        <Input label="Телефон" value={user.uPhone ?? ""}></Input>
        <Input label="Роль" value={user.uRole ?? ""}></Input>
        <Input label="Должность" value={user.uPosition ?? ""}></Input>
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
    if (!selectedItem) return;
    try {
      axiosClient
        .patch(`/api/users/?id=${selectedItem.id}`, {
          userName: selectedItem.userName,
          uEmail: selectedItem.uEmail,
          uPhone: selectedItem.uPhone,
          uRole: selectedItem.uRole,
          uPosition: selectedItem.uPosition,
        })
        .then(({ data }) => {
          console.log(data);
          const index = users.findIndex((user) => user.id === selectedItem.id);
          users[index] = data;
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
        .delete(`/api/users/?id=${selectedItem.id}`)
        .then(({ data }) => {
          console.log(data);
          setUsers(users.filter((user) => user.id !== selectedItem.id));
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
    <div className="w-80% mx-auto my-10">
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
                  {renderCell(item, columnKey as string | "actions")}
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
                {selectedItem && (
                  <>
                    {editModalContent(selectedItem)}
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
                {selectedItem && (
                  <>
                    {deleteModalContent(selectedItem)}
                    <Alert color="warning">
                      Вы уверены, что хотите удалить этот элемент?
                    </Alert>
                  </>
                )}
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
