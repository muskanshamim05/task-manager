import { useState } from 'react'

function formatDate(str) {
  if (!str) return ''
  const d = new Date(str + 'T12:00:00')
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function isOverdue(task) {
  if (!task.dueDate || task.done) return false
  return new Date(task.dueDate + 'T23:59:59') < new Date()
}

function isToday(task) {
  if (!task.dueDate || task.done) return false
  return new Date(task.dueDate + 'T12:00:00').toDateString() === new Date().toDateString()
}

export default function TaskCard({ task, onToggle, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
  const [dueDate, setDueDate] = useState(task.dueDate || '')
  const [saving, setSaving] = useState(false)

  const overdue = isOverdue(task)
  const today = isToday(task)

  const handleSave = async () => {
    if (!title.trim()) return
    setSaving(true)
    try {
      await onUpdate(task.id, {
        title: title.trim(), description: description.trim(),
        dueDate: dueDate || null, done: task.done
      })
      setEditing(false)
    } finally { setSaving(false) }
  }

  const handleCancel = () => {
    setTitle(task.title)
    setDescription(task.description || '')
    setDueDate(task.dueDate || '')
    setEditing(false)
  }

  return (
    <div className={`task-card ${overdue ? 'overdue' : ''} ${task.done ? 'done-card' : ''}`}>
      <div className="task-top">
        <button
          className={`check-btn ${task.done ? 'checked' : ''}`}
          onClick={() => onToggle(task.id)}
          aria-label={task.done ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.done && '✓'}
        </button>

        <div className="task-body">
          {editing ? (
            <div className="edit-form">
              <input
                className="edit-title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={255}
              />
              <div className="edit-row">
                <div className="field grow">
                  <label>Description</label>
                  <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)} />
                </div>
                <div className="field">
                  <label>Due date</label>
                  <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                </div>
              </div>
              <div className="edit-actions">
                <button className="btn sm" onClick={handleCancel}>Cancel</button>
                <button className="btn sm primary" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="task-title">{task.title}</div>
              {task.description && <div className="task-desc">{task.description}</div>}
              <div className="task-meta">
                {task.dueDate && (
                  <span className={`due-badge ${overdue ? 'overdue-badge' : ''} ${today && !overdue ? 'today-badge' : ''}`}>
                    📅 {overdue ? 'Overdue · ' : today ? 'Today · ' : ''}{formatDate(task.dueDate)}
                  </span>
                )}
                <span className="created-label">
                  Added {new Date(task.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            </>
          )}
        </div>

        {!editing && (
          <div className="task-actions">
            <button className="icon-btn" onClick={() => setEditing(true)} title="Edit">✏️</button>
            <button className="icon-btn del" onClick={() => onDelete(task)} title="Delete">🗑️</button>
          </div>
        )}
      </div>
    </div>
  )
}
