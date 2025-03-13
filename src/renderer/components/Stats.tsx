import React, { useState, useEffect } from "react";
import {
  format,
  parseISO,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  subWeeks,
  addWeeks,
  startOfMonth,
  endOfMonth,
  subMonths,
  addMonths,
  isWithinInterval,
} from "date-fns";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useTodo } from "../contexts/TodoContext";
import { usePomodoro } from "../contexts/PomodoroContext";
import { Todo, Pomodoro } from "../types";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Stats: React.FC = () => {
  const { todos, completedTodos } = useTodo();
  const { pomodoroHistory } = usePomodoro();

  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: startOfWeek(currentDate),
    end: endOfWeek(currentDate),
  });

  // Update date range when view mode or current date changes
  useEffect(() => {
    if (viewMode === "week") {
      setDateRange({
        start: startOfWeek(currentDate),
        end: endOfWeek(currentDate),
      });
    } else {
      setDateRange({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
      });
    }
  }, [viewMode, currentDate]);

  // Navigate to previous period
  const handlePrevious = () => {
    if (viewMode === "week") {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  // Navigate to next period
  const handleNext = () => {
    if (viewMode === "week") {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  // Reset to current period
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Get days in the current range
  const daysInRange = eachDayOfInterval({
    start: dateRange.start,
    end: dateRange.end,
  });

  // Calculate completed todos per day
  const completedTodosPerDay = daysInRange.map((day) => {
    return completedTodos.filter((todo) => {
      if (!todo.completedAt) return false;
      const completedDate = parseISO(todo.completedAt);
      return isSameDay(completedDate, day);
    }).length;
  });

  // Calculate pomodoros per day
  const pomodorosPerDay = daysInRange.map((day) => {
    return pomodoroHistory.filter((pomodoro) => {
      if (!pomodoro.startTime) return false;
      const pomodoroDate = parseISO(pomodoro.startTime);
      return isSameDay(pomodoroDate, day) && pomodoro.type === "pomodoro";
    }).length;
  });

  // Calculate total focus time in the current range
  const totalFocusTime = pomodoroHistory
    .filter((pomodoro) => {
      if (!pomodoro.startTime) return false;
      const pomodoroDate = parseISO(pomodoro.startTime);
      return (
        isWithinInterval(pomodoroDate, {
          start: dateRange.start,
          end: dateRange.end,
        }) && pomodoro.type === "pomodoro"
      );
    })
    .reduce((total, pomodoro) => total + pomodoro.duration, 0);

  // Calculate total completed todos in the current range
  const totalCompletedTodos = completedTodos.filter((todo) => {
    if (!todo.completedAt) return false;
    const completedDate = parseISO(todo.completedAt);
    return isWithinInterval(completedDate, {
      start: dateRange.start,
      end: dateRange.end,
    });
  }).length;

  // Calculate completion rate
  const completionRate =
    todos.length + completedTodos.length > 0
      ? (completedTodos.length / (todos.length + completedTodos.length)) * 100
      : 0;

  // Prepare chart data
  const chartData = {
    labels: daysInRange.map((day) => format(day, "d MMM")),
    datasets: [
      {
        label: "Completed Todos",
        data: completedTodosPerDay,
        backgroundColor: "#FF4545",
      },
      {
        label: "Pomodoros",
        data: pomodorosPerDay,
        backgroundColor: "#5D5FEF",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Activity for ${format(dateRange.start, "MMM d")} - ${format(
          dateRange.end,
          "MMM d, yyyy"
        )}`,
      },
    },
  };

  // Get most productive day
  const getMostProductiveDay = () => {
    let maxIndex = 0;
    let maxValue = 0;

    for (let i = 0; i < daysInRange.length; i++) {
      const productivity = completedTodosPerDay[i] + pomodorosPerDay[i];
      if (productivity > maxValue) {
        maxValue = productivity;
        maxIndex = i;
      }
    }

    return maxValue > 0 ? format(daysInRange[maxIndex], "EEEE") : "N/A";
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Statistics</h1>

      {/* Period Navigation */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            className={`btn ${
              viewMode === "week" ? "btn-primary" : "btn-secondary"
            }`}
            onClick={() => setViewMode("week")}
          >
            Week
          </button>
          <button
            className={`btn ${
              viewMode === "month" ? "btn-primary" : "btn-secondary"
            }`}
            onClick={() => setViewMode("month")}
          >
            Month
          </button>
        </div>

        <div className="flex space-x-2">
          <button className="btn btn-secondary" onClick={handlePrevious}>
            Previous
          </button>
          <button className="btn btn-primary" onClick={handleToday}>
            Today
          </button>
          <button className="btn btn-secondary" onClick={handleNext}>
            Next
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Focus Time</h3>
          <div className="text-3xl font-bold text-primary">
            {Math.floor(totalFocusTime / 60)}h {totalFocusTime % 60}m
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Completed Todos</h3>
          <div className="text-3xl font-bold text-primary">
            {totalCompletedTodos}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Completion Rate</h3>
          <div className="text-3xl font-bold text-primary">
            {completionRate.toFixed(0)}%
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Most Productive Day</h3>
          <div className="text-3xl font-bold text-primary">
            {getMostProductiveDay()}
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="card p-6">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Priority Distribution */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Priority Distribution</h3>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span>High</span>
              <span>
                {todos.filter((todo) => todo.priority === "high").length}
              </span>
            </div>
            <div className="w-full bg-secondary-dark rounded-full h-2.5">
              <div
                className="bg-red-500 h-2.5 rounded-full"
                style={{
                  width: `${
                    todos.length > 0
                      ? (todos.filter((todo) => todo.priority === "high")
                          .length /
                          todos.length) *
                        100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span>Medium</span>
              <span>
                {todos.filter((todo) => todo.priority === "medium").length}
              </span>
            </div>
            <div className="w-full bg-secondary-dark rounded-full h-2.5">
              <div
                className="bg-yellow-500 h-2.5 rounded-full"
                style={{
                  width: `${
                    todos.length > 0
                      ? (todos.filter((todo) => todo.priority === "medium")
                          .length /
                          todos.length) *
                        100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span>Low</span>
              <span>
                {todos.filter((todo) => todo.priority === "low").length}
              </span>
            </div>
            <div className="w-full bg-secondary-dark rounded-full h-2.5">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{
                  width: `${
                    todos.length > 0
                      ? (todos.filter((todo) => todo.priority === "low")
                          .length /
                          todos.length) *
                        100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
