import { useEffect, useState } from 'react';
import { getUserById } from '../../services/userService';

const ExpenseHistoryItem = ({ item, type = 'expense' }) => {
  const [paidByUser, setPaidByUser] = useState(null);
  const [fromUser, setFromUser] = useState(null);
  const [toUser, setToUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (type === 'expense' && item.paidBy) {
          const user = await getUserById(item.paidBy);
          setPaidByUser(user);
        } else if (type === 'settlement') {
          const from = await getUserById(item.from);
          const to = await getUserById(item.to);
          setFromUser(from);
          setToUser(to);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, [item, type]);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (type === 'expense') {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                {item.category}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Paid by <span className="font-semibold">{paidByUser?.name || 'Loading...'}</span>
            </p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-gray-900">₹{item.amount.toFixed(2)}</div>
            <div className="text-xs text-gray-500">{formatDate(item.createdAt)}</div>
          </div>
        </div>

        {/* Split Details */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="font-medium">
              Split {item.splitType === 'equal' ? 'equally' : item.splitType === 'ratio' ? 'by ratio' : 'custom'}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {item.splits?.map((split) => (
              <div key={split.userId} className="text-sm">
                <span className="text-gray-600">₹{split.amount.toFixed(2)}</span>
                {split.ratio && <span className="text-gray-400 text-xs ml-1">({split.ratio}%)</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Settlement type
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-900">Payment Settled</h3>
            <p className="text-sm text-green-700">
              <span className="font-semibold">{fromUser?.name || 'Loading...'}</span> paid{' '}
              <span className="font-semibold">{toUser?.name || 'Loading...'}</span>
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-green-700">₹{item.amount.toFixed(2)}</div>
          <div className="text-xs text-green-600">{formatDate(item.createdAt)}</div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseHistoryItem;
