import { useState, useEffect } from 'react';
import { databaseService, type Quest, type QuestObjective } from '../firebase/database';
import { useAuth } from '../components/providers/auth-provider';

export function useQuests() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, userRole } = useAuth();

  // Load quests for current user with real-time updates
  useEffect(() => {
    if (!user) {
      setQuests([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Subscribe to real-time quest updates
    const unsubscribe = databaseService.subscribeToUserQuests(
      user.uid, 
      userRole!, 
      (updatedQuests) => {
        setQuests(updatedQuests);
        setLoading(false);
        setError(null);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user, userRole]);

  // Create a new quest (parent only)
  const createQuest = async (questData: {
    title: string;
    description: string;
    objectives: Omit<QuestObjective, 'completed'>[];
    difficulty: Quest['difficulty'];
    coinReward: number;
    xpReward?: number;
    bonusReward?: string;
    assignedTo?: string;
    dueDate?: Date;
    category: Quest['category'];
  }) => {
    if (!user || userRole !== 'parent') {
      throw new Error('Only parents can create quests');
    }

    try {
      // Convert objectives to include completed status
      const processedObjectives: QuestObjective[] = questData.objectives.map(obj => ({
        ...obj,
        completed: false
      }));

      // Convert email to user ID if assignedTo is provided
      let assignedToUserId = questData.assignedTo;
      if (questData.assignedTo) {
        const assignedUser = await databaseService.getUserByEmail(questData.assignedTo);
        if (assignedUser) {
          assignedToUserId = assignedUser.id;
        } else {
          throw new Error(`User with email ${questData.assignedTo} not found`);
        }
      }

      // Build quest object, excluding undefined values
      const questToAdd: any = {
        title: questData.title,
        description: questData.description,
        objectives: processedObjectives,
        difficulty: questData.difficulty,
        coinReward: questData.coinReward,
        category: questData.category,
        createdBy: user.uid,
        status: 'active',
        progress: 0
      };

      // Only add optional fields if they have values
      if (questData.xpReward !== undefined) {
        questToAdd.xpReward = questData.xpReward;
      }
      if (questData.bonusReward && questData.bonusReward.trim() !== '') {
        questToAdd.bonusReward = questData.bonusReward;
      }
      if (assignedToUserId && assignedToUserId.trim() !== '') {
        questToAdd.assignedTo = assignedToUserId;
      }
      if (questData.dueDate) {
        questToAdd.dueDate = questData.dueDate;
      }

      const questId = await databaseService.addQuest(questToAdd);
      
      return questId;
    } catch (err) {
      console.error('Error creating quest:', err);
      throw err;
    }
  };

  // Complete quest objective (child only)
  const completeObjective = async (questId: string, objectiveId: string) => {
    if (!user || userRole !== 'child') {
      throw new Error('Only children can complete quest objectives');
    }

    try {
      await databaseService.completeQuestObjective(questId, objectiveId);
    } catch (err) {
      console.error('Error completing objective:', err);
      throw err;
    }
  };

  // Delete quest (parent only)
  const deleteQuest = async (questId: string) => {
    if (!user || userRole !== 'parent') {
      throw new Error('Only parents can delete quests');
    }

    try {
      await databaseService.deleteQuest(questId);
    } catch (err) {
      console.error('Error deleting quest:', err);
      throw err;
    }
  };

  return {
    quests,
    loading,
    error,
    createQuest,
    completeObjective,
    deleteQuest,
  };
}
