import { useState, useEffect } from 'react';
import Modal from './Modal';
import TextInput from '../ui/TextInput';
import Checkbox from '../ui/Checkbox';
import PrimaryButton from '../ui/PrimaryButton';
import ErrorAlert from '../ui/ErrorAlert';
import { useAuth } from '../../contexts/AuthContext';
import { getAllUsers } from '../../services/userService';
import { createGroup } from '../../services/groupService';

const CreateGroupModal = ({ isOpen, onClose, onSuccess }) => {
  const { currentUser } = useAuth();
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      // Auto-select current user
      if (currentUser) {
        setSelectedMembers([currentUser.uid]);
      }
    }
  }, [isOpen, currentUser]);

  const fetchUsers = async () => {
    try {
      const allUsers = await getAllUsers();
      // Filter out current user from selection list
      const otherUsers = allUsers.filter((user) => user.id !== currentUser?.uid);
      setUsers(otherUsers);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users. Please try again.');
    }
  };

  const handleMemberToggle = (userId) => {
    setSelectedMembers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!groupName.trim()) {
      setError('Group name is required');
      return;
    }

    // Current user is automatically included, so we need at least 1 other member selected
    if (selectedMembers.length < 2) {
      setError('Please select at least one other member');
      return;
    }

    setLoading(true);

    try {
      await createGroup(groupName.trim(), selectedMembers, currentUser.uid);

      // Reset form
      setGroupName('');
      setSelectedMembers([currentUser.uid]);
      setError('');

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (err) {
      console.error('Failed to create group:', err);
      setError('Failed to create group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setGroupName('');
      setSelectedMembers([currentUser?.uid]);
      setError('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Group" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <ErrorAlert message={error} onClose={() => setError('')} />
        )}

        {/* Group Name */}
        <TextInput
          id="groupName"
          name="groupName"
          type="text"
          label="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          disabled={loading}
          autoComplete="off"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />

        {/* Member Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Members
            <span className="text-gray-500 font-normal ml-2">
              (You are automatically included)
            </span>
          </label>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {users.map((user) => (
              <Checkbox
                key={user.id}
                label={user.name}
                description={user.email}
                checked={selectedMembers.includes(user.id)}
                onChange={() => handleMemberToggle(user.id)}
                disabled={loading}
              />
            ))}

            {users.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p>No other users registered yet.</p>
                <p className="text-sm mt-1">Invite friends to register!</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <PrimaryButton
            type="submit"
            loading={loading}
            disabled={loading || !groupName.trim() || selectedMembers.length < 2}
            className="flex-1"
          >
            Create Group
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
};

export default CreateGroupModal;
