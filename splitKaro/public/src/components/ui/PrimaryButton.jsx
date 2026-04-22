const PrimaryButton = ({
  children,
  loading = false,
  disabled = false,
  variant = 'primary',
  fullWidth = true,
  size = 'md',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-base',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm',
    outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 shadow-sm hover:shadow-md',
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        ${fullWidth ? 'w-full' : ''}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        font-semibold
        rounded-xl
        transition-all
        duration-300
        focus:outline-none
        focus:ring-4
        focus:ring-indigo-500/20
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:hover:transform-none
        transform
        hover:scale-[1.02]
        active:scale-[0.98]
        ${props.className || ''}
      `}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-3">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {typeof children === 'string' && children.includes('Register')
            ? 'Creating account...'
            : typeof children === 'string' && children.includes('Login')
            ? 'Logging in...'
            : 'Processing...'}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default PrimaryButton;
