import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getGroupById } from '../services/groupService';
import { getGroupExpenses, calculateBalances, simplifyBalances } from '../services/expenseService';
import { getGroupSettlements } from '../services/settlementService';
import { getUsersByIds } from '../services/userService';
import TopNavBar from '../components/layout/TopNavBar';
import GroupHeader from '../components/groups/GroupHeader';
import Tabs from '../components/ui/Tabs';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import AddExpenseForm from '../components/expenses/AddExpenseForm';
import ExpenseHistoryItem from '../components/expenses/ExpenseHistoryItem';
import BalanceCard from '../components/expenses/BalanceCard';
import SettlementModal from '../components/modals/SettlementModal';
import EditGroupModal from '../components/modals/EditGroupModal';
import SuccessToast from '../components/ui/SuccessToast';

const GroupPage = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('expenses');
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [balances, setBalances] = useState([]);
  const [balancesLoading, setBalancesLoading] = useState(false);
  const [balanceUsers, setBalanceUsers] = useState({});
  const [showSettlementModal, setShowSettlementModal] = useState(false);
  const [settlementData, setSettlementData] = useState(null);
  const [showEditGroupModal, setShowEditGroupModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setLoading(true);
        const groupData = await getGroupById(groupId);
        setGroup(groupData);
      } catch (error) {
        console.error('Failed to fetch group:', error);
      } finally {
        setLoading(false);
      }
    };

    if (groupId) {
      fetchGroup();
    }
  }, [groupId]);

  const fetchHistory = async () => {
    if (!groupId) return;

    try {
      setHistoryLoading(true);
      const [expenses, settlements] = await Promise.all([
        getGroupExpenses(groupId),
        getGroupSettlements(groupId),
      ]);

      // Merge and sort by date
      const combined = [
        ...expenses.map((e) => ({ ...e, type: 'expense' })),
        ...settlements.map((s) => ({ ...s, type: 'settlement' })),
      ];

      combined.sort((a, b) => {
        const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return bTime - aTime; // Newest first
      });

      setHistory(combined);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    } else if (activeTab === 'balances') {
      fetchBalances();
    }
  }, [activeTab, groupId]);

  const fetchBalances = async () => {
    if (!groupId) return;

    try {
      setBalancesLoading(true);
      const [expenses, settlements] = await Promise.all([
        getGroupExpenses(groupId),
        getGroupSettlements(groupId),
      ]);

      // Calculate balances
      const balanceMap = calculateBalances(expenses, settlements);

      // Simplify to minimal transactions
      const transactions = simplifyBalances(balanceMap);

      // Fetch user details for all involved users
      const userIds = new Set();
      transactions.forEach(t => {
        userIds.add(t.from);
        userIds.add(t.to);
      });

      const users = await getUsersByIds(Array.from(userIds));
      const userMap = {};
      users.forEach(u => {
        userMap[u.id] = u;
      });

      setBalanceUsers(userMap);
      setBalances(transactions);
    } catch (error) {
      console.error('Failed to fetch balances:', error);
    } finally {
      setBalancesLoading(false);
    }
  };

  const handleExpenseAdded = () => {
    if (activeTab === 'history') {
      fetchHistory();
    } else if (activeTab === 'balances') {
      fetchBalances();
    }
  };

  const handleSettleUp = (transaction) => {
    setSettlementData(transaction);
    setShowSettlementModal(true);
  };

  const handleSettlementConfirmed = async () => {
    // Refresh balances and history after settlement
    await fetchBalances();
    await fetchHistory();
    setShowSettlementModal(false);
    setSettlementData(null);
  };

  const handleEditGroupSuccess = async () => {
    // Refresh group data
    try {
      const groupData = await getGroupById(groupId);
      setGroup(groupData);
      setSuccessMessage('Group members updated successfully!');
      setShowSuccessToast(true);
    } catch (error) {
      console.error('Failed to refresh group:', error);
    }
    setShowEditGroupModal(false);
  };

  const tabs = [
    {
      id: 'expenses',
      label: 'Add Expense',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      id: 'history',
      label: 'History',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'balances',
      label: 'Balances',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <TopNavBar onCreateGroup={() => {}} />
        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner size="lg" text="Loading group..." />
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <TopNavBar onCreateGroup={() => {}} />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Group not found</h2>
            <p className="text-gray-600">The group you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <TopNavBar onCreateGroup={() => {}} />
      <GroupHeader group={group} onEditClick={() => setShowEditGroupModal(true)} />

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'expenses' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Add Expense</h2>
            <AddExpenseForm group={group} onSuccess={handleExpenseAdded} />
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Transaction History</h2>
            {historyLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" text="Loading history..." />
              </div>
            ) : history.length > 0 ? (
              <div className="space-y-4">
                {history.map((item) => (
                  <ExpenseHistoryItem key={item.id} item={item} type={item.type} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h3>
                <p className="text-gray-600">Add your first expense to get started</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'balances' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Group Balances</h2>
            {balancesLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" text="Calculating balances..." />
              </div>
            ) : balances.length > 0 ? (
              <div className="space-y-4">
                {balances.map((transaction, index) => (
                  <BalanceCard
                    key={index}
                    transaction={transaction}
                    fromUser={balanceUsers[transaction.from]}
                    toUser={balanceUsers[transaction.to]}
                    onSettleUp={handleSettleUp}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">All settled up!</h3>
                <p className="text-gray-600">No pending balances in this group</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Settlement Modal */}
      <SettlementModal
        isOpen={showSettlementModal}
        onClose={() => setShowSettlementModal(false)}
        transaction={settlementData}
        fromUser={settlementData ? balanceUsers[settlementData.from] : null}
        toUser={settlementData ? balanceUsers[settlementData.to] : null}
        groupId={groupId}
        onSuccess={handleSettlementConfirmed}
      />

      {/* Edit Group Modal */}
      <EditGroupModal
        isOpen={showEditGroupModal}
        onClose={() => setShowEditGroupModal(false)}
        group={group}
        onSuccess={handleEditGroupSuccess}
      />

      {/* Success Toast */}
      <SuccessToast
        message={successMessage}
        isVisible={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />
    </div>
  );
};

export default GroupPage;
