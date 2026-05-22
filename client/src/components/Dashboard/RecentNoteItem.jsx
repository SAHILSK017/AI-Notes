'use client';

import { FileText, Clock, ChevronRight, Hash, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export default function RecentNoteItem({ note }) {
  return (
    <Link href={`/notes/${note._id}`} className="group block">
      <div className="relative p-8 bg-card/65 backdrop-blur-sm border border-border rounded-[2.5rem] hover:bg-card hover:border-primary/30 transition-all duration-500 shadow-sm group-active:scale-[0.98] overflow-hidden">
        {/* Glow Layer */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/[0.02] blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <div className="flex flex-col h-full relative z-10">
          <div className="flex items-start justify-between mb-8">
            <div className="w-12 h-12 rounded-2xl bg-secondary border border-border/40 flex items-center justify-center text-primary/70 group-hover:text-primary group-hover:bg-primary/10 transition-all duration-500 shadow-inner group-hover:rotate-6">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full border border-border/40 group-hover:border-primary/20 transition-all">
              <Clock className="w-3 h-3 text-muted-foreground/75 group-hover:text-primary/60" />
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/75 group-hover:text-foreground/60">
                {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
              </span>
            </div>
          </div>

          <h3 className="text-xl font-black text-foreground/90 mb-3 tracking-tighter leading-tight group-hover:text-primary transition-colors">
            {note.title || 'Untitled Entry'}
          </h3>
          
          <p className="text-sm text-muted-foreground/70 line-clamp-2 mb-8 font-medium leading-relaxed group-hover:text-muted-foreground/90 transition-colors">
            {note.content || 'A silent thought waiting to be synthesized into wisdom...'}
          </p>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {note.tags && note.tags.length > 0 ? (
                note.tags.slice(0, 2).map((tag, i) => (
                  <span key={i} className="flex items-center gap-1.5 px-3 py-1 bg-secondary border border-border/40 rounded-lg text-[9px] font-black uppercase tracking-widest text-muted-foreground/75">
                    <Hash className="w-2.5 h-2.5 text-primary/70" />
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/55 italic">
                  Uncategorized
                </span>
              )}
            </div>
            
            <div className="w-8 h-8 rounded-full bg-secondary border border-border/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0 group-hover:bg-primary/10 group-hover:border-primary/20">
              <ChevronRight className="w-4 h-4 text-primary" />
            </div>
          </div>
        </div>

        {/* Intelligence Badge */}
        {note.aiSummary && (
          <div className="absolute top-8 right-8 w-1.5 h-1.5 rounded-full bg-primary shadow-sm animate-pulse" title="AI Augmented" />
        )}
      </div>
    </Link>
  );
}
