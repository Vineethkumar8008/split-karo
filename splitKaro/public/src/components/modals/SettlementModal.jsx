import { useState } from 'react';
import Modal from './Modal';
import PrimaryButton from '../ui/PrimaryButton';
import ErrorAlert from '../ui/ErrorAlert';
import { createSettlement } from '../../services/settlementService';

const SettlementModal = ({ isOpen, onClose, transaction, fromUser, toUser, groupId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    if (!transaction || !groupId) return;

    setLoading(true);
    setError('');

    try {
      await createSettlement(groupId, transaction.from, transaction.to, transaction.amount);

      if (onSuccess) {
        await onSuccess();
      }

      onClose();
    } catch (err) {
      console.error('Failed to create settlement:', err);
      setError('Failed to record settlement. Please try again.');
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

  if (!transaction || !fromUser || !toUser) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Confirm Settlement" size="md">
      <div className="space-y-6">
        {error && <ErrorAlert message={error} onClose={() => setError('')} />}

        {/* Settlement Details */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-green-900 mb-2">₹{transaction.amount.toFixed(2)}</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white/50 rounded-lg p-3">
              <span className="text-sm text-green-800 font-medium">From:</span>
              <span className="font-bold text-green-900">{fromUser.name}</span>
            </div>
            <div className="flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <div className="flex items-center justify-between bg-white/50 rounded-lg p-3">
              <span className="text-sm text-green-800 font-medium">To:</span>
              <span className="font-bold text-green-900">{toUser.name}</span>
            </div>
          </div>
        </div>

        {/* Confirmation Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-blue-900">
              Confirm that <strong>{fromUser.name}</strong> has paid <strong>₹{transaction.amount.toFixed(2)}</strong> to{' '}
              <strong>{toUser.name}</strong>. This will update the group balances.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
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
            onClick={handleConfirm}
            loading={loading}
            disabled={loading}
            className="flex-1"
          >
            Confirm Settlement
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
};

export default SettlementModal;
