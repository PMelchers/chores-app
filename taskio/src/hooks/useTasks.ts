import { useState, useEffect } from 'react';
import { databaseService, type Task } from '../firebase/database';
import { useAuth } from '../components/providers/auth-provider';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, userRole } = useAuth();

  useEffect(() => {
    if (!user || !userRole) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const unsubscribe = databaseService.subscribeToUserTasks(
      user.uid,
      userRole,
      (newTasks) => {
        setTasks(newTasks);
        setLoading(false);
        setError(null);
      }
    );

    return () => unsubscribe();
  }, [user, userRole]);

  const addTask = async (taskData: {
    title: string;
    description?: string;
    assignedTo?: string;
    dueDate?: Date;
    points?: number;
  }) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await databaseService.addTask({
        ...taskData,
        completed: false,
        createdBy: user.uid,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task');
      throw err;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      await databaseService.updateTask(taskId, updates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      throw err;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await databaseService.deleteTask(taskId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      throw err;
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    try {
      await databaseService.toggleTaskCompletion(taskId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle task');
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
  };
}
