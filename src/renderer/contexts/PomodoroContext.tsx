import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Pomodoro } from "../types";

interface PomodoroContextType {
  isActive: boolean;
  isPaused?: boolean;
  timeLeft: number;
  currentSession: "pomodoro" | "shortBreak" | "longBreak";
  pomodoroHistory: Pomodoro[];
  completedPomodoros?: number;
  startTimer: (todoId?: string) => void;
  pauseTimer: () => void;
  resumeTimer?: () => void;
  stopTimer?: () => void;
  resetTimer: () => void;
  skipTimer: () => void;
}

interface Settings {
  pomodoroLength: number;
  shortBreakLength: number;
  longBreakLength: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(
  undefined
);

export const PomodoroProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Default 25 minutes
  const [currentSession, setCurrentSession] = useState<
    "pomodoro" | "shortBreak" | "longBreak"
  >("pomodoro");
  const [pomodoroHistory, setPomodoroHistory] = useState<Pomodoro[]>([]);
  const [settings, setSettings] = useState<Settings>({
    pomodoroLength: 25,
    shortBreakLength: 5,
    longBreakLength: 15,
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
  });
  const [currentPomodoro, setCurrentPomodoro] = useState<Pomodoro | null>(null);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  // Load settings and pomodoro history from database on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load settings
        const loadedSettings = await window.electron.ipcRenderer.invoke(
          "get-settings"
        );
        setSettings(loadedSettings);

        // Set initial timer based on settings
        setTimeLeft(loadedSettings.pomodoroLength * 60);

        // Load pomodoro history
        const loadedPomodoros = await window.electron.ipcRenderer.invoke(
          "get-pomodoros"
        );
        setPomodoroHistory(loadedPomodoros || []);
      } catch (error) {
        console.error("Failed to load pomodoro data:", error);
      }
    };

    loadData();
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer completed
      handleTimerComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleTimerComplete = async () => {
    // Play notification sound
    const audio = new Audio("/assets/notification.mp3");
    audio.play();

    // Save completed pomodoro to history if it was a pomodoro session
    if (currentSession === "pomodoro" && currentPomodoro) {
      const completedPomodoro: Pomodoro = {
        ...currentPomodoro,
        endTime: new Date().toISOString(),
      };

      try {
        await window.electron.ipcRenderer.invoke(
          "add-pomodoro",
          completedPomodoro
        );
        setPomodoroHistory((prev) => [...prev, completedPomodoro]);
      } catch (error) {
        console.error("Failed to save pomodoro:", error);
      }
    }

    // Reset current pomodoro
    setCurrentPomodoro(null);

    // Update completed pomodoros count if it was a pomodoro session
    if (currentSession === "pomodoro") {
      setCompletedPomodoros((prev) => prev + 1);
    }

    // Determine next session
    let nextSession: "pomodoro" | "shortBreak" | "longBreak";
    if (currentSession !== "pomodoro") {
      nextSession = "pomodoro";
    } else {
      // After a pomodoro, determine if it should be a short or long break
      const isLongBreakDue =
        (completedPomodoros + 1) % settings.longBreakInterval === 0;
      nextSession = isLongBreakDue ? "longBreak" : "shortBreak";
    }

    // Set the next session
    setCurrentSession(nextSession);

    // Set the timer based on the next session
    if (nextSession === "pomodoro") {
      setTimeLeft(settings.pomodoroLength * 60);
    } else if (nextSession === "shortBreak") {
      setTimeLeft(settings.shortBreakLength * 60);
    } else {
      setTimeLeft(settings.longBreakLength * 60);
    }

    // Auto-start next session if enabled in settings
    if (
      (nextSession !== "pomodoro" && settings.autoStartBreaks) ||
      (nextSession === "pomodoro" && settings.autoStartPomodoros)
    ) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  };

  const startTimer = (todoId?: string) => {
    if (!isActive) {
      setIsActive(true);

      // Create a new pomodoro entry if starting a pomodoro session
      if (currentSession === "pomodoro" && !currentPomodoro) {
        const newPomodoro: Pomodoro = {
          id: uuidv4(),
          type: currentSession,
          duration: settings.pomodoroLength * 60,
          startTime: new Date().toISOString(),
          endTime: null,
          todoId: todoId || null,
        };
        setCurrentPomodoro(newPomodoro);
      }
    }
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);

    // Reset timer based on current session type
    if (currentSession === "pomodoro") {
      setTimeLeft(settings.pomodoroLength * 60);
    } else if (currentSession === "shortBreak") {
      setTimeLeft(settings.shortBreakLength * 60);
    } else {
      setTimeLeft(settings.longBreakLength * 60);
    }

    // Reset current pomodoro
    setCurrentPomodoro(null);
  };

  const skipTimer = () => {
    setIsActive(false);
    handleTimerComplete();
  };

  return (
    <PomodoroContext.Provider
      value={{
        isActive,
        timeLeft,
        currentSession,
        pomodoroHistory,
        startTimer,
        pauseTimer,
        resetTimer,
        skipTimer,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
};

export const usePomodoro = (): PomodoroContextType => {
  const context = useContext(PomodoroContext);
  if (context === undefined) {
    throw new Error("usePomodoro must be used within a PomodoroProvider");
  }
  return context;
};
