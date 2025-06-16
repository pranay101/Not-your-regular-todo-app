import './App.css'
import { ActivityGraph } from './components'

function App() {
  return (
   <main className='grid grid-cols-5 gap-6 h-full p-6'>
    <section className='col-span-2 w-full overflow-x-auto'>
            <ActivityGraph />
    </section>
    <section className='bg-red-500 h-full w-full col-span-2'></section>
    <section className='bg-red-500 h-full w-full col-span-1'></section>
   </main>
  )
}

export default App
