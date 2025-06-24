// Electron window API types
interface Window {
  api: {
    minimize: () => void;
    maximize: () => void;
  };
  ipcRenderer: {
    invoke(channel: "todos:getAll"): Promise<any[]>;
    invoke(
      channel: "todos:add",
      todo: {
        title: string;
        description: string;
        status: string;
        priority: string;
      }
    ): Promise<any>;
    invoke(
      channel: "todos:updateStatus",
      id: number,
      status: string
    ): Promise<{ success: boolean }>;
    invoke(channel: "todos:delete", id: number): Promise<{ success: boolean }>;
    invoke(channel: "notes:getAll"): Promise<any[]>;
    invoke(channel: "notes:add", content: string): Promise<any>;
    invoke(
      channel: "notes:update",
      id: number,
      content: string
    ): Promise<{ success: boolean }>;
    invoke(channel: "notes:delete", id: number): Promise<{ success: boolean }>;
    invoke(channel: string, ...args: any[]): Promise<any>;
  };
}

// CSS properties for Electron window controls
declare module "react" {
  interface CSSProperties {
    WebkitAppRegion?: "drag" | "no-drag";
  }
}
