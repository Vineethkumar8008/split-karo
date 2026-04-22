import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { getUserGroups } from '../services/groupService';

const GroupContext = createContext({});

export const useGroup = () => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error('useGroup must be used within a GroupProvider');
  }
  return context;
};

export const GroupProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user's groups
  const fetchGroups = async () => {
    if (!currentUser) {
      setGroups([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userGroups = await getUserGroups(currentUser.uid);
      setGroups(userGroups);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch groups when user changes
  useEffect(() => {
    fetchGroups();
  }, [currentUser]);

  // Refresh groups (can be called after creating/updating a group)
  const refreshGroups = async () => {
    await fetchGroups();
  };

  const value = {
    groups,
    selectedGroup,
    setSelectedGroup,
    loading,
    refreshGroups,
  };

  return (
    <GroupContext.Provider value={value}>
      {children}
    </GroupContext.Provider>
  );
};
