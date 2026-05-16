'use client';

import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Sparkles, ArrowRight, Mail, Lock, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Logged in successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#111315] text-[#f3f1ea] selection:bg-[#d6a96d]/30 selection:text-[#d6a96d]">
      {/* Left Panel: Cinematic Workspace */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-110"
          style={{ backgroundImage: "url('/login-bg.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111315] via-[#111315]/40 to-transparent" />
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="relative z-10 p-16 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-2 mb-12">
              <div className="w-10 h-10 bg-[#d6a96d] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(214,169,109,0.3)]">
                <Sparkles className="text-[#111315] w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">AI Notes</span>
            </div>
            
            <div className="max-w-md animate-in fade-in slide-in-from-left-8 duration-1000">
              <h1 className="text-6xl font-extrabold leading-[1.1] text-white mb-6 tracking-tight">
                Capture thoughts before they <span className="text-[#d6a96d]">disappear.</span>
              </h1>
              <p className="text-xl text-[#f3f1ea]/70 leading-relaxed font-medium">
                AI-powered notes designed for deep thinking, focused writing, and seamless organization.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-[#f3f1ea]/40 font-medium">
            <span className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-[#d6a96d]" />
              Premium Experience
            </span>
            <span className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-[#d6a96d]" />
              AI Enhanced
            </span>
            <span className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-[#d6a96d]" />
              Encrypted Privacy
            </span>
          </div>
        </div>
      </div>

      {/* Right Panel: Authentication Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#d6a96d]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="w-full max-w-[420px] animate-in fade-in zoom-in-95 duration-700">
          <div className="lg:hidden flex items-center gap-2 mb-10 justify-center">
            <div className="w-8 h-8 bg-[#d6a96d] rounded-lg flex items-center justify-center">
              <Sparkles className="text-[#111315] w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">AI Notes</span>
          </div>

          <div className="bg-[#16181d] p-10 rounded-[2.5rem] border border-[#23262d] shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden group">
            {/* Soft Top Border Glow */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d6a96d]/20 to-transparent" />
            
            <div className="relative z-10">
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-[#f3f1ea]/50 text-sm font-medium">Return to your digital sanctuary.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#f3f1ea]/40 uppercase tracking-[0.1em] ml-1">Email Address</label>
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-[#f3f1ea]/20 group-focus-within/input:text-[#d6a96d] transition-colors" />
                    </div>
                    <input
                      type="email"
                      className="w-full bg-[#1f2228] border border-[#23262d] text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#d6a96d]/50 focus:border-[#d6a96d]/50 transition-all placeholder:text-[#f3f1ea]/10 font-medium"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-end mb-1">
                    <label className="text-xs font-bold text-[#f3f1ea]/40 uppercase tracking-[0.1em] ml-1">Password</label>
                    <a href="#" className="text-xs text-[#d6a96d]/60 hover:text-[#d6a96d] transition-colors font-semibold">Forgot password?</a>
                  </div>
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-[#f3f1ea]/20 group-focus-within/input:text-[#d6a96d] transition-colors" />
                    </div>
                    <input
                      type="password"
                      className="w-full bg-[#1f2228] border border-[#23262d] text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#d6a96d]/50 focus:border-[#d6a96d]/50 transition-all placeholder:text-[#f3f1ea]/10 font-medium"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#d6a96d] hover:bg-[#e5b97d] text-[#111315] font-bold py-4 rounded-2xl transition-all shadow-[0_10px_20px_rgba(214,169,109,0.2)] hover:shadow-[0_15px_30px_rgba(214,169,109,0.3)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group/btn disabled:opacity-50 disabled:translate-y-0"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Sign Into Workspace
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-10 pt-10 border-t border-[#23262d] text-center">
                <p className="text-sm text-[#f3f1ea]/40 font-medium">
                  New to our workspace?{' '}
                  <Link href="/signup" className="text-[#d6a96d] hover:text-[#e5b97d] font-bold transition-colors underline-offset-4 hover:underline">
                    Create an account
                  </Link>
                </p>
              </div>
            </div>
          </div>
          
          <p className="mt-8 text-center text-xs text-[#f3f1ea]/20 font-medium uppercase tracking-[0.2em]">
            Focused Writing • AI Insights • Absolute Privacy
          </p>
        </div>
      </div>
    </div>
  );
}
