// Electron window API types
interface Window {
  api: {
    minimize: () => void;
    maximize: () => void;
  };
}

// CSS properties for Electron window controls
declare module 'react' {
  interface CSSProperties {
    WebkitAppRegion?: 'drag' | 'no-drag';
  }
} 