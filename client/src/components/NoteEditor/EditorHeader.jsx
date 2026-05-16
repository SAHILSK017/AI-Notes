'use client';

import { CheckCircle2, Trash2, Copy, Share2, Sparkles, ChevronLeft, Lock, Globe, Layers } from 'lucide-react';

export default function EditorHeader({
  onBack,
  onToggleSidebar,
  saveStatus,
  onDelete,
  onShare,
  isPublic,
  isSharing,
  isDeleting
}) {
  const getStatusStyles = () => {
    switch (saveStatus) {
      case 'Saved':
        return 'text-[#4ade80] bg-[#4ade80]/5 border-[#4ade80]/20 shadow-[0_0_15px_rgba(74,222,128,0.1)]';
      case 'Saving...':
        return 'text-[#d6a96d] bg-[#d6a96d]/5 border-[#d6a96d]/20 shadow-[0_0_15px_rgba(214,169,109,0.1)]';
      default:
        return 'text-[#a7afbd]/40 bg-white/5 border-white/5';
    }
  };

  return (
    <header className="h-20 border-b border-white/[0.03] flex items-center justify-between px-10 bg-[#0a0b0d]/40 backdrop-blur-3xl shrink-0 z-10 sticky top-0 shadow-lg">
      <div className="flex items-center gap-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2.5 px-4 py-2 hover:bg-white/5 rounded-xl text-[#a7afbd]/60 hover:text-white transition-all group font-black border border-transparent hover:border-white/5 active:scale-95"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] uppercase tracking-[0.25em]">Back</span>
        </button>
        
        <div className="w-px h-6 bg-white/[0.05]" />
        
        <div className={`flex items-center gap-2.5 text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border transition-all ${getStatusStyles()}`}>
          {saveStatus === 'Saving...' ? (
            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : saveStatus === 'Saved' ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" />
          )}
          {saveStatus}
        </div>

        <div className="w-px h-6 bg-white/[0.05]" />

        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#a7afbd]/30">
          <Layers className="w-3.5 h-3.5" />
          <span>Workspace Alpha</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="flex items-center gap-3 px-5 py-2.5 bg-[#1b1f27] border border-[#3a3f4a] hover:border-[#d6a96d] rounded-xl text-white hover:text-[#d6a96d] transition-all font-black text-[10px] uppercase tracking-widest shadow-lg group active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-[#d6a96d] group-hover:scale-110 transition-transform" />
          Intel Center
        </button>

        <div className="w-px h-6 bg-white/[0.05] mx-1" />

        <button
          onClick={onShare}
          disabled={isSharing}
          className={`flex items-center gap-3 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border shadow-sm active:scale-95 ${
            isPublic 
              ? 'bg-[#d6a96d]/10 text-[#d6a96d] border-[#d6a96d]/20 hover:bg-[#d6a96d]/20' 
              : 'bg-[#1b1f27] text-white border-[#2d3139] hover:bg-[#232832]'
          }`}
        >
          {isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          {isPublic ? 'Copy Public Link' : 'Secure Share'}
        </button>

        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="p-2.5 text-[#a7afbd]/20 hover:bg-destructive/10 hover:text-destructive rounded-xl transition-all border border-transparent hover:border-destructive/10"
          title="Archive Thought"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
