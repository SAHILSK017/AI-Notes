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
    <div className="p-6 md:p-12 pb-24 animate-in fade-in duration-1000">
      {/* Intelligence Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-[10px] font-black text-primary uppercase tracking-[0.4em]">
            <BrainCircuit className="w-4 h-4" />
            Neural Overview
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">Workspace <span className="text-primary/70">Analytics</span></h1>
        </div>
        
        <Link href="/notes" className="group flex items-center justify-center gap-4 px-8 py-4 bg-card border border-border rounded-2xl hover:border-primary/30 transition-all text-sm font-black uppercase tracking-widest text-foreground shadow-sm">
          <Library className="w-5 h-5 text-primary" />
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
            <h2 className="text-xl font-black text-foreground tracking-tight flex items-center gap-4">
              Latest Thinking
              <div className="h-px w-20 bg-gradient-to-r from-primary/40 to-transparent" />
            </h2>
            <Link href="/notes" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/35 hover:text-primary transition-colors">
              View Complete Archive
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-64 rounded-[2.5rem] bg-secondary/40 animate-pulse border border-border" />
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
            <div className="text-center py-24 bg-secondary/20 rounded-[3rem] border border-dashed border-border">
              <div className="w-20 h-20 bg-secondary rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-border">
                <FileText className="w-10 h-10 text-muted-foreground/20" />
              </div>
              <h3 className="text-2xl font-black text-muted-foreground/40 mb-4 tracking-tighter">Your archive is empty.</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/20 max-w-xs mx-auto leading-loose">
                Initialize your first thinking space to begin the synthesis journey.
              </p>
            </div>
          )}
        </div>

        {/* Intelligence Context Column */}
        <div className="lg:col-span-4">
          <div className="sticky top-32">
            <div className="p-10 bg-gradient-to-br from-card to-secondary/30 border border-border rounded-[3rem] shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/[0.03] blur-3xl rounded-full" />
              
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-10 shadow-inner group-hover:scale-110 transition-transform duration-700">
                <BrainCircuit className="w-8 h-8" />
              </div>
              
              <h3 className="text-2xl font-black text-foreground mb-6 tracking-tighter">Neural Context</h3>
              <p className="text-sm text-muted-foreground/60 font-medium leading-[1.8] mb-10">
                Our AI engines are currently processing your intellectual entries to identify hidden patterns and provide real-time synthesis.
              </p>
              
              <div className="space-y-4">
                {[
                  { label: 'Neural Processing', status: 'Optimal', color: '#10b981' },
                  { label: 'Knowledge Extraction', status: 'Active', color: '#3b82f6' },
                  { label: 'Semantic Mapping', status: 'Scanning', color: 'var(--color-primary)' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-secondary/30 border border-border/60 rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/35">{item.label}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg bg-secondary" style={{ color: item.color }}>
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
