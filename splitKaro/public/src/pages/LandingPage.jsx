import { Link } from 'react-router-dom';
import PrimaryButton from '../components/ui/PrimaryButton';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6 py-12">
      <div className="w-full max-w-lg animate-fade-in">
        {/* Logo Section */}
        <div className="text-center mb-12 animate-slide-up">
          {/* App Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-2xl shadow-indigo-500/40 mb-8 transform hover:scale-110 hover:rotate-6 transition-all duration-500">
            <svg
              className="w-14 h-14 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* App Name */}
          <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-5">
            SplitKaro
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 text-xl font-medium max-w-md mx-auto leading-relaxed">
            Split expenses easily with friends
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 p-10 space-y-5 animate-scale-in">
          {/* Login Button */}
          <Link to="/login" className="block">
            <PrimaryButton variant="primary" size="lg">
              <span className="flex items-center justify-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login to your account
              </span>
            </PrimaryButton>
          </Link>

          {/* Divider */}
          <div className="relative py-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-5 bg-white/80 text-sm text-gray-500 font-semibold">or</span>
            </div>
          </div>

          {/* Create Account Button */}
          <Link to="/register" className="block">
            <PrimaryButton variant="outline" size="lg">
              <span className="flex items-center justify-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Create new account
              </span>
            </PrimaryButton>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-10 grid grid-cols-3 gap-5">
          <div className="p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:shadow-lg transition-shadow duration-300">
            <div className="text-3xl mb-2">🔒</div>
            <p className="text-sm text-gray-700 font-semibold">Secure</p>
          </div>
          <div className="p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:shadow-lg transition-shadow duration-300">
            <div className="text-3xl mb-2">⚡</div>
            <p className="text-sm text-gray-700 font-semibold">Fast</p>
          </div>
          <div className="p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:shadow-lg transition-shadow duration-300">
            <div className="text-3xl mb-2">✨</div>
            <p className="text-sm text-gray-700 font-semibold">Simple</p>
          </div>
        </div>

        {/* Footer Text */}
        <p className="mt-10 text-center text-base text-gray-500 font-medium">
          Join thousands managing expenses together
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
