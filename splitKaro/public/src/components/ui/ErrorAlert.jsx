const ErrorAlert = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="rounded-xl bg-red-50 border-2 border-red-200 p-4 animate-slide-up">
      <div className="flex items-start gap-3">
        {/* Error Icon */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <div className="flex-1 pt-1">
          <p className="text-sm font-semibold text-red-900 mb-1">Error</p>
          <p className="text-sm text-red-800">{message}</p>
        </div>

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-red-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;
