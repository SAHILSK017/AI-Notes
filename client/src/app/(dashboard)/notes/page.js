'use client';

import { useAuth } from '../../../context/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/axios';
import Link from 'next/link';
import { useState } from 'react';
import { BookOpen, FileText, Hash, Plus, Search, Trash2, ChevronRight, Sparkles, LayoutGrid, List, Library, Edit3 } from 'lucide-react';
import { useDebounce } from '../../../lib/hooks';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import DeleteConfirmModal from '../../../components/DeleteConfirmModal';

export default function NotesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, noteId: null });

  // Query to fetch filtered notes based on search term, tag, and category
  const { data: notes, isLoading } = useQuery({
    queryKey: ['notes', debouncedSearch, selectedTag, selectedCategory],
    queryFn: async () => {
      let url = `/notes?search=${debouncedSearch}`;
      if (selectedTag) url += `&tag=${selectedTag}`;
      if (selectedCategory) url += `&category=${selectedCategory}`;
      const res = await api.get(url);
      return res.data.data;
    },
    enabled: !!user
  });

  // Query to fetch all notes to extract all unique tags and categories for filters
  const { data: allNotes } = useQuery({
    queryKey: ['all-notes'],
    queryFn: async () => {
      const res = await api.get('/notes');
      return res.data.data;
    },
    enabled: !!user
  });

  const allTags = allNotes ? Array.from(new Set(allNotes.flatMap(note => note.tags || []))) : [];
  const allCategories = allNotes 
    ? Array.from(new Set(allNotes.map(note => note.category).filter(cat => cat && cat !== 'Uncategorized'))) 
    : [];

  const handleCreateNote = async () => {
    try {
      const res = await api.post('/notes', { title: 'Untitled Note', content: '' });
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      router.push(`/notes/${res.data.data._id}`);
      toast.success('New workspace initialized');
    } catch (error) {
      toast.error('Failed to create note');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/notes/${deleteModal.noteId}`);
      toast.success('Thought archived successfully');
      setDeleteModal({ isOpen: false, noteId: null });
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    } catch (error) {
      toast.error('Failed to archive thought');
    }
  };

  return (
    <div className="p-12 pb-24 animate-in fade-in duration-1000">
      {/* Archive Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-[10px] font-black text-[#d6a96d] uppercase tracking-[0.4em]">
            <BookOpen className="w-4 h-4" />
            Intellectual Archive
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Your <span className="text-[#d6a96d]/60">Library</span></h1>
        </div>
        
        <div className="flex items-center gap-4 flex-wrap">
          {/* Search bar */}
          <div className="relative group shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#d6a96d] transition-colors" />
            <input 
              type="text" 
              placeholder="Filter archive..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#111315] border border-white/[0.05] rounded-2xl pl-12 pr-6 py-3.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#d6a96d]/40 focus:border-[#d6a96d]/40 transition-all w-72 placeholder:text-white/10 font-bold shadow-lg"
            />
          </div>

          {/* Tag Filter */}
          <div className="relative shrink-0">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="bg-[#111315] border border-white/[0.05] rounded-2xl pl-6 pr-10 py-3.5 text-sm text-white/70 focus:outline-none focus:ring-1 focus:ring-[#d6a96d]/40 focus:border-[#d6a96d]/40 transition-all font-bold shadow-lg appearance-none cursor-pointer w-40"
            >
              <option value="">All Tags</option>
              {allTags.map(t => (
                <option key={t} value={t}>#{t}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30 text-[10px]">▼</div>
          </div>

          {/* Category Filter */}
          <div className="relative shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#111315] border border-white/[0.05] rounded-2xl pl-6 pr-10 py-3.5 text-sm text-white/70 focus:outline-none focus:ring-1 focus:ring-[#d6a96d]/40 focus:border-[#d6a96d]/40 transition-all font-bold shadow-lg appearance-none cursor-pointer w-44"
            >
              <option value="">All Categories</option>
              {allCategories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30 text-[10px]">▼</div>
          </div>

          {/* Clear Filters */}
          {(selectedTag || selectedCategory) && (
            <button
              onClick={() => { setSelectedTag(''); setSelectedCategory(''); }}
              className="px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/10 transition-all active:scale-95 shrink-0"
            >
              Reset
            </button>
          )}
          
          <button 
            onClick={handleCreateNote}
            className="flex items-center gap-3 px-8 py-3.5 bg-[#d6a96d] text-[#111315] font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-[#e5b97d] transition-all shadow-xl hover:-translate-y-0.5 active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            New Entry
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-10 px-4 py-2 border-b border-white/[0.03]">
        <div className="flex items-center gap-8">
          <button className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d6a96d] border-b-2 border-[#d6a96d] pb-2">
            All Entries ({notes?.length || 0})
          </button>
          <button className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors pb-2">
            Favorites
          </button>
          <button className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors pb-2">
            Shared
          </button>
        </div>
        
        <div className="flex items-center gap-4 text-white/20">
          <button className="p-2 hover:text-white transition-colors">
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button className="p-2 hover:text-white transition-colors">
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 rounded-[2.5rem] bg-[#111315]/40 animate-pulse border border-white/[0.03]" />
          ))}
        </div>
      ) : notes && notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {notes.map((note) => (
            <div key={note._id} className="group relative h-full">
              {/* Quick Actions Overlay */}
              <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 translate-y-2 group-hover:translate-y-0">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/notes/${note._id}`);
                  }}
                  className="p-2.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl text-white hover:bg-[#d6a96d] hover:text-[#111315] hover:border-[#d6a96d] transition-all shadow-xl"
                  title="Open Editor"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteModal({ isOpen: true, noteId: note._id });
                  }}
                  className="p-2.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl text-white hover:bg-destructive hover:border-destructive transition-all shadow-xl"
                  title="Archive Thought"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <Link href={`/notes/${note._id}`} className="block h-full">
                <div className="h-full p-8 bg-[#111315]/40 backdrop-blur-sm border border-white/[0.03] rounded-[2.5rem] hover:bg-white/[0.04] hover:border-[#d6a96d]/30 transition-all duration-500 shadow-xl group-hover:-translate-y-1 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#d6a96d]/[0.02] blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex flex-col h-full relative z-10">
                    <div className="flex items-start justify-between mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center text-[#d6a96d]/60 group-hover:text-[#d6a96d] group-hover:bg-[#d6a96d]/10 transition-all duration-500">
                        <FileText className="w-5 h-5" />
                      </div>
                      {note.aiSummary && (
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-black text-[#d6a96d] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Augmented</span>
                          <Sparkles className="w-4 h-4 text-[#d6a96d] shadow-[0_0_10px_#d6a96d]" />
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-black text-white/90 mb-4 tracking-tighter leading-tight group-hover:text-[#d6a96d] transition-colors">
                      {note.title || 'Untitled Entry'}
                    </h3>
                    
                    <p className="text-sm text-white/30 line-clamp-3 mb-10 font-medium leading-relaxed group-hover:text-white/60 transition-colors">
                      {note.content || 'Start drafting your intellectual legacy...'}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/[0.03]">
                      <div className="flex flex-col gap-2.5">
                        {/* Category Badge */}
                        {note.category && note.category !== 'Uncategorized' && (
                          <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[#d6a96d] flex items-center gap-1.5 bg-[#d6a96d]/10 px-2.5 py-1 rounded-lg border border-[#d6a96d]/20 self-start">
                            <Sparkles className="w-2.5 h-2.5 text-[#d6a96d]" />
                            {note.category}
                          </span>
                        )}
                        
                        {/* Tags */}
                        <div className="flex gap-2">
                          {note.tags && note.tags.length > 0 ? (
                            note.tags.slice(0, 2).map((tag, i) => (
                              <span key={i} className="text-[9px] font-black uppercase tracking-widest text-white/20 flex items-center gap-1 group-hover:text-[#d6a96d]/40 transition-colors">
                                <Hash className="w-2.5 h-2.5" />
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/10 group-hover:text-white/20 transition-colors">Draft Phase</span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-[#d6a96d] group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-40 bg-[#111315]/20 rounded-[3rem] border border-dashed border-white/[0.05]">
          <div className="w-24 h-24 bg-white/[0.03] rounded-3xl flex items-center justify-center mx-auto mb-10 border border-white/[0.05]">
            <Library className="w-10 h-10 text-white/20" />
          </div>
          <h3 className="text-3xl font-black text-white/40 mb-6 tracking-tighter">Library is empty.</h3>
          <button onClick={handleCreateNote} className="px-10 py-4 bg-[#1b1f27] text-white font-black text-xs uppercase tracking-widest rounded-2xl border border-[#2d3139] hover:border-[#d6a96d]/30 transition-all">
            Begin First Entry
          </button>
        </div>
      )}

      <DeleteConfirmModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, noteId: null })}
        onConfirm={handleDelete}
        isLoading={false}
      />
    </div>
  );
}
