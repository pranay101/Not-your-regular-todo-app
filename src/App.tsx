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
  Onboarding,
} from "./components";
import React from "react";
import { Todo } from "./config";
import moment from "moment";
import { LoadingWomen } from "./assets";
import { useEffect } from "react";

function App() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [yearGraph, setYearGraph] = React.useState<Todo[]>([]);
  const [importantTodos, setImportantTodos] = React.useState<Todo[]>([]);
  const [overdueTodos, setOverdueTodos] = React.useState<Todo[]>([]);
  const [isWorkModeActive, setIsWorkModeActive] = React.useState(false);

  const [showInitialLoadingAnimation, setShowInitialLoadingAnimation] =
    React.useState(true);

  const [showOnboarding, setShowOnboarding] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);

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

  const checkUser = React.useCallback(async () => {
    try {
      const userExists = await window.ipcRenderer.invoke("user:exists");
      if (!userExists) {
        setShowOnboarding(true);
        return false;
      } else {
        const userData = await window.ipcRenderer.invoke("user:get");
        setUser(userData);
        return true;
      }
    } catch (error) {
      console.error("Failed to check user:", error);
      // If there's an error checking user, show onboarding as fallback
      setShowOnboarding(true);
      return false;
    }
  }, []);

  const loadTodos = React.useCallback(async () => {
    try {
      const today = moment().format("YYYY-MM-DD");
      setLoading(true);
      setError(null);
      const todosData = await window.ipcRenderer.invoke(
        "todos:getByDate",
        today
      );
      setTodos(todosData);
    } catch (err) {
      console.error("Failed to load todos:", err);
      setError("Failed to load todos. Please try again.");
      setTodos([]); // Set empty array as fallback
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
      setImportantTodos([]);
      setOverdueTodos([]);
    }
  };

  const completedTodos =
    todos?.filter((todo: Todo) => todo.status === "done") || [];

  React.useEffect(() => {
    const initializeApp = async () => {
      try {
        const userExists = await checkUser();
        if (userExists) {
          loadTodos();
          fetchTodos();
          fetchImportantAndOverdueTodos();
        }
      } catch (error) {
        console.error("Failed to initialize app:", error);
        // If initialization fails, still try to load todos
        loadTodos();
        fetchTodos();
        fetchImportantAndOverdueTodos();
      }
    };

    initializeApp();
  }, [checkUser, loadTodos]);

  const refetchTodos = () => {
    loadTodos();
    fetchTodos();
    fetchImportantAndOverdueTodos();
  };

  const handleOnboardingComplete = async () => {
    try {
      setShowOnboarding(false);
      const userData = await window.ipcRenderer.invoke("user:get");
      setUser(userData);
      loadTodos();
      fetchTodos();
      fetchImportantAndOverdueTodos();
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      // Even if getting user fails, proceed with app
      setShowOnboarding(false);
      loadTodos();
      fetchTodos();
      fetchImportantAndOverdueTodos();
    }
  };

  const handleWorkModeToggle = (active: boolean) => {
    setIsWorkModeActive(active);
  };

  useEffect(() => {
    setTimeout(() => {
      setShowInitialLoadingAnimation(false);
    }, 2000);
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

      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}

      <main className="grid grid-cols-5 gap-4 h-full p-4">
        <section className="col-span-2 w-full overflow-x-auto h-fit">
          <ActivityGraph todos={yearGraph} />
          <div className="flex items-start gap-4 mt-4">
            <Calendar className="flex-1 bg-bg-secondary bg-gray-100" />
            <Position yearActivity={yearGraph} />
            <WorkMode
              isWorkMode={isWorkModeActive}
              onToggle={handleWorkModeToggle}
            />
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
