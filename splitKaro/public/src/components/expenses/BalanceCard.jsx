import { useState } from 'react';
import UserAvatar from '../layout/UserAvatar';
import PrimaryButton from '../ui/PrimaryButton';

const BalanceCard = ({ transaction, fromUser, toUser, onSettleUp }) => {
  const [settling, setSettling] = useState(false);

  const handleSettleUp = async () => {
    setSettling(true);
    try {
      await onSettleUp(transaction);
    } finally {
      setSettling(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 flex-1">
          {/* From User */}
          <div className="flex items-center gap-2">
            <UserAvatar user={fromUser} size="md" />
            <span className="font-semibold text-gray-900">{fromUser?.name}</span>
          </div>

          {/* Arrow */}
          <div className="flex items-center gap-2 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>

          {/* To User */}
          <div className="flex items-center gap-2">
            <UserAvatar user={toUser} size="md" />
            <span className="font-semibold text-gray-900">{toUser?.name}</span>
          </div>
        </div>

        {/* Amount */}
        <div className="text-right ml-4">
          <div className="text-2xl font-bold text-indigo-600">₹{transaction.amount.toFixed(2)}</div>
        </div>
      </div>

      {/* Settle Up Button */}
      <div className="pt-4 border-t border-gray-100">
        <PrimaryButton
          variant="primary"
          size="sm"
          onClick={handleSettleUp}
          loading={settling}
          disabled={settling}
          className="w-full"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Settle Up
          </span>
        </PrimaryButton>
      </div>
    </div>
  );
};

export default BalanceCard;
