'use client';

import { AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Archive Thought',
  message = 'Are you sure you want to discard this intellectual entry? This process is irreversible.',
  isLoading = false
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-md animate-in fade-in duration-300">
      <div
        className="bg-card w-full max-w-md rounded-[2.5rem] border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-10">
          <div className="flex items-center justify-between mb-8">
            <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive border border-destructive/20 shadow-inner">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <button
              onClick={onClose}
              className="p-2.5 hover:bg-secondary rounded-xl text-muted-foreground/40 hover:text-foreground transition-all border border-transparent hover:border-border"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 className="text-2xl font-black text-foreground mb-3 tracking-tight">{title}</h3>
          <p className="text-muted-foreground/60 font-medium leading-relaxed">{message}</p>
        </div>

        <div className="p-8 bg-secondary/20 flex gap-4 border-t border-border/30">
          <button
            onClick={onClose}
            className="flex-1 py-4 px-6 rounded-2xl font-bold text-xs uppercase tracking-widest text-muted-foreground bg-secondary border border-border hover:bg-secondary/80 hover:text-foreground transition-all active:scale-95"
          >
            Preserve entry
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-4 px-6 rounded-2xl font-bold text-xs uppercase tracking-widest text-white bg-destructive hover:bg-destructive/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-destructive/10 active:scale-95"
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            Discard
          </button>
        </div>
      </div>
    </div>
  );
}
