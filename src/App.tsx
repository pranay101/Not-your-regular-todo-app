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
import { LoadingWomen } from "./assets";

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [yearGraph, setYearGraph] = useState<Todo[]>([]);
  const [importantTodos, setImportantTodos] = useState<Todo[]>([]);
  const [overdueTodos, setOverdueTodos] = useState<Todo[]>([]);

  const [showInitialLoadingAnimation, setShowInitialLoadingAnimation] =
    useState(true);

  const loadingMessages = [
    {
      title: "Getting everything ready for you! 🌟",
      subtitle:
        "Taking a moment to organize your day for maximum productivity and joy ✨",
    },
    {
      title: "Brewing your daily motivation! ☕",
      subtitle: "Preparing your workspace for another amazing day ahead 🌅",
    },
    {
      title: "Gathering your tasks with care! 📝",
      subtitle:
        "Making sure everything is perfectly arranged for your success 🎯",
    },
    {
      title: "Almost there! 🚀",
      subtitle:
        "Polishing the final details for your productive journey today ✨",
    },
    {
      title: "Loading your productivity toolkit! 🛠️",
      subtitle: "Setting up everything you need to crush your goals today 💪",
    },
    {
      title: "Creating your success roadmap! 🗺️",
      subtitle: "Mapping out your path to achievement, one task at a time 🌟",
    },
  ];

  const randomLoadingMessage =
    loadingMessages[Math.floor(Math.random() * loadingMessages.length)];

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

  const fetchImportantAndOverdueTodos = async () => {
    try {
      // Get todos for the next 3 days (important/urgent)
      const today = moment().add(1, "days").format("YYYY-MM-DD");
      const threeDaysFromNow = moment().add(3, "days").format("YYYY-MM-DD");

      const nextThreeDaysTodos: Todo[] = await window.ipcRenderer.invoke(
        "todos:getByDateRange",
        today,
        threeDaysFromNow
      );

      // Filter for high priority todos
      const important = nextThreeDaysTodos.filter(
        (todo: Todo) => todo.priority === "high" && todo.status !== "done"
      );
      setImportantTodos(important);

      // Get overdue todos from the last 7 days
      const sevenDaysAgo = moment().subtract(7, "days").format("YYYY-MM-DD");
      const yesterday = moment().subtract(1, "day").format("YYYY-MM-DD");

      const overdueTodosData: Todo[] = await window.ipcRenderer.invoke(
        "todos:getByDateRange",
        sevenDaysAgo,
        yesterday
      );

      // Filter for overdue todos (not done and past due date)
      const overdue = overdueTodosData.filter(
        (todo: Todo) =>
          todo.status !== "done" && moment(todo.date).isBefore(moment(), "day")
      );
      setOverdueTodos(overdue);
    } catch (error) {
      console.error("Failed to fetch important and overdue todos:", error);
    }
  };

  const completedTodos = todos?.filter((todo) => todo.status === "done") || [];

  useEffect(() => {
    loadTodos();
    fetchTodos();
    fetchImportantAndOverdueTodos();
  }, [loadTodos]);

  const refetchTodos = () => {
    loadTodos();
    fetchTodos();
    fetchImportantAndOverdueTodos();
  };

  useEffect(() => {
    setTimeout(() => {
      setShowInitialLoadingAnimation(false);
    }, 3000);
  }, []);

  return (
    <div className="flex flex-col h-full relative">
      <Header loadTodos={refetchTodos} isLoading={loading} />

      {showInitialLoadingAnimation && (
        <div className="bg-primary-bg/50 fixed inset-0 z-50 h-[800px] w-full flex-1 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="w-[400px]">
            <LoadingWomen />
          </div>
          <h3 className="text-white text-center text-sm font-semibold">
            {randomLoadingMessage.title}
          </h3>
          <p className="text-white/80 text-center text-xs mt-2">
            {randomLoadingMessage.subtitle}
          </p>
        </div>
      )}

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
            loadTodos={refetchTodos}
            loading={loading}
            error={error}
            todos={todos}
            setTodos={setTodos}
            onRefresh={refetchTodos}
          />
        </section>
        <section className="col-span-1 flex flex-col w-full flex-1 h-full overflow-y-auto">
          <OtherTodoInfo
            importantTodos={importantTodos}
            overdueTodos={overdueTodos}
            onRefresh={refetchTodos}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
