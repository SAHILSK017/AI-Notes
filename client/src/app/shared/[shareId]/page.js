'use client';

import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { useParams } from 'next/navigation';
import { FileText, Sparkles, LayoutPanelLeft } from 'lucide-react';

export default function SharedNote() {
  const { shareId } = useParams();

  const { data: note, isLoading, error } = useQuery({
    queryKey: ['sharedNote', shareId],
    queryFn: async () => {
      const res = await api.get(`/shared/${shareId}`);
      return res.data.data;
    },
    retry: false
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md p-8 bg-card rounded-2xl border border-border shadow-lg">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Note Not Found</h1>
          <p className="text-muted-foreground">This note might have been deleted or the link is invalid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="h-16 border-b border-border flex items-center px-6 bg-card shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <FileText className="w-6 h-6" />
          <span>NeuralDesk</span>
          <span className="text-sm font-normal text-muted-foreground ml-4 bg-secondary px-3 py-1 rounded-full">Shared View</span>
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)]">
        <div className="flex-1 overflow-y-auto p-6 md:p-12 max-w-4xl mx-auto w-full">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{note.title}</h1>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-10 pb-6 border-b border-border">
            <span>Last updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
            {note.userId?.name && (
              <>
                <span>•</span>
                <span>Author: {note.userId.name}</span>
              </>
            )}
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {note.content.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>

        {/* AI Sidebar if available */}
        {(note.aiSummary || (note.aiActionItems && note.aiActionItems.length > 0)) && (
          <aside className="hidden lg:flex w-80 border-l border-border bg-card shrink-0 flex-col h-full shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
            <div className="p-5 border-b border-border bg-gradient-to-r from-blue-500/10 to-purple-500/10">
              <h3 className="font-bold flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5 text-primary" />
                AI Insights
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-background/30">
              {note.aiSummary && (
                <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
                  <h4 className="font-bold text-sm mb-2 text-primary">Summary</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{note.aiSummary}</p>
                </div>
              )}

              {note.aiActionItems && note.aiActionItems.length > 0 && (
                <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
                  <h4 className="font-bold text-sm mb-3 text-primary">Action Items</h4>
                  <ul className="space-y-2">
                    {note.aiActionItems.map((item, i) => {
                      const text = typeof item === 'string' ? item : item.text;
                      const isCompleted = typeof item === 'string' ? false : !!item.completed;
                      return (
                        <li key={i} className="text-sm flex gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${isCompleted ? 'bg-muted-foreground/40' : 'bg-primary'}`} />
                          <span className={`leading-relaxed ${isCompleted ? 'line-through text-muted-foreground/50' : 'text-muted-foreground'}`}>{text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
