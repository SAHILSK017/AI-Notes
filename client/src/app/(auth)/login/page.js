'use client';

import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Sparkles, ArrowRight, Mail, Lock, Loader2 } from 'lucide-react';
import DeskLamp from '../../../components/DeskLamp';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isOn, setIsOn] = useState(false);

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
    <div className="min-h-screen flex bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      {/* Left Panel: Cinematic Workspace */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-110"
          style={{ backgroundImage: "url('/login-bg.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-black/20" />

        {/* Cinematic volumetric lighting overlay: Bookshelf ambient glow */}
        <div 
          className={`absolute inset-0 bg-[radial-gradient(circle_at_73%_44%,rgba(253,186,116,0.16)_0%,transparent_60%)] pointer-events-none mix-blend-color-dodge transition-opacity duration-[800ms] z-10 ${
            isOn ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Cinematic volumetric lighting overlay: Table wood grain reflection */}
        <div 
          className={`absolute bottom-[18%] left-[55%] w-[340px] h-[140px] bg-[radial-gradient(ellipse_at_center,rgba(253,186,116,0.25)_0%,transparent_70%)] blur-sm pointer-events-none mix-blend-color-dodge transition-opacity duration-[800ms] z-10 ${
            isOn ? 'opacity-100' : 'opacity-0'
          }`}
        />
        
        <div className="relative z-10 p-16 flex flex-col justify-between h-full w-full">
          <div>
            <div className="flex items-center gap-2 mb-12">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="text-white dark:text-background w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">NeuralDesk</span>
            </div>
            
            <div className="max-w-md animate-in fade-in slide-in-from-left-8 duration-1000">
              <h1 className="text-6xl font-extrabold leading-[1.1] text-foreground mb-6 tracking-tight">
                Capture thoughts before they <span className="text-primary">disappear.</span>
              </h1>
              <p className="text-xl text-muted-foreground/80 leading-relaxed font-medium">
                AI-powered notes designed for deep thinking, focused writing, and seamless organization.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground/40 font-medium">
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Premium Experience
            </span>
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              AI Enhanced
            </span>
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Encrypted Privacy
            </span>
          </div>
        </div>

        {/* Interactive Desk Lamp overlaying the static lamp on the table */}
        <div className="absolute bottom-[31%] right-[6%] z-20 scale-[1.15] lg:scale-[1.4] origin-bottom-right">
          {/* Ambient base shadow cast by the heavy brass pedestal */}
          <div 
            className={`absolute left-[117px] top-[286px] w-24 h-4 bg-black/60 blur-[3px] rounded-full pointer-events-none transition-opacity duration-[800ms] z-10 ${
              isOn ? 'opacity-40' : 'opacity-80'
            }`}
          />
          <DeskLamp isOn={isOn} onToggle={() => setIsOn(!isOn)} />
        </div>
      </div>

      {/* Right Panel: Authentication Form */}
      <div 
        className={`w-full lg:w-1/2 flex items-center justify-center p-8 relative transition-colors duration-500 ${
          isOn ? 'bg-[#13100b]' : 'bg-background'
        }`}
      >
        {/* Subtle Ambient Glows */}
        <div className={`absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none transition-opacity duration-500 ${isOn ? 'opacity-30' : 'opacity-100'}`} />
        <div className={`absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none transition-opacity duration-500 ${isOn ? 'opacity-20' : 'opacity-100'}`} />
        
        {/* Warm Golden Glow Overlay */}
        <div className={`absolute inset-0 bg-[radial-gradient(circle_at_35%_40%,rgba(214,169,109,0.06)_0%,transparent_70%)] pointer-events-none transition-opacity duration-500 ${isOn ? 'opacity-100' : 'opacity-0'}`} />

        <div className="flex flex-col items-center justify-center w-full max-w-[420px] animate-in fade-in zoom-in-95 duration-700">
          {/* Vintage Desk Lamp Component (stacked above form on mobile/tablet below lg) */}
          <div className="lg:hidden mb-6">
            <DeskLamp isOn={isOn} onToggle={() => setIsOn(!isOn)} />
          </div>

          <div 
            className={`w-full transition-all duration-700 ease-in-out ${
              isOn 
                ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' 
                : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
            }`}
          >
            <div className="lg:hidden flex items-center gap-2 mb-10 justify-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="text-white dark:text-background w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">NeuralDesk</span>
            </div>

            <div 
              className={`bg-card p-10 rounded-[2.5rem] border shadow-xl relative overflow-hidden group transition-all duration-500 ${
                isOn 
                  ? 'border-[#ebd08b]/40 shadow-[0_0_50px_rgba(235,208,139,0.15)] bg-[#191510]' 
                  : 'border-border'
              }`}
            >
              {/* Soft Top Border Glow */}
              <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent transition-opacity duration-500 ${isOn ? 'opacity-0' : 'opacity-100'}`} />
              <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ebd08b]/40 to-transparent transition-opacity duration-500 ${isOn ? 'opacity-100' : 'opacity-0'}`} />
              
              <div className="relative z-10">
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h2>
                  <p className="text-muted-foreground/50 text-sm font-medium">Return to your digital sanctuary.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground/45 uppercase tracking-[0.1em] ml-1">Email Address</label>
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-muted-foreground/30 group-focus-within/input:text-primary transition-colors" />
                      </div>
                      <input
                        type="email"
                        className={`w-full border text-foreground pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-1 transition-all placeholder:text-muted-foreground/20 font-medium ${
                          isOn 
                            ? 'bg-[#221c15] border-[#ebd08b]/20 focus:ring-[#ebd08b]/50 focus:border-[#ebd08b]/50' 
                            : 'bg-secondary border-border focus:ring-primary/50 focus:border-primary/50'
                        }`}
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-end mb-1">
                      <label className="text-xs font-bold text-muted-foreground/45 uppercase tracking-[0.1em] ml-1">Password</label>
                      <a 
                        href="#" 
                        className={`text-xs font-semibold transition-colors ${
                          isOn ? 'text-[#ebd08b]/75 hover:text-[#ebd08b]' : 'text-primary/70 hover:text-primary'
                        }`}
                      >
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-muted-foreground/30 group-focus-within/input:text-primary transition-colors" />
                      </div>
                      <input
                        type="password"
                        className={`w-full border text-foreground pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-1 transition-all placeholder:text-muted-foreground/20 font-medium ${
                          isOn 
                            ? 'bg-[#221c15] border-[#ebd08b]/20 focus:ring-[#ebd08b]/50 focus:border-[#ebd08b]/50' 
                            : 'bg-secondary border-border focus:ring-primary/50 focus:border-primary/50'
                        }`}
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
                    className={`w-full font-bold py-4 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 group/btn disabled:opacity-50 disabled:translate-y-0 cursor-pointer ${
                      isOn
                        ? 'bg-[#ebd08b] hover:bg-[#ffe39c] text-[#36291d]'
                        : 'bg-primary hover:bg-primary/95 text-white dark:text-background'
                    }`}
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

                <div className="mt-10 pt-10 border-t border-border text-center">
                  <p className="text-sm text-muted-foreground/50 font-medium">
                    New to our workspace?{' '}
                    <Link 
                      href="/signup" 
                      className={`font-bold transition-colors hover:underline ${
                        isOn ? 'text-[#ebd08b]' : 'text-primary'
                      }`}
                    >
                      Create an account
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            
            <p className="mt-8 text-center text-xs text-muted-foreground/20 font-medium uppercase tracking-[0.2em]">
              Focused Writing • AI Insights • Absolute Privacy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
