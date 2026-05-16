'use client';

import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Settings, LogOut, PlusCircle, Search, Sparkles, Command, ChevronRight, Calendar, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import api from '../../lib/axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const { data: recentNotes } = useQuery({
    queryKey: ['notes', 'recent'],
    queryFn: async () => {
      const res = await api.get('/notes');
      return res.data.data.slice(0, 5);
    },
    enabled: !!user
  });

  const handleCreateNote = async () => {
    try {
      const res = await api.post('/notes', { title: 'Untitled Note', content: '' });
      router.push(`/notes/${res.data.data._id}`);
      toast.success('New workspace initialized');
    } catch (error) {
      toast.error('Failed to create note');
    }
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Library', href: '/notes', icon: FileText },
  ];

  const formattedDate = currentTime ? currentTime.toLocaleDateString('en-US', { 
    weekday: 'short', month: 'short', day: 'numeric' 
  }) : '';

  const hours = currentTime ? currentTime.getHours() : 0;
  const greeting = hours < 12 ? 'Morning' : hours < 18 ? 'Afternoon' : 'Evening';

  return (
    <div className="flex h-screen bg-[#0a0b0d] text-[#f3f1ea] overflow-hidden selection:bg-[#d6a96d]/30 selection:text-[#d6a96d]">
      {/* Premium Sidebar with Glass Effect */}
      <aside className="w-72 border-r border-white/[0.05] bg-[#111315]/40 backdrop-blur-3xl flex flex-col transition-all relative z-20 shadow-[10px_0_30px_rgba(0,0,0,0.2)]">
        <div className="p-8 pb-10 flex items-center gap-3 font-black text-2xl tracking-tighter text-white group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-[#d6a96d] to-[#b88a4d] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(214,169,109,0.3)] group-hover:shadow-[0_0_35px_rgba(214,169,109,0.5)] transition-all group-hover:scale-105 duration-500">
            <Sparkles className="text-[#111315] w-6 h-6" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">AI Notes</span>
        </div>
        
        <div className="px-6 pb-8">
          <button 
            onClick={handleCreateNote}
            className="w-full flex items-center justify-center gap-3 bg-[#16181d] text-white py-4 rounded-2xl hover:bg-[#1f2228] transition-all font-bold border border-[#2d3139]/50 shadow-lg group active:scale-[0.97] hover:border-[#d6a96d]/30"
          >
            <div className="w-6 h-6 bg-[#d6a96d]/10 rounded-lg flex items-center justify-center text-[#d6a96d]">
              <PlusCircle className="w-4 h-4" />
            </div>
            New Thought
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="text-[9px] font-black text-[#a7afbd]/30 uppercase tracking-[0.3em] mb-4 px-4">Navigation</div>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all font-bold group border ${
                  isActive 
                    ? 'bg-[#d6a96d]/10 text-[#d6a96d] border-[#d6a96d]/20 shadow-[0_0_20px_rgba(214,169,109,0.08)]' 
                    : 'text-[#a7afbd]/70 hover:bg-[#16181d] hover:text-white border-transparent'
                }`}
              >
                <div className="flex items-center gap-4">
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-[#d6a96d]' : 'text-[#a7afbd]/40 group-hover:text-white'} transition-colors`} />
                  {item.name}
                </div>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#d6a96d] shadow-[0_0_10px_#d6a96d]" />}
              </Link>
            );
          })}

          {/* Recent Notes Section with better polish */}
          {recentNotes && recentNotes.length > 0 && (
            <div className="pt-10 pb-4">
              <h4 className="text-[9px] font-black text-[#a7afbd]/30 uppercase tracking-[0.3em] mb-5 px-4">Recently Archived</h4>
              <div className="space-y-1.5">
                {recentNotes.map(note => {
                  const isActive = pathname === `/notes/${note._id}`;
                  return (
                    <Link 
                      key={note._id} 
                      href={`/notes/${note._id}`}
                      className={`flex items-center justify-between px-5 py-3 rounded-xl text-[13px] font-bold transition-all group border ${
                        isActive 
                          ? 'bg-white/5 text-[#d6a96d] border-white/5' 
                          : 'text-[#a7afbd]/50 hover:bg-white/5 hover:text-[#f3f1ea] border-transparent'
                      }`}
                    >
                      <span className="truncate max-w-[150px]">{note.title || 'Untitled Entry'}</span>
                      <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-30 transition-all group-hover:translate-x-0.5 ${isActive ? 'opacity-30' : ''}`} />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        {/* Sidebar Footer with increased contrast */}
        <div className="p-6 border-t border-white/[0.05] mt-auto bg-black/20">
          <div className="flex items-center gap-4 mb-8 px-2 group cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1f2228] to-[#111315] border border-white/[0.1] flex items-center justify-center text-[#d6a96d] font-black shadow-xl group-hover:border-[#d6a96d]/40 transition-all">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-black text-white truncate">{user?.name}</span>
              <span className="text-[9px] text-[#d6a96d]/60 uppercase tracking-widest font-black">Premium Workspace</span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex items-center justify-center gap-3 w-full py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-[#a7afbd]/60 hover:bg-[#16181d] hover:text-white transition-all border border-transparent hover:border-[#2d3139]/50"
            >
              {theme === 'dark' ? '🌞 Daylight Mode' : '🌙 Cinematic Mode'}
            </button>
            <button
              onClick={logout}
              className="flex items-center justify-center gap-3 w-full py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-[#a7afbd]/40 hover:bg-destructive/10 hover:text-destructive transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#0a0b0d] relative flex flex-col custom-scrollbar">
        {/* Cinematic Lighting Layers */}
        <div className="fixed top-0 right-0 w-[1000px] h-[800px] bg-[#d6a96d]/5 blur-[200px] rounded-full -z-10 pointer-events-none translate-x-1/3 -translate-y-1/3 opacity-60" />
        <div className="fixed bottom-0 left-0 w-[800px] h-[700px] bg-blue-500/5 blur-[180px] rounded-full -z-10 pointer-events-none -translate-x-1/3 translate-y-1/3 opacity-40" />
        <div className="fixed top-1/2 left-1/2 w-[1200px] h-[1000px] bg-purple-500/[0.02] blur-[220px] rounded-full -z-10 pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        
        {/* Enhanced Header */}
        <header className="h-24 shrink-0 border-b border-white/[0.03] flex items-center justify-between px-12 bg-[#0a0b0d]/60 backdrop-blur-2xl sticky top-0 z-10 shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
          <div className="flex flex-col">
            {mounted && currentTime && (
              <div className="flex items-center gap-3 text-[10px] font-black text-[#a7afbd]/40 uppercase tracking-[0.3em] mb-1.5 animate-in fade-in duration-500">
                <Calendar className="w-3 h-3 text-[#d6a96d]/60" />
                <span>{formattedDate}</span>
                <span className="mx-1">•</span>
                <Clock className="w-3 h-3 text-[#d6a96d]/60" />
                <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            )}
            <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
              {mounted ? `Good ${greeting}, ${user?.name?.split(' ')[0]}` : 'Initializing Workspace...'}
              <div className="w-1.5 h-1.5 rounded-full bg-[#d6a96d] shadow-[0_0_10px_#d6a96d]" />
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a7afbd]/30 group-focus-within:text-[#d6a96d] transition-colors" />
              <input 
                type="text" 
                placeholder="Deep Search..." 
                className="bg-[#111315] border border-[#1f2228] rounded-[1.25rem] pl-12 pr-6 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#d6a96d]/40 focus:border-[#d6a96d]/40 transition-all w-80 placeholder:text-[#a7afbd]/20 font-bold"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 rounded-lg border border-[#1f2228] bg-[#16181d] text-[10px] text-[#a7afbd]/40 font-black tracking-widest">
                <Command className="w-3 h-3" /> K
              </div>
            </div>
            
            <button className="w-12 h-12 rounded-2xl bg-[#111315] border border-[#1f2228] flex items-center justify-center text-[#a7afbd]/60 hover:text-white hover:border-[#d6a96d]/40 transition-all shadow-lg active:scale-95 group">
              <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
            </button>
          </div>
        </header>

        <div className="flex-1 relative">
          {children}
        </div>
      </main>
    </div>
  );
}
