import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Create a new group
 * @param {string} name - Group name
 * @param {Array<string>} memberIds - Array of member UIDs
 * @param {string} adminId - UID of group admin/creator
 * @returns {Promise<Object>} Created group object
 */
export const createGroup = async (name, memberIds, adminId) => {
  try {
    // Create new group document with auto-generated ID
    const groupRef = doc(collection(db, 'groups'));

    const groupData = {
      id: groupRef.id,
      name: name,
      adminId: adminId,
      members: memberIds,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(groupRef, groupData);

    console.log('Group created successfully:', groupRef.id);

    return {
      id: groupRef.id,
      ...groupData,
    };
  } catch (error) {
    console.error('Create group error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw error;
  }
};

/**
 * Get a group by ID
 * @param {string} groupId - Group ID
 * @returns {Promise<Object>} Group object
 */
export const getGroupById = async (groupId) => {
  try {
    const groupDoc = await getDoc(doc(db, 'groups', groupId));

    if (!groupDoc.exists()) {
      throw new Error('Group not found');
    }

    return {
      id: groupDoc.id,
      ...groupDoc.data(),
    };
  } catch (error) {
    console.error('Get group by ID error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw error;
  }
};

/**
 * Get all groups for a specific user
 * @param {string} userId - User's UID
 * @returns {Promise<Array>} Array of group objects
 */
export const getUserGroups = async (userId) => {
  try {
    const groupsQuery = query(
      collection(db, 'groups'),
      where('members', 'array-contains', userId)
    );

    const querySnapshot = await getDocs(groupsQuery);
    const groups = [];

    querySnapshot.forEach((doc) => {
      groups.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Sort by most recent first
    groups.sort((a, b) => {
      const aTime = a.createdAt?.toMillis() || 0;
      const bTime = b.createdAt?.toMillis() || 0;
      return bTime - aTime;
    });

    return groups;
  } catch (error) {
    console.error('Get user groups error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw error;
  }
};

/**
 * Update group details
 * @param {string} groupId - Group ID
 * @param {Object} updates - Object containing fields to update
 * @returns {Promise<void>}
 */
export const updateGroup = async (groupId, updates) => {
  try {
    const groupRef = doc(db, 'groups', groupId);

    await updateDoc(groupRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    console.log('Group updated successfully:', groupId);
  } catch (error) {
    console.error('Update group error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw error;
  }
};

/**
 * Delete a group
 * @param {string} groupId - Group ID
 * @returns {Promise<void>}
 */
export const deleteGroup = async (groupId) => {
  try {
    await deleteDoc(doc(db, 'groups', groupId));
    console.log('Group deleted successfully:', groupId);
  } catch (error) {
    console.error('Delete group error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw error;
  }
};
