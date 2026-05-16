'use client';

import { AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title = "Archive Thought", message = "Are you sure you want to discard this intellectual entry? This process is irreversible.", isLoading = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f1115]/90 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="bg-[#16181d] w-full max-w-md rounded-[2.5rem] border border-[#2d3139] shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-10">
          <div className="flex items-center justify-between mb-8">
            <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive border border-destructive/20 shadow-inner">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <button 
              onClick={onClose}
              className="p-2.5 hover:bg-[#1b1f27] rounded-xl text-[#a7afbd]/40 hover:text-white transition-all border border-transparent hover:border-[#2d3139]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{title}</h3>
          <p className="text-[#a7afbd]/60 font-medium leading-relaxed">{message}</p>
        </div>
        
        <div className="p-8 bg-[#0f1115]/50 flex gap-4 border-t border-[#2d3139]/30">
          <button
            onClick={onClose}
            className="flex-1 py-4 px-6 rounded-2xl font-bold text-xs uppercase tracking-widest text-[#a7afbd] bg-[#1b1f27] border border-[#2d3139] hover:bg-[#232832] hover:text-white transition-all active:scale-95"
          >
            Preserve entry
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-4 px-6 rounded-2xl font-bold text-xs uppercase tracking-widest text-white bg-destructive hover:bg-destructive/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-destructive/10 active:scale-95"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : null}
            Discard
          </button>
        </div>
      </div>
    </div>
  );
}
