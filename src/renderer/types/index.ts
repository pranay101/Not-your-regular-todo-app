export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  category?: string;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  tags?: string[];
}

export interface Pomodoro {
  id: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  type: "pomodoro" | "shortBreak" | "longBreak";
  todoId?: string;
}

export interface Settings {
  pomodoroLength: number; // in minutes
  shortBreakLength: number; // in minutes
  longBreakLength: number; // in minutes
  longBreakInterval: number; // after how many pomodoros
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  darkMode: boolean;
}

export interface PomodoroStats {
  date: string;
  count: number;
}

export interface TodoCategory {
  id: string;
  name: string;
  color: string;
}
