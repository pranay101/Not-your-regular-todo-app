import React, { useEffect, useState } from "react";
import { usePomodoro } from "../contexts/PomodoroContext";
import { useSettings } from "../contexts/SettingsContext";
import { useTodo } from "../contexts/TodoContext";

const PomodoroTimer: React.FC = () => {
  const {
    isActive,
    timeLeft,
    currentSession,
    startTimer,
    pauseTimer,
    resetTimer,
    skipTimer,
  } = usePomodoro();

  const isPaused = false; // Default value if not provided by context
  const completedPomodoros = 0; // Default value if not provided by context
  const resumeTimer = pauseTimer; // Fallback if not provided
  const stopTimer = resetTimer; // Fallback if not provided

  const { settings } = useSettings();
  const { todos } = useTodo();
  const [selectedTodoId, setSelectedTodoId] = useState<string | undefined>(
    undefined
  );
  const [progress, setProgress] = useState(100);

  // Calculate progress percentage for the progress ring
  useEffect(() => {
    let totalTime: number;
    switch (currentSession) {
      case "pomodoro":
        totalTime = settings.pomodoroLength * 60;
        break;
      case "shortBreak":
        totalTime = settings.shortBreakLength * 60;
        break;
      case "longBreak":
        totalTime = settings.longBreakLength * 60;
        break;
    }

    const progressPercentage = (timeLeft / totalTime) * 100;
    setProgress(progressPercentage);
  }, [timeLeft, currentSession, settings]);

  // Format time left as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Get session name for display
  const getSessionName = (): string => {
    switch (currentSession) {
      case "pomodoro":
        return "Focus Time";
      case "shortBreak":
        return "Short Break";
      case "longBreak":
        return "Long Break";
      default:
        return "Pomodoro";
    }
  };

  // Get color based on current session
  const getSessionColor = (): string => {
    switch (currentSession) {
      case "pomodoro":
        return "text-primary";
      case "shortBreak":
        return "text-green-500";
      case "longBreak":
        return "text-blue-500";
      default:
        return "text-primary";
    }
  };

  // Handle start timer with selected todo
  const handleStartTimer = () => {
    startTimer(selectedTodoId);
  };

  // Calculate the circumference of the progress ring
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Pomodoro Timer</h1>

      <div className="flex flex-col items-center justify-center">
        {/* Session Type */}
        <div className={`text-xl font-medium mb-4 ${getSessionColor()}`}>
          {getSessionName()}
        </div>

        {/* Timer Circle */}
        <div className="relative w-72 h-72 flex items-center justify-center">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 300 300"
          >
            {/* Background circle */}
            <circle
              cx="150"
              cy="150"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-secondary-light"
            />

            {/* Progress circle */}
            <circle
              cx="150"
              cy="150"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={getSessionColor()}
              strokeLinecap="round"
            />
          </svg>

          {/* Time display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-6xl font-bold">{formatTime(timeLeft)}</div>
            <div className="text-sm text-gray-400 mt-2">
              {completedPomodoros} pomodoros completed
            </div>
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex space-x-4 mt-8">
          {!isActive ? (
            <button onClick={handleStartTimer} className="btn btn-primary px-6">
              Start
            </button>
          ) : isPaused ? (
            <button onClick={resumeTimer} className="btn btn-primary px-6">
              Resume
            </button>
          ) : (
            <button onClick={pauseTimer} className="btn btn-primary px-6">
              Pause
            </button>
          )}

          <button
            onClick={stopTimer}
            className="btn btn-secondary"
            disabled={!isActive}
          >
            Stop
          </button>

          <button
            onClick={skipTimer}
            className="btn btn-secondary"
            disabled={!isActive}
          >
            Skip
          </button>

          <button onClick={resetTimer} className="btn btn-secondary">
            Reset
          </button>
        </div>
      </div>

      {/* Todo Selection */}
      {currentSession === "pomodoro" && !isActive && (
        <div className="card mt-8">
          <h2 className="text-lg font-semibold mb-4">
            Select a Todo for this Pomodoro
          </h2>

          {todos.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <div
                className={`p-2 rounded cursor-pointer hover:bg-secondary ${
                  selectedTodoId === undefined ? "bg-secondary" : ""
                }`}
                onClick={() => setSelectedTodoId(undefined)}
              >
                <span className="font-medium">No specific todo</span>
              </div>

              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`p-2 rounded cursor-pointer hover:bg-secondary ${
                    selectedTodoId === todo.id ? "bg-secondary" : ""
                  }`}
                  onClick={() => setSelectedTodoId(todo.id)}
                >
                  <span className="font-medium">{todo.title}</span>
                  {todo.priority === "high" && (
                    <span className="ml-2 text-xs bg-red-500 text-white px-1 rounded">
                      High
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">
              No active todos. Add some todos first!
            </p>
          )}
        </div>
      )}

      {/* Pomodoro Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="card">
          <h3 className="font-semibold mb-2">Focus Time</h3>
          <p className="text-gray-400">{settings.pomodoroLength} minutes</p>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-2">Short Break</h3>
          <p className="text-gray-400">{settings.shortBreakLength} minutes</p>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-2">Long Break</h3>
          <p className="text-gray-400">
            Every {settings.longBreakInterval} pomodoros
          </p>
          <p className="text-gray-400">{settings.longBreakLength} minutes</p>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
