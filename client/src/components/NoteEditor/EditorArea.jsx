'use client';

import { Tag as TagIcon, Sparkles, Feather, Hash } from 'lucide-react';

export default function EditorArea({
  title,
  setTitle,
  content,
  setContent,
  tags,
  setTags,
  onStatusChange
}) {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar relative">
      {/* Centered Focused Writing Area */}
      <div className="max-w-[850px] mx-auto w-full px-10 py-24 min-h-full flex flex-col animate-in fade-in duration-1000 slide-in-from-bottom-4">
        
        {/* Workspace Metadata Indicator */}
        <div className="flex items-center gap-4 mb-16 opacity-30">
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-[#a7afbd]">
            <Feather className="w-3.5 h-3.5" />
            <span>Focused Writing Mode</span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-[#a7afbd] to-transparent" />
        </div>

        {/* Title Input with Premium Typography */}
        <div className="relative group mb-12">
          <input
            type="text"
            className="w-full text-5xl md:text-6xl font-black bg-transparent border-none focus:outline-none focus:ring-0 mb-6 placeholder-white/20 text-white tracking-tighter leading-[1.1] selection:bg-[#d6a96d]/30"
            placeholder="Name your intellectual entry..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              onStatusChange('Typing...');
            }}
          />
        </div>
        
        {/* Categorization with Glass Effect */}
        <div className="flex items-center gap-4 mb-20 bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] focus-within:border-[#d6a96d]/40 focus-within:bg-white/[0.04] transition-all px-8 py-5 rounded-[2rem] group/tags shadow-xl">
          <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-focus-within/tags:bg-[#d6a96d]/10 group-focus-within/tags:text-[#d6a96d] transition-colors text-[#a7afbd]/20">
            <Hash className="w-4 h-4" />
          </div>
          <input
            type="text"
            className="flex-1 text-xs font-black uppercase tracking-[0.2em] bg-transparent border-none focus:outline-none focus:ring-0 text-[#f3f1ea] placeholder-white/20"
            placeholder="Assign categorical keywords..."
            value={tags}
            onChange={(e) => {
              setTags(e.target.value);
              onStatusChange('Typing...');
            }}
          />
        </div>

        {/* Body Editor with Premium Readability */}
        <div className="relative flex-1">
          <textarea
            className="w-full h-full min-h-[700px] text-[1.2rem] md:text-[1.3rem] bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-[#f3f1ea]/80 leading-[2] placeholder-white/20 font-medium selection:bg-[#d6a96d]/30"
            placeholder="Start drafting your manuscript here..."
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              onStatusChange('Typing...');
            }}
          />
        </div>

        {/* Footer Credit */}
        <div className="mt-20 pt-10 border-t border-white/[0.03] flex items-center justify-between opacity-10">
          <span className="text-[9px] font-black uppercase tracking-widest text-[#a7afbd]">Autosave enabled</span>
          <span className="text-[9px] font-black uppercase tracking-widest text-[#a7afbd]">Drafting Phase</span>
        </div>
      </div>
      
      {/* Editor Side Lighting */}
      <div className="absolute top-1/4 -left-40 w-80 h-[500px] bg-[#d6a96d]/2 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-80 h-[500px] bg-blue-500/[0.02] blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}
