import { useState } from 'react';

const UserAvatar = ({ user, isCurrentUser = false, size = 'md' }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Get initials from user name
  const getInitials = (name) => {
    if (!name) return '?';
    const names = name.trim().split(' ');
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const initials = getInitials(user?.name);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full
          flex items-center justify-center
          font-semibold
          text-white
          transition-all
          duration-200
          cursor-pointer
          ${
            isCurrentUser
              ? 'bg-gradient-to-br from-indigo-600 to-purple-600 ring-4 ring-indigo-300 ring-offset-2 scale-110 shadow-lg'
              : 'bg-gray-400 hover:bg-gray-500 hover:scale-105'
          }
        `}
      >
        {initials}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap z-50 animate-fade-in">
          {user?.name || 'Unknown User'}
          {isCurrentUser && ' (You)'}
          {/* Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
