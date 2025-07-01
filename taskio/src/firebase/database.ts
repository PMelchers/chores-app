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
  getDoc,
  Timestamp
} from 'firebase/firestore';
import type { DocumentData, QuerySnapshot } from 'firebase/firestore';
import { db } from './config';

// Types for your data structures
export type Task = {
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

export type User = {
  id: string;
  email: string;
  role: 'parent' | 'child';
  displayName?: string;
  coins?: number; // Super Coins earned from completing tasks
  createdAt: Date | Timestamp;
}

export type Family = {
  id?: string;
  name: string;
  parentIds: string[];
  childIds: string[];
  createdAt: Date | Timestamp;
}

export type FamilyInvitation = {
  id?: string;
  familyId: string;
  familyName: string;
  invitedEmail: string;
  invitedBy: string; // User ID of parent who sent invitation
  invitedByName: string; // Display name of parent
  role: 'parent' | 'child';
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expiresAt: Date | Timestamp;
  createdAt: Date | Timestamp;
  respondedAt?: Date | Timestamp;
}

export type Reward = {
  id?: string;
  name: string;
  description: string;
  coinCost: number;
  category: string;
  requiresApproval: boolean;
  available: boolean;
  imageUrl?: string;
  popularity?: number;
  createdBy: string; // User ID of parent who created it
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export type RewardPurchase = {
  id?: string;
  rewardId: string;
  userId: string; // Child who purchased it
  coinCost: number;
  status: 'pending' | 'approved' | 'denied';
  approvedBy?: string; // Parent who approved/denied
  purchasedAt: Date | Timestamp;
  processedAt?: Date | Timestamp;
  notes?: string;
}

export type Quest = {
  id?: string;
  title: string;
  description: string;
  objectives: QuestObjective[];
  difficulty: 'easy' | 'medium' | 'hard' | 'epic' | 'legendary';
  coinReward: number;
  xpReward?: number;
  bonusReward?: string; // Special reward description
  assignedTo?: string; // User ID
  createdBy: string; // User ID
  dueDate?: Date;
  completedAt?: Date;
  status: 'active' | 'completed' | 'failed' | 'paused';
  category: 'daily' | 'weekly' | 'monthly' | 'special';
  progress: number; // 0-100 percentage
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export type QuestObjective = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  required: boolean; // If false, this is an optional bonus objective
  points?: number; // Bonus points for completing this objective
}

// Database service functions
export class DatabaseService {
  // Collection references
  private tasksCollection = collection(db, 'tasks');
  private usersCollection = collection(db, 'users');
  private familiesCollection = collection(db, 'families');
  private familyInvitationsCollection = collection(db, 'familyInvitations');
  private rewardsCollection = collection(db, 'rewards');
  private rewardPurchasesCollection = collection(db, 'rewardPurchases');
  private questsCollection = collection(db, 'quests');

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
        const newCompletedStatus = !task.completed;
        
        await updateDoc(taskRef, {
          completed: newCompletedStatus,
          updatedAt: serverTimestamp()
        });

        // If task is being completed, award coins to the assigned user
        if (newCompletedStatus && task.assignedTo && task.points) {
          await this.awardCoinsToUser(task.assignedTo, task.points);
        }
      }
    } catch (error) {
      console.error('Error toggling task completion:', error);
      throw error;
    }
  }

  // Award coins to user
  async awardCoinsToUser(userId: string, coins: number): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const currentCoins = userDoc.data().coins || 0;
        await updateDoc(userRef, {
          coins: currentCoins + coins
        });
      }
    } catch (error) {
      console.error('Error awarding coins to user:', error);
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

  // Get user by ID
  async getUserById(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(this.usersCollection, userId));
      
      if (!userDoc.exists()) {
        return null;
      }
      
      const data = userDoc.data();
      return {
        id: userDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt
      } as User;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  // Reward methods
  async addReward(reward: Omit<Reward, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const newReward = {
        ...reward,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(this.rewardsCollection, newReward);
      return docRef.id;
    } catch (error) {
      console.error('Error adding reward:', error);
      throw error;
    }
  }

  async getRewards(): Promise<Reward[]> {
    try {
      const q = query(this.rewardsCollection, where('available', '==', true), orderBy('coinCost', 'asc'));
      const querySnapshot = await getDocs(q);
      const rewards: Reward[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        rewards.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
        } as Reward);
      });
      
      return rewards;
    } catch (error) {
      console.error('Error getting rewards:', error);
      throw error;
    }
  }

  async updateReward(rewardId: string, updates: Partial<Omit<Reward, 'id' | 'createdAt'>>): Promise<void> {
    try {
      const rewardRef = doc(db, 'rewards', rewardId);
      await updateDoc(rewardRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating reward:', error);
      throw error;
    }
  }

  async deleteReward(rewardId: string): Promise<void> {
    try {
      const rewardRef = doc(db, 'rewards', rewardId);
      await deleteDoc(rewardRef);
    } catch (error) {
      console.error('Error deleting reward:', error);
      throw error;
    }
  }

  // Reward purchase methods
  async purchaseReward(userId: string, rewardId: string, coinCost: number): Promise<string> {
    try {
      // Check if user has enough coins
      const user = await this.getUser(userId);
      if (!user || (user.coins || 0) < coinCost) {
        throw new Error('Insufficient coins');
      }

      // Get reward to check if approval is required
      const rewardDoc = await getDoc(doc(db, 'rewards', rewardId));
      if (!rewardDoc.exists()) {
        throw new Error('Reward not found');
      }
      
      const reward = rewardDoc.data() as Reward;
      const requiresApproval = reward.requiresApproval;

      // Create purchase record
      const purchase = {
        rewardId,
        userId,
        coinCost,
        status: requiresApproval ? 'pending' as const : 'approved' as const,
        purchasedAt: serverTimestamp(),
        ...(requiresApproval ? {} : { approvedBy: 'auto', processedAt: serverTimestamp() })
      };

      const docRef = await addDoc(this.rewardPurchasesCollection, purchase);

      // Deduct coins from user
      await updateDoc(doc(db, 'users', userId), {
        coins: (user.coins || 0) - coinCost
      });

      return docRef.id;
    } catch (error) {
      console.error('Error purchasing reward:', error);
      throw error;
    }
  }

  async getRewardPurchases(userId?: string): Promise<RewardPurchase[]> {
    try {
      let q;
      if (userId) {
        q = query(this.rewardPurchasesCollection, where('userId', '==', userId), orderBy('purchasedAt', 'desc'));
      } else {
        q = query(this.rewardPurchasesCollection, orderBy('purchasedAt', 'desc'));
      }
      
      const querySnapshot = await getDocs(q);
      const purchases: RewardPurchase[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        purchases.push({
          id: doc.id,
          ...data,
          purchasedAt: data.purchasedAt?.toDate ? data.purchasedAt.toDate() : data.purchasedAt,
          processedAt: data.processedAt?.toDate ? data.processedAt.toDate() : data.processedAt
        } as RewardPurchase);
      });
      
      return purchases;
    } catch (error) {
      console.error('Error getting reward purchases:', error);
      throw error;
    }
  }

  async approveRewardPurchase(purchaseId: string, approvedBy: string, approved: boolean, notes?: string): Promise<void> {
    try {
      const purchaseRef = doc(db, 'rewardPurchases', purchaseId);
      await updateDoc(purchaseRef, {
        status: approved ? 'approved' : 'denied',
        approvedBy,
        processedAt: serverTimestamp(),
        notes: notes || undefined
      });
    } catch (error) {
      console.error('Error processing reward purchase:', error);
      throw error;
    }
  }

  // Quest methods
  async addQuest(quest: Omit<Quest, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const newQuest = {
        ...quest,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(this.questsCollection, newQuest);
      return docRef.id;
    } catch (error) {
      console.error('Error adding quest:', error);
      throw error;
    }
  }

  async getQuestsForUser(userId: string): Promise<Quest[]> {
    try {
      const q = query(this.questsCollection, where('assignedTo', '==', userId), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const quests: Quest[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        quests.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
          dueDate: data.dueDate?.toDate ? data.dueDate.toDate() : data.dueDate,
          completedAt: data.completedAt?.toDate ? data.completedAt.toDate() : data.completedAt
        } as Quest);
      });
      
      return quests;
    } catch (error) {
      console.error('Error getting quests:', error);
      throw error;
    }
  }

  async getQuestsCreatedBy(userId: string): Promise<Quest[]> {
    try {
      const q = query(this.questsCollection, where('createdBy', '==', userId), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const quests: Quest[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        quests.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
          dueDate: data.dueDate?.toDate ? data.dueDate.toDate() : data.dueDate,
          completedAt: data.completedAt?.toDate ? data.completedAt.toDate() : data.completedAt
        } as Quest);
      });
      
      return quests;
    } catch (error) {
      console.error('Error getting created quests:', error);
      throw error;
    }
  }

  async updateQuest(questId: string, updates: Partial<Omit<Quest, 'id' | 'createdAt'>>): Promise<void> {
    try {
      const questRef = doc(db, 'quests', questId);
      await updateDoc(questRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating quest:', error);
      throw error;
    }
  }

  async deleteQuest(questId: string): Promise<void> {
    try {
      const questRef = doc(db, 'quests', questId);
      await deleteDoc(questRef);
    } catch (error) {
      console.error('Error deleting quest:', error);
      throw error;
    }
  }

  // Complete quest objective
  async completeQuestObjective(questId: string, objectiveId: string): Promise<void> {
    try {
      const questRef = doc(db, 'quests', questId);
      const questDoc = await getDoc(questRef);
      
      if (questDoc.exists()) {
        const quest = questDoc.data() as Quest;
        
        // Update the objective
        const updatedObjectives = quest.objectives.map(obj => 
          obj.id === objectiveId ? { ...obj, completed: true } : obj
        );
        
        // Calculate progress
        const completedCount = updatedObjectives.filter(obj => obj.completed).length;
        const progress = (completedCount / updatedObjectives.length) * 100;
        
        // Check if quest is completed
        const isCompleted = progress >= 100;
        const status = isCompleted ? 'completed' : quest.status;
        
        // Build update object, only including fields that have values
        const updateData: any = {
          objectives: updatedObjectives,
          progress,
          status,
          updatedAt: serverTimestamp()
        };

        // Only set completedAt if quest is newly completed
        if (isCompleted && quest.status !== 'completed') {
          updateData.completedAt = serverTimestamp();
        }

        await updateDoc(questRef, updateData);

        // If quest is completed, award coins to the assigned user
        if (isCompleted && quest.assignedTo) {
          await this.awardCoinsToUser(quest.assignedTo, quest.coinReward);
          
          // Award bonus XP if available
          if (quest.xpReward) {
            // TODO: Implement XP system
            console.log(`Awarded ${quest.xpReward} XP to user ${quest.assignedTo}`);
          }
        }
      }
    } catch (error) {
      console.error('Error completing quest objective:', error);
      throw error;
    }
  }

  // Subscribe to quests for real-time updates
  subscribeToUserQuests(userId: string, role: 'parent' | 'child', callback: (quests: Quest[]) => void): () => void {
    let q;
    if (role === 'parent') {
      q = query(this.questsCollection, where('createdBy', '==', userId), orderBy('createdAt', 'desc'));
    } else {
      q = query(this.questsCollection, where('assignedTo', '==', userId), orderBy('createdAt', 'desc'));
    }
    
    return onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
      const quests: Quest[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        quests.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
          dueDate: data.dueDate?.toDate ? data.dueDate.toDate() : data.dueDate,
          completedAt: data.completedAt?.toDate ? data.completedAt.toDate() : data.completedAt
        } as Quest);
      });
      
      callback(quests);
    }, (error) => {
      console.error('subscribeToUserQuests: Query error', error);
    });
  }

  // Family Management Methods
  
  // Create a new family
  async createFamily(name: string, parentId: string): Promise<string> {
    try {
      const familyData = {
        name,
        parentIds: [parentId],
        childIds: [],
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(this.familiesCollection, familyData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating family:', error);
      throw error;
    }
  }

  // Get family by ID
  async getFamily(familyId: string): Promise<Family | null> {
    try {
      const familyDoc = await getDoc(doc(this.familiesCollection, familyId));
      if (familyDoc.exists()) {
        const data = familyDoc.data();
        return {
          id: familyDoc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt
        } as Family;
      }
      return null;
    } catch (error) {
      console.error('Error getting family:', error);
      throw error;
    }
  }

  // Get family for a user
  async getFamilyForUser(userId: string): Promise<Family | null> {
    try {
      // Check if user is a parent
      let q = query(this.familiesCollection, where('parentIds', 'array-contains', userId));
      let querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt
        } as Family;
      }

      // Check if user is a child
      q = query(this.familiesCollection, where('childIds', 'array-contains', userId));
      querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate : data.createdAt
        } as Family;
      }

      return null;
    } catch (error) {
      console.error('Error getting family for user:', error);
      throw error;
    }
  }

  // Send family invitation
  async sendFamilyInvitation(familyId: string, invitedEmail: string, role: 'parent' | 'child', invitedBy: string, invitedByName: string): Promise<string> {
    try {
      // Check if invitation already exists
      const existingInvitation = await this.getPendingInvitation(invitedEmail, familyId);
      if (existingInvitation) {
        throw new Error('An invitation to this email for this family already exists');
      }

      // Check if user is already in the family
      const existingUser = await this.getUserByEmail(invitedEmail);
      if (existingUser) {
        const family = await this.getFamily(familyId);
        if (family?.parentIds.includes(existingUser.id) || family?.childIds.includes(existingUser.id)) {
          throw new Error('This user is already a member of your family');
        }
      }

      const family = await this.getFamily(familyId);
      if (!family) {
        throw new Error('Family not found');
      }

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7); // Expires in 7 days

      const invitationData = {
        familyId,
        familyName: family.name,
        invitedEmail,
        invitedBy,
        invitedByName,
        role,
        status: 'pending' as const,
        expiresAt: expirationDate,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(this.familyInvitationsCollection, invitationData);
      return docRef.id;
    } catch (error) {
      console.error('Error sending family invitation:', error);
      throw error;
    }
  }

  // Get pending invitation
  async getPendingInvitation(email: string, familyId: string): Promise<FamilyInvitation | null> {
    try {
      const q = query(
        this.familyInvitationsCollection,
        where('invitedEmail', '==', email),
        where('familyId', '==', familyId),
        where('status', '==', 'pending')
      );
      
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
          expiresAt: data.expiresAt?.toDate ? data.expiresAt.toDate() : data.expiresAt,
          respondedAt: data.respondedAt?.toDate ? data.respondedAt.toDate() : data.respondedAt
        } as FamilyInvitation;
      }
      return null;
    } catch (error) {
      console.error('Error getting pending invitation:', error);
      throw error;
    }
  }

  // Get invitations for user
  async getInvitationsForUser(email: string): Promise<FamilyInvitation[]> {
    try {
      const q = query(
        this.familyInvitationsCollection,
        where('invitedEmail', '==', email),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const invitations: FamilyInvitation[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        invitations.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
          expiresAt: data.expiresAt?.toDate ? data.expiresAt.toDate() : data.expiresAt,
          respondedAt: data.respondedAt?.toDate ? data.respondedAt.toDate() : data.respondedAt
        } as FamilyInvitation);
      });
      
      return invitations;
    } catch (error) {
      console.error('Error getting invitations for user:', error);
      throw error;
    }
  }

  // Accept family invitation
  async acceptFamilyInvitation(invitationId: string, userId: string): Promise<void> {
    try {
      const invitationDoc = await getDoc(doc(this.familyInvitationsCollection, invitationId));
      if (!invitationDoc.exists()) {
        throw new Error('Invitation not found');
      }

      const invitation = invitationDoc.data() as FamilyInvitation;
      
      // Check if invitation is still valid
      if (invitation.status !== 'pending') {
        throw new Error('Invitation is no longer pending');
      }

      const now = new Date();
      const expiresAt = invitation.expiresAt instanceof Date ? invitation.expiresAt : invitation.expiresAt.toDate();
      if (now > expiresAt) {
        throw new Error('Invitation has expired');
      }

      // Update family to add user
      const familyRef = doc(this.familiesCollection, invitation.familyId);
      const familyDoc = await getDoc(familyRef);
      
      if (!familyDoc.exists()) {
        throw new Error('Family not found');
      }

      const family = familyDoc.data() as Family;
      const updateData: any = {};

      if (invitation.role === 'parent') {
        updateData.parentIds = [...family.parentIds, userId];
      } else {
        updateData.childIds = [...family.childIds, userId];
      }

      await updateDoc(familyRef, updateData);

      // Update invitation status
      await updateDoc(doc(this.familyInvitationsCollection, invitationId), {
        status: 'accepted',
        respondedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error accepting family invitation:', error);
      throw error;
    }
  }

  // Decline family invitation
  async declineFamilyInvitation(invitationId: string): Promise<void> {
    try {
      await updateDoc(doc(this.familyInvitationsCollection, invitationId), {
        status: 'declined',
        respondedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error declining family invitation:', error);
      throw error;
    }
  }

  // Get family members with user details
  async getFamilyMembers(familyId: string): Promise<{ parents: User[], children: User[] }> {
    try {
      const family = await this.getFamily(familyId);
      if (!family) {
        throw new Error('Family not found');
      }

      const parents: User[] = [];
      const children: User[] = [];

      // Get parent details
      for (const parentId of family.parentIds) {
        const user = await this.getUserById(parentId);
        if (user) {
          parents.push(user);
        }
      }

      // Get children details
      for (const childId of family.childIds) {
        const user = await this.getUserById(childId);
        if (user) {
          children.push(user);
        }
      }

      return { parents, children };
    } catch (error) {
      console.error('Error getting family members:', error);
      throw error;
    }
  }

  // Remove user from family
  async removeUserFromFamily(familyId: string, userId: string): Promise<void> {
    try {
      const familyRef = doc(this.familiesCollection, familyId);
      const familyDoc = await getDoc(familyRef);
      
      if (!familyDoc.exists()) {
        throw new Error('Family not found');
      }

      const family = familyDoc.data() as Family;
      
      const updateData: any = {};
      
      if (family.parentIds.includes(userId)) {
        updateData.parentIds = family.parentIds.filter(id => id !== userId);
      }
      
      if (family.childIds.includes(userId)) {
        updateData.childIds = family.childIds.filter(id => id !== userId);
      }

      await updateDoc(familyRef, updateData);
    } catch (error) {
      console.error('Error removing user from family:', error);
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
        tasks.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
          dueDate: data.dueDate?.toDate ? data.dueDate.toDate() : data.dueDate
        } as Task);
      });
      
      return tasks;
    } catch (error) {
      console.error('Error getting all tasks:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const databaseService = new DatabaseService();
