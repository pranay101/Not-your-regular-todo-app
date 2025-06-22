import React, { useState } from "react";
import data from "../config/data.json";
import {
  CheckCircleIcon,
  CheckIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { Modal, Select } from "./UI";
import CreateNewTodoModal from "./CreateNewTodoModal";

interface Todo {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
}

interface TodoItemProps {
  todo: Todo;
  onStatusChange: (id: number) => void;
  isDone: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onStatusChange,
  isDone,
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="flex items-start gap-2 cursor-pointer"
      onClick={() => onStatusChange(todo.id)}
    >
      {isDone ? (
        <div className="w-6 h-6 rounded-full flex items-center justify-center aspect-square border border-primary-purple">
          <CheckIcon className="w-4 h-4 text-white" />
        </div>
      ) : (
        <div className="w-6 h-6 rounded-full flex items-center justify-center aspect-square bg-secondary-bg border border-stroke-secondary" />
      )}
      <p className="text-xs font-medium mt-1">{todo.title}</p>
    </motion.div>
  );
};

interface TodoListColumnProps {
  id: string;
  title: string;
  todos: Todo[];
  onStatusChange: (id: number) => void;
  isDone: boolean;
}

const TodoListColumn: React.FC<TodoListColumnProps> = ({
  title,
  id,
  todos,
  onStatusChange,
  isDone,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full flex flex-col max-h-[688px] bg-primary-bg border border-stroke-primary rounded-xl p-2">
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-6 h-6 rounded-full p-1 bg-secondary-bg">
          <CheckCircleIcon className="text-primary-blue" />
        </div>
        <h5 className="text-white text-xs font-medium tracking-wide">
          {title}
        </h5>

        <button
          className="ml-auto cursor-pointer"
          onClick={setIsModalOpen.bind(null, true)}
        >
          <PlusIcon className="w-4 h-4 text-white" />
        </button>
      </div>
      <div className="flex flex-col gap-2 mt-4 text-sm text-text-primary flex-1 overflow-y-auto">
        <AnimatePresence>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onStatusChange={onStatusChange}
              isDone={isDone}
            />
          ))}
        </AnimatePresence>
      </div>
      <CreateNewTodoModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        id={id}
      />
    </div>
  );
};

const MainTodoList: React.FC = () => {
  const [todos, setTodos] = useState(data.todos);

  const handleStatusChange = (id: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? { ...todo, status: todo.status === "done" ? "pending" : "done" }
          : todo
      )
    );
  };

  const doneTodos = todos.filter((todo) => todo.status === "done");
  const pendingTodos = todos.filter((todo) => todo.status === "pending");

  return (
    <div className="grid grid-cols-2 gap-4 h-full flex-1 overflow-y-auto">
      <TodoListColumn
        id="completed"
        title="Completed"
        todos={doneTodos}
        onStatusChange={handleStatusChange}
        isDone={true}
      />
      <TodoListColumn
        id="pending"
        title="Pending"
        todos={pendingTodos}
        onStatusChange={handleStatusChange}
        isDone={false}
      />
    </div>
  );
};

export default MainTodoList;
