const AuthCard = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-8 animate-slide-up">
            {title && (
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-gray-500 text-sm">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 animate-scale-in">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
