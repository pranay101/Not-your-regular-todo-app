export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  category?: "work" | "personal";
  createdAt: string;
  completedAt: string | null;
  description?: string;
  dueDate?: string;
  tags?: string[];
}

export interface Pomodoro {
  id: string;
  type: "pomodoro" | "shortBreak" | "longBreak";
  duration: number;
  startTime: string;
  endTime: string | null;
  todoId: string | null;
}

export interface Settings {
  pomodoroLength: number;
  shortBreakLength: number;
  longBreakLength: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  darkMode: boolean;
  notificationsEnabled: boolean;
}
