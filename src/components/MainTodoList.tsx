import React, { useState } from "react";
import data from "../config/data.json";
import { CheckCircleIcon, CheckIcon } from "@heroicons/react/24/outline";

interface MainTodoListProps {}

const MainTodoList: React.FC<MainTodoListProps> = () => {
  const [doneTodos, setDoneTodos] = useState(
    data.todos.filter((todo) => todo.status === "done")
  );
  const [pendingTodos, setPendingTodos] = useState(
    data.todos.filter((todo) => todo.status === "pending")
  );

  return (
    <div className="grid grid-cols-2 gap-4 h-full flex-1 overflow-y-auto">
      <div className="w-full flex flex-col  max-h-[688px] bg-primary-bg border border-stroke-primary rounded-xl p-2">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-6 h-6 rounded-full p-1 bg-secondary-bg">
            <CheckCircleIcon className="text-primary-blue" />{" "}
          </div>
          <h5 className="text-white text-xs font-medium tracking-wide">
            Completed
          </h5>
        </div>
        <div className="flex flex-col gap-2 mt-4 text-sm text-text-primary flex-1 overflow-y-auto">
          {doneTodos.map((todo) => (
            <div key={todo.id} className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center aspect-square border border-primary-purple">
                <CheckIcon className="w-4 h-4 text-white" />
              </div>
              <p className=" text-xs font-medium mt-1">{todo.title}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full flex flex-col max-h-[688px] bg-primary-bg border border-stroke-primary rounded-xl p-2">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-6 h-6 rounded-full p-1 bg-secondary-bg">
            <CheckCircleIcon className="text-primary-blue" />{" "}
          </div>
          <h5 className="text-white text-xs font-medium tracking-wide">
            Completed
          </h5>
        </div>
        <div className="flex flex-col gap-2 mt-4 text-sm text-text-primary flex-1 overflow-y-auto">
          {pendingTodos.map((todo) => (
            <div key={todo.id} className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center aspect-square bg-secondary-bg border border-stroke-secondary" />

              <p className=" text-xs font-medium mt-1">{todo.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainTodoList;
