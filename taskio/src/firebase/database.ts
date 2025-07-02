import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  setDoc,
  getDoc
} from 'firebase/firestore';
import type { DocumentData, QuerySnapshot, Timestamp } from 'firebase/firestore';
import { db } from './config';

// Types for your data structures
export interface Task {
  id?: string;
  title: string;
  description?: string;
  completed: boolean;
  assignedTo?: string; // User ID
  createdBy: string; // User ID
  dueDate?: Date;
  points?: number;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export interface User {
  id: string;
  email: string;
  role: 'parent' | 'child';
  displayName?: string;
  createdAt: Date | Timestamp;
}

export interface Family {
  id?: string;
  name: string;
  parentIds: string[];
  childIds: string[];
  createdAt: Date | Timestamp;
}

// Database service functions
export class DatabaseService {
  // Collection references
  private tasksCollection = collection(db, 'tasks');
  private usersCollection = collection(db, 'users');
  // private familiesCollection = collection(db, 'families'); // TODO: Implement family features

  // Task methods
  async addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const newTask = {
        ...task,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(this.tasksCollection, newTask);
      return docRef.id;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  }

  async getTasksForUser(userId: string, role: 'parent' | 'child'): Promise<Task[]> {
    try {
      let q;
      if (role === 'parent') {
        // Parents can see all tasks they created
        q = query(this.tasksCollection, where('createdBy', '==', userId), orderBy('createdAt', 'desc'));
      } else {
        // Children can see tasks assigned to them
        q = query(this.tasksCollection, where('assignedTo', '==', userId), orderBy('createdAt', 'desc'));
      }
      
      const querySnapshot = await getDocs(q);
      const tasks: Task[] = [];
      
      querySnapshot.forEach((doc) => {
        tasks.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : doc.data().createdAt,
          updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate() : doc.data().updatedAt,
          dueDate: doc.data().dueDate?.toDate ? doc.data().dueDate.toDate() : doc.data().dueDate
        } as Task);
      });
      
      return tasks;
    } catch (error) {
      console.error('Error getting tasks:', error);
      throw error;
    }
  }

  // Update a task
  async updateTask(taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<void> {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  // Delete a task
  async deleteTask(taskId: string): Promise<void> {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  // Listen to real-time updates for user tasks
  subscribeToUserTasks(userId: string, role: 'parent' | 'child', callback: (tasks: Task[]) => void): () => void {
    let q;
    if (role === 'parent') {
      q = query(this.tasksCollection, where('createdBy', '==', userId), orderBy('createdAt', 'desc'));
    } else {
      q = query(this.tasksCollection, where('assignedTo', '==', userId), orderBy('createdAt', 'desc'));
    }
    
    return onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
      const tasks: Task[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        tasks.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
          dueDate: data.dueDate?.toDate ? data.dueDate.toDate() : data.dueDate
        } as Task);
      });
      
      callback(tasks);
    }, (error) => {
      console.error('subscribeToUserTasks: Query error', error);
    });
  }

  // Toggle task completion
  async toggleTaskCompletion(taskId: string): Promise<void> {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      const taskDoc = await getDoc(taskRef);
      
      if (taskDoc.exists()) {
        const task = taskDoc.data() as Task;
        await updateDoc(taskRef, {
          completed: !task.completed,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error toggling task completion:', error);
      throw error;
    }
  }

  // User management methods
  async createUser(userId: string, userData: Omit<User, 'id' | 'createdAt'>): Promise<void> {
    try {
      await setDoc(doc(db, 'users', userId), {
        ...userData,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUser(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return {
          id: userDoc.id,
          ...userDoc.data(),
          createdAt: userDoc.data().createdAt?.toDate ? userDoc.data().createdAt.toDate() : userDoc.data().createdAt
        } as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  // User methods
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const q = query(this.usersCollection, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const userDoc = querySnapshot.docs[0];
      return {
        id: userDoc.id,
        ...userDoc.data(),
        createdAt: userDoc.data().createdAt?.toDate ? userDoc.data().createdAt.toDate() : userDoc.data().createdAt
      } as User;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  // Debug function to get all tasks
  async getAllTasks(): Promise<Task[]> {
    try {
      const querySnapshot = await getDocs(this.tasksCollection);
      const tasks: Task[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('getAllTasks: Task document', doc.id, data);
        tasks.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
          dueDate: data.dueDate?.toDate ? data.dueDate.toDate() : data.dueDate
        } as Task);
      });
      
      console.log('getAllTasks: Total tasks found', tasks.length);
      return tasks;
    } catch (error) {
      console.error('Error getting all tasks:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const databaseService = new DatabaseService();
