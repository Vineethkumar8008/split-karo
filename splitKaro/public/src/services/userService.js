import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Get all registered users from Firestore
 * @returns {Promise<Array>} Array of user objects
 */
export const getAllUsers = async () => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const users = [];

    usersSnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return users;
  } catch (error) {
    console.error('Get all users error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw error;
  }
};

/**
 * Get a single user by ID
 * @param {string} userId - User's UID
 * @returns {Promise<Object>} User object
 */
export const getUserById = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));

    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    return {
      id: userDoc.id,
      ...userDoc.data(),
    };
  } catch (error) {
    console.error('Get user by ID error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw error;
  }
};

/**
 * Get multiple users by their IDs
 * @param {Array<string>} userIds - Array of user UIDs
 * @returns {Promise<Array>} Array of user objects
 */
export const getUsersByIds = async (userIds) => {
  try {
    if (!userIds || userIds.length === 0) {
      return [];
    }

    const userPromises = userIds.map((userId) => getUserById(userId));
    const users = await Promise.all(userPromises);

    return users;
  } catch (error) {
    console.error('Get users by IDs error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw error;
  }
};
