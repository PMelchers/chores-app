import { useState, useEffect } from 'react';
import { databaseService, type Family, type FamilyInvitation, type User } from '../firebase/database';
import { useAuth } from '../components/providers/auth-provider';

export function useFamily() {
  const [family, setFamily] = useState<Family | null>(null);
  const [familyMembers, setFamilyMembers] = useState<{ parents: User[], children: User[] }>({ parents: [], children: [] });
  const [invitations, setInvitations] = useState<FamilyInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Load family data
  const loadFamilyData = async () => {
    if (!user) {
      setFamily(null);
      setFamilyMembers({ parents: [], children: [] });
      setInvitations([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Get user's family
      const userFamily = await databaseService.getFamilyForUser(user.uid);
      setFamily(userFamily);

      if (userFamily) {
        // Get family members
        const members = await databaseService.getFamilyMembers(userFamily.id!);
        setFamilyMembers(members);
      } else {
        setFamilyMembers({ parents: [], children: [] });
      }

      // Get pending invitations for current user
      const userInvitations = await databaseService.getInvitationsForUser(user.email!);
      setInvitations(userInvitations);

    } catch (err) {
      console.error('Error loading family data:', err);
      setError('Failed to load family information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFamilyData();
  }, [user]);

  // Create a new family
  const createFamily = async (name: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const familyId = await databaseService.createFamily(name, user.uid);
      await loadFamilyData();
      return familyId;
    } catch (err) {
      console.error('Error creating family:', err);
      throw err;
    }
  };

  // Send family invitation
  const sendInvitation = async (email: string, role: 'parent' | 'child') => {
    if (!user || !family) throw new Error('User not authenticated or no family');
    
    try {
      const invitationId = await databaseService.sendFamilyInvitation(
        family.id!,
        email,
        role,
        user.uid,
        user.displayName || user.email || 'Parent'
      );
      await loadFamilyData();
      return invitationId;
    } catch (err) {
      console.error('Error sending invitation:', err);
      throw err;
    }
  };

  // Accept family invitation
  const acceptInvitation = async (invitationId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      await databaseService.acceptFamilyInvitation(invitationId, user.uid);
      await loadFamilyData();
    } catch (err) {
      console.error('Error accepting invitation:', err);
      throw err;
    }
  };

  // Decline family invitation
  const declineInvitation = async (invitationId: string) => {
    try {
      await databaseService.declineFamilyInvitation(invitationId);
      await loadFamilyData();
    } catch (err) {
      console.error('Error declining invitation:', err);
      throw err;
    }
  };

  // Remove member from family
  const removeMember = async (userId: string) => {
    if (!family) throw new Error('No family found');
    
    try {
      await databaseService.removeUserFromFamily(family.id!, userId);
      await loadFamilyData();
    } catch (err) {
      console.error('Error removing member:', err);
      throw err;
    }
  };

  return {
    family,
    familyMembers,
    invitations,
    loading,
    error,
    createFamily,
    sendInvitation,
    acceptInvitation,
    declineInvitation,
    removeMember,
    refreshData: loadFamilyData,
    clearError: () => setError(null)
  };
}
