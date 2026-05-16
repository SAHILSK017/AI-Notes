'use client';

import { useAuth } from '../../../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/axios';
import StatsCard from '../../../components/Dashboard/StatsCard';
import RecentNoteItem from '../../../components/Dashboard/RecentNoteItem';
import { FileText, Sparkles, Zap, BrainCircuit, ArrowRight, Library, Target } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: notes, isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const res = await api.get('/notes');
      return res.data.data;
    },
    enabled: !!user
  });

  const stats = [
    { 
      title: 'Intellectual Entries', 
      value: notes?.length || 0, 
      icon: FileText, 
      trend: notes?.length > 0 ? 'Archive Active' : 'Waiting for Data', 
      color: 'amber' 
    },
    { 
      title: 'Neural Summaries', 
      value: notes?.filter(n => n.aiSummary).length || 0, 
      icon: Sparkles, 
      trend: `${notes?.length > 0 ? Math.round((notes.filter(n => n.aiSummary).length / notes.length) * 100) : 0}% coverage`, 
      color: 'blue' 
    },
    { 
      title: 'Actionable Logic', 
      value: notes?.reduce((acc, n) => acc + (n.aiActionItems?.length || 0), 0) || 0, 
      icon: Target, 
      trend: 'Real-time Extraction', 
      color: 'emerald' 
    },
  ];

  return (
    <div className="p-12 pb-24 animate-in fade-in duration-1000">
      {/* Intelligence Dashboard Header */}
      <div className="flex items-center justify-between mb-16">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-[10px] font-black text-[#d6a96d] uppercase tracking-[0.4em]">
            <BrainCircuit className="w-4 h-4" />
            Neural Overview
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Workspace <span className="text-[#d6a96d]/60">Analytics</span></h1>
        </div>
        
        <Link href="/notes" className="group flex items-center gap-4 px-8 py-4 bg-[#16181d] border border-white/[0.03] rounded-2xl hover:border-[#d6a96d]/30 transition-all text-sm font-black uppercase tracking-widest text-white shadow-xl">
          <Library className="w-5 h-5 text-[#d6a96d]" />
          Enter Library
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {stats.map((stat, i) => (
          <div key={i} className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${i * 100}ms` }}>
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      {/* Content Section Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Recent Activity Column */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-10 px-4">
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-4">
              Latest Thinking
              <div className="h-px w-20 bg-gradient-to-r from-[#d6a96d]/40 to-transparent" />
            </h2>
            <Link href="/notes" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-[#d6a96d] transition-colors">
              View Complete Archive
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-64 rounded-[2.5rem] bg-[#111315]/40 animate-pulse border border-white/[0.03]" />
              ))}
            </div>
          ) : notes && notes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {notes.slice(0, 4).map((note, i) => (
                <div key={note._id} className="animate-in fade-in slide-in-from-bottom-12 duration-1000" style={{ animationDelay: `${i * 150}ms` }}>
                  <RecentNoteItem note={note} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-[#111315]/20 rounded-[3rem] border border-dashed border-white/[0.05]">
              <div className="w-20 h-20 bg-white/[0.03] rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-white/[0.05]">
                <FileText className="w-10 h-10 text-white/10" />
              </div>
              <h3 className="text-2xl font-black text-white/40 mb-4 tracking-tighter">Your archive is empty.</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/10 max-w-xs mx-auto leading-loose">
                Initialize your first thinking space to begin the synthesis journey.
              </p>
            </div>
          )}
        </div>

        {/* Intelligence Context Column */}
        <div className="lg:col-span-4">
          <div className="sticky top-32">
            <div className="p-10 bg-gradient-to-br from-[#16181d] to-[#0c0d0f] border border-white/[0.03] rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#d6a96d]/[0.03] blur-3xl rounded-full" />
              
              <div className="w-16 h-16 bg-[#d6a96d]/10 rounded-2xl flex items-center justify-center text-[#d6a96d] mb-10 shadow-inner group-hover:scale-110 transition-transform duration-700">
                <BrainCircuit className="w-8 h-8" />
              </div>
              
              <h3 className="text-2xl font-black text-white mb-6 tracking-tighter">Neural Context</h3>
              <p className="text-sm text-white/40 font-medium leading-[1.8] mb-10">
                Our AI engines are currently processing your intellectual entries to identify hidden patterns and provide real-time synthesis.
              </p>
              
              <div className="space-y-4">
                {[
                  { label: 'Neural Processing', status: 'Optimal', color: '#10b981' },
                  { label: 'Knowledge Extraction', status: 'Active', color: '#3b82f6' },
                  { label: 'Semantic Mapping', status: 'Scanning', color: '#d6a96d' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{item.label}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg bg-white/5" style={{ color: item.color }}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
