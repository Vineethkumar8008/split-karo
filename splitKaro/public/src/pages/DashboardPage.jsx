import { useAuth } from '../contexts/AuthContext';
import { useGroup } from '../contexts/GroupContext';
import { logoutUser } from '../services/authService';
import Button from '../components/ui/Button';
import TopNavBar from '../components/layout/TopNavBar';
import CreateGroupModal from '../components/modals/CreateGroupModal';
import SuccessToast from '../components/ui/SuccessToast';
import GroupCard from '../components/groups/GroupCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const { groups, loading: groupsLoading, refreshGroups } = useGroup();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = () => {
    setIsCreateGroupModalOpen(true);
  };

  const handleGroupCreated = () => {
    setShowSuccessToast(true);
    refreshGroups();
  };

  const handleGroupClick = (groupId) => {
    navigate(`/group/${groupId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Top Navigation Bar */}
      <TopNavBar onCreateGroup={handleCreateGroup} />
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                SplitKaro
              </h1>
            </div>
            <Button
              variant="secondary"
              onClick={handleLogout}
              loading={loading}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-8 text-white shadow-lg mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome, {currentUser?.email?.split('@')[0] || 'User'}!
          </h2>
          <p className="text-purple-100">
            Manage your groups and split expenses with friends
          </p>
        </div>

        {/* Groups Section */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Groups</h3>

          {groupsLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Loading groups..." />
            </div>
          ) : groups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <GroupCard key={group.id} group={group} onClick={() => handleGroupClick(group.id)} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No groups yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first group to start splitting expenses with friends
              </p>
              <button
                onClick={handleCreateGroup}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Group
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        onSuccess={handleGroupCreated}
      />

      {/* Success Toast */}
      <SuccessToast
        message="Group created successfully!"
        isVisible={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />
    </div>
  );
};

export default DashboardPage;
