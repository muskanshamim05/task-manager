export default function DeleteModal({ task, onConfirm, onCancel }) {
  if (!task) return null
  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="modal">
        <h3>Delete task?</h3>
        <p>
          <strong>"{task.title}"</strong> will be permanently removed. This cannot be undone.
        </p>
        <div className="modal-actions">
          <button className="btn" onClick={onCancel}>Keep it</button>
          <button className="btn danger" onClick={() => onConfirm(task.id)}>Delete</button>
        </div>
      </div>
    </div>
  )
}
