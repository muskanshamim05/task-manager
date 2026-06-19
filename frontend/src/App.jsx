import { useState, useEffect, useCallback } from 'react'
import { taskApi } from './api/tasks'
import AddTaskForm from './components/AddTaskForm'
import TaskCard from './components/TaskCard'
import DeleteModal from './components/DeleteModal'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState({ active: 0, completed: 0, total: 0 })
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadTasks = useCallback(async () => {
    try {
      const [data, statsData] = await Promise.all([
        taskApi.getAll(filter, search),
        taskApi.getStats()
      ])
      setTasks(data)
      setStats(statsData)
      setError('')
    } catch {
      setError('Could not connect to server. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }, [filter, search])

  useEffect(() => { loadTasks() }, [loadTasks])

  const handleAdd = async (data) => {
    await taskApi.create(data)
    loadTasks()
  }

  const handleToggle = async (id) => {
    await taskApi.toggle(id)
    loadTasks()
  }

  const handleUpdate = async (id, data) => {
    await taskApi.update(id, data)
    loadTasks()
  }

  const handleDeleteConfirm = async (id) => {
    await taskApi.delete(id)
    setDeleteTarget(null)
    loadTasks()
  }

  const emptyMessage = () => {
    if (search) return { icon: '🔍', title: `No tasks match "${search}"`, sub: 'Try a different search term' }
    if (filter === 'completed') return { icon: '✅', title: 'Nothing completed yet', sub: 'Finish a task and it will appear here' }
    if (filter === 'active') return { icon: '🎉', title: 'All caught up!', sub: 'No active tasks right now' }
    return { icon: '📋', title: 'No tasks yet', sub: 'Add your first task above to get started' }
  }

  return (
    <div className="app">
      <div className="header">
        <h1 className="app-title">My tasks</h1>
        <p className="app-sub">Stay on top of what matters</p>
        <div className="stats">
          <div className="stat"><span className="stat-num active">{stats.active}</span><span className="stat-label">Active</span></div>
          <div className="stat"><span className="stat-num done">{stats.completed}</span><span className="stat-label">Completed</span></div>
          <div className="stat"><span className="stat-num over">{tasks.filter(t => !t.done && t.dueDate && new Date(t.dueDate + 'T23:59:59') < new Date()).length}</span><span className="stat-label">Overdue</span></div>
          <div className="stat"><span className="stat-num">{stats.total}</span><span className="stat-label">Total</span></div>
        </div>
      </div>

      <AddTaskForm onAdd={handleAdd} />

      {error && <div className="error-banner">{error}</div>}

      <div className="toolbar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text" placeholder="Search tasks…" value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filters">
          {['all', 'active', 'completed'].map(f => (
            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="empty"><p>Loading…</p></div>
      ) : tasks.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">{emptyMessage().icon}</div>
          <p className="empty-title">{emptyMessage().title}</p>
          <span className="empty-sub">{emptyMessage().sub}</span>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map(task => (
            <TaskCard
              key={task.id} task={task}
              onToggle={handleToggle}
              onUpdate={handleUpdate}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <DeleteModal
        task={deleteTarget}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
