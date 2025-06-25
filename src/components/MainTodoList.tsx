import { CheckCircleIcon, PlusIcon } from "@heroicons/react/24/outline";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { Todo } from "../config";
import CreateNewTodoModal from "./CreateNewTodoModal";
import TodoItem from "./TodoItem";

interface TodoListColumnProps {
  id: "done" | "pending" | "overdue" | "upcoming-important";
  title: string;
  todos: Todo[];
  onStatusChange: (id: number) => void;
  isDone: boolean;
  onRefresh: () => void;
}

const TodoListColumn: React.FC<TodoListColumnProps> = ({
  title,
  id,
  todos,
  onStatusChange,
  isDone,
  onRefresh,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalClose = () => {
    setIsModalOpen(false);
    onRefresh(); // Refresh todos after modal closes
  };

  return (
    <div className="w-full flex flex-col h-[700px] bg-primary-bg border border-stroke-primary rounded-xl p-2">
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-6 h-6 rounded-full p-1 bg-secondary-bg">
          <CheckCircleIcon className="text-primary-blue" />
        </div>
        <h5 className="text-white text-xs font-medium tracking-wide">
          {title}
        </h5>

        <button
          className="ml-auto cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusIcon className="w-4 h-4 text-white" />
        </button>
      </div>
      <div className="flex flex-col gap-2 mt-4 text-sm text-text-primary flex-1 overflow-y-auto">
        <AnimatePresence>
          {todos.map((todo) => (
            <TodoItem
              id={id}
              key={todo.id}
              todo={todo}
              onStatusChange={onStatusChange}
              isDone={isDone}
              onRefresh={onRefresh}
            />
          ))}
        </AnimatePresence>
      </div>
      <CreateNewTodoModal
        isModalOpen={isModalOpen}
        setIsModalOpen={handleModalClose}
        id={id}
        onTodoCreated={onRefresh}
      />
    </div>
  );
};

interface MainTodoListProps {
  loadTodos: () => void;
  loading: boolean;
  error: string | null;
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
}

const MainTodoList: React.FC<MainTodoListProps> = ({
  loadTodos,
  loading,
  error,
  todos,
  setTodos,
}) => {
  const handleStatusChange = async (id: number) => {
    try {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;

      const newStatus = todo.status === "done" ? "pending" : "done";
      await window.ipcRenderer.invoke("todos:updateStatus", id, newStatus);

      // Update local state
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, status: newStatus } : todo
        )
      );
    } catch (err) {
      console.error("Failed to update todo status:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-lg">Loading todos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="text-primary-red text-lg">{error}</div>
        <button
          onClick={loadTodos}
          className="bg-primary-red text-white px-4 py-2 rounded-sm text-sm font-semibold cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  const doneTodos = todos.filter((todo) => todo.status === "done");
  const pendingTodos = todos.filter((todo) => todo.status === "pending");

  return (
    <div className="grid grid-cols-2 gap-4 h-full flex-1 overflow-y-auto">
      <TodoListColumn
        id="done"
        title="Completed"
        todos={doneTodos}
        onStatusChange={handleStatusChange}
        isDone={true}
        onRefresh={loadTodos}
      />
      <TodoListColumn
        id="pending"
        title="Pending"
        todos={pendingTodos}
        onStatusChange={handleStatusChange}
        isDone={false}
        onRefresh={loadTodos}
      />
    </div>
  );
};

export default MainTodoList;
