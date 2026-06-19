import { useState } from 'react'

export default function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) { setError('Title is required'); return }
    setLoading(true)
    setError('')
    try {
      await onAdd({ title: title.trim(), description: description.trim(), dueDate: dueDate || null })
      setTitle(''); setDescription(''); setDueDate('')
    } catch (err) {
      setError(err.response?.data?.title || 'Failed to add task')
    } finally { setLoading(false) }
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="field grow">
          <label htmlFor="title">Task title *</label>
          <input
            id="title" type="text" value={title} maxLength={255}
            onChange={e => setTitle(e.target.value)}
            placeholder="What needs to be done?"
          />
          {error && <span className="field-error">{error}</span>}
        </div>
        <div className="field">
          <label htmlFor="due">Due date</label>
          <input id="due" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        </div>
      </div>
      <div className="form-row">
        <div className="field grow">
          <label htmlFor="desc">Description</label>
          <textarea id="desc" rows={2} value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Add details…" />
        </div>
        <div className="field align-end">
          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? 'Adding…' : '+ Add task'}
          </button>
        </div>
      </div>
    </form>
  )
}
