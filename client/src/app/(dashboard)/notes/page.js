'use client';

import { useAuth } from '../../../context/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/axios';
import Link from 'next/link';
import { useState } from 'react';
import { BookOpen, FileText, Hash, Plus, Search, Trash2, ChevronRight, Sparkles, LayoutGrid, List, Library, Edit3, Heart } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState('grid');
  const [activeTab, setActiveTab] = useState('all');

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

  const filteredNotes = notes
    ? notes.filter(note => {
        if (activeTab === 'favorites') {
          return note.isFavorite === true;
        }
        if (activeTab === 'shared') {
          return note.isPublic === true;
        }
        return true;
      })
    : [];

  const handleToggleFavorite = async (noteId, currentIsFavorite) => {
    try {
      await api.patch(`/notes/${noteId}`, { isFavorite: !currentIsFavorite });
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['all-notes'] });
      toast.success(currentIsFavorite ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      toast.error('Failed to update favorite status');
    }
  };

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
    <div className="p-6 md:p-12 pb-24 animate-in fade-in duration-1000">
      {/* Archive Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-16">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-[10px] font-black text-primary uppercase tracking-[0.4em]">
            <BookOpen className="w-4 h-4" />
            Intellectual Archive
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">Your <span className="text-primary/70">Library</span></h1>
        </div>
        
        <div className="flex items-center gap-4 flex-wrap w-full xl:w-auto">
          {/* Search bar */}
          <div className="relative group shrink-0 w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Filter archive..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-card border border-border rounded-2xl pl-12 pr-6 py-3.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/45 focus:border-primary/45 transition-all w-full placeholder:text-muted-foreground/30 font-bold shadow-sm"
            />
          </div>

          {/* Tag Filter */}
          <div className="relative shrink-0 w-full sm:w-40">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="bg-card border border-border rounded-2xl pl-6 pr-10 py-3.5 text-sm text-foreground/80 focus:outline-none focus:ring-1 focus:ring-primary/45 focus:border-primary/45 transition-all font-bold shadow-sm appearance-none cursor-pointer w-full"
            >
              <option value="">All Tags</option>
              {allTags.map(t => (
                <option key={t} value={t}>#{t}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/40 text-[10px]">▼</div>
          </div>

          {/* Category Filter */}
          <div className="relative shrink-0 w-full sm:w-44">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-card border border-border rounded-2xl pl-6 pr-10 py-3.5 text-sm text-foreground/80 focus:outline-none focus:ring-1 focus:ring-primary/45 focus:border-primary/45 transition-all font-bold shadow-sm appearance-none cursor-pointer w-full"
            >
              <option value="">All Categories</option>
              {allCategories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/40 text-[10px]">▼</div>
          </div>

          {/* Clear Filters */}
          {(selectedTag || selectedCategory) && (
            <button
              onClick={() => { setSelectedTag(''); setSelectedCategory(''); }}
              className="px-4 py-3.5 bg-secondary border border-border rounded-2xl text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all active:scale-95 shrink-0"
            >
              Reset
            </button>
          )}
          
          <button 
            onClick={handleCreateNote}
            className="flex items-center justify-center gap-3 px-8 py-3.5 bg-primary text-white dark:text-background font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-primary/90 transition-all shadow-lg active:scale-95 shrink-0 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            New Entry
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-10 px-4 py-2 border-b border-border/40">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => setActiveTab('all')}
            className={`text-[10px] font-black uppercase tracking-[0.2em] pb-2 transition-all border-b-2 cursor-pointer ${
              activeTab === 'all' 
                ? 'text-primary border-primary' 
                : 'text-muted-foreground hover:text-foreground border-transparent'
            }`}
          >
            All Entries ({notes?.length || 0})
          </button>
          <button 
            onClick={() => setActiveTab('favorites')}
            className={`text-[10px] font-black uppercase tracking-[0.2em] pb-2 transition-all border-b-2 cursor-pointer ${
              activeTab === 'favorites' 
                ? 'text-primary border-primary' 
                : 'text-muted-foreground hover:text-foreground border-transparent'
            }`}
          >
            Favorites ({notes?.filter(n => n.isFavorite).length || 0})
          </button>
          <button 
            onClick={() => setActiveTab('shared')}
            className={`text-[10px] font-black uppercase tracking-[0.2em] pb-2 transition-all border-b-2 cursor-pointer ${
              activeTab === 'shared' 
                ? 'text-primary border-primary' 
                : 'text-muted-foreground hover:text-foreground border-transparent'
            }`}
          >
            Shared ({notes?.filter(n => n.isPublic).length || 0})
          </button>
        </div>
        
        <div className="flex items-center gap-2 text-muted-foreground/60">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              viewMode === 'grid' 
                ? 'bg-primary/10 border-primary/20 text-primary' 
                : 'bg-transparent border-transparent hover:text-foreground'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              viewMode === 'list' 
                ? 'bg-primary/10 border-primary/20 text-primary' 
                : 'bg-transparent border-transparent hover:text-foreground'
            }`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid/List View Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 rounded-[2.5rem] bg-secondary/40 animate-pulse border border-border" />
          ))}
        </div>
      ) : filteredNotes && filteredNotes.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
            {filteredNotes.map((note) => (
              <div key={note._id} className="group relative h-full">
                {/* Quick Actions Overlay */}
                <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 translate-y-2 group-hover:translate-y-0">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleToggleFavorite(note._id, note.isFavorite);
                    }}
                    className={`p-2.5 bg-card/85 backdrop-blur-md border rounded-xl transition-all shadow-md cursor-pointer ${
                      note.isFavorite 
                        ? 'text-rose-500 border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10' 
                        : 'text-foreground border-border hover:bg-secondary hover:text-primary'
                    }`}
                    title={note.isFavorite ? 'Unfavorite' : 'Favorite'}
                  >
                    <Heart className={`w-4 h-4 ${note.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      router.push(`/notes/${note._id}`);
                    }}
                    className="p-2.5 bg-card/85 backdrop-blur-md border border-border rounded-xl text-foreground hover:bg-primary hover:text-white dark:hover:text-background transition-all shadow-md cursor-pointer"
                    title="Open Editor"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setDeleteModal({ isOpen: true, noteId: note._id });
                    }}
                    className="p-2.5 bg-card/85 backdrop-blur-md border border-border rounded-xl text-foreground hover:bg-destructive hover:text-white hover:border-destructive transition-all shadow-md cursor-pointer"
                    title="Archive Thought"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <Link href={`/notes/${note._id}`} className="block h-full">
                  <div className="h-full p-8 bg-card/65 backdrop-blur-sm border border-border rounded-[2.5rem] hover:bg-card hover:border-primary/30 transition-all duration-500 shadow-sm hover:-translate-y-0.5 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/[0.02] blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex flex-col h-full relative z-10">
                      <div className="flex items-start justify-between mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary/70 group-hover:text-primary group-hover:bg-primary/10 transition-all duration-500">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-2">
                          {note.isFavorite && (
                            <Heart className="w-4 h-4 text-rose-500 fill-current animate-in zoom-in-75" />
                          )}
                          {note.aiSummary && (
                            <div className="flex items-center gap-2">
                              <span className="text-[8px] font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Augmented</span>
                              <Sparkles className="w-4 h-4 text-primary shadow-[0_0_10px_color-mix(in_srgb,var(--color-primary)_50%,transparent)]" />
                            </div>
                          )}
                        </div>
                      </div>

                      <h3 className="text-xl font-black text-foreground/90 mb-4 tracking-tighter leading-tight group-hover:text-primary transition-colors">
                        {note.title || 'Untitled Entry'}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground/80 line-clamp-3 mb-10 font-medium leading-relaxed group-hover:text-muted-foreground/95 transition-colors">
                        {note.content || 'Start drafting your intellectual legacy...'}
                      </p>

                      <div className="mt-auto flex items-center justify-between pt-6 border-t border-border/40">
                        <div className="flex flex-col gap-2.5">
                          {/* Category Badge */}
                          {note.category && note.category !== 'Uncategorized' && (
                            <span className="text-[9px] font-black uppercase tracking-[0.15em] text-primary flex items-center gap-1.5 bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20 self-start">
                              <Sparkles className="w-2.5 h-2.5 text-primary" />
                              {note.category}
                            </span>
                          )}
                          
                          {/* Tags */}
                          <div className="flex gap-2">
                            {note.tags && note.tags.length > 0 ? (
                              note.tags.slice(0, 2).map((tag, i) => (
                                <span key={i} className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/75 flex items-center gap-1 group-hover:text-primary/60 transition-colors">
                                  <Hash className="w-2.5 h-2.5" />
                                  {tag}
                                </span>
                              ))
                            ) : (
                              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 group-hover:text-muted-foreground/80 transition-colors">Draft Phase</span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-500">
            {filteredNotes.map((note) => (
              <div key={note._id} className="group relative">
                <Link href={`/notes/${note._id}`} className="block">
                  <div className="p-6 bg-card/65 backdrop-blur-sm border border-border rounded-3xl hover:bg-card hover:border-primary/30 transition-all duration-500 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                    
                    {/* Left Side: Icon & Title info */}
                    <div className="flex items-center gap-5 min-w-0 flex-1">
                      <div className="w-12 h-12 rounded-2xl bg-secondary shrink-0 flex items-center justify-center text-primary/70 group-hover:text-primary group-hover:bg-primary/10 transition-all duration-500">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                          <h3 className="text-lg font-black text-foreground/90 tracking-tighter leading-tight group-hover:text-primary transition-colors truncate">
                            {note.title || 'Untitled Entry'}
                          </h3>
                          {note.isFavorite && (
                            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current shrink-0 animate-in zoom-in-75" />
                          )}
                          {note.aiSummary && (
                            <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground/80 line-clamp-1 font-medium">
                          {note.content || 'Start drafting your intellectual legacy...'}
                        </p>
                      </div>
                    </div>

                    {/* Middle/Right Side: Metadata, Tags & Actions */}
                    <div className="flex items-center gap-6 shrink-0 justify-between md:justify-end">
                      {/* Category & Tags */}
                      <div className="flex flex-col items-start md:items-end gap-1.5">
                        {note.category && note.category !== 'Uncategorized' && (
                          <span className="text-[8px] font-black uppercase tracking-[0.15em] text-primary bg-primary/10 px-2.5 py-0.5 rounded-md border border-primary/20">
                            {note.category}
                          </span>
                        )}
                        {note.tags && note.tags.length > 0 && (
                          <div className="flex gap-1.5">
                            {note.tags.slice(0, 2).map((tag, idx) => (
                              <span key={idx} className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/75 flex items-center gap-0.5">
                                <Hash className="w-2 h-2" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Actions Panel */}
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleToggleFavorite(note._id, note.isFavorite);
                          }}
                          className={`p-2 bg-secondary border rounded-xl transition-all cursor-pointer ${
                            note.isFavorite 
                              ? 'text-rose-500 border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10' 
                              : 'border-border text-foreground hover:border-primary hover:text-primary'
                          }`}
                          title={note.isFavorite ? 'Unfavorite' : 'Favorite'}
                        >
                          <Heart className={`w-3.5 h-3.5 ${note.isFavorite ? 'fill-current' : ''}`} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            router.push(`/notes/${note._id}`);
                          }}
                          className="p-2 bg-secondary border border-border rounded-xl text-foreground hover:border-primary hover:text-primary transition-all cursor-pointer"
                          title="Open Editor"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDeleteModal({ isOpen: true, noteId: note._id });
                          }}
                          className="p-2 bg-secondary border border-border rounded-xl text-foreground hover:border-destructive hover:text-destructive transition-all cursor-pointer"
                          title="Archive Thought"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                </Link>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-40 bg-secondary/15 rounded-[3rem] border border-dashed border-border/80 animate-in fade-in duration-500">
          <div className="w-24 h-24 bg-secondary flex items-center justify-center mx-auto mb-10 border border-border rounded-3xl">
            <Library className="w-10 h-10 text-muted-foreground/65" />
          </div>
          <h3 className="text-3xl font-black text-muted-foreground/75 mb-6 tracking-tighter">
            {activeTab === 'favorites' ? 'No favorite thoughts yet.' : activeTab === 'shared' ? 'No shared thoughts yet.' : 'Library is empty.'}
          </h3>
          <button onClick={handleCreateNote} className="px-10 py-4 bg-secondary text-foreground font-black text-xs uppercase tracking-widest rounded-2xl border border-border hover:border-primary/30 transition-all cursor-pointer">
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
