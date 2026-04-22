import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUsersByIds } from '../../services/userService';
import UserAvatar from '../layout/UserAvatar';

const GroupCard = ({ group, onClick }) => {
  const { currentUser } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = group.adminId === currentUser?.uid;
  const memberCount = group.members?.length || 0;

  useEffect(() => {
    const fetchMembers = async () => {
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

    if (group.members && group.members.length > 0) {
      fetchMembers();
    } else {
      setLoading(false);
    }
  }, [group.members]);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
    >
      {/* Group Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
            {group.name}
          </h3>
          {isAdmin && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
              Admin
            </span>
          )}
        </div>

        {/* Icon */}
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      </div>

      {/* Members */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="flex gap-1">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          ) : (
            <>
              <div className="flex -space-x-2">
                {members.slice(0, 3).map((member) => (
                  <div key={member.id} className="ring-2 ring-white rounded-full">
                    <UserAvatar user={member} isCurrentUser={member.id === currentUser?.uid} size="sm" />
                  </div>
                ))}
              </div>
              {memberCount > 3 && (
                <span className="text-xs text-gray-500 font-medium ml-2">
                  +{memberCount - 3} more
                </span>
              )}
            </>
          )}
        </div>

        <span className="text-sm text-gray-500">
          {memberCount} {memberCount === 1 ? 'member' : 'members'}
        </span>
      </div>

      {/* Arrow indicator */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-end text-indigo-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
        View Group
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};

export default GroupCard;
