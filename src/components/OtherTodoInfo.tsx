import {
  BellAlertIcon,
  CheckCircleIcon,
  HeartIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Todo } from "../config";
import TodoItem from "./TodoItem";

interface OtherTodoInfoProps {
  className?: string;
  importantTodos: Todo[];
  overdueTodos: Todo[];
  onRefresh: () => void;
}

const wholesomeMessages = {
  noImportant: [
    "You're all caught up! 🌟",
    "Nothing urgent - you're doing great! ✨",
    "Clear skies ahead! ☀️",
    "You've got this under control! 💪",
  ],
  noOverdue: [
    "You're staying on top of things! 🎯",
    "No overdue tasks - you're amazing! 🌈",
    "You're crushing it! Keep going! 🚀",
    "Perfect timing! You're doing fantastic! ⭐",
  ],
  encouragement: [
    "Every small step counts! 🌱",
    "You're making progress every day! 📈",
    "Your future self will thank you! 💝",
    "You have the power to achieve anything! ⚡",
  ],
};

const getRandomMessage = (messages: string[]) => {
  return messages[Math.floor(Math.random() * messages.length)];
};

const OtherTodoInfo = ({
  className,
  importantTodos,
  overdueTodos,
  onRefresh,
}: OtherTodoInfoProps) => {
  const [encouragementMessage, setEncouragementMessage] = useState("");

  useEffect(() => {
    // Set a random encouragement message
    setEncouragementMessage(getRandomMessage(wholesomeMessages.encouragement));
  }, []);

  const handleMarkAsDone = async (id: number) => {
    try {
      const todo = [...importantTodos, ...overdueTodos].find(
        (t) => t.id === id
      );
      if (!todo) return;

      await window.ipcRenderer.invoke("todos:updateStatus", id, "done");

      onRefresh();
    } catch (err) {
      console.error("Failed to update todo status:", err);
    }
  };

  return (
    <div
      className={twMerge(
        "component-card max-h-[700px] h-full bg-primary-bg border border-stroke-primary rounded-xl p-4 text-text-primary overflow-y-auto",
        className
      )}
    >
      {/* Daily Encouragement */}
      <div className="mb-6 p-3 bg-gradient-to-r from-primary-blue/10 to-purple-500/10 rounded-lg border border-primary-blue/20">
        <div className="flex items-center gap-2 mb-2">
          <SparklesIcon className="w-4 h-4 text-primary-blue" />
          <h6 className="text-xs font-semibold text-primary-blue">
            Daily Motivation
          </h6>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          {encouragementMessage}
        </p>
      </div>

      <div className="mb-6">
        {/* Important todos due in next 3 days */}
        <div className="flex items-center gap-2 flex-shrink-0 mb-3">
          <div className="w-6 h-6 rounded-full p-1 bg-secondary-bg">
            <CheckCircleIcon className="w-4 h-4 text-primary-blue" />
          </div>
          <h5 className="text-white text-sm font-medium tracking-wide">
            Important (Next 3 days)
          </h5>
          {importantTodos.length > 0 && (
            <span className="ml-auto text-xs bg-primary-blue/20 text-primary-blue px-2 py-1 rounded-full">
              {importantTodos.length}
            </span>
          )}
        </div>

        {importantTodos.length === 0 ? (
          <div className="text-center py-4">
            <HeartIcon className="w-8 h-8 text-primary-blue/50 mx-auto mb-2" />
            <p className="text-xs text-text-secondary italic">
              {getRandomMessage(wholesomeMessages.noImportant)}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <AnimatePresence>
              {importantTodos.map((todo) => (
                <TodoItem
                  onStatusChange={handleMarkAsDone}
                  isDone={false}
                  key={todo.id}
                  todo={todo}
                  id="upcoming-important"
                  onRefresh={onRefresh}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="border-t border-stroke-primary pt-4">
        {/* Overdue todos from last 7 days */}
        <div className="flex items-center gap-2 flex-shrink-0 mb-3">
          <div className="w-6 h-6 rounded-full p-1 bg-secondary-bg">
            <BellAlertIcon className="w-4 h-4 text-primary-red" />
          </div>
          <h5 className="text-white text-sm font-medium tracking-wide">
            Overdue
          </h5>
          {overdueTodos.length > 0 && (
            <span className="ml-auto text-xs bg-primary-red/20 text-primary-red px-2 py-1 rounded-full">
              {overdueTodos.length}
            </span>
          )}
        </div>

        {overdueTodos.length === 0 ? (
          <div className="text-center py-4">
            <SparklesIcon className="w-8 h-8 text-green-400/50 mx-auto mb-2" />
            <p className="text-xs text-text-secondary italic">
              {getRandomMessage(wholesomeMessages.noOverdue)}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <AnimatePresence>
              {overdueTodos.map((todo) => (
                <TodoItem
                  onStatusChange={handleMarkAsDone}
                  isDone={false}
                  key={todo.id}
                  todo={todo}
                  id="overdue"
                  onRefresh={onRefresh}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Bottom Encouragement */}
      <div className="mt-4 pt-4 border-t border-stroke-primary">
        <div className="text-center">
          <p className="text-xs text-text-secondary">
            Remember: Progress over perfection! 🌟
          </p>
          <p className="text-xs text-text-secondary mt-1">
            You're doing better than you think! 💫
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtherTodoInfo;
