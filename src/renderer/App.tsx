import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import { TodoProvider } from "./contexts/TodoContext";
import { PomodoroProvider } from "./contexts/PomodoroContext";
import "./App.css";

const App: React.FC = () => {
  return (
    <TodoProvider>
      <PomodoroProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </Router>
      </PomodoroProvider>
    </TodoProvider>
  );
};

export default App;
