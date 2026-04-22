import { useState } from 'react';

const TextInput = ({
  label,
  error,
  helperText,
  icon,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleChange = (e) => {
    setHasValue(e.target.value.length > 0);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <div className="w-full">
      <div className="relative group">
        {/* Icon */}
        {icon && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors duration-200">
            {icon}
          </div>
        )}

        {/* Floating Label */}
        <label
          htmlFor={props.id}
          className={`
            absolute
            ${icon ? 'left-14' : 'left-5'}
            transition-all
            duration-200
            pointer-events-none
            ${isFocused || hasValue || props.value
              ? '-top-3 text-xs text-indigo-600 font-semibold bg-white px-2 rounded-md'
              : 'top-1/2 -translate-y-1/2 text-base text-gray-500'
            }
          `}
        >
          {label}
        </label>

        {/* Input Field */}
        <input
          {...props}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full
            ${icon ? 'pl-14' : 'pl-5'}
            pr-5
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
            ${error
              ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
              : 'border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
            }
            ${props.disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
            ${props.className || ''}
          `}
        />
      </div>

      {/* Helper Text or Error */}
      {(error || helperText) && (
        <div className="mt-3 flex items-start gap-2">
          {error && (
            <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
          <p className={`text-sm leading-relaxed ${error ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
            {error || helperText}
          </p>
        </div>
      )}
    </div>
  );
};

export default TextInput;
