import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Create a new settlement
 * @param {string} groupId - Group ID
 * @param {string} from - UID of person paying
 * @param {string} to - UID of person receiving
 * @param {number} amount - Settlement amount
 * @returns {Promise<Object>} Created settlement object
 */
export const createSettlement = async (groupId, from, to, amount) => {
  try {
    const settlementRef = doc(collection(db, 'settlements'));

    const settlement = {
      id: settlementRef.id,
      groupId: groupId,
      from: from,
      to: to,
      amount: parseFloat(amount),
      createdAt: serverTimestamp(),
    };

    await setDoc(settlementRef, settlement);

    console.log('Settlement created successfully:', settlementRef.id);

    return {
      id: settlementRef.id,
      ...settlement,
    };
  } catch (error) {
    console.error('Create settlement error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw error;
  }
};

/**
 * Get all settlements for a group
 * @param {string} groupId - Group ID
 * @returns {Promise<Array>} Array of settlement objects
 */
export const getGroupSettlements = async (groupId) => {
  try {
    const settlementsQuery = query(
      collection(db, 'settlements'),
      where('groupId', '==', groupId)
    );

    const querySnapshot = await getDocs(settlementsQuery);
    const settlements = [];

    querySnapshot.forEach((doc) => {
      settlements.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Sort in JavaScript instead of Firestore
    settlements.sort((a, b) => {
      const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return bTime - aTime;
    });

    return settlements;
  } catch (error) {
    console.error('Get group settlements error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw error;
  }
};
