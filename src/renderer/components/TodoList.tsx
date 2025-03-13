import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { useTodo } from "../contexts/TodoContext";
import { Todo } from "../types";
import TodoItem from "./TodoItem";
import TodoForm from "./TodoForm";

const TodoList: React.FC = () => {
  const { todos, completedTodos, completeTodo, deleteTodo, updateTodo } =
    useTodo();
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [sortBy, setSortBy] = useState<"priority" | "dueDate" | "createdAt">(
    "priority"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);

  const handleToggleTodo = (id: string) => {
    completeTodo(id);
  };

  const handleDeleteTodo = (id: string) => {
    deleteTodo(id);
  };

  const handleEditTodo = (id: string) => {
    setEditingTodoId(id);
  };

  const handleUpdateTodo = (todo: Todo) => {
    updateTodo(todo);
    setEditingTodoId(null);
  };

  // Filter todos based on current filter
  const filteredTodos = (() => {
    let result = [...todos];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (todo) =>
          todo.title.toLowerCase().includes(query) ||
          (todo.description && todo.description.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (filter === "completed") {
      return completedTodos;
    }

    return result;
  })();

  // Sort todos based on current sort option
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortBy === "priority") {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    } else if (sortBy === "dueDate") {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Todo List</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          Add Todo
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search todos..."
            className="input w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <select
            className="input"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>

          <select
            className="input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
            <option value="createdAt">Created Date</option>
          </select>
        </div>
      </div>

      {/* Todo List */}
      <div className="space-y-4">
        {sortedTodos.length > 0 ? (
          sortedTodos.map((todo) => (
            <div
              key={todo.id}
              className={`p-4 rounded-md ${
                todo.completed
                  ? "bg-secondary-light opacity-70"
                  : "bg-secondary"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo.id)}
                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div>
                    <h3
                      className={`font-medium ${
                        todo.completed ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {todo.title}
                    </h3>
                    <div className="flex space-x-2 mt-1">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
                          todo.priority
                        )}`}
                      >
                        {todo.priority}
                      </span>
                      {todo.category && (
                        <span className="text-xs px-2 py-1 rounded-full bg-secondary-light">
                          {todo.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditTodo(todo.id)}
                    className="text-gray-400 hover:text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card text-center py-8">
            <p className="text-gray-400">No todos found.</p>
            <button
              className="btn btn-primary mt-4"
              onClick={() => setShowAddForm(true)}
            >
              Add Your First Todo
            </button>
          </div>
        )}
      </div>

      {/* Add Todo Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-secondary-light rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Todo</h2>
            <TodoForm onClose={() => setShowAddForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case "high":
      return "bg-red-500 bg-opacity-20 text-red-500";
    case "medium":
      return "bg-yellow-500 bg-opacity-20 text-yellow-500";
    case "low":
      return "bg-green-500 bg-opacity-20 text-green-500";
    default:
      return "bg-gray-500 bg-opacity-20 text-gray-500";
  }
};

export default TodoList;
