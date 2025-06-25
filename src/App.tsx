import "./App.css";
import {
  ActivityGraph,
  Calendar,
  Header,
  MainTodoList,
  OtherTodoInfo,
  PomodoroToday,
  Position,
  QuickNote,
  WorkMode,
} from "./components";
import { useState, useCallback, useEffect } from "react";
import { Todo } from "./config";
import moment from "moment";

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [yearGraph, setYearGraph] = useState<Todo[]>([]);

  const loadTodos = useCallback(async () => {
    try {
      const today = moment().format("YYYY-MM-DD");
      setLoading(true);
      setError(null);
      const todosData = await window.ipcRenderer.invoke(
        "todos:getByDate",
        today
      );

      console.log(todosData, "asad");
      setTodos(todosData);
    } catch (err) {
      console.error("Failed to load todos:", err);
      setError("Failed to load todos. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTodos = async () => {
    try {
      const start = moment().subtract(365, "days").format("YYYY-MM-DD");
      const end = moment().format("YYYY-MM-DD");

      const todos: Todo[] = await window.ipcRenderer.invoke(
        "todos:getByDateRange",
        start,
        end
      );
      setYearGraph(todos);
    } catch (err) {
      console.error("Failed to load todos:", err);
      setError("Failed to load todos. Please try again.");
      setYearGraph([]);
    }
  };

  const completedTodos = todos?.filter((todo) => todo.status === "done") || [];

  useEffect(() => {
    loadTodos();
    fetchTodos();
  }, [loadTodos]);

  const refetchTodos = () => {
    loadTodos();
    fetchTodos();
  };

  return (
    <div className="flex flex-col h-full">
      <Header loadTodos={refetchTodos} isLoading={loading} />
      <main className="grid grid-cols-5 gap-4 h-full p-4">
        <section className="col-span-2 w-full overflow-x-auto h-fit">
          <ActivityGraph todos={yearGraph} />
          <div className="flex items-start gap-4 mt-4">
            <Calendar className="flex-1 bg-bg-secondary bg-gray-100" />
            <Position />
            <WorkMode />
          </div>
          <div className="flex items-start gap-4 mt-4">
            <PomodoroToday
              totalTasks={todos.length}
              completedTasks={completedTodos.length}
            />
            <QuickNote />
          </div>
        </section>
        <section className="col-span-2 flex flex-col w-full flex-1 h-full overflow-y-auto">
          <MainTodoList
            loadTodos={loadTodos}
            loading={loading}
            error={error}
            todos={todos}
            setTodos={setTodos}
          />
        </section>
        <section className="col-span-1 flex flex-col w-full flex-1 h-full overflow-y-auto">
          <OtherTodoInfo />
        </section>
      </main>
    </div>
  );
}

export default App;
