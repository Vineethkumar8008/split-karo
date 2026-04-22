import UserAvatar from '../layout/UserAvatar';

const SplitPreview = ({ splits, members, totalAmount }) => {
  if (!splits || splits.length === 0 || !members || members.length === 0) {
    return null;
  }

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
      <h3 className="text-sm font-semibold text-indigo-900 mb-4 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Split Preview
      </h3>

      <div className="space-y-3">
        {splits.map((split) => {
          const member = members.find((m) => m.id === split.userId);
          if (!member) return null;

          return (
            <div
              key={split.userId}
              className="flex items-center justify-between bg-white rounded-lg p-3 border border-indigo-100"
            >
              <div className="flex items-center gap-3">
                <UserAvatar user={member} size="sm" />
                <span className="font-medium text-gray-900">{member.name}</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-indigo-600">₹{split.amount.toFixed(2)}</div>
                {split.ratio !== undefined && (
                  <div className="text-xs text-gray-500">({split.ratio}%)</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-4 pt-4 border-t border-indigo-200 flex items-center justify-between font-bold">
        <span className="text-indigo-900">Total</span>
        <span className="text-indigo-600">₹{totalAmount.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default SplitPreview;
