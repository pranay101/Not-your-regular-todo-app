import {
  ArrowRightIcon,
  CheckCircleIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { Todo } from "../config";
import { useState } from "react";
import EditTodoModal from "./EditTodoModal";
import moment from "moment";

interface TodoItemProps {
  todo: Todo;
  onStatusChange: (id: number) => void;
  isDone: boolean;
  onRefresh?: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onStatusChange,
  isDone,
  onRefresh,
}) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleClickOutside = () => {
    setShowContextMenu(false);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await window.ipcRenderer.invoke("todos:delete", todo.id);
      onRefresh?.(); // Refresh the parent component
    } catch (error) {
      console.error("Failed to delete todo:", error);
      alert("Failed to delete todo. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowContextMenu(false);
    }
  };

  const handleEdit = () => {
    setShowEditModal(true);
    setShowContextMenu(false);
  };

  const handleMoveToTomorrow = async () => {
    try {
      await window.ipcRenderer.invoke("todos:update", todo.id, {
        ...todo,
        date: moment(todo.date).add(1, "day").format("YYYY-MM-DD"),
      });
      onRefresh?.();

      setShowContextMenu(false);
    } catch (error) {
      console.error("Failed to update todo:", error);
      alert("Failed to update todo. Please try again.");
      setShowContextMenu(false);
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return <ExclamationTriangleIcon className="w-3 h-3 text-primary-red" />;
      case "medium":
        return <ExclamationTriangleIcon className="w-3 h-3 text-yellow-500" />;
      case "low":
        return <CheckCircleIcon className="w-3 h-3 text-green-500" />;
      default:
        return <CheckCircleIcon className="w-3 h-3 text-gray-400" />;
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="flex items-start gap-2 cursor-pointer group"
        onContextMenu={handleContextMenu}
        onClick={() => setShowDescription(!showDescription)}
      >
        {isDone ? (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(todo.id);
            }}
            className="w-6 h-6 rounded-full flex items-center justify-center aspect-square border border-primary-purple"
          >
            <CheckIcon className="w-4 h-4 text-white" />
          </div>
        ) : (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(todo.id);
            }}
            className="w-6 h-6 rounded-full flex items-center justify-center aspect-square bg-secondary-bg border border-stroke-secondary"
          />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p
              className={`text-xs font-medium  ${
                isDone ? "line-through text-gray-400" : "text-white"
              }`}
            >
              {todo.title}
            </p>
            <div className="relative">{getPriorityIcon(todo.priority)}</div>
          </div>
          <AnimatePresence>
            {showDescription && todo.description && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className={`text-xs mt-1 ${
                  isDone ? "line-through text-gray-500" : "text-gray-400"
                }`}
              >
                {todo.description.length > 50
                  ? `${todo.description.substring(0, 50)}...`
                  : todo.description}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {showContextMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={handleClickOutside} />
          <div
            className="fixed z-50 bg-secondary-bg border border-stroke-secondary rounded-md shadow-lg p-0.5 min-w-[160px]"
            style={{
              left: contextMenuPosition.x,
              top: contextMenuPosition.y,
            }}
          >
            <button
              className="w-full px-4 py-2 text-xs text-left hover:bg-primary-bg flex items-center gap-2 rounded-sm transition-colors"
              onClick={() => {
                onStatusChange(todo.id);
                setShowContextMenu(false);
              }}
            >
              <CheckIcon className="w-4 h-4" />
              Mark as {isDone ? "Pending" : "Done"}
            </button>

            <button
              className="w-full px-4 py-2 text-xs text-left hover:bg-primary-bg flex items-center gap-2 rounded-sm transition-colors"
              onClick={handleMoveToTomorrow}
            >
              <ArrowRightIcon className="w-4 h-4" />
              Move to Tomorrow
            </button>

            <button
              className="w-full px-4 py-2 text-xs text-left hover:bg-primary-bg flex items-center gap-2 rounded-sm transition-colors"
              onClick={handleEdit}
            >
              <PencilIcon className="w-4 h-4" />
              Edit
            </button>

            <div className="border-t border-stroke-secondary my-1" />

            <button
              className="w-full px-4 py-2 text-xs text-left hover:bg-primary-bg text-primary-red flex items-center gap-2 rounded-sm transition-colors disabled:opacity-50"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <TrashIcon className="w-4 h-4" />
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </>
      )}

      <EditTodoModal
        isModalOpen={showEditModal}
        setIsModalOpen={setShowEditModal}
        todo={todo}
        onTodoUpdated={onRefresh}
      />
    </>
  );
};

export default TodoItem;
