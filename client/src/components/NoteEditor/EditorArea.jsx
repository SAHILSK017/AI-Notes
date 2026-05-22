'use client';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Sparkles, Feather, Hash, Loader2, ListChecks } from 'lucide-react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

export default function EditorArea({
  title,
  setTitle,
  content,
  setContent,
  tags,
  setTags,
  onStatusChange,
  noteId,
  autoSuggestEnabled = true,
  isAiGenerating = false,
  activeAiAction = null,
  isLiveTaskEnabled = false,
  onLiveTaskCommit,
  actionItems = [],
  checkedItems = {},
  onToggleCheck
}) {
  const editorScrollRef = useRef(null);
  const textareaRef = useRef(null);
  const [selectedText, setSelectedText] = useState('');
  const [selectionRange, setSelectionRange] = useState({ start: 0, end: 0 });
  const [showAiBar, setShowAiBar] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [activeSelectionAction, setActiveSelectionAction] = useState('');

  const [suggestion, setSuggestion] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);

  const normalizeSuggestion = (value) => {
    if (!value) return null;
    if (typeof value === 'string') {
      return { insight: value.trim(), why: '', actions: ['Expand', 'Challenge', 'Architecture'] };
    }

    const insight = value.insight || value.suggestion || '';
    return {
      insight: insight.trim(),
      why: (value.why || '').trim(),
      actions: Array.isArray(value.actions) && value.actions.length
        ? value.actions.slice(0, 3)
        : ['Expand', 'Challenge', 'Architecture']
    };
  };

  const formatSuggestionForNote = (nextSuggestion = suggestion) => {
    const lines = [
      `Insight: ${nextSuggestion.insight}`,
      nextSuggestion.why ? `Why: ${nextSuggestion.why}` : '',
    ].filter(Boolean);

    return lines.join('\n');
  };

  const handleSuggestionAction = (action) => {
    const actionPrompts = {
      Expand: `\n\nNext: expand "${suggestion.insight}" into a 3-step execution plan.`,
      Challenge: `\n\nChallenge: identify the riskiest assumption behind "${suggestion.insight}".`,
      Architecture: `\n\nArchitecture: sketch the core data model and MERN components for "${suggestion.insight}".`,
    };

    setContent(prev => prev + (actionPrompts[action] || `\n\n${action}: ${suggestion.insight}`));
    setSuggestion('');
    setShowSuggestion(false);
    onStatusChange('Typing...');
    toast.success(`${action} prompt added`);
  };

  const handleSelect = (e) => {
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;
    if (start !== end) {
      const selected = e.target.value.substring(start, end);
      setSelectedText(selected);
      setSelectionRange({ start, end });
      setShowAiBar(true);
    } else {
      // Only hide if we aren't currently generating or showing a result
      if (!isGenerating && !showPreview) {
        setShowAiBar(false);
      }
    }
  };

  const handleSelectionAi = async (action) => {
    if (!selectedText.trim()) return;
    setIsGenerating(true);
    setActiveSelectionAction(action);
    setShowPreview(false);
    
    try {
      const res = await api.post(`/notes/${noteId}/ai`, {
        action,
        text: selectedText
      });
      
      const resData = res.data.data;
      const textResult = action === 'summary' ? resData.summary : resData.text;
      
      if (textResult) {
        setAiResult(textResult);
        setShowPreview(true);
        toast.success('AI selection processing complete!');
      } else {
        toast.error('AI returned an empty response.');
      }
    } catch (error) {
      const serverMsg = error?.response?.data?.message;
      toast.error(serverMsg || 'Failed to analyze selection');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReplaceSelection = () => {
    const newContent = 
      content.substring(0, selectionRange.start) + 
      aiResult + 
      content.substring(selectionRange.end);
    
    setContent(newContent);
    onStatusChange('Typing...');
    clearSelection();
    toast.success('Selection replaced');
  };

  const handleInsertBelow = () => {
    const newContent = 
      content.substring(0, selectionRange.end) + 
      '\n\n' + 
      aiResult + 
      content.substring(selectionRange.end);
    
    setContent(newContent);
    onStatusChange('Typing...');
    clearSelection();
    toast.success('AI response inserted below');
  };

  const clearSelection = () => {
    setSelectedText('');
    setSelectionRange({ start: 0, end: 0 });
    setShowAiBar(false);
    setShowPreview(false);
    setAiResult('');
    setActiveSelectionAction('');
  };

  useEffect(() => {
    if (!autoSuggestEnabled || !content || content.trim().length < 15) {
      const clearTimer = setTimeout(() => {
        setSuggestion('');
        setShowSuggestion(false);
      }, 0);
      return () => clearTimeout(clearTimer);
    }

    const timer = setTimeout(async () => {
      setIsSuggesting(true);
      try {
        const res = await api.post(`/notes/${noteId}/ai`, {
          action: 'auto_suggest',
          text: content.trim()
        });
        
        const nextSuggestion = normalizeSuggestion(res.data?.data);
        if (nextSuggestion?.insight) {
          setSuggestion(nextSuggestion);
          setShowSuggestion(true);
        }
      } catch (err) {
        console.warn('Live suggest skipped:', err);
      } finally {
        setIsSuggesting(false);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [autoSuggestEnabled, content, noteId]);

  useLayoutEffect(() => {
    if (!textareaRef.current) return;
    const scroller = editorScrollRef.current;
    const previousScrollTop = scroller?.scrollTop ?? 0;

    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;

    if (scroller && document.activeElement === textareaRef.current) {
      scroller.scrollTop = previousScrollTop;
    }
  }, [content]);

  return (
    <div ref={editorScrollRef} className="flex-1 overflow-y-auto custom-scrollbar relative [overflow-anchor:none]">
      {/* Centered Focused Writing Area */}
      <div className="max-w-[800px] mx-auto w-full px-8 py-12 min-h-full flex flex-col animate-in fade-in duration-1000 slide-in-from-bottom-4">
        
        {/* Workspace Metadata Indicator */}
        <div className="flex items-center gap-4 mb-8 opacity-70">
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground">
            <Feather className="w-3.5 h-3.5" />
            <span>Focused Writing Mode</span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-muted-foreground to-transparent" />
        </div>

        {/* Title Input with Premium Typography */}
        <div className="relative group mb-6">
          <input
            type="text"
            className="w-full text-5xl md:text-6xl font-black bg-transparent border-none focus:outline-none focus:ring-0 mb-4 placeholder-foreground/20 text-foreground tracking-tighter leading-[1.1] selection:bg-primary/30"
            placeholder="Name your intellectual entry..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              onStatusChange('Typing...');
            }}
          />
        </div>
        
        {/* Categorization with Glass Effect */}
        <div className="flex items-center gap-4 mb-10 bg-card border border-border focus-within:border-primary/40 focus-within:bg-secondary/40 transition-all px-6 py-3.5 rounded-2xl group/tags shadow-xl">
          <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center group-focus-within/tags:bg-primary/10 group-focus-within/tags:text-primary transition-colors text-muted-foreground/30">
            <Hash className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            className="flex-1 text-[11px] font-black uppercase tracking-[0.2em] bg-transparent border-none focus:outline-none focus:ring-0 text-foreground placeholder-foreground/20"
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
            ref={textareaRef}
            className="w-full min-h-[160px] overflow-hidden text-[1.2rem] md:text-[1.3rem] bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-foreground/85 leading-[1.8] placeholder-foreground/20 font-medium selection:bg-primary/30"
            placeholder="Start drafting your manuscript here..."
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              onStatusChange('Typing...');
            }}
            onKeyUp={(e) => {
              if (e.key === 'Enter' && isLiveTaskEnabled) {
                onLiveTaskCommit?.(e.currentTarget.value);
              }
            }}
            onSelect={handleSelect}
          />

          {/* Live Suggestion Card */}
          {showSuggestion && suggestion?.insight && (
            <div className="mt-3 ml-auto w-full max-w-[560px] p-4 rounded-lg bg-primary/5 border border-primary/20 backdrop-blur-md flex flex-col gap-4 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-wider text-primary mb-1">
                  <Sparkles className="w-3.5 h-3.5" /> AI Live Suggestion
                </div>
                <div className="space-y-2 text-xs text-foreground/85 font-medium">
                  <p><span className="font-black text-foreground">Insight:</span> {suggestion.insight}</p>
                  {suggestion.why && (
                    <p><span className="font-black text-foreground">Why:</span> {suggestion.why}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {suggestion.actions.map((action) => (
                    <button
                      key={action}
                      onClick={() => handleSuggestionAction(action)}
                      className="px-2.5 py-1.5 bg-background/70 hover:bg-secondary text-foreground text-[10px] font-black uppercase tracking-wider rounded-md transition-all border border-border"
                    >
                      {action}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <button
                    onClick={() => {
                      setContent(prev => {
                        const spacer = prev.endsWith('\n') ? '\n' : '\n\n';
                        return prev + spacer + formatSuggestionForNote();
                      });
                      setSuggestion('');
                      setShowSuggestion(false);
                      onStatusChange('Typing...');
                      toast.success('Suggestion accepted');
                    }}
                    className="px-3 py-1.5 bg-primary hover:bg-primary/80 text-background dark:text-foreground text-[10px] font-black uppercase tracking-wider rounded-md transition-all active:scale-95 shadow-md"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => {
                      setSuggestion('');
                      setShowSuggestion(false);
                    }}
                    className="px-2.5 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground text-[10px] font-black uppercase tracking-wider rounded-md transition-all border border-border"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {isAiGenerating && activeAiAction === 'action_items' && (
          <section className="mt-8 rounded-lg border border-emerald-500/25 bg-emerald-500/[0.035] px-6 py-5 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2.5 mb-4">
              <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
              <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-foreground">
                {isLiveTaskEnabled ? 'Refreshing Tasks' : 'Generating Tasks'}
              </h3>
            </div>
            <div className="space-y-3">
              {[0, 1, 2].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-md border-2 border-emerald-500/25 bg-background" />
                  <div className="h-4 rounded-full bg-emerald-500/15 animate-pulse" style={{ width: `${72 - item * 12}%` }} />
                </div>
              ))}
            </div>
          </section>
        )}

        {!isAiGenerating && (isLiveTaskEnabled || (actionItems && actionItems.length > 0)) && (
          <section className="mt-8 rounded-lg border border-emerald-500/30 bg-emerald-500/[0.04] px-6 py-5 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between gap-4 mb-5">
              <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-foreground flex items-center gap-2.5">
                <ListChecks className="w-3.5 h-3.5 text-emerald-500" />
                {isLiveTaskEnabled ? 'Live Tasks' : 'Tasks'}
              </h3>
              {isLiveTaskEnabled && (
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1">
                  Enter updates
                </span>
              )}
              <span className="text-[9px] text-foreground font-black bg-emerald-500/20 px-2.5 py-1 rounded-md shrink-0">
                {actionItems.filter((item, idx) => typeof item === 'string' ? !!checkedItems[idx] : !!item.completed).length} / {actionItems.length}
              </span>
            </div>
            {actionItems.length > 0 ? (
              <ul className="space-y-3">
                {actionItems.map((item, i) => {
                  const text = typeof item === 'string' ? item : item.text;
                  const isChecked = typeof item === 'string' ? !!checkedItems[i] : !!item.completed;
                  return (
                    <li
                      key={`${text}-${i}`}
                      onClick={() => onToggleCheck?.(i)}
                      className="flex gap-3 items-start cursor-pointer group select-none"
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded-md shrink-0 border-2 flex items-center justify-center transition-all duration-200 ${
                        isChecked
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-border group-hover:border-emerald-500/70 bg-background'
                      }`}>
                        {isChecked && (
                          <svg className="w-3 h-3 text-background dark:text-foreground" fill="none" viewBox="0 0 12 12" strokeWidth="3">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm md:text-base font-bold leading-relaxed transition-all duration-200 ${
                        isChecked ? 'line-through text-muted-foreground/50' : 'text-foreground/90'
                      }`}>
                        {text}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm font-bold text-muted-foreground">
                No clear tasks found yet. Keep writing and this will refresh.
              </p>
            )}
          </section>
        )}

        {/* Footer Credit */}
        <div className="mt-12 pt-6 border-t border-border/40 flex items-center justify-between opacity-55">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Autosave enabled</span>
            {autoSuggestEnabled && isSuggesting && (
              <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5 animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" /> Thinking...
              </span>
            )}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Drafting Phase</span>
        </div>
      </div>
      
      {/* Editor Side Lighting */}
      <div className="absolute top-1/4 -left-40 w-80 h-[500px] bg-primary/2 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-80 h-[500px] bg-blue-500/[0.01] blur-[120px] rounded-full pointer-events-none" />

      {/* Floating AI Bar for Highlighted Selection */}
      {showAiBar && selectedText && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur-md border border-primary/30 px-6 py-4 rounded-3xl shadow-2xl z-30 flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary shrink-0">
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Selection AI</span>
          </div>
          <div className="w-px h-6 bg-border shrink-0" />
          <div className="flex gap-1.5 overflow-x-auto max-w-[50vw] sm:max-w-none no-scrollbar">
            <button 
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelectionAi('rewrite')}
              disabled={isGenerating}
              className="px-3 py-1.5 rounded-xl bg-secondary text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white dark:hover:text-background transition-all disabled:opacity-50 shrink-0"
            >
              📝 Rewrite
            </button>
            <button 
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelectionAi('simplify')}
              disabled={isGenerating}
              className="px-3 py-1.5 rounded-xl bg-secondary text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white dark:hover:text-background transition-all disabled:opacity-50 shrink-0"
            >
              💡 Simplify
            </button>
            <button 
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelectionAi('grammar')}
              disabled={isGenerating}
              className="px-3 py-1.5 rounded-xl bg-secondary text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white dark:hover:text-background transition-all disabled:opacity-50 shrink-0"
            >
              ✅ Fix Grammar
            </button>
            <button 
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelectionAi('summary')}
              disabled={isGenerating}
              className="px-3 py-1.5 rounded-xl bg-secondary text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white dark:hover:text-background transition-all disabled:opacity-50 shrink-0"
            >
              🔍 Summarize
            </button>
            <button 
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelectionAi('continue_writing')}
              disabled={isGenerating}
              className="px-3 py-1.5 rounded-xl bg-secondary text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white dark:hover:text-background transition-all disabled:opacity-50 shrink-0"
            >
              ✨ Extend
            </button>
          </div>
          <div className="w-px h-6 bg-border shrink-0" />
          <button 
            onClick={clearSelection}
            className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground shrink-0"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Floating Suggestion Preview Card */}
      {showPreview && aiResult && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 w-[550px] max-w-[90vw] bg-card/95 backdrop-blur-md border border-border p-6 rounded-[2.25rem] shadow-2xl z-30 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              AI Selection Response: {activeSelectionAction.toUpperCase()}
            </span>
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Preview</span>
          </div>
          <div className="max-h-48 overflow-y-auto custom-scrollbar bg-secondary/40 p-5 rounded-2xl border border-border/40 mb-6 text-xs md:text-sm text-foreground leading-relaxed italic">
            {aiResult}
          </div>
          <div className="flex gap-2.5 justify-end">
            <button 
              onClick={handleReplaceSelection}
              className="px-4 py-2.5 rounded-xl bg-primary text-white dark:text-background text-[10px] font-black uppercase tracking-widest hover:bg-primary/95 transition-all shadow-md active:scale-95"
            >
              Replace Highlight
            </button>
            <button 
              onClick={handleInsertBelow}
              className="px-4 py-2.5 rounded-xl bg-secondary text-foreground text-[10px] font-black uppercase tracking-widest hover:bg-secondary/80 transition-all border border-border active:scale-95"
            >
              Insert Below
            </button>
            <button 
              onClick={clearSelection}
              className="px-4 py-2.5 rounded-xl bg-transparent text-muted-foreground hover:text-foreground text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
