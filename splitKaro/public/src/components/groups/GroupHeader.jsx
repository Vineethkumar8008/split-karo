import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUsersByIds } from '../../services/userService';
import UserAvatar from '../layout/UserAvatar';
import { useNavigate } from 'react-router-dom';

const GroupHeader = ({ group, onEditClick }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = group?.adminId === currentUser?.uid;

  useEffect(() => {
    const fetchMembers = async () => {
      if (!group?.members) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const groupMembers = await getUsersByIds(group.members);
        setMembers(groupMembers);
      } catch (error) {
        console.error('Failed to fetch group members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [group?.members]);

  if (!group) return null;

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button + Group Name */}
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{group.name}</h1>
                {isAdmin && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                    You are Admin
                  </span>
                )}
              </div>

              {/* Edit Button - Only for Admin */}
              {isAdmin && (
                <button
                  onClick={onEditClick}
                  className="ml-auto p-2 hover:bg-indigo-100 rounded-lg transition-colors text-indigo-600"
                  title="Edit group members"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Members */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 font-medium">Members:</span>
          {loading ? (
            <div className="flex gap-1">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {members.map((member) => (
                <UserAvatar
                  key={member.id}
                  user={member}
                  isCurrentUser={member.id === currentUser?.uid}
                  size="sm"
                />
              ))}
              <span className="text-sm text-gray-500 ml-1">
                ({members.length} {members.length === 1 ? 'member' : 'members'})
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupHeader;
