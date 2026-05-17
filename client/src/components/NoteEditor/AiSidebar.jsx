'use client';

import { Loader2, Zap, Sparkles, AlignLeft, ListChecks, BarChart3, Hash, Type, PenTool, CheckSquare, Sparkle, Target, BrainCircuit, Activity } from 'lucide-react';

export default function AiSidebar({
  isGenerating,
  activeAction,
  isOnCooldown,
  cooldownSeconds,
  onAction,
  hasContent,
  summary,
  isTyping,
  actionItems,
  checkedItems,
  onToggleCheck
}) {
  const actions = [
    { id: 'summary', icon: AlignLeft, label: 'Summarize', category: 'extract', color: '#d6a96d' },
    { id: 'action_items', icon: ListChecks, label: 'Tasks', category: 'extract', color: '#10b981' },
    { id: 'insights', icon: BarChart3, label: 'Insights', category: 'extract', color: '#3b82f6' },
    { id: 'tags', icon: Hash, label: 'Auto Tags', category: 'extract', color: '#a7afbd' },
    { id: 'continue_writing', icon: PenTool, label: 'Continue Flow', category: 'write' },
    { id: 'rewrite', icon: Target, label: 'Refine Style', category: 'write' },
    { id: 'grammar', icon: CheckSquare, label: 'Fix Syntax', category: 'write' },
    { id: 'title', icon: Type, label: 'Suggest Title', category: 'write' },
  ];

  const actionLabels = {
    summary: 'Distilling core essence...',
    action_items: 'Extracting actionable logic...',
    insights: 'Identifying latent patterns...',
    tags: 'Categorizing concept...',
    continue_writing: 'Extending neural flow...',
    rewrite: 'Refining delivery...',
    grammar: 'Perfecting syntax...',
    title: 'Suggesting neural title...',
  };

  return (
    <aside className="w-[350px] border-l border-white/[0.05] bg-[#0c0d0f] shrink-0 flex flex-col h-full shadow-[-20px_0_60px_rgba(0,0,0,0.5)] relative z-20">
      {/* Header with improved status */}
      <div className="p-6 border-b border-white/[0.05] bg-gradient-to-br from-white/[0.03] to-transparent">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black flex items-center gap-2.5 text-xs uppercase tracking-[0.25em] text-white">
            <BrainCircuit className="w-4 h-4 text-[#d6a96d]" />
            Intelligence
          </h3>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-white/10 border border-white/10 rounded-full">
            <Activity className="w-2.5 h-2.5 text-[#d6a96d] animate-pulse" />
            <span className="text-[8px] font-black text-white/80 uppercase tracking-widest">Active</span>
          </div>
        </div>
        
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
          {isGenerating && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d6a96d] to-transparent w-full animate-shimmer" 
                 style={{ backgroundSize: '200% 100%' }} />
          )}
          {isOnCooldown && (
            <div className="absolute inset-0 bg-amber-500/40" style={{ width: `${(cooldownSeconds / 5) * 100}%`, transition: 'width 1s linear' }} />
          )}
        </div>
        
        <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mt-3">
          {isGenerating && activeAction ? (
            <span className="text-[#d6a96d] flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              {actionLabels[activeAction]}
            </span>
          ) : isOnCooldown ? (
            <span className="text-amber-500">System Cooling... {cooldownSeconds}s</span>
          ) : (
            'Awaiting neural processing command'
          )}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-6 space-y-6">
          {/* Extraction Matrix */}
          <div>
            <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-3 px-1">Logic Extraction Matrix</h4>
            <div className="grid grid-cols-2 gap-3">
              {actions.filter(a => a.category === 'extract').map(({ id, icon: Icon, label, color }) => (
                <button
                  key={id}
                  onClick={() => onAction(id)}
                  disabled={isGenerating || isOnCooldown || !hasContent}
                  className={`p-3.5 bg-white/[0.04] border rounded-2xl transition-all text-[9px] font-black uppercase tracking-widest flex flex-col items-start gap-2.5 shadow-sm hover:-translate-y-1 group active:scale-95 disabled:opacity-30 disabled:hover:translate-y-0 ${
                    activeAction === id
                      ? 'border-[#d6a96d] text-[#d6a96d] bg-[#d6a96d]/10 shadow-[0_10px_30px_rgba(214,169,109,0.2)]'
                      : 'border-white/[0.08] text-white/70 hover:border-[#d6a96d]/50 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform ${activeAction === id ? 'text-[#d6a96d]' : ''}`}>
                    {activeAction === id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Icon className="w-3.5 h-3.5" style={{ color: activeAction === id ? '#d6a96d' : color, opacity: hasContent ? 1 : 0.4 }} />}
                  </div>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Neural Synthesis */}
          <div>
            <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-3 px-1">Neural Augmentation</h4>
            <div className="space-y-2">
              {actions.filter(a => a.category === 'write').map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => onAction(id)}
                  disabled={isGenerating || isOnCooldown || !hasContent}
                  className={`w-full py-2.5 px-4 bg-white/[0.04] border rounded-xl transition-all text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-between shadow-sm group active:scale-[0.98] disabled:opacity-30 ${
                    activeAction === id
                      ? 'border-[#d6a96d] text-[#d6a96d] bg-[#d6a96d]/10 shadow-[0_10px_30px_rgba(214,169,109,0.2)]'
                      : 'border-white/[0.08] text-white/60 hover:border-[#d6a96d]/50 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {activeAction === id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#d6a96d]" />
                    ) : (
                      <Icon className={`w-3.5 h-3.5 group-hover:text-[#d6a96d] transition-colors ${hasContent ? 'text-[#d6a96d]/60' : 'text-white/20'}`} />
                    )}
                    {label}
                  </span>
                  <Sparkle className={`w-3 h-3 ${activeAction === id ? 'opacity-100 text-[#d6a96d]' : 'opacity-0 group-hover:opacity-40'} transition-opacity`} />
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Result Area with improved contrast */}
          <div className="space-y-4 pt-2">
            {!isGenerating && summary && (
              <div className="bg-white/[0.03] rounded-2xl border border-[#d6a96d]/30 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-700">
                <div className="p-6">
                  <h4 className="font-black text-[9px] uppercase tracking-[0.3em] mb-4 text-[#d6a96d] flex items-center gap-2.5">
                    <AlignLeft className="w-3.5 h-3.5" /> Synthesized Essence
                  </h4>
                  <p className="text-xs text-white leading-relaxed font-bold italic">
                    "{summary}"
                    {isTyping && <span className="inline-block w-1 h-3.5 bg-[#d6a96d] ml-1 animate-pulse align-text-bottom shadow-[0_0_10px_#d6a96d]" />}
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#d6a96d]/60 to-transparent" />
              </div>
            )}

            {!isGenerating && actionItems && actionItems.length > 0 && (
              <div className="bg-white/[0.03] rounded-2xl border border-emerald-500/30 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-700">
                <div className="p-6">
                  <h4 className="font-black text-[9px] uppercase tracking-[0.3em] mb-5 text-white flex items-center gap-2.5">
                    <ListChecks className="w-3.5 h-3.5 text-emerald-500" />
                    Neural Tasks
                    <span className="ml-auto text-[8px] text-white font-black bg-emerald-500/20 px-2 py-0.5 rounded-md">
                      {Object.values(checkedItems).filter(Boolean).length} / {actionItems.length}
                    </span>
                  </h4>
                  <ul className="space-y-4">
                    {actionItems.map((item, i) => (
                      <li
                        key={i}
                        onClick={() => onToggleCheck(i)}
                        className="flex gap-4 items-start cursor-pointer group select-none"
                      >
                        <div className={`mt-0.5 w-5 h-5 rounded-lg shrink-0 border-2 flex items-center justify-center transition-all duration-300 ${
                          checkedItems[i] 
                            ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                            : 'border-white/20 group-hover:border-emerald-500/60 bg-white/5'
                        }`}>
                          {checkedItems[i] && (
                            <svg className="w-3 h-3 text-[#0c0d0f]" fill="none" viewBox="0 0 12 12" strokeWidth="3">
                              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-xs font-bold leading-snug transition-all duration-300 ${
                          checkedItems[i] ? 'line-through text-white/30' : 'text-white group-hover:text-white'
                        }`}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Sidebar Side Light */}
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[#d6a96d]/20 to-transparent" />
    </aside>
  );
}
