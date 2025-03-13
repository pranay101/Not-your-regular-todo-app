import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { Todo } from "../types";

interface TodoContextType {
  todos: Todo[];
  completedTodos: Todo[];
  addTodo: (
    todo: Omit<Todo, "id" | "completed" | "createdAt" | "completedAt">
  ) => void;
  updateTodo: (todo: Todo) => void;
  deleteTodo: (id: string) => void;
  completeTodo: (id: string) => void;
  uncompleteTodo: (id: string) => void;
  getTodosByCategory: (category?: string) => Todo[];
  getTodosByPriority: (priority: Todo["priority"]) => Todo[];
  getTodosByTag: (tag: string) => Todo[];
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return context;
};

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const loadedTodos = await window.electron.ipcRenderer.invoke(
          "get-todos"
        );

        const formattedTodos = loadedTodos.map((todo: any) => ({
          ...todo,
          completed: Boolean(todo.completed),
        }));

        setTodos(formattedTodos.filter((todo: Todo) => !todo.completed));
        setCompletedTodos(
          formattedTodos.filter((todo: Todo) => todo.completed)
        );
      } catch (error) {
        console.error("Failed to load todos:", error);
      }
    };

    loadTodos();
  }, []);

  const addTodo = async (
    todoData: Omit<Todo, "id" | "completed" | "createdAt" | "completedAt">
  ) => {
    const newTodo: Todo = {
      id: uuidv4(),
      title: todoData.title,
      completed: false,
      priority: todoData.priority || "medium",
      category: todoData.category,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    try {
      await window.electron.ipcRenderer.invoke("add-todo", newTodo);
      setTodos((prevTodos) => [...prevTodos, newTodo]);
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  const updateTodo = async (updatedTodo: Todo) => {
    try {
      await window.electron.ipcRenderer.invoke("update-todo", updatedTodo);

      if (updatedTodo.completed) {
        setTodos((prevTodos) =>
          prevTodos.filter((todo) => todo.id !== updatedTodo.id)
        );
        setCompletedTodos((prevTodos) => {
          const exists = prevTodos.some((todo) => todo.id === updatedTodo.id);
          if (exists) {
            return prevTodos.map((todo) =>
              todo.id === updatedTodo.id ? updatedTodo : todo
            );
          } else {
            return [...prevTodos, updatedTodo];
          }
        });
      } else {
        setTodos((prevTodos) => {
          const exists = prevTodos.some((todo) => todo.id === updatedTodo.id);
          if (exists) {
            return prevTodos.map((todo) =>
              todo.id === updatedTodo.id ? updatedTodo : todo
            );
          } else {
            return [...prevTodos, updatedTodo];
          }
        });
        setCompletedTodos((prevTodos) =>
          prevTodos.filter((todo) => todo.id !== updatedTodo.id)
        );
      }
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await window.electron.ipcRenderer.invoke("delete-todo", id);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      setCompletedTodos((prevTodos) =>
        prevTodos.filter((todo) => todo.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const completeTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const updatedTodo: Todo = {
      ...todo,
      completed: true,
      completedAt: new Date().toISOString(),
    };

    try {
      await window.electron.ipcRenderer.invoke("update-todo", updatedTodo);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      setCompletedTodos((prevTodos) => [...prevTodos, updatedTodo]);
    } catch (error) {
      console.error("Failed to complete todo:", error);
    }
  };

  const uncompleteTodo = async (id: string) => {
    const todo = completedTodos.find((t) => t.id === id);
    if (!todo) return;

    const updatedTodo: Todo = {
      ...todo,
      completed: false,
      completedAt: null,
    };

    try {
      await window.electron.ipcRenderer.invoke("update-todo", updatedTodo);
      setCompletedTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      setTodos((prevTodos) => [...prevTodos, updatedTodo]);
    } catch (error) {
      console.error("Failed to uncomplete todo:", error);
    }
  };

  const getTodosByCategory = (category?: string) => {
    if (!category) return todos;
    return todos.filter((todo) => todo.category === category);
  };

  const getTodosByPriority = (priority: Todo["priority"]) => {
    return todos.filter((todo) => todo.priority === priority);
  };

  const getTodosByTag = (tag: string) => {
    return todos.filter((todo) => todo.tags?.includes(tag));
  };

  const value = {
    todos,
    completedTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    completeTodo,
    uncompleteTodo,
    getTodosByCategory,
    getTodosByPriority,
    getTodosByTag,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
