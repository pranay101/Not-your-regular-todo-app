import "./App.css";
import { ActivityGraph, Calendar, Position, WorkMode } from "./components";

function App() {
  return (
    <main className="grid grid-cols-5 gap-6 h-full p-6">
      <section className="col-span-2 w-full overflow-x-auto h-fit">
        <ActivityGraph />
        <div className="flex items-start gap-4 mt-4">
          <Calendar className="flex-1 bg-bg-secondary bg-gray-100" />
          <Position />
          <WorkMode />
        </div>
      </section>
      {/* <section className="bg-red-500 h-full w-full col-span-2"></section>
      <section className="bg-red-500 h-full w-full col-span-1"></section> */}
    </main>
  );
}

export default App;
