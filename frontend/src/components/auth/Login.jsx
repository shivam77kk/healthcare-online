import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useMutation } from '../../hooks/useApi';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'Patient', // Default role
  });

  const [showPassword, setShowPassword] = useState(false);

  // Get redirect path from location state
  const redirectPath = location.state?.from?.pathname || '/';

  // Login mutation
  const {
    execute: executeLogin,
    loading: loginLoading,
    error: loginError,
  } = useMutation(login, {
    onSuccess: (result) => {
      // Redirect based on user role
      const dashboardPath = result.role === 'Admin' ? '/admin/dashboard' : '/patient/dashboard';
      navigate(dashboardPath, { replace: true });
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await executeLogin(formData);
    } catch (error) {
      // Error is already handled by the mutation hook
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className=\"min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8\">
      <div className=\"max-w-md w-full space-y-8\">
        <div>
          <div className=\"flex justify-center\">
            <img
              className=\"h-12 w-auto\"
              src=\"/logo.png\"
              alt=\"Healthcare\"
            />
          </div>
          <h2 className=\"mt-6 text-center text-3xl font-extrabold text-gray-900\">
            Sign in to your account
          </h2>
          <p className=\"mt-2 text-center text-sm text-gray-600\">
            Or{' '}
            <Link
              to=\"/register\"
              className=\"font-medium text-blue-600 hover:text-blue-500\"
            >
              create a new patient account
            </Link>
          </p>
        </div>

        <form className=\"mt-8 space-y-6\" onSubmit={handleSubmit}>
          {/* Error Message */}
          {loginError && (
            <div className=\"bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md\">
              <p className=\"text-sm\">{loginError.message}</p>
            </div>
          )}

          <div className=\"space-y-4\">
            {/* Role Selection */}
            <div>
              <label htmlFor=\"role\" className=\"block text-sm font-medium text-gray-700\">
                Login as
              </label>
              <select
                id=\"role\"
                name=\"role\"
                value={formData.role}
                onChange={handleChange}
                className=\"mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500\"
                required
              >
                <option value=\"Patient\">Patient</option>
                <option value=\"Admin\">Admin</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label htmlFor=\"email\" className=\"block text-sm font-medium text-gray-700\">
                Email address
              </label>
              <input
                id=\"email\"
                name=\"email\"
                type=\"email\"
                autoComplete=\"email\"
                value={formData.email}
                onChange={handleChange}
                className=\"mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500\"
                placeholder=\"Enter your email\"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor=\"password\" className=\"block text-sm font-medium text-gray-700\">
                Password
              </label>
              <div className=\"mt-1 relative\">
                <input
                  id=\"password\"
                  name=\"password\"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete=\"current-password\"
                  value={formData.password}
                  onChange={handleChange}
                  className=\"block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500\"
                  placeholder=\"Enter your password\"
                  required
                />
                <button
                  type=\"button\"
                  className=\"absolute inset-y-0 right-0 pr-3 flex items-center\"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className=\"h-5 w-5 text-gray-400\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\">
                      <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M15 12a3 3 0 11-6 0 3 3 0 016 0z\" />
                      <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z\" />
                    </svg>
                  ) : (
                    <svg className=\"h-5 w-5 text-gray-400\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\">
                      <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.87 6.87m2.007 3.008zm4.243 4.243l2.007 2.007m0 0l2.007 2.007M15.121 9.878l2.007-2.007m-2.007 2.007z\" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className=\"flex items-center justify-between\">
            <div className=\"flex items-center\">
              <input
                id=\"remember-me\"
                name=\"remember-me\"
                type=\"checkbox\"
                className=\"h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded\"
              />
              <label htmlFor=\"remember-me\" className=\"ml-2 block text-sm text-gray-900\">
                Remember me
              </label>
            </div>

            <div className=\"text-sm\">
              <Link
                to=\"/forgot-password\"
                className=\"font-medium text-blue-600 hover:text-blue-500\"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type=\"submit\"
              disabled={loginLoading}
              className=\"group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed\"
            >
              {loginLoading ? (
                <>
                  <svg className=\"animate-spin -ml-1 mr-3 h-5 w-5 text-white\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\">
                    <circle className=\"opacity-25\" cx=\"12\" cy=\"12\" r=\"10\" stroke=\"currentColor\" strokeWidth=\"4\"></circle>
                    <path className=\"opacity-75\" fill=\"currentColor\" d=\"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z\"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          {/* Links */}
          <div className=\"text-center space-y-2\">
            <div className=\"text-sm text-gray-600\">
              Don't have an account?{' '}
              <Link
                to=\"/register\"
                className=\"font-medium text-blue-600 hover:text-blue-500\"
              >
                Register as Patient
              </Link>
            </div>
            {formData.role === 'Admin' && (
              <div className=\"text-xs text-gray-500\">
                Admin accounts are created by existing administrators
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
