import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, XCircle, Loader2 } from "lucide-react";
import api from "../utils/api";
import { useNavigate, Link } from "react-router-dom";

import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

import { FcGoogle } from "react-icons/fc";
import { FaFacebookSquare } from "react-icons/fa";

export default function Register({ onRegister }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if(error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic validations
    if (!formData.name.trim()) {
      setError("Full name is required");
      return;
    }
    if (!formData.email.includes('@')) {
      setError("Please enter a valid email");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/register', {
        name: formData.name.trim(),
        email: formData.email.toLowerCase(),
        password: formData.password
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onRegister(res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth registration handler
  const handleGoogleRegisterSuccess = async (credentialResponse) => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/auth/google-login', {
        token: credentialResponse.credential,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onRegister(res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Google registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Facebook OAuth registration handler
  const handleFacebookRegisterSuccess = async (response) => {
    if (response.accessToken) {
      setError(null);
      setLoading(true);
      try {
        const res = await api.post('/auth/facebook-login', {
          accessToken: response.accessToken,
          userID: response.userID,
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        onRegister(res.data.user);
        navigate('/');
      } catch (err) {
        setError(err.response?.data?.error || 'Facebook registration failed');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Facebook registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30 -z-10" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 relative z-10"
      >
        {/* Logo */}
        <div className="mb-8 text-center select-none">
          <div className="inline-block p-4 rounded-2xl bg-white/10 backdrop-blur-md mb-4">
            <div className="text-3xl font-extrabold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              ShowMint
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-white/70">Join ShowMint and start booking your favorite movies</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm rounded-xl border border-red-500/30 flex items-center gap-3 text-red-200">
            <XCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Full Name Input */}
        <div className="mb-6 relative">
          <label className="sr-only">Full Name</label>
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={e => handleInputChange('name', e.target.value)}
            disabled={loading}
            className="w-full pl-12 pr-4 py-3 bg-white/20 text-white placeholder-white/70 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white/30 transition"
            required
          />
        </div>

        {/* Email Input */}
        <div className="mb-6 relative">
          <label className="sr-only">Email Address</label>
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={e => handleInputChange('email', e.target.value)}
            disabled={loading}
            className="w-full pl-12 pr-4 py-3 bg-white/20 text-white placeholder-white/70 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white/30 transition"
            required
          />
        </div>

        {/* Password Input */}
        <div className="mb-6 relative">
          <label className="sr-only">Password</label>
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={formData.password}
            onChange={e => handleInputChange('password', e.target.value)}
            disabled={loading}
            className="w-full pl-12 pr-12 py-3 bg-white/20 text-white placeholder-white/70 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white/30 transition"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Confirm Password Input */}
        <div className="mb-8 relative">
          <label className="sr-only">Confirm Password</label>
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={e => handleInputChange('confirmPassword', e.target.value)}
            disabled={loading}
            className="w-full pl-12 pr-12 py-3 bg-white/20 text-white placeholder-white/70 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white/30 transition"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={loading}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition"
            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-white transition 
            hover:from-purple-700 hover:to-indigo-700 ${loading ? 'cursor-not-allowed opacity-80' : 'hover:shadow-xl hover:scale-105'}`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating Account...
            </div>
          ) : (
            'Create Account'
          )}
        </button>

        {/* Social Register Buttons */}
        <div className="mt-6 flex justify-center gap-6">
          {/* Google Register */}
          <GoogleLogin
            onSuccess={handleGoogleRegisterSuccess}
            onError={() => setError('Google registration failed')}
            useOneTap
            render={(renderProps) => (
              <button
                onClick={renderProps.onClick}
                disabled={loading || renderProps.disabled}
                type="button"
                className="bg-white rounded-full p-2 shadow hover:scale-110 transition transform flex items-center justify-center"
                aria-label="Sign up with Google"
              >
                <FcGoogle size={28} />
              </button>
            )}
          />
          </div>
          {/* Facebook Register 
          <FacebookLogin
            appId={process.env.REACT_APP_FACEBOOK_APP_ID}
            fields="name,email,picture"
            callback={handleFacebookRegisterSuccess}
            render={(renderProps) => (
              <button
                onClick={renderProps.onClick}
                type="button"
                className="bg-blue-600 rounded-full p-2 shadow hover:scale-110 transition transform text-white flex items-center justify-center"
                disabled={loading}
                aria-label="Sign up with Facebook"
              >
                <FaFacebookSquare size={28} />
              </button>
            )}
          />
        */}

        {/* Login Link */}
        <div className="mt-6 text-center text-white/70 text-sm select-none">
          Already have an account?{' '}
          <Link to="/login" className="underline hover:text-white font-medium transition">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
