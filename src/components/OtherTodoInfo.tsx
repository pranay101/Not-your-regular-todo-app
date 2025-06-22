import { BellAlertIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "framer-motion";

interface Todo {
  id: number;
  title: string;
  dueDate: string;
}

interface OtherTodoInfoProps {
  className?: string;
}

const importantTodos: Todo[] = [
  {
    id: 1,
    title: "Complete project presentation",
    dueDate: "2024-01-20",
  },
  {
    id: 2,
    title: "Schedule team meeting",
    dueDate: "2024-01-22",
  },
  {
    id: 3,
    title: "Review quarterly goals",
    dueDate: "2024-01-25",
  },
];

const overdueTodos: Todo[] = [
  {
    id: 4,
    title: "Submit expense reports",
    dueDate: "2024-01-15",
  },
  {
    id: 5,
    title: "Update documentation",
    dueDate: "2024-01-10",
  },
];

const TodoItem: React.FC<{ todo: Todo; isOverdue?: boolean }> = ({
  todo,
  isOverdue,
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={twMerge(
        "flex items-start gap-2 cursor-pointer",
        isOverdue && "text-primary-red"
      )}
    >
      <div className="w-6 h-6 rounded-full flex items-center justify-center aspect-square bg-secondary-bg border border-stroke-secondary" />
      <p className="text-xs font-medium mt-1">{todo.title}</p>
    </motion.div>
  );
};

const OtherTodoInfo: React.FC<OtherTodoInfoProps> = ({ className }) => {
  return (
    <div
      className={twMerge(
        "component-card max-h-[700px] h-full bg-primary-bg border border-stroke-primary rounded-xl p-2 text-text-primary",
        className
      )}
    >
      <div className="mb-4">
        <div className="flex items-center gap-2 flex-shrink-0 mb-3">
          <div className="w-6 h-6 rounded-full p-1 bg-secondary-bg">
            <CheckCircleIcon className="text-primary-blue" />
          </div>
          <h5 className="text-white text-xs font-medium tracking-wide">
            What you shouldn't forget
          </h5>
        </div>
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {importantTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 flex-shrink-0 mb-3">
          <div className="w-6 h-6 rounded-full p-1 bg-secondary-bg">
            <BellAlertIcon className="text-primary-red" />
          </div>
          <h5 className="text-white text-xs font-medium tracking-wide">
            Overdue
          </h5>
        </div>
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {overdueTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} isOverdue />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default OtherTodoInfo;
