import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Create a new expense
 * @param {string} groupId - Group ID
 * @param {Object} expenseData - Expense data {title, category, amount, paidBy, splitType, splits}
 * @returns {Promise<Object>} Created expense object
 */
export const createExpense = async (groupId, expenseData) => {
  try {
    const expenseRef = doc(collection(db, 'expenses'));

    const expense = {
      id: expenseRef.id,
      groupId: groupId,
      title: expenseData.title,
      category: expenseData.category,
      amount: parseFloat(expenseData.amount),
      paidBy: expenseData.paidBy,
      splitType: expenseData.splitType,
      splits: expenseData.splits,
      createdAt: serverTimestamp(),
    };

    await setDoc(expenseRef, expense);

    console.log('Expense created successfully:', expenseRef.id);

    return {
      id: expenseRef.id,
      ...expense,
    };
  } catch (error) {
    console.error('Create expense error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw error;
  }
};

/**
 * Get all expenses for a group
 * @param {string} groupId - Group ID
 * @returns {Promise<Array>} Array of expense objects
 */
export const getGroupExpenses = async (groupId) => {
  try {
    const expensesQuery = query(
      collection(db, 'expenses'),
      where('groupId', '==', groupId)
    );

    const querySnapshot = await getDocs(expensesQuery);
    const expenses = [];

    querySnapshot.forEach((doc) => {
      expenses.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Sort in JavaScript instead of Firestore
    expenses.sort((a, b) => {
      const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return bTime - aTime;
    });

    return expenses;
  } catch (error) {
    console.error('Get group expenses error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw error;
  }
};

/**
 * Delete an expense
 * @param {string} expenseId - Expense ID
 * @returns {Promise<void>}
 */
export const deleteExpense = async (expenseId) => {
  try {
    await deleteDoc(doc(db, 'expenses', expenseId));
    console.log('Expense deleted successfully:', expenseId);
  } catch (error) {
    console.error('Delete expense error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw error;
  }
};

/**
 * Calculate balances for a group
 * @param {Array} expenses - Array of expense objects
 * @param {Array} settlements - Array of settlement objects
 * @returns {Object} Balance object {userId: balance}
 */
export const calculateBalances = (expenses, settlements) => {
  const balances = {};

  // Process expenses
  expenses.forEach((expense) => {
    // Credit the person who paid
    if (!balances[expense.paidBy]) {
      balances[expense.paidBy] = 0;
    }
    balances[expense.paidBy] += expense.amount;

    // Debit each person who owes
    expense.splits.forEach((split) => {
      if (!balances[split.userId]) {
        balances[split.userId] = 0;
      }
      balances[split.userId] -= split.amount;
    });
  });

  // Process settlements
  settlements.forEach((settlement) => {
    if (!balances[settlement.from]) {
      balances[settlement.from] = 0;
    }
    if (!balances[settlement.to]) {
      balances[settlement.to] = 0;
    }

    balances[settlement.from] += settlement.amount;
    balances[settlement.to] -= settlement.amount;
  });

  return balances;
};

/**
 * Simplify balances to minimize transactions
 * @param {Object} balances - Balance object {userId: balance}
 * @returns {Array} Array of transactions {from, to, amount}
 */
export const simplifyBalances = (balances) => {
  const creditors = [];
  const debtors = [];

  // Separate creditors (owed money) and debtors (owe money)
  Object.entries(balances).forEach(([userId, balance]) => {
    if (balance > 0.01) {
      creditors.push({ userId, amount: balance });
    } else if (balance < -0.01) {
      debtors.push({ userId, amount: Math.abs(balance) });
    }
  });

  // Sort by amount (largest first) for optimal matching
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const transactions = [];

  while (creditors.length > 0 && debtors.length > 0) {
    const creditor = creditors[0];
    const debtor = debtors[0];
    const amount = Math.min(creditor.amount, debtor.amount);

    transactions.push({
      from: debtor.userId,
      to: creditor.userId,
      amount: parseFloat(amount.toFixed(2)),
    });

    creditor.amount -= amount;
    debtor.amount -= amount;

    if (creditor.amount < 0.01) {
      creditors.shift();
    }
    if (debtor.amount < 0.01) {
      debtors.shift();
    }
  }

  return transactions;
};
