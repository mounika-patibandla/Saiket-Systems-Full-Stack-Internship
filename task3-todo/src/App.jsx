import { useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [editingId, setEditingId] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedTask = taskInput.trim();

    if (!trimmedTask) {
      return;
    }

    if (editingId !== null) {
      setTasks(
        tasks.map((task) =>
          task.id === editingId
            ? { ...task, text: trimmedTask }
            : task
        )
      );
      setEditingId(null);
    } else {
      const newTask = {
        id: Date.now(),
        text: trimmedTask,
        completed: false
      };

      setTasks([...tasks, newTask]);
    }

    setTaskInput('');
  }

  function handleEdit(task) {
    setTaskInput(task.text);
    setEditingId(task.id);
  }

  function handleDelete(id) {
    setTasks(tasks.filter((task) => task.id !== id));

    if (editingId === id) {
      setEditingId(null);
      setTaskInput('');
    }
  }

  function toggleCompleted(id) {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function cancelEdit() {
    setEditingId(null);
    setTaskInput('');
  }

  return (
    <div className="app-container">
      <div className="todo-card">
        <h1>My To-Do List</h1>

        <p className="subtitle">
          Organize your day, one task at a time.
        </p>

        <form onSubmit={handleSubmit} className="task-form">
          <input
            type="text"
            value={taskInput}
            onChange={(event) => setTaskInput(event.target.value)}
            placeholder="Enter a task..."
            aria-label="Task name"
          />

          <button type="submit" className="add-button">
            {editingId !== null ? 'Update' : 'Add Task'}
          </button>
        </form>

        {editingId !== null && (
          <button
            type="button"
            className="cancel-button"
            onClick={cancelEdit}
          >
            Cancel Editing
          </button>
        )}

        <div className="task-summary">
          <span>Total: {tasks.length}</span>
          <span>
            Completed: {tasks.filter((task) => task.completed).length}
          </span>
        </div>

        {tasks.length === 0 ? (
          <p className="empty-message">
            No tasks yet. Add your first task!
          </p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className="task-item">
                <label className={task.completed ? 'completed' : ''}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleCompleted(task.id)}
                  />
                  <span>{task.text}</span>
                </label>

                <div className="task-actions">
                  <button
                    type="button"
                    className="edit-button"
                    onClick={() => handleEdit(task)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDelete(task.id)}>
                  
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;