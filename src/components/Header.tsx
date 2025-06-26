import {
  ArrowPathIcon,
  ArrowsPointingOutIcon,
  Cog6ToothIcon,
  MinusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";

interface HeaderProps {
  loadTodos: () => void;
  isLoading: boolean;
}

const Header: React.FC<HeaderProps> = ({ loadTodos, isLoading }) => {
  return (
    <header
      style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
      className="flex-shrink-0 h-10 flex items-center justify-between w-full bg-primary-bg border-b border-stroke-primary px-4"
    >
      <div className="flex items-center gap-2">
        <button
          className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center"
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
          onClick={() => window.close()}
        >
          <XMarkIcon className="w-2 h-2 text-red-900" />
        </button>
        <button
          className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center"
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
          onClick={() => window.api.minimize()}
        >
          <MinusIcon className="w-2 h-2 text-yellow-900" />
        </button>
        <button
          className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center"
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
          onClick={() => {
            window.api.maximize();
            loadTodos();
          }}
        >
          <ArrowsPointingOutIcon className="w-2 h-2 text-green-900" />
        </button>
      </div>
      <h5 className="text-white text-center text-sm font-semibold">
        The Thu Du App
      </h5>
      <div className="w-24 z-20 flex items-center gap-2 justify-end  ">
        <button
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
          className={twMerge("cursor-pointer", isLoading && "animate-spin")}
          onClick={() => loadTodos()}
        >
          <ArrowPathIcon className="w-4 h-4 text-white" />
        </button>
        <button
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
          className="cursor-pointer hidden"
        >
          <Cog6ToothIcon className="w-4 h-4 text-white" />
        </button>
      </div>
    </header>
  );
};

export default Header;
