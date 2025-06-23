import {
  ArrowRightIcon,
  CheckIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { Todo } from "../config";
import { useState } from "react";

interface TodoItemProps {
  todo: Todo;
  onStatusChange: (id: number) => void;
  isDone: boolean;
  onDelete?: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onStatusChange,
  isDone,
  onDelete,
}) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
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

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="flex items-start gap-2 cursor-pointer"
        onContextMenu={handleContextMenu}
      >
        {isDone ? (
          <div
            onClick={() => onStatusChange(todo.id)}
            className="w-6 h-6 rounded-full flex items-center justify-center aspect-square border border-primary-purple"
          >
            <CheckIcon className="w-4 h-4 text-white" />
          </div>
        ) : (
          <div
            onClick={() => onStatusChange(todo.id)}
            className="w-6 h-6 rounded-full flex items-center justify-center aspect-square bg-secondary-bg border border-stroke-secondary"
          />
        )}

        <p className="text-xs font-medium mt-1">{todo.title}</p>
      </motion.div>

      {showContextMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={handleClickOutside} />
          <div
            className="fixed z-50 bg-secondary-bg border border-stroke-secondary rounded-md shadow-lg p-0.5"
            style={{
              left: contextMenuPosition.x,
              top: contextMenuPosition.y,
            }}
          >
            <button
              className="w-full px-4 py-2 text-xs text-left hover:bg-primary-bg flex items-center gap-2 rounded-sm"
              onClick={() => {
                onStatusChange(todo.id);
                setShowContextMenu(false);
              }}
            >
              <CheckIcon className="w-4 h-4" />
              Mark as {isDone ? "Pending" : "Done"}
            </button>
            <button
              className="w-full px-4 py-2 text-xs text-left hover:bg-primary-bg flex items-center gap-2 rounded-sm"
              onClick={() => {
                onStatusChange(todo.id);
                setShowContextMenu(false);
              }}
            >
              <ArrowRightIcon className="w-4 h-4" />
              Move to Tomorrow
            </button>
            <button
              className="w-full px-4 py-2 text-xs text-left hover:bg-primary-bg flex items-center gap-2 rounded-sm"
              onClick={() => {
                onStatusChange(todo.id);
                setShowContextMenu(false);
              }}
            >
              <PencilIcon className="w-4 h-4" />
              Edit
            </button>

            {onDelete && (
              <button
                className="w-full px-4 py-2 text-xs text-left hover:bg-primary-bg text-red-500 flex items-center gap-2 rounded-sm"
                onClick={() => {
                  onDelete(todo.id);
                  setShowContextMenu(false);
                }}
              >
                <TrashIcon className="w-4 h-4" />
                Delete
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default TodoItem;
