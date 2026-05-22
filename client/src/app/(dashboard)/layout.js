'use client';

import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, Settings, LogOut, PlusCircle, Search, Sparkles, Command, ChevronRight, ChevronLeft, Calendar, Clock, Menu, X, Sun, Moon } from 'lucide-react';
import { useState, useEffect, useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const toggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem('sidebarCollapsed', String(next));
  };

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
      setIsMobileSidebarOpen(false);
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
  const greeting = hours < 12 ? 'morning' : hours < 18 ? 'afternoon' : 'evening';
  const firstName = user?.name?.trim().split(/\s+/)[0];
  const greetingText = firstName ? `Good ${greeting}, ${firstName}` : `Good ${greeting}`;

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden selection:bg-primary/30 selection:text-primary">
      {/* Mobile Sidebar Backdrop */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Premium Sidebar with Glass Effect */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 border-r border-border/40 bg-card/95 backdrop-blur-3xl flex flex-col transition-[width,transform] duration-300 shadow-2xl md:relative md:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isCollapsed ? 'sidebar-desktop-collapsed' : 'sidebar-desktop-expanded'
        } sidebar-mobile`}
      >
        <div className={`flex items-center justify-between gap-2 font-black tracking-tighter text-foreground group cursor-pointer transition-all duration-300 ${
          isCollapsed ? 'p-5 flex-col gap-4' : 'p-6 pb-10'
        }`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 duration-500 shrink-0">
              <Sparkles className="text-white dark:text-background w-6 h-6 shrink-0" />
            </div>
            <span className={`text-foreground font-black text-xl tracking-tight transition-all duration-300 whitespace-nowrap truncate ${
              isCollapsed ? 'opacity-0 max-w-0 pointer-events-none' : 'opacity-100 max-w-[150px]'
            }`}>
              NeuralDesk
            </span>
          </div>
          
          <button 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>

          <button 
            onClick={toggleCollapse}
            className="hidden md:flex p-2 rounded-xl bg-secondary/50 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all active:scale-95 shrink-0"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
        
        <div className={`transition-all duration-300 ${isCollapsed ? 'px-3 pb-6' : 'px-6 pb-8'}`}>
          <button 
            onClick={handleCreateNote}
            className={`w-full flex items-center justify-center bg-secondary text-foreground rounded-2xl hover:bg-secondary/80 transition-all font-bold border border-border shadow-lg group active:scale-[0.97] hover:border-primary/30 ${
              isCollapsed ? 'p-3' : 'gap-3 py-4'
            }`}
            title={isCollapsed ? "New Thought" : undefined}
          >
            <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
              <PlusCircle className="w-4 h-4" />
            </div>
            <span className={`transition-all duration-300 whitespace-nowrap ${
              isCollapsed ? 'opacity-0 max-w-0 overflow-hidden' : 'opacity-100 max-w-[150px]'
            }`}>
              New Thought
            </span>
          </button>
        </div>

        <nav className={`flex-1 space-y-2 overflow-y-auto custom-scrollbar transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-4'}`}>
          <div className={`text-[9px] font-black text-muted-foreground/75 uppercase tracking-[0.3em] mb-4 px-4 transition-all duration-300 ${
            isCollapsed ? 'opacity-0 max-h-0 mb-0 overflow-hidden' : 'opacity-100 max-h-4'
          }`}>
            Navigation
          </div>
          
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileSidebarOpen(false)}
                className={`flex items-center rounded-2xl transition-all font-bold group border ${
                  isCollapsed ? 'justify-center p-3.5' : 'justify-between px-5 py-3.5'
                } ${
                  isActive 
                    ? 'bg-primary/10 text-primary border-primary/20 shadow-md' 
                    : 'text-muted-foreground/80 hover:bg-secondary hover:text-foreground border-transparent'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <div className="flex items-center">
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted-foreground/50 group-hover:text-foreground'} transition-colors shrink-0`} />
                  <span className={`transition-all duration-300 whitespace-nowrap ${
                    isCollapsed ? 'opacity-0 max-w-0 overflow-hidden pointer-events-none' : 'opacity-100 max-w-[200px] ml-4'
                  }`}>
                    {item.name}
                  </span>
                </div>
                {!isCollapsed && isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 ml-auto" />}
              </Link>
            );
          })}

          {/* Recent Notes Section */}
          {recentNotes && recentNotes.length > 0 && (
            <div className={`pt-10 pb-4 transition-all duration-300 ${isCollapsed ? 'opacity-0 max-h-0 overflow-hidden pointer-events-none' : 'opacity-100'}`}>
              <h4 className="text-[9px] font-black text-muted-foreground/75 uppercase tracking-[0.3em] mb-5 px-4">Recently Archived</h4>
              <div className="space-y-1.5">
                {recentNotes.map(note => {
                  const isActive = pathname === `/notes/${note._id}`;
                  return (
                    <Link 
                      key={note._id} 
                      href={`/notes/${note._id}`}
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className={`flex items-center justify-between px-5 py-3 rounded-xl text-[13px] font-bold transition-all group border ${
                        isActive 
                          ? 'bg-primary/5 text-primary border-primary/10' 
                          : 'text-muted-foreground/70 hover:bg-secondary hover:text-foreground border-transparent'
                      }`}
                    >
                      <span className="truncate max-w-[150px]">{note.title || 'Untitled Entry'}</span>
                      <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-all group-hover:translate-x-0.5 ${isActive ? 'opacity-60' : ''}`} />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className={`border-t border-border/40 mt-auto bg-secondary/20 transition-all duration-300 ${isCollapsed ? 'p-3' : 'p-6'}`}>
          <div className={`flex items-center group cursor-pointer transition-all duration-300 ${isCollapsed ? 'justify-center mb-4' : 'gap-4 mb-8 px-2'}`} title={isCollapsed ? user?.name : undefined}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-card to-secondary border border-border flex items-center justify-center text-primary font-black shadow-xl group-hover:border-primary/40 transition-all shrink-0">
              {user?.name?.[0] || 'U'}
            </div>
            <div className={`flex flex-col min-w-0 transition-all duration-300 whitespace-nowrap ${
              isCollapsed ? 'opacity-0 max-w-0 overflow-hidden pointer-events-none' : 'opacity-100 max-w-[150px]'
            }`}>
              <span className="text-sm font-black text-foreground truncate">{user?.name}</span>
              <span className="text-[9px] text-primary/80 uppercase tracking-widest font-black">Premium Workspace</span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={logout}
              className={`flex items-center justify-center w-full rounded-xl text-[11px] font-black uppercase tracking-widest text-muted-foreground/60 hover:bg-destructive/10 hover:text-destructive transition-all cursor-pointer ${
                isCollapsed ? 'p-3.5' : 'gap-3 py-3'
              }`}
              title={isCollapsed ? "Sign Out" : undefined}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span className={`transition-all duration-300 whitespace-nowrap ${
                isCollapsed ? 'opacity-0 max-w-0 overflow-hidden' : 'opacity-100 max-w-[150px]'
              }`}>
                Sign Out
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-background relative flex flex-col custom-scrollbar">
        {/* Cinematic Lighting Layers */}
        <div className="fixed top-0 right-0 w-[1000px] h-[800px] bg-primary/5 blur-[200px] rounded-full -z-10 pointer-events-none translate-x-1/3 -translate-y-1/3 opacity-60 dark:opacity-40" />
        <div className="fixed bottom-0 left-0 w-[800px] h-[700px] bg-blue-500/5 blur-[180px] rounded-full -z-10 pointer-events-none -translate-x-1/3 translate-y-1/3 opacity-40 dark:opacity-20" />
        <div className="fixed top-1/2 left-1/2 w-[1200px] h-[1000px] bg-purple-500/[0.02] blur-[220px] rounded-full -z-10 pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        
        {/* Enhanced Header */}
        <header className="h-24 shrink-0 border-b border-border/40 flex items-center justify-between px-6 md:px-12 bg-background/60 backdrop-blur-2xl sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2.5 rounded-xl bg-card border border-border text-foreground hover:bg-secondary transition-all active:scale-95 shadow-sm"
            >
              <Menu className="w-5 h-5 text-primary" />
            </button>
            <div className="flex flex-col">
              {mounted && currentTime && (
                <div className="flex items-center gap-3 text-[10px] font-black text-muted-foreground/80 uppercase tracking-[0.3em] mb-1.5 animate-in fade-in duration-500">
                  <Calendar className="w-3 h-3 text-primary/60" />
                  <span>{formattedDate}</span>
                  <span className="mx-1">•</span>
                  <Clock className="w-3 h-3 text-primary/60" />
                  <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              )}
              <h2 className="text-xl md:text-2xl font-black text-foreground tracking-normal flex items-center gap-3">
                {mounted ? greetingText : 'Initializing Workspace...'}
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden sm:block relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Deep Search..." 
                className="bg-card border border-border rounded-[1.25rem] pl-12 pr-6 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-all w-80 placeholder:text-muted-foreground/55 font-bold animate-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 rounded-lg border border-border bg-secondary text-[10px] text-muted-foreground/70 font-black tracking-widest">
                <Command className="w-3 h-3" /> K
              </div>
            </div>
            
            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all shadow-md active:scale-95 group cursor-pointer"
              title={mounted && theme === 'light' ? 'Cinematic Mode' : 'Daylight Mode'}
            >
              {mounted && theme === 'light' ? (
                <Moon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              ) : (
                <Sun className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              )}
            </button>

            <button className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all shadow-md active:scale-95 group">
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
