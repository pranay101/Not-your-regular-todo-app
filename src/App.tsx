import "./App.css";
import {
  ActivityGraph,
  Calendar,
  Header,
  MainTodoList,
  OtherTodoInfo,
  PomodoroToday,
  Position,
  QuickNote,
  WorkMode,
} from "./components";


function App() {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <main className="grid grid-cols-5 gap-4 h-full p-4">
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
        <section className="col-span-1 flex flex-col w-full flex-1 h-full overflow-y-auto">
          <OtherTodoInfo />
        </section>
      </main>
    </div>
  );
}

export default App;
