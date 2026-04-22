const Dropdown = ({ label, name, value, onChange, options, error, disabled = false, icon }) => {
  return (
    <div className="w-full">
      <div className="relative group">
        {/* Icon */}
        {icon && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors duration-200 pointer-events-none z-10">
            {icon}
          </div>
        )}

        {/* Floating Label */}
        <label
          className={`
            absolute
            ${icon ? 'left-14' : 'left-5'}
            transition-all
            duration-200
            pointer-events-none
            ${value
              ? '-top-3 text-xs text-indigo-600 font-semibold bg-white px-2 rounded-md'
              : 'top-1/2 -translate-y-1/2 text-base text-gray-500'
            }
          `}
        >
          {label}
        </label>

        {/* Select Field */}
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full
            ${icon ? 'pl-14' : 'pl-5'}
            pr-10
            py-4
            h-14
            bg-white
            border-2
            rounded-2xl
            text-base
            text-gray-900
            transition-all
            duration-200
            focus:outline-none
            appearance-none
            cursor-pointer
            ${error
              ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
              : 'border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
          `}
        >
          <option value="" disabled></option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Arrow Icon */}
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-3 flex items-start gap-2">
          <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-sm leading-relaxed text-red-600 font-medium">
            {error}
          </p>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
