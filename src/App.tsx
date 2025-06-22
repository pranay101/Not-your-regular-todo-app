import "./App.css";
import { ActivityGraph, Calendar, MainTodoList, PomodoroToday, Position, QuickNote, WorkMode } from "./components";

function App() {
  return (
    <main className="grid grid-cols-5 gap-6 h-full  p-6">
      <section className="col-span-2 w-full overflow-x-auto h-fit">
        <ActivityGraph />
        <div className="flex items-start gap-4 mt-4">
          <Calendar className="flex-1 bg-bg-secondary bg-gray-100" />
          <Position />
          <WorkMode />
        </div>
        <div className="flex items-start gap-4 mt-4">
          <PomodoroToday totalTasks={10} completedTasks={7} />
          <QuickNote />
        </div>
      </section>
      <section className="col-span-2 flex flex-col w-full flex-1 h-full overflow-y-auto">
        <MainTodoList />
      </section>
      {/* <section className="bg-red-500 h-full w-full col-span-2"></section>
      <section className="bg-red-500 h-full w-full col-span-1"></section> */}
    </main>
  );
}

export default App;
