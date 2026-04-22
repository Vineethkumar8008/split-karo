import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getAllUsers } from '../../services/userService';
import UserAvatar from './UserAvatar';
import PrimaryButton from '../ui/PrimaryButton';

const TopNavBar = ({ onCreateGroup }) => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const allUsers = await getAllUsers();
        setUsers(allUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Users Avatars */}
          <div className="flex items-center gap-2">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            ) : (
              <>
                {users.map((user) => (
                  <UserAvatar
                    key={user.id}
                    user={user}
                    isCurrentUser={user.id === currentUser?.uid}
                    size="md"
                  />
                ))}
              </>
            )}
          </div>

          {/* Create Group Button */}
          <div>
            <PrimaryButton
              variant="primary"
              size="sm"
              onClick={onCreateGroup}
              disabled={loading}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Group
              </span>
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavBar;
