import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../components/providers/auth-provider';

export function TaskList() {
  const { tasks, loading, addTask, toggleTaskCompletion, deleteTask } = useTasks();
  const { userRole } = useAuth();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      await addTask({
        title: newTaskTitle,
        points: 10, // Default points
      });
      setNewTaskTitle('');
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="task-list">
      <h2>{userRole === 'parent' ? 'Manage Tasks' : 'My Tasks'}</h2>
      
      {userRole === 'parent' && (
        <form onSubmit={handleAddTask} className="add-task-form">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add new task..."
            className="task-input"
          />
          <button type="submit" className="add-button">
            Add Task
          </button>
        </form>
      )}

      <div className="tasks">
        {tasks.map((task) => (
          <div key={task.id} className={`task ${task.completed ? 'completed' : ''}`}>
            <h3>{task.title}</h3>
            {task.description && <p>{task.description}</p>}
            {task.points && <span className="points">{task.points} points</span>}
            
            <div className="task-actions">
              <button 
                onClick={() => task.id && toggleTaskCompletion(task.id)}
                className="toggle-button"
              >
                {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </button>
              
              {userRole === 'parent' && (
                <button 
                  onClick={() => task.id && deleteTask(task.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <p className="no-tasks">
          {userRole === 'parent' 
            ? 'No tasks created yet. Add some tasks for your family!' 
            : 'No tasks assigned to you yet.'}
        </p>
      )}
    </div>
  );
}
