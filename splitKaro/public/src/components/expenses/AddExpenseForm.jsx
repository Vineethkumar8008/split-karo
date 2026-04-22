import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUsersByIds } from '../../services/userService';
import { createExpense } from '../../services/expenseService';
import TextInput from '../ui/TextInput';
import Dropdown from '../ui/Dropdown';
import PrimaryButton from '../ui/PrimaryButton';
import ErrorAlert from '../ui/ErrorAlert';
import SuccessToast from '../ui/SuccessToast';
import SplitPreview from './SplitPreview';

const CATEGORIES = [
  { value: 'Food', label: '🍕 Food' },
  { value: 'Travel', label: '✈️ Travel' },
  { value: 'Rent', label: '🏠 Rent' },
  { value: 'Shopping', label: '🛍️ Shopping' },
  { value: 'Other', label: '📦 Other' },
];

const SPLIT_TYPES = {
  EQUAL: 'equal',
  RATIO: 'ratio',
  CUSTOM: 'custom',
};

const AddExpenseForm = ({ group, onSuccess }) => {
  const { currentUser } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    amount: '',
    paidBy: currentUser?.uid || '',
    splitType: SPLIT_TYPES.EQUAL,
  });

  // Custom amounts for each member (for custom split)
  const [customAmounts, setCustomAmounts] = useState({});
  // Ratios for each member (for ratio split)
  const [ratios, setRatios] = useState({});

  useEffect(() => {
    const fetchMembers = async () => {
      if (!group?.members) return;

      try {
        const groupMembers = await getUsersByIds(group.members);
        setMembers(groupMembers);

        // Initialize custom amounts and ratios
        const initialAmounts = {};
        const initialRatios = {};
        groupMembers.forEach((member) => {
          initialAmounts[member.id] = '';
          initialRatios[member.id] = '';
        });
        setCustomAmounts(initialAmounts);
        setRatios(initialRatios);
      } catch (err) {
        console.error('Failed to fetch members:', err);
      }
    };

    fetchMembers();
  }, [group?.members]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomAmountChange = (userId, value) => {
    setCustomAmounts((prev) => ({ ...prev, [userId]: value }));
  };

  const handleRatioChange = (userId, value) => {
    setRatios((prev) => ({ ...prev, [userId]: value }));
  };

  // Calculate splits based on split type
  const calculateSplits = () => {
    const amount = parseFloat(formData.amount) || 0;
    if (amount === 0 || members.length === 0) return [];

    const splits = [];

    if (formData.splitType === SPLIT_TYPES.EQUAL) {
      const perPerson = amount / members.length;
      members.forEach((member) => {
        splits.push({
          userId: member.id,
          amount: parseFloat(perPerson.toFixed(2)),
        });
      });
    } else if (formData.splitType === SPLIT_TYPES.RATIO) {
      const totalRatio = members.reduce((sum, member) => {
        return sum + (parseFloat(ratios[member.id]) || 0);
      }, 0);

      if (totalRatio > 0) {
        members.forEach((member) => {
          const ratio = parseFloat(ratios[member.id]) || 0;
          const memberAmount = (amount * ratio) / totalRatio;
          splits.push({
            userId: member.id,
            amount: parseFloat(memberAmount.toFixed(2)),
            ratio: ratio,
          });
        });
      }
    } else if (formData.splitType === SPLIT_TYPES.CUSTOM) {
      members.forEach((member) => {
        const memberAmount = parseFloat(customAmounts[member.id]) || 0;
        splits.push({
          userId: member.id,
          amount: memberAmount,
        });
      });
    }

    return splits;
  };

  const splits = calculateSplits();
  const splitTotal = splits.reduce((sum, split) => sum + split.amount, 0);

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }

    if (!formData.category) {
      setError('Category is required');
      return false;
    }

    const amount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return false;
    }

    if (!formData.paidBy) {
      setError('Please select who paid');
      return false;
    }

    if (formData.splitType === SPLIT_TYPES.RATIO) {
      const totalRatio = members.reduce((sum, member) => {
        return sum + (parseFloat(ratios[member.id]) || 0);
      }, 0);
      if (totalRatio === 0) {
        setError('Please enter valid ratios');
        return false;
      }
    }

    if (formData.splitType === SPLIT_TYPES.CUSTOM) {
      const diff = Math.abs(splitTotal - amount);
      if (diff > 0.01) {
        setError(`Split amounts must equal total (difference: ₹${diff.toFixed(2)})`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      await createExpense(group.id, {
        ...formData,
        splits: splits,
      });

      // Reset form
      setFormData({
        title: '',
        category: '',
        amount: '',
        paidBy: currentUser?.uid || '',
        splitType: SPLIT_TYPES.EQUAL,
      });

      // Reset custom amounts and ratios
      const resetAmounts = {};
      const resetRatios = {};
      members.forEach((member) => {
        resetAmounts[member.id] = '';
        resetRatios[member.id] = '';
      });
      setCustomAmounts(resetAmounts);
      setRatios(resetRatios);

      setShowSuccess(true);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Failed to create expense:', err);
      setError('Failed to create expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.title &&
    formData.category &&
    formData.amount &&
    formData.paidBy &&
    (formData.splitType !== SPLIT_TYPES.CUSTOM || Math.abs(splitTotal - parseFloat(formData.amount)) < 0.01);

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <ErrorAlert message={error} onClose={() => setError('')} />}

        {/* Title */}
        <TextInput
          id="title"
          name="title"
          type="text"
          label="Expense Title"
          value={formData.title}
          onChange={handleChange}
          disabled={loading}
          autoComplete="off"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          }
        />

        {/* Category */}
        <Dropdown
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={CATEGORIES}
          disabled={loading}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          }
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Amount */}
          <TextInput
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            label="Amount (₹)"
            value={formData.amount}
            onChange={handleChange}
            disabled={loading}
            autoComplete="off"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />

          {/* Paid By */}
          <Dropdown
            label="Paid By"
            name="paidBy"
            value={formData.paidBy}
            onChange={handleChange}
            options={members.map((m) => ({ value: m.id, label: m.name }))}
            disabled={loading}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />
        </div>

        {/* Split Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Split Type</label>
          <div className="grid grid-cols-3 gap-3">
            {Object.values(SPLIT_TYPES).map((type) => (
              <label
                key={type}
                className={`
                  flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all
                  ${
                    formData.splitType === type
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }
                  ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <input
                  type="radio"
                  name="splitType"
                  value={type}
                  checked={formData.splitType === type}
                  onChange={handleChange}
                  disabled={loading}
                  className="sr-only"
                />
                <span className="font-semibold capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Ratio Inputs */}
        {formData.splitType === SPLIT_TYPES.RATIO && (
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">Enter Ratios</h4>
            <div className="grid grid-cols-2 gap-4">
              {members.map((member) => (
                <TextInput
                  key={member.id}
                  id={`ratio-${member.id}`}
                  type="number"
                  step="1"
                  label={member.name}
                  value={ratios[member.id]}
                  onChange={(e) => handleRatioChange(member.id, e.target.value)}
                  disabled={loading}
                  autoComplete="off"
                />
              ))}
            </div>
          </div>
        )}

        {/* Custom Amount Inputs */}
        {formData.splitType === SPLIT_TYPES.CUSTOM && (
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">Enter Custom Amounts</h4>
            <div className="grid grid-cols-2 gap-4">
              {members.map((member) => (
                <TextInput
                  key={member.id}
                  id={`custom-${member.id}`}
                  type="number"
                  step="0.01"
                  label={member.name}
                  value={customAmounts[member.id]}
                  onChange={(e) => handleCustomAmountChange(member.id, e.target.value)}
                  disabled={loading}
                  autoComplete="off"
                />
              ))}
            </div>
            <div className="mt-4 text-sm">
              <span className="text-gray-600">Total: </span>
              <span
                className={`font-bold ${
                  Math.abs(splitTotal - parseFloat(formData.amount || 0)) < 0.01 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                ₹{splitTotal.toFixed(2)}
              </span>
              <span className="text-gray-600"> / ₹{parseFloat(formData.amount || 0).toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Split Preview */}
        {formData.amount && splits.length > 0 && (
          <SplitPreview splits={splits} members={members} totalAmount={parseFloat(formData.amount)} />
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <PrimaryButton type="submit" loading={loading} disabled={loading || !isFormValid}>
            Add Expense
          </PrimaryButton>
        </div>
      </form>

      <SuccessToast
        message="Expense added successfully!"
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </>
  );
};

export default AddExpenseForm;
