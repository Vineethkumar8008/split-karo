import { useState, useEffect } from 'react';
import Modal from './Modal';
import Checkbox from '../ui/Checkbox';
import PrimaryButton from '../ui/PrimaryButton';
import ErrorAlert from '../ui/ErrorAlert';
import Dropdown from '../ui/Dropdown';
import { useAuth } from '../../contexts/AuthContext';
import { getAllUsers } from '../../services/userService';
import { updateGroupMembers } from '../../services/groupService';

const EditGroupModal = ({ isOpen, onClose, group, onSuccess }) => {
  const { currentUser } = useAuth();
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [newAdmin, setNewAdmin] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = group?.adminId === currentUser?.uid;

  useEffect(() => {
    if (isOpen && group) {
      fetchUsers();
      setSelectedMembers(group.members || []);
      setNewAdmin(group.adminId || '');
      setError('');
    }
  }, [isOpen, group]);

  const fetchUsers = async () => {
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
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
    if (selectedMembers.length === 0) {
      setError('Group must have at least one member');
      return;
    }

    // Check if current admin is removing themselves
    const isAdminRemoving = group.adminId === currentUser?.uid && !selectedMembers.includes(currentUser.uid);

    if (isAdminRemoving && newAdmin === group.adminId) {
      setError('As admin, you must assign another admin before removing yourself from the group');
      return;
    }

    if (isAdminRemoving && !newAdmin) {
      setError('Please select a new admin');
      return;
    }

    // If admin is being changed, ensure new admin is in the members list
    if (newAdmin !== group.adminId && !selectedMembers.includes(newAdmin)) {
      setError('New admin must be a member of the group');
      return;
    }

    setLoading(true);

    try {
      const adminToAssign = isAdminRemoving ? newAdmin : group.adminId;

      await updateGroupMembers(group.id, selectedMembers, adminToAssign);

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (err) {
      console.error('Failed to update group:', err);
      setError('Failed to update group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError('');
      onClose();
    }
  };

  if (!isOpen || !group) return null;

  // Get members currently in group
  const currentMembers = users.filter((user) => selectedMembers.includes(user.id));

  // Check if admin is being removed
  const isAdminRemoving = group.adminId === currentUser?.uid && !selectedMembers.includes(currentUser.uid);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Group Members" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <ErrorAlert message={error} onClose={() => setError('')} />}

        {/* Member Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Group Members
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
                <p>No users registered yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Admin Selection - Show only if admin is being removed */}
        {isAdminRemoving && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3 mb-4">
              <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0v2m0-6v-2m0 0V7m0 2a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-sm text-yellow-900">
                You are removing yourself. Please assign another admin to the group.
              </p>
            </div>

            <Dropdown
              label="Assign New Admin"
              name="newAdmin"
              value={newAdmin}
              onChange={(e) => setNewAdmin(e.target.value)}
              options={currentMembers
                .filter((m) => m.id !== currentUser?.uid)
                .map((m) => ({ value: m.id, label: m.name }))}
              disabled={loading}
            />
          </div>
        )}

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
            disabled={loading || selectedMembers.length === 0 || (isAdminRemoving && !newAdmin)}
            className="flex-1"
          >
            Save Changes
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
};

export default EditGroupModal;
