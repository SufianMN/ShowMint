import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, XCircle, Loader2 } from "lucide-react";
import api from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookSquare } from "react-icons/fa";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Normal email/password login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLogin(res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Google login success handler
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/auth/google-login', {
        token: credentialResponse.credential,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLogin(res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  // Facebook login success handler
  const handleFacebookLoginSuccess = async (response) => {
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
        onLogin(res.data.user);
        navigate('/');
      } catch (err) {
        setError(err.response?.data?.error || 'Facebook login failed');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Facebook login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30 -z-10" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 relative z-10"
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="inline-block p-4 rounded-2xl bg-white/10 backdrop-blur-md mb-4 select-none">
            <div className="text-3xl font-extrabold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              ShowMint
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/70">Sign in to your account to continue</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm rounded-xl border border-red-500/30 flex items-center gap-3 text-red-200">
            <XCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Email Input */}
        <div className="mb-6 relative">
          <label className="sr-only">Email Address</label>
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full pl-12 pr-4 py-3 bg-white/20 text-white placeholder-white/70 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white/30 transition"
          />
        </div>

        {/* Password Input */}
        <div className="mb-6 relative">
          <label className="sr-only">Password</label>
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full pl-12 pr-12 py-3 bg-white/20 text-white placeholder-white/70 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white/30 transition"
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-white transition 
          hover:from-purple-700 hover:to-indigo-700 ${loading ? "cursor-not-allowed opacity-80" : "hover:shadow-xl hover:scale-105"}`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Signing in...
            </div>
          ) : (
            "Login"
          )}
        </button>

        {/* Social Login Buttons */}
        <div className="mt-6 flex justify-center gap-6">
          {/* Google Login */}
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => setError("Google login failed")}
            useOneTap
            render={(renderProps) => (
              <button
                onClick={renderProps.onClick}
                disabled={loading || renderProps.disabled}
                type="button"
                className="bg-white rounded-full p-2 shadow hover:scale-110 transition transform flex items-center justify-center"
                aria-label="Sign in with Google"
              >
                <FcGoogle size={28} />
              </button>
            )}
          />
          </div>

          {/* Facebook Login 
          <FacebookLogin
            appId={process.env.REACT_APP_FACEBOOK_APP_ID} // Add this env variable in frontend .env file
            fields="name,email,picture"
            callback={handleFacebookLoginSuccess}
            render={(renderProps) => (
              <button
                onClick={renderProps.onClick}
                type="button"
                className="bg-blue-600 rounded-full p-2 shadow hover:scale-110 transition transform text-white flex items-center justify-center"
                disabled={loading}
                aria-label="Sign in with Facebook"
              >
                <FaFacebookSquare size={28} />
              </button>
            )}
          />
        </div> */}

        {/* Optional "Forgot password" & Sign up links */}
        <div className="mt-6 text-center text-white/70 text-sm select-none">
          Forgot your password? <button type="button" className="underline hover:text-white">Click here</button>
          <br />
          <span>Don't have an account? </span>
          <Link to="/register" className="underline hover:text-white font-medium">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}
