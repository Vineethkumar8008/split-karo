import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TextInput from '../components/ui/TextInput';
import PrimaryButton from '../components/ui/PrimaryButton';
import ErrorAlert from '../components/ui/ErrorAlert';
import SuccessToast from '../components/ui/SuccessToast';
import { registerUser, getErrorMessage } from '../services/authService';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      await registerUser(formData.name, formData.email, formData.password);
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setErrors({ general: getErrorMessage(error.code) });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.name && formData.email && formData.password && formData.confirmPassword;

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6 py-12">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-10 animate-slide-up">
            <Link to="/" className="inline-block mb-8 group">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <svg className="w-11 h-11 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Create Account</h1>
            <p className="text-gray-600 text-lg">Join SplitKaro to manage expenses</p>
          </div>

          {/* Form Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 p-10 animate-scale-in">
            {errors.general && (
              <div className="mb-8">
                <ErrorAlert message={errors.general} onClose={() => setErrors((prev) => ({ ...prev, general: '' }))} />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <TextInput
                id="name"
                name="name"
                type="text"
                label="Full Name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                autoComplete="name"
                disabled={loading}
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
              />

              <TextInput
                id="email"
                name="email"
                type="email"
                label="Email Address"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                autoComplete="email"
                disabled={loading}
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>}
              />

              <TextInput
                id="password"
                name="password"
                type="password"
                label="Password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                helperText={!errors.password ? 'Minimum 6 characters' : undefined}
                autoComplete="new-password"
                disabled={loading}
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
              />

              <TextInput
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                autoComplete="new-password"
                disabled={loading}
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />

              <div className="pt-4">
                <PrimaryButton type="submit" loading={loading} disabled={loading || !isFormValid}>
                  Create Account
                </PrimaryButton>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-base text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <SuccessToast message="Account created successfully! Redirecting..." isVisible={showSuccess} onClose={() => setShowSuccess(false)} />
    </>
  );
};

export default RegisterPage;
