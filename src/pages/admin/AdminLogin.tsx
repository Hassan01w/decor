import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { Lock, ArrowRight, KeyRound, User, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, navigate } = useBlog();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const success = loginAdmin(password, undefined, username);
      if (!success) {
        setErrorMessage('Invalid username or password. Please try again.');
        setIsSubmitting(false);
      }
    }, 150);
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#242522] flex flex-col justify-center items-center p-4 sm:p-6 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-10 border border-[#E5DED2] shadow-xl space-y-7">
        {/* Brand Logo & Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#2F3A32] text-[#C8A97E] mx-auto flex items-center justify-center shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold tracking-[0.25em] text-[#A68B6A] uppercase block">
              The Decor Diary
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#242522] mt-0.5">
              Admin Portal
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#7A7369] max-w-xs mx-auto">
            Sign in to manage store catalog, editorial content, and site settings.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-xs text-red-700 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold">{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Production Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#242522] mb-1.5">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Enter username"
                className="w-full pl-4 pr-10 py-3 bg-[#F7F4EE] border border-[#E5DED2] rounded-xl text-sm text-[#242522] placeholder-[#A89F95] focus:outline-none focus:border-[#2F3A32] transition-colors"
              />
              <User className="w-4 h-4 text-[#A68B6A] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#242522] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Enter password"
                className="w-full pl-4 pr-11 py-3 bg-[#F7F4EE] border border-[#E5DED2] rounded-xl text-sm text-[#242522] placeholder-[#A89F95] focus:outline-none focus:border-[#2F3A32] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A68B6A] hover:text-[#242522] transition-colors cursor-pointer p-0.5"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#2F3A32] hover:bg-[#252E27] active:bg-[#1E251F] text-[#FAF7F2] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer border border-[#2F3A32] disabled:opacity-75"
          >
            <span>{isSubmitting ? 'Verifying...' : 'Sign In to Portal'}</span>
            <ArrowRight className="w-4 h-4 text-[#C8A97E]" />
          </button>
        </form>

        {/* Security & Return Link */}
        <div className="pt-2 border-t border-[#F0EBE6] text-center space-y-3">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#A68B6A]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2F3A32]" />
            <span>End-to-end encrypted administrative session</span>
          </div>

          <div>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-xs text-[#7A7369] hover:text-[#2F3A32] hover:underline transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <span>&larr;</span>
              <span>Return to The Decor Diary Store</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
