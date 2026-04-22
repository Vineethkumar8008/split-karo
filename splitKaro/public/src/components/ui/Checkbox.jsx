const Checkbox = ({ label, checked, onChange, disabled = false, description }) => {
  return (
    <label className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
      checked
        ? 'border-indigo-500 bg-indigo-50'
        : 'border-gray-200 hover:border-gray-300 bg-white'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className="flex items-center h-6">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer disabled:cursor-not-allowed"
        />
      </div>
      <div className="flex-1">
        <div className="font-medium text-gray-900">{label}</div>
        {description && (
          <div className="text-sm text-gray-500 mt-0.5">{description}</div>
        )}
      </div>
    </label>
  );
};

export default Checkbox;
