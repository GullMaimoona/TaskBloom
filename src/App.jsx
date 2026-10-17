import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDown, ArrowUp, Check, CheckCheck, ChevronDown, Circle, Clock3,
  ListTodo, Plus, Search, Sparkles, Trash2, X,
} from 'lucide-react'

const starterTasks = []
const STORAGE_KEY = 'taskbloom-tasks'

const filters = ['All tasks', 'In progress', 'Completed']
const categoryStyles = {
  Work: 'bg-[#f0ede6] text-[#77705f]',
  Personal: 'bg-[#e8efe5] text-[#657b5b]',
  Learning: 'bg-[#f4e8e2] text-[#aa7057]',
}

function getDateLabel() {
  return new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())
}

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : starterTasks
    } catch {
      return starterTasks
    }
  })
  const [filter, setFilter] = useState('All tasks')
  const [query, setQuery] = useState('')
  const [input, setInput] = useState('')
  const [category, setCategory] = useState('Work')
  const [showComposer, setShowComposer] = useState(false)
  const [sortNewest, setSortNewest] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const completed = tasks.filter((task) => task.done).length
  const remaining = tasks.length - completed
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0
  const visibleTasks = useMemo(() => {
    let result = tasks.filter((task) => {
      const matchesFilter = filter === 'All tasks' || (filter === 'Completed' ? task.done : !task.done)
      return matchesFilter && task.title.toLowerCase().includes(query.toLowerCase())
    })
    if (sortNewest) result = [...result].reverse()
    return result
  }, [tasks, filter, query, sortNewest])

  function addTask(event) {
    event.preventDefault()
    const title = input.trim()
    if (!title) return
    setTasks((current) => [{ id: Date.now(), title, category, time: new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date()), done: false }, ...current])
    setInput('')
    setShowComposer(false)
  }

  function toggleTask(id) {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, done: !task.done } : task))
  }

  function deleteTask(id) {
    setTasks((current) => current.filter((task) => task.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-[#292b28]">
      <header className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-6 sm:px-8 lg:px-10">
        <a href="#top" className="flex items-center gap-2.5" aria-label="TaskBloom home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#566b4f] text-white shadow-sm"><CheckCheck size={19} strokeWidth={2.4} /></span>
          <span className="font-display text-[19px] font-extrabold tracking-[-0.8px]">TaskBloom<span className="text-[#8d9b83]">.</span></span>
        </a>
        <button className="flex items-center gap-2 rounded-full border border-[#e9e7e1] bg-white/70 py-1.5 pl-1.5 pr-3 text-sm font-semibold text-[#565952] transition hover:bg-white">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e8ece4] text-xs font-bold text-[#566b4f]">T</span>
          <span className="hidden sm:inline">My profile</span><ChevronDown size={15} className="text-[#96988f]" />
        </button>
      </header>

      <main id="top" className="mx-auto max-w-[1180px] px-5 pb-16 pt-6 sm:px-8 sm:pt-10 lg:px-10">
        <section className="mb-9 flex flex-col justify-between gap-6 sm:mb-11 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-[14px] font-semibold uppercase tracking-[1.7px] text-[#73766d]">{getDateLabel()}</p>
            <h1 className="font-display text-[34px] font-bold leading-tight tracking-[-1.6px] text-[#292b28] sm:text-[42px]">Hello, welcome! <span className="inline-block origin-bottom animate-wave">👋</span></h1>
            <p className="mt-2 text-[16px] text-[#686b63]">A little progress each day adds up.</p>
          </div>
          <button onClick={() => setShowComposer(true)} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#566b4f] px-5 text-[14px] font-semibold text-white shadow-[0_5px_14px_rgba(65,83,58,0.15)] transition hover:-translate-y-0.5 hover:bg-[#465a40] active:translate-y-0">
            <Plus size={18} strokeWidth={2.5} /> Add a task
          </button>
        </section>

        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#ebe9e3] bg-white p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between"><span className="text-[16px] font-semibold text-[#454840]">Tasks today</span><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f2f0e9] text-[#7a796d]"><ListTodo size={18} /></span></div>
            <div className="flex items-end gap-2"><span className="font-display text-[36px] font-bold leading-none tracking-[-1px]">{tasks.length}</span><span className="pb-0.5 text-[16px] font-medium text-[#62655d]">total tasks</span></div>
          </div>
          <div className="rounded-2xl border border-[#ebe9e3] bg-white p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between"><span className="text-[16px] font-semibold text-[#454840]">Still to do</span><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#faf0e7] text-[#bd885b]"><Clock3 size={18} /></span></div>
            <div className="flex items-end gap-2"><span className="font-display text-[36px] font-bold leading-none tracking-[-1px]">{remaining}</span><span className="pb-0.5 text-[16px] font-medium text-[#62655d]">left for today</span></div>
          </div>
          <div className="rounded-2xl border border-[#ebe9e3] bg-white p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between"><span className="text-[16px] font-semibold text-[#454840]">Daily progress</span><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eaf0e7] text-[#66815c]"><Sparkles size={17} /></span></div>
            <div className="mb-3 flex items-end justify-between"><span className="font-display text-[36px] font-bold leading-none tracking-[-1px]">{progress}<span className="text-[23px]">%</span></span><span className="pb-0.5 text-[15px] font-medium text-[#565a52]">{completed} of {tasks.length} done</span></div>
            <div className="h-[6px] overflow-hidden rounded-full bg-[#eff0eb]"><div className="h-full rounded-full bg-[#76916b] transition-all duration-500" style={{ width: `${progress}%` }} /></div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#ebe9e3] bg-white">
          <div className="flex flex-col gap-4 border-b border-[#f0efe9] px-5 py-5 sm:px-7 sm:py-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><h2 className="font-display text-[20px] font-bold tracking-[-0.5px]">Your tasks</h2><p className="mt-1 text-[14px] text-[#73766d]">Keep your day moving, one thing at a time.</p></div>
              <button onClick={() => setSortNewest(!sortNewest)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-medium text-[#777970] transition hover:bg-[#f8f7f4]">{sortNewest ? <ArrowUp size={15} /> : <ArrowDown size={15} />} {sortNewest ? 'Newest first' : 'Oldest first'}</button>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-1 overflow-x-auto">
                {filters.map((item) => <button key={item} onClick={() => setFilter(item)} className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-[13px] font-semibold transition ${filter === item ? 'bg-[#edf0e9] text-[#506547]' : 'text-[#92938a] hover:bg-[#f8f7f4] hover:text-[#55574f]'}`}>{item}{item === 'All tasks' && <span className="ml-1.5 text-[11px] opacity-60">{tasks.length}</span>}</button>)}
              </div>
              <label className="flex h-11 w-full items-center gap-2 rounded-lg border border-[#d8d9d1] bg-white px-3 text-[#62665d] transition focus-within:border-[#879b7d] focus-within:ring-3 focus-within:ring-[#879b7d]/10 sm:w-[240px]"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks..." className="w-full bg-transparent text-[14px] font-medium text-[#373933] outline-none placeholder:font-normal placeholder:text-[#777970]" /></label>
            </div>
          </div>

          <div className="min-h-[280px]">
            {visibleTasks.length ? <ul className="divide-y divide-[#f2f1ec]">
              {visibleTasks.map((task) => <li key={task.id} className="group flex items-center gap-3.5 px-5 py-[17px] transition hover:bg-[#fcfbf9] sm:gap-4 sm:px-7">
                <button onClick={() => toggleTask(task.id)} aria-label={task.done ? `Mark ${task.title} incomplete` : `Complete ${task.title}`} className={`flex h-[21px] w-[21px] shrink-0 items-center justify-center rounded-full border transition ${task.done ? 'border-[#76916b] bg-[#76916b] text-white' : 'border-[#d9dad3] text-transparent hover:border-[#82977a]'}`}>{task.done && <Check size={13} strokeWidth={3} />}</button>
                <div className="min-w-0 flex-1"><p className={`truncate text-[16px] font-semibold transition ${task.done ? 'text-[#92948b] line-through' : 'text-[#353831]'}`}>{task.title}</p><div className="mt-1.5 flex items-center gap-2.5"><span className={`rounded-md px-2 py-[3px] text-[13px] font-semibold ${categoryStyles[task.category] || 'bg-[#f0ede6] text-[#77705f]'}`}>{task.category}</span><span className="text-[14px] text-[#74776f]">{task.time}</span></div></div>
                <button onClick={() => deleteTask(task.id)} aria-label={`Delete ${task.title}`} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#b5b4ac] opacity-100 transition hover:bg-[#fbefec] hover:text-[#ba7464] sm:opacity-0 sm:group-hover:opacity-100"><Trash2 size={15} /></button>
              </li>)}
            </ul> : <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center"><span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3f2ed] text-[#899280]"><Circle size={21} /></span><p className="text-[17px] font-semibold text-[#60625a]">{query ? 'No matching tasks' : filter === 'Completed' ? 'Nothing completed yet' : 'You’re all caught up'}</p><p className="mt-1 max-w-[300px] text-[15px] text-[#777970]">{query ? 'Try a different search.' : 'Add a task when something new comes up.'}</p></div>}
          </div>
          <div className="flex items-center justify-between border-t border-[#f0efe9] px-5 py-3.5 text-[14px] font-medium text-[#74776f] sm:px-7"><span>{remaining === 0 ? 'Everything is complete' : `${remaining} ${remaining === 1 ? 'task' : 'tasks'} remaining`}</span><span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#8da580]" />Saved automatically</span></div>
        </section>

        <footer className="mt-7 flex items-center justify-center text-[14px] font-semibold text-[#393c36]">Make today count, at your own pace.</footer>
      </main>

      {showComposer && <div className="fixed inset-0 z-20 flex items-center justify-center bg-[#22251f]/30 px-4 backdrop-blur-[2px]" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowComposer(false) }}>
        <form onSubmit={addTask} className="w-full max-w-[440px] rounded-2xl border border-[#eceae4] bg-white p-6 shadow-[0_24px_80px_rgba(34,37,31,0.18)] sm:p-7">
          <div className="mb-6 flex items-start justify-between"><div><p className="text-[12px] font-semibold uppercase tracking-[1.5px] text-[#92938a]">Make it happen</p><h2 className="mt-1 font-display text-[22px] font-bold tracking-[-0.7px]">Add a new task</h2></div><button type="button" aria-label="Close" onClick={() => setShowComposer(false)} className="rounded-lg p-2 text-[#92938a] hover:bg-[#f5f4f0]"><X size={18} /></button></div>
          <label className="mb-2 block text-[13px] font-semibold text-[#65675f]">What needs to get done?</label><input autoFocus value={input} onChange={(event) => setInput(event.target.value)} placeholder="e.g. Plan the week ahead" className="h-12 w-full rounded-xl border border-[#e8e7e0] px-3.5 text-[14px] outline-none transition placeholder:text-[#b5b5ad] focus:border-[#879b7d] focus:ring-3 focus:ring-[#879b7d]/10" />
          <label className="mb-2 mt-5 block text-[13px] font-semibold text-[#65675f]">Category</label><div className="flex flex-wrap gap-2">{Object.keys(categoryStyles).map((item) => <button type="button" key={item} onClick={() => setCategory(item)} className={`rounded-lg px-3.5 py-2 text-[12px] font-semibold transition ${category === item ? 'ring-2 ring-[#879b7d]/50 ring-offset-1 ' : ''}${categoryStyles[item]}`}>{item}</button>)}</div>
          <div className="mt-7 flex justify-end gap-2"><button type="button" onClick={() => setShowComposer(false)} className="rounded-xl px-4 py-2.5 text-[13px] font-semibold text-[#777970] hover:bg-[#f6f5f1]">Cancel</button><button disabled={!input.trim()} className="inline-flex items-center gap-1.5 rounded-xl bg-[#566b4f] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#465a40] disabled:cursor-not-allowed disabled:opacity-40"><Plus size={16} /> Add task</button></div>
        </form>
      </div>}
    </div>
  )
}

export default App
