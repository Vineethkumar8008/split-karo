import { useEffect, useState } from 'react';

const SuccessToast = ({ message, isVisible, onClose, autoClose = true, duration = 3000 }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);

      if (autoClose) {
        const timer = setTimeout(() => {
          setShow(false);
          setTimeout(() => {
            if (onClose) onClose();
          }, 300);
        }, duration);

        return () => clearTimeout(timer);
      }
    } else {
      setShow(false);
    }
  }, [isVisible, autoClose, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-center z-50 pointer-events-none px-4 pt-8">
      <div
        className={`
          pointer-events-auto
          bg-white
          rounded-2xl
          shadow-2xl
          border-2
          border-green-200
          p-5
          max-w-md
          w-full
          transition-all
          duration-500
          ${show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95'}
        `}
      >
        <div className="flex items-start gap-4">
          {/* Success Icon with Animation */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-bounce-slow">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Message */}
          <div className="flex-1 pt-1">
            <h4 className="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
              Success!
              <span className="text-xl">🎉</span>
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">{message}</p>
          </div>

          {/* Close Button */}
          <button
            onClick={() => {
              setShow(false);
              setTimeout(() => {
                if (onClose) onClose();
              }, 300);
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 p-1 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        {autoClose && (
          <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all"
              style={{
                animation: `shrink ${duration}ms linear`,
                width: '100%'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessToast;
