import React, { useState, useEffect } from "react";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import { useTodo } from "../contexts/TodoContext";
import { usePomodoro } from "../contexts/PomodoroContext";
import { Todo, Pomodoro } from "../types";

const Dashboard: React.FC = () => {
  const { todos, completedTodos, addTodo, completeTodo } = useTodo();
  const { pomodoroHistory, startTimer, isActive, timeLeft, currentSession } =
    usePomodoro();
  const [newTodoText, setNewTodoText] = useState("");
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<
    "work" | "personal" | "all"
  >("all");

  // Format time left as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Calculate pomodoro stats for the current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get completed todos for today
  const todayCompletedTodos = completedTodos.filter((todo) => {
    if (!todo.completedAt) return false;
    const completedDate = parseISO(todo.completedAt);
    const today = new Date();
    return (
      completedDate.getDate() === today.getDate() &&
      completedDate.getMonth() === today.getMonth() &&
      completedDate.getFullYear() === today.getFullYear()
    );
  });

  // Handle adding a new todo
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    addTodo({
      title: newTodoText,
      priority: "medium",
      category: selectedCategory === "all" ? undefined : selectedCategory,
    });

    setNewTodoText("");
  };

  // Filter todos by category
  const filteredTodos =
    selectedCategory === "all"
      ? todos
      : todos.filter((todo) => todo.category === selectedCategory);

  // Handle window control buttons
  const handleMinimize = () => {
    window.electron.ipcRenderer.send("window-minimize");
  };

  const handleMaximize = () => {
    window.electron.ipcRenderer.send("window-maximize");
  };

  const handleClose = () => {
    window.electron.ipcRenderer.send("window-close");
  };

  return (
    <div className="flex flex-col h-screen bg-secondary-dark text-white">
      {/* Custom Title Bar */}
      <div className="bg-secondary-dark p-2 flex justify-between items-center border-b border-secondary-light titlebar">
        <div className="flex items-center">
          <span className="text-primary font-bold text-lg">
            Not the Regular Todo App
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            className="text-gray-400 hover:text-white"
            onClick={handleMinimize}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
          </button>
          <button
            className="text-gray-400 hover:text-white"
            onClick={handleMaximize}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
              />
            </svg>
          </button>
          <button
            className="text-gray-400 hover:text-red-500"
            onClick={handleClose}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/3 p-4 border-r border-secondary-light flex flex-col">
          {/* Pomodoro Activity */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-red-500 mb-2 flex items-center">
              <svg
                className="w-4 h-4 mr-1"
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
              Pomodoro Activity
            </h2>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"].map(
                (month) => (
                  <div key={month} className="text-xs text-gray-400">
                    {month}
                  </div>
                )
              )}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 210 }).map((_, i) => {
                const intensity = Math.random(); // This would be based on actual data
                const color =
                  intensity === 0
                    ? "bg-secondary-light opacity-30"
                    : intensity < 0.3
                    ? "bg-red-500 opacity-30"
                    : intensity < 0.7
                    ? "bg-red-500 opacity-70"
                    : "bg-red-500";

                return (
                  <div key={i} className={`w-4 h-4 rounded-sm ${color}`}></div>
                );
              })}
            </div>

            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>No pomodoros</span>
              <span>7+ pomodoros</span>
            </div>
          </div>

          {/* Calendar */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-2 flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              March 2025
            </h2>

            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              <div className="text-gray-500">M</div>
              <div className="text-gray-500">T</div>
              <div className="text-gray-500">W</div>
              <div className="text-gray-500">T</div>
              <div className="text-gray-500">F</div>
              <div className="text-gray-500">S</div>
              <div className="text-gray-500">S</div>

              {/* Empty cells for days before the 1st */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={`empty-${i}`}></div>
              ))}

              {/* Days of the month */}
              {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1;
                const isToday = day === 11; // Example: 11th is today

                return (
                  <div
                    key={day}
                    className={`py-1 ${
                      isToday ? "bg-red-500 text-white rounded-full" : ""
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Position */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-2 flex items-center text-yellow-500">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
              Position
            </h2>

            <div className="bg-secondary-light rounded-lg p-4 flex items-center">
              <div className="bg-blue-500 rounded-full p-2 mr-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-sm">259 points</div>
                <div className="text-xs text-gray-400">Rank 2 of 17</div>
              </div>
            </div>
          </div>

          {/* Work Mode */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-2 flex items-center text-red-500">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Work Mode
            </h2>

            <div className="bg-red-500 rounded-lg p-4 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* Quick Note */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-2 flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Quick Note
            </h2>

            <div className="bg-secondary-light rounded-lg p-4">
              <p className="text-sm text-gray-300">Stop reading my todos 😡</p>
            </div>
          </div>

          {/* Pomodoro Timer */}
          <div>
            <h2 className="text-sm font-semibold mb-2 flex items-center text-red-500">
              <svg
                className="w-4 h-4 mr-1"
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
              Pomodoros
            </h2>

            <div className="bg-secondary-light rounded-lg p-6 flex flex-col items-center">
              <div className="relative w-24 h-24 flex items-center justify-center mb-2">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#2A2A3C"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#FF4545"
                    strokeWidth="8"
                    strokeDasharray="283"
                    strokeDashoffset="70"
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                  Done
                </div>
              </div>
              <div className="flex mt-2 space-x-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i === 0 ? "bg-red-500" : "bg-gray-500"
                    }`}
                  ></div>
                ))}
              </div>
              <div className="text-xs text-gray-400 mt-1">40 mins</div>
            </div>
          </div>
        </div>

        {/* Middle Panel */}
        <div className="w-1/3 p-4 border-r border-secondary-light">
          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-4 flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
              Work done today
              <span className="ml-2 text-xs bg-red-500 bg-opacity-20 text-red-500 px-1 rounded">
                work
              </span>
            </h2>

            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-secondary-light flex items-center justify-center mr-2">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-sm">Completed</span>
              </div>

              {/* Completed todos */}
              {[
                "Calendar fix",
                "Figure out customer Sizzy subscriptions that...",
                "Pay for hit9xitze.io",
                "Ship new landing page vs todoist etc",
                "Menus don't have bg on vaul",
                "See why users cannot send pass reset email...",
                "benji email verification doesn't work",
                "Pay mailgun",
                "Text accountant",
                "sizzy downloads for apple silicon",
                "Refund customer",
                "fix guy's sub on benji",
                "Move benji to coolify",
                "Deploy glink",
                "Make sure ppl can buy sizzy",
                "Sizzy new subs don't load",
                "Pay PIT for Nov/Dec",
                "Finalize taxes with accountant",
                "see PIT email",
                "appsumo money",
                "Invoices expenses November",
                "Invoices income December",
                "Invoices expenses December",
              ].map((todo, index) => (
                <div key={index} className="flex items-center pl-7">
                  <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center mr-2">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-sm">{todo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/3 p-4">
          {/* Work todos today */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-4 flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Work todos today
              <span className="ml-2 text-xs bg-red-500 bg-opacity-20 text-red-500 px-1 rounded">
                work
              </span>
            </h2>

            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Quick add todo..."
                  className="w-full bg-secondary-light rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTodo(e)}
                />
              </div>

              {/* Active todos */}
              {[
                "Event ghost for move/create/resize",
                "Saving on mobile doesnt keep layout on refre...",
                "Switching dash doesnt get remembered in lo...",
                "When dragging a todo into a section the enti...",
              ].map((todo, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-500 mr-2"></div>
                  <span className="text-sm">{todo}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Forgotten */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-4 flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Forgotten
              <span className="ml-2 text-xs bg-red-500 bg-opacity-20 text-red-500 px-1 rounded">
                work
              </span>
            </h2>

            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full flex items-center justify-center mr-2">
                  <svg
                    className="w-4 h-4 text-gray-500"
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
                </div>
                <span className="text-sm">Overplanned</span>
              </div>

              {/* Forgotten todos */}
              {[
                "Ask accountant about crypto tax",
                "manage payment details button doe...",
              ].map((todo, index) => (
                <div key={index} className="flex items-center pl-7">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-500 mr-2"></div>
                  <span className="text-sm">{todo}</span>
                </div>
              ))}

              <div className="flex items-center mt-4">
                <div className="w-5 h-5 rounded-full flex items-center justify-center mr-2">
                  <svg
                    className="w-4 h-4 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-sm">Overdue</span>
              </div>

              {/* Overdue todos */}
              {[
                "Send invoices to accountant",
                "Move emails out of spam",
                "Clean email inbox",
                "Daily work demo",
                "Make finances snapshot",
              ].map((todo, index) => (
                <div key={index} className="flex items-center pl-7">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-500 mr-2"></div>
                  <span className="text-sm">{todo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
