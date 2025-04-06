import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
} from "@heroui/react";
import { Pencil, Eye, Trash2 } from "lucide-react";
import { TableItem } from "../Types";

type Column<T> = {
  name: string;
  uid: keyof T | "actions";
};
type ModalContentRenderer<T> = (item: T) => React.ReactNode;

type GenericTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  renderCell?: (item: T, columnKey: string) => React.ReactNode;
  viewModalContent: ModalContentRenderer<T>;
  editModalContent: ModalContentRenderer<T>;
  deleteModalContent: ModalContentRenderer<T>;
  onEditSubmit: (item: T) => void;
  onDeleteSubmit: (item: T) => void;
  emptyContent?: string;
  isAdmin?: boolean;
  getId?: (item: T) => number | null;
};

const GenericTable = <T extends TableItem>({
  columns,
  data,
  renderCell,
  viewModalContent,
  editModalContent,
  deleteModalContent,
  onEditSubmit,
  onDeleteSubmit,
  emptyContent = "Данные не найдены",
  isAdmin = false,
  getId = (item) =>
    item.id || item.device_id || item.room_id || item.user_id || null,
}: GenericTableProps<T>) => {
  // Modal state
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onOpenChange: onViewOpenChange,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onOpenChange: onEditOpenChange,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Default render cell function if not provided
  const defaultRenderCell = (item: T, columnKey: keyof T | "actions") => {
    const cellValue = item[columnKey as keyof T];

    if (columnKey === "actions") {
      return (
        <div className="relative flex items-center gap-5 justify-end">
          <Tooltip content="Просмотр">
            <span
              className="cursor-pointer text-lg text-defualt-400 active:opacity-50 transition-all duration-300"
              onClick={() => {
                setSelectedItem(item);
                onViewOpen();
              }}
            >
              <Eye />
            </span>
          </Tooltip>
          {isAdmin && (
            <>
              <Tooltip content="Редактировать">
                <span
                  className="cursor-pointer text-lg text-defualt-400 active:opacity-50 transition-all duration-300"
                  onClick={() => {
                    setSelectedItem(item);
                    onEditOpen();
                  }}
                >
                  <Pencil />
                </span>
              </Tooltip>
              <Tooltip content="Удалить" color="danger">
                <span
                  className="cursor-pointer text-lg text-defualt-400 active:opacity-50 transition-all duration-300"
                  onClick={() => {
                    setSelectedItem(item);
                    onDeleteOpen();
                  }}
                >
                  <Trash2 />
                </span>
              </Tooltip>
            </>
          )}
        </div>
      );
    }

    return typeof cellValue === "string" || cellValue === "number" ? (
      <p className="text-small">{cellValue as React.ReactNode}</p>
    ) : null;
  };
  const handleEdit = async () => {
    if (!selectedItem) return;
    try {
      await onEditSubmit(selectedItem);
      setSuccess("Успешно");
      setTimeout(() => setSuccess(null), 3000);
      onEditClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
      setTimeout(() => setError(null), 3000);
    }
  };
  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      await onDeleteSubmit(selectedItem);
      setSuccess("Успешно");
      setTimeout(() => setSuccess(null), 3000);
      onDeleteClose();
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
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid as string}
              align={column.uid === "actions" ? "end" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={data} emptyContent={emptyContent}>
          {(item) => (
            <TableRow key={getId(item)}>
              {(columnKey) => (
                <TableCell>
                  {(renderCell || defaultRenderCell)(
                    item,
                    columnKey as string | "actions"
                  )}
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
                <Button color="primary" onPress={onClose} />
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
};

export default GenericTable;
