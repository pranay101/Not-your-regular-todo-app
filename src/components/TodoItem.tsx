import {
  ArrowRightIcon,
  CheckCircleIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Todo } from "../config";
import EditTodoModal from "./EditTodoModal";

interface TodoItemProps {
  todo: Todo;
  onStatusChange: (id: number) => void;
  isDone: boolean;
  onRefresh?: () => void;
  id: "done" | "pending" | "overdue" | "upcoming-important";
}

// TODO: Add ability to mark/unmark todo as important
// This would allow users to:
// - Flag critical tasks
// - Filter and sort by importance
// - Get notifications for important items
// - Show important badge/indicator

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onStatusChange,
  isDone,
  onRefresh,
  id,
}) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  const isOverdue = id === "overdue";

  const formatDate = (dateString: string) => {
    const date = moment(dateString);
    const today = moment();
    const diffDays = date.diff(today, "days");

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays > 0) return `In ${diffDays} days`;
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;

    return date.format("MMM DD");
  };

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

  const handleMoveToToday = async () => {
    try {
      await window.ipcRenderer.invoke("todos:update", todo.id, {
        ...todo,
        date: moment().format("YYYY-MM-DD"),
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
        className={twMerge(
          "flex items-start gap-2 cursor-pointer group",
          isOverdue && "text-primary-red"
        )}
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
            className={twMerge(
              "w-6 h-6 rounded-full flex items-center justify-center aspect-square border border-stroke-secondary",
              isOverdue ? "bg-primary-red/20" : "bg-secondary-bg"
            )}
          >
           
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mt-0.5">
            <p
              className={`text-xs font-medium  ${
                isDone ? "line-through text-gray-400" : "text-white"
              }`}
            >
              {todo.title}
            </p>
            <div className="relative">{getPriorityIcon(todo.priority)}</div>
          </div>
          {isOverdue && (
            <p className="text-xs text-text-secondary mt-1 mb-2">
              {formatDate(todo.date)}
            </p>
          )}
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
            {/* Context menu items based on todo type */}
            {id === "overdue" ? (
              <>
                <button
                  className="w-full px-4 py-2 text-xs text-left hover:bg-primary-bg flex items-center gap-2 rounded-sm transition-colors"
                  onClick={() => {
                    onStatusChange(todo.id);
                    setShowContextMenu(false);
                  }}
                >
                  <CheckIcon className="w-4 h-4" />
                  Mark as Done
                </button>

                <button
                  className="w-full px-4 py-2 text-xs text-left hover:bg-primary-bg flex items-center gap-2 rounded-sm transition-colors"
                  onClick={handleMoveToToday}
                >
                  <ArrowRightIcon className="w-4 h-4" />
                  Move to Today
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
              </>
            ) : id === "upcoming-important" ? (
              <>
                <button
                  className="w-full px-4 py-2 text-xs text-left hover:bg-primary-bg flex items-center gap-2 rounded-sm transition-colors"
                  onClick={() => {
                    onStatusChange(todo.id);
                    setShowContextMenu(false);
                  }}
                >
                  <CheckIcon className="w-4 h-4" />
                  Mark as Done
                </button>

                <button
                  className="w-full px-4 py-2 text-xs text-left hover:bg-primary-bg flex items-center gap-2 rounded-sm transition-colors"
                  onClick={handleMoveToToday}
                >
                  <ArrowRightIcon className="w-4 h-4" />
                  Move to Today
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
              </>
            ) : (
              <>
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
              </>
            )}
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
