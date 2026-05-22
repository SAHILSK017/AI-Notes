'use client';

import { CheckCircle2, Trash2, Copy, Share2, Sparkles, ChevronLeft, Lock, Globe, Layers, RotateCcw } from 'lucide-react';

export default function EditorHeader({
  onBack,
  onToggleSidebar,
  saveStatus,
  onDelete,
  onShare,
  isPublic,
  isSharing,
  isDeleting,
  onUndo,
  canUndo,
  autoSuggestEnabled,
  onToggleAutoSuggest
}) {
  const getStatusStyles = () => {
    switch (saveStatus) {
      case 'Saved':
        return 'text-[#10b981] bg-[#10b981]/5 border-[#10b981]/20 shadow-sm';
      case 'Saving...':
        return 'text-primary bg-primary/5 border-primary/20 shadow-sm';
      default:
        return 'text-muted-foreground/45 bg-secondary border-border';
    }
  };

  return (
    <header className="h-20 border-b border-border/40 flex items-center justify-between px-6 md:px-10 bg-background/60 backdrop-blur-3xl shrink-0 z-10 sticky top-0 shadow-sm">
      <div className="flex items-center gap-4 md:gap-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 hover:bg-secondary rounded-xl text-muted-foreground/90 hover:text-foreground transition-all group font-black border border-transparent hover:border-border active:scale-95"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] uppercase tracking-[0.25em] hidden sm:inline">Back</span>
        </button>
        
        <div className="w-px h-6 bg-border" />
        
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

        <div className="w-px h-6 bg-border hidden sm:block" />

        <div className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/75">
          <Layers className="w-3.5 h-3.5" />
          <span>Workspace Alpha</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3 md:gap-4">
        <button 
          onClick={onToggleSidebar}
          className="flex items-center gap-2 px-4 py-2.5 bg-secondary border border-border hover:border-primary rounded-xl text-foreground hover:text-primary transition-all font-black text-[10px] uppercase tracking-widest shadow-md group active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Intel Center</span>
        </button>

        <button
          onClick={onToggleAutoSuggest}
          aria-pressed={autoSuggestEnabled}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all shadow-sm active:scale-95 ${
            autoSuggestEnabled
              ? 'bg-primary/10 text-primary border-primary/25 hover:bg-primary/15'
              : 'bg-secondary text-muted-foreground border-border hover:text-foreground hover:bg-secondary/80'
          }`}
          title={autoSuggestEnabled ? 'Disable auto suggestions' : 'Enable auto suggestions'}
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden lg:inline">Auto Suggest</span>
          <span className="hidden sm:inline lg:hidden">{autoSuggestEnabled ? 'Suggest On' : 'Suggest Off'}</span>
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        <button
          onClick={onShare}
          disabled={isSharing}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border shadow-sm active:scale-95 ${
            isPublic 
              ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20' 
              : 'bg-secondary text-foreground border-border hover:bg-secondary/80'
          }`}
        >
          {isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          <span className="hidden sm:inline">{isPublic ? 'Copy Public Link' : 'Secure Share'}</span>
          <span className="sm:hidden">{isPublic ? 'Link' : 'Share'}</span>
        </button>

        {onUndo && (
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-2.5 transition-all border border-transparent rounded-xl ${
              canUndo
                ? 'text-amber-500 hover:bg-amber-500/10 hover:border-amber-500/20 active:scale-95'
                : 'text-muted-foreground/35 opacity-40 cursor-not-allowed'
            }`}
            title="Undo last AI insertion"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="p-2.5 text-muted-foreground/80 hover:bg-destructive/10 hover:text-destructive rounded-xl transition-all border border-transparent hover:border-destructive/10 active:scale-95"
          title="Archive Thought"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
