import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { useTodo } from "../contexts/TodoContext";
import { usePomodoro } from "../contexts/PomodoroContext";
import { Todo } from "../types";
import TodoForm from "./TodoForm";

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const { completeTodo, uncompleteTodo, deleteTodo } = useTodo();
  const { startTimer } = usePomodoro();
  const [showEditForm, setShowEditForm] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleToggleComplete = () => {
    if (todo.completed) {
      uncompleteTodo(todo.id);
    } else {
      completeTodo(todo.id);
    }
  };

  const handleStartPomodoro = () => {
    startTimer(todo.id);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      deleteTodo(todo.id);
    }
  };

  const getPriorityColor = (priority: Todo["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <>
      <div className="card hover:bg-secondary-dark transition-colors">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-1">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={handleToggleComplete}
              className="w-5 h-5 rounded-full border-2 border-primary checked:bg-primary focus:ring-primary"
            />
          </div>

          <div className="ml-3 flex-1">
            <div className="flex items-center justify-between">
              <h3
                className={`text-lg font-medium ${
                  todo.completed ? "line-through text-gray-400" : ""
                }`}
                onClick={() => setExpanded(!expanded)}
              >
                {todo.title}
              </h3>

              <div className="flex space-x-2">
                <span
                  className={`w-3 h-3 rounded-full ${getPriorityColor(
                    todo.priority
                  )}`}
                  title={`Priority: ${todo.priority}`}
                ></span>

                {!todo.completed && (
                  <button
                    onClick={handleStartPomodoro}
                    className="text-accent hover:text-accent-light"
                    title="Start Pomodoro"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                )}

                <button
                  onClick={() => setShowEditForm(true)}
                  className="text-gray-400 hover:text-white"
                  title="Edit"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>

                <button
                  onClick={handleDelete}
                  className="text-gray-400 hover:text-red-500"
                  title="Delete"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {expanded && (
              <div className="mt-2 space-y-2">
                {todo.description && (
                  <p className="text-gray-300">{todo.description}</p>
                )}

                <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                  {todo.category && (
                    <span className="bg-secondary px-2 py-1 rounded">
                      {todo.category}
                    </span>
                  )}

                  {todo.dueDate && (
                    <span className="bg-secondary px-2 py-1 rounded">
                      Due: {format(parseISO(todo.dueDate), "MMM d, yyyy")}
                    </span>
                  )}

                  {todo.tags &&
                    todo.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-accent bg-opacity-20 text-accent px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                </div>

                <div className="text-xs text-gray-500">
                  Created:{" "}
                  {format(parseISO(todo.createdAt), "MMM d, yyyy h:mm a")}
                  {todo.completedAt && (
                    <span className="ml-2">
                      Completed:{" "}
                      {format(parseISO(todo.completedAt), "MMM d, yyyy h:mm a")}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Todo Form Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-secondary-light rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Todo</h2>
            <TodoForm
              onClose={() => setShowEditForm(false)}
              initialData={todo}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TodoItem;
