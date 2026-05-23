'use client';

import { useEffect, useState } from 'react';
import { Loader2, Zap, Sparkles, AlignLeft, ListChecks, BarChart3, Hash, Type, PenTool, CheckSquare, Sparkle, Target, BrainCircuit, Activity, X, Send, MessageSquareText, Eye, Lightbulb, AlertTriangle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

export default function AiSidebar({
  isGenerating,
  activeAction,
  isOnCooldown,
  cooldownSeconds,
  onAction,
  hasContent,
  isLiveTaskEnabled,
  insightReport,
  isInsightReportOpen,
  onViewInsightReport,
  onDismissInsightReport,
  summary,
  isTyping,
  thinkPartnerData,
  onInsertThinkPartner,
  onUndoThinkPartner,
  onDismissThinkPartner,
  hasInserted,
  onClose,
  noteId,
  noteContext
}) {
  const [chatInput, setChatInput] = useState('');
  const [width, setWidth] = useState(() => {
    if (typeof window === 'undefined') return 360;

    const savedWidth = localStorage.getItem('aiPanelWidth');
    const parsed = parseInt(savedWidth || '', 10);

    return !isNaN(parsed) && parsed >= 320 && parsed <= 700 ? parsed : 360;
  });
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e) => {
    if (window.innerWidth < 1024) return; // Only allow drag resize on desktop
    e.preventDefault();
    setIsDragging(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none'; // Prevent text selection
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      if (window.innerWidth < 1024) return;

      // Calculate width from the right side of the window
      let newWidth = window.innerWidth - e.clientX;

      // Snap resizing behavior
      if (Math.abs(newWidth - 320) < 15) {
        newWidth = 320;
      } else if (Math.abs(newWidth - 360) < 15) {
        newWidth = 360;
      } else if (Math.abs(newWidth - 700) < 15) {
        newWidth = 700;
      }

      // Handle collapse trigger
      if (newWidth < 240) {
        onClose();
        setIsDragging(false);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        return;
      }

      // Impose boundaries
      if (newWidth < 320) newWidth = 320;
      if (newWidth > 700) newWidth = 700;

      setWidth(newWidth);
      localStorage.setItem('aiPanelWidth', newWidth.toString());
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onClose]);
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'ai',
      text: 'I can think with this note. Ask me to challenge the idea, find the weak spot, or shape it into execution.'
    }
  ]);
  const [isChatting, setIsChatting] = useState(false);
  const [insightLoadingStep, setInsightLoadingStep] = useState(0);

  const actions = [
    { id: 'think_partner', icon: BrainCircuit, label: 'Thinking Partner', category: 'extract', color: '#ec4899' },
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
    think_partner: 'Expanding user thought structure...',
    summary: 'Distilling core essence...',
    action_items: 'Extracting actionable logic...',
    insights: 'Identifying latent patterns...',
    tags: 'Categorizing concept...',
    continue_writing: 'Extending neural flow...',
    rewrite: 'Refining delivery...',
    grammar: 'Perfecting syntax...',
    title: 'Suggesting neural title...',
  };

  const insightLoadingMessages = [
    'Extracting behavioral signals...',
    'Detecting productivity patterns...',
    'Mapping blind spots...',
    'Synthesizing suggestions...'
  ];

  const isInsightLoading = isGenerating && activeAction === 'insights';
  const isInsightMode = isInsightLoading || (isInsightReportOpen && !!insightReport);
  const insightMetrics = [
    { label: 'Category', value: insightReport?.category },
    { label: 'Signal', value: insightReport?.sentiment },
    { label: 'Complexity', value: insightReport?.complexity },
    { label: 'Read', value: insightReport?.readingTime },
  ].filter(item => item.value);

  useEffect(() => {
    if (!isInsightLoading) {
      return undefined;
    }

    const timer = setInterval(() => {
      setInsightLoadingStep(prev => (prev + 1) % insightLoadingMessages.length);
    }, 1300);

    return () => clearInterval(timer);
  }, [isInsightLoading, insightLoadingMessages.length]);

  const buildChatContext = (message) => {
    const recentMessages = chatMessages.slice(-6).map(item => `${item.role === 'user' ? 'User' : 'AI'}: ${item.text}`).join('\n');

    return [
      `Current note title: ${noteContext?.title || 'Untitled'}`,
      `Current note tags: ${noteContext?.tags || 'None'}`,
      `Current note content:\n${noteContext?.content || 'No note content yet.'}`,
      `Recent chat:\n${recentMessages || 'No previous chat.'}`,
      `User asks:\n${message}`
    ].join('\n\n---\n\n');
  };

  const sendChatMessage = async () => {
    const message = chatInput.trim();
    if (!message || isChatting) return;

    const userMessage = { role: 'user', text: message };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatting(true);

    try {
      const res = await api.post(`/notes/${noteId}/ai`, {
        action: 'ai_chat',
        text: buildChatContext(message)
      });

      const data = res.data?.data;
      const reply = data?.reply || 'I need a little more context before I can give you a useful answer.';
      const followUps = Array.isArray(data?.followUps) ? data.followUps.slice(0, 2) : [];

      setChatMessages(prev => [
        ...prev,
        {
          role: 'ai',
          text: reply,
          followUps
        }
      ]);
    } catch (error) {
      const serverMsg = error?.response?.data?.message;
      toast.error(serverMsg || 'AI chat failed');
      setChatMessages(prev => prev.filter(item => item !== userMessage));
    } finally {
      setIsChatting(false);
    }
  };

  return (
    <>
      {isDragging && (
        <div 
          className="fixed inset-0 z-[9999] cursor-col-resize select-none"
          style={{ cursor: 'col-resize' }}
        />
      )}
      <aside 
        style={{
          width: `${width}px`,
          transition: isDragging ? 'none' : 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        className="border-l border-border bg-card shrink-0 flex flex-col h-full shadow-2xl animate-in slide-in-from-right ai-panel-desktop ai-panel-tablet ai-panel-mobile"
      >
        {/* Premium Resize Handle */}
        <div 
          onMouseDown={handleMouseDown}
          className={`resize-handle ${isDragging ? 'resize-handle-active' : ''}`}
        >
          <div className="resize-handle-line" />
        </div>
      {/* Header with improved status */}
      <div className="p-6 border-b border-border bg-gradient-to-br from-secondary/20 to-transparent">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black flex items-center gap-2.5 text-sm uppercase tracking-[0.25em] text-foreground">
            <BrainCircuit className="w-4 h-4 text-primary" />
            Intelligence
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-secondary border border-border rounded-full">
              <Activity className="w-2.5 h-2.5 text-primary animate-pulse" />
              <span className="text-[9px] font-black text-foreground/80 uppercase tracking-widest">Active</span>
            </div>
            {onClose && (
              <button 
                onClick={onClose}
                className="md:hidden p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden relative">
          {isGenerating && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent w-full animate-shimmer" 
                 style={{ backgroundSize: '200% 100%' }} />
          )}
          {isOnCooldown && (
            <div className="absolute inset-0 bg-amber-500/40" style={{ width: `${(cooldownSeconds / 5) * 100}%`, transition: 'width 1s linear' }} />
          )}
        </div>
        
        <p className="text-[10px] font-black text-muted-foreground/80 uppercase tracking-[0.2em] mt-3">
          {isGenerating && activeAction ? (
            <span className="text-primary flex items-center gap-2">
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
          {isInsightMode ? (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-300">
              <div className="rounded-lg border border-blue-500/35 bg-blue-500/[0.04] p-5 shadow-[0_0_0_1px_rgba(59,130,246,0.08),0_18px_42px_rgba(59,130,246,0.12)]">
                <div className="mb-4">
                  <button
                    onClick={onDismissInsightReport}
                    className="mb-4 inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-border bg-card text-[9px] font-black uppercase tracking-widest text-foreground/70 hover:text-foreground hover:border-blue-500/35 active:scale-95 transition-all"
                    title="Back to AI tools"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back
                  </button>
                  <div className="flex items-center justify-between gap-3">
                  <h4 className="font-black text-[11px] uppercase tracking-[0.3em] text-blue-500 flex items-center gap-2.5">
                    <BarChart3 className="w-4 h-4" />
                    Insight Report
                  </h4>
                  <button
                    onClick={() => onAction('insights')}
                    disabled={isGenerating || isOnCooldown || !hasContent}
                    className="px-2.5 py-1 rounded-md border border-blue-500/30 bg-blue-500/10 text-[9px] font-black uppercase tracking-widest text-blue-500 disabled:opacity-40 active:scale-95 transition-all"
                  >
                    Refresh
                  </button>
                  </div>
                </div>

                {isInsightLoading ? (
                  <div className="space-y-4">
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-blue-500 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                    </div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-500 min-h-4">
                      {insightLoadingMessages[insightLoadingStep]}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {[0, 1, 2, 3].map(item => (
                        <div key={item} className="h-16 rounded-lg border border-blue-500/10 bg-blue-500/[0.04] animate-pulse" />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {insightMetrics.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {insightMetrics.map(item => (
                          <div key={item.label} className="rounded-lg border border-border bg-card/70 p-3">
                            <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">{item.label}</p>
                            <p className="text-xs font-black text-foreground leading-snug">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <ReportSection
                      icon={Eye}
                      title="Observations"
                      tone="text-blue-500"
                      items={insightReport?.observations}
                      fallback="No observations found yet."
                    />
                    <ReportSection
                      icon={AlertTriangle}
                      title="Blind Spots"
                      tone="text-amber-500"
                      items={insightReport?.blindSpots}
                      fallback="No blind spots detected."
                    />
                    <ReportSection
                      icon={Lightbulb}
                      title="Suggestions"
                      tone="text-emerald-500"
                      items={insightReport?.suggestions}
                      fallback="No suggestions available."
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
          {insightReport && (
            <button
              onClick={onViewInsightReport}
              className="w-full rounded-lg border border-blue-500/30 bg-blue-500/[0.06] px-4 py-3 text-left shadow-sm hover:border-blue-500/55 hover:bg-blue-500/[0.09] active:scale-[0.99] transition-all"
            >
              <span className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-blue-500">
                  <BarChart3 className="w-3.5 h-3.5" />
                  View Previous Insight
                </span>
                <ArrowLeft className="w-3.5 h-3.5 text-blue-500 rotate-180" />
              </span>
            </button>
          )}
          <div>
            <h4 className="text-[10px] font-black text-muted-foreground/75 uppercase tracking-[0.3em] mb-3 px-1 flex items-center gap-2">
              <MessageSquareText className="w-3.5 h-3.5 text-primary" />
              Thinking Chat
            </h4>
            <div className="rounded-2xl border border-border bg-secondary/25 overflow-hidden">
              <div className="max-h-72 overflow-y-auto custom-scrollbar p-4 space-y-3">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`rounded-xl px-3 py-2.5 text-xs leading-relaxed ${
                      message.role === 'user'
                        ? 'ml-6 bg-primary text-background dark:text-foreground font-bold'
                        : 'mr-6 bg-card border border-border text-foreground font-semibold'
                    }`}
                  >
                    <p>{message.text}</p>
                    {message.followUps && message.followUps.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {message.followUps.map((followUp) => (
                          <button
                            key={followUp}
                            onClick={() => setChatInput(followUp)}
                            className="px-2 py-1 rounded-md bg-secondary text-[9px] font-black uppercase tracking-wider text-foreground border border-border hover:border-primary"
                          >
                            {followUp}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {isChatting && (
                  <div className="mr-6 rounded-xl px-3 py-2.5 text-xs bg-card border border-border text-primary font-black flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Thinking with the note...
                  </div>
                )}
              </div>
              <div className="border-t border-border p-3 flex items-end gap-2 bg-card/60">
                <textarea
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      sendChatMessage();
                    }
                  }}
                  placeholder="Ask for a challenge, strategy, or blind spot..."
                  rows={2}
                  className="flex-1 resize-none bg-transparent border-none focus:outline-none text-xs leading-relaxed text-foreground placeholder:text-muted-foreground/60"
                />
                <button
                  onClick={sendChatMessage}
                  disabled={!chatInput.trim() || isChatting}
                  className="p-2.5 rounded-xl bg-primary text-background dark:text-foreground disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
                  title="Send message"
                >
                  {isChatting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Extraction Matrix */}
          <div>
            <h4 className="text-[10px] font-black text-muted-foreground/75 uppercase tracking-[0.3em] mb-3 px-1">Logic Extraction Matrix</h4>
            <div className="grid grid-cols-2 gap-3">
              {actions.filter(a => a.category === 'extract').map(({ id, icon: Icon, label, color }) => {
                const isTaskAction = id === 'action_items';
                const isInsightAction = id === 'insights';
                const isSelected = activeAction === id || (isTaskAction && isLiveTaskEnabled) || (isInsightAction && isInsightMode);
                const isLiveTaskSelected = isTaskAction && isLiveTaskEnabled;
                const isInsightSelected = isInsightAction && isInsightMode;
                const isBusy = activeAction === id && isGenerating;
                const isDisabled = isGenerating || (!isSelected && isOnCooldown) || !hasContent;

                return (
                  <button
                    key={id}
                    onClick={() => onAction(id)}
                    disabled={isDisabled}
                    aria-pressed={isTaskAction ? isLiveTaskEnabled : undefined}
                    className={`relative p-3.5 bg-secondary/40 border rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest flex flex-col items-start gap-2.5 shadow-sm hover:-translate-y-0.5 group active:scale-95 disabled:opacity-30 disabled:hover:translate-y-0 ${
                      isLiveTaskSelected
                        ? 'border-emerald-400 text-emerald-700 bg-emerald-500/10 shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_12px_28px_rgba(16,185,129,0.12)]'
                        : isInsightSelected
                          ? 'border-blue-400 text-blue-600 bg-blue-500/10 shadow-[0_0_0_1px_rgba(59,130,246,0.22),0_14px_34px_rgba(59,130,246,0.18)]'
                        : activeAction === id
                          ? 'border-primary text-primary bg-primary/10 shadow-md'
                        : 'border-border text-foreground/90 hover:border-primary/50 hover:text-foreground hover:bg-secondary/70'
                    } ${isLiveTaskSelected || isInsightSelected ? 'animate-pulse' : ''}`}
                  >
                    {isLiveTaskSelected && (
                      <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                    )}
                    {isInsightSelected && (
                      <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.85)]" />
                    )}
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${
                      isLiveTaskSelected
                        ? 'bg-emerald-500/15 text-emerald-600'
                        : isInsightSelected
                          ? 'bg-blue-500/15 text-blue-600'
                          : 'bg-secondary'
                    }`}>
                      {isBusy ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Icon className="w-3.5 h-3.5" style={{ color: isLiveTaskSelected ? '#10b981' : isInsightSelected ? '#3b82f6' : activeAction === id ? 'var(--color-primary)' : color, opacity: hasContent ? 1 : 0.4 }} />
                      )}
                    </div>
                    <span>{isLiveTaskSelected ? 'Tasks On' : isInsightSelected ? 'Insights On' : label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Neural Synthesis */}
          <div>
            <h4 className="text-[10px] font-black text-muted-foreground/75 uppercase tracking-[0.3em] mb-3 px-1">Neural Augmentation</h4>
            <div className="space-y-2">
              {actions.filter(a => a.category === 'write').map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => onAction(id)}
                  disabled={isGenerating || isOnCooldown || !hasContent}
                  className={`w-full py-2.5 px-4 bg-secondary/40 border rounded-xl transition-all text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-between shadow-sm group active:scale-[0.98] disabled:opacity-30 ${
                    activeAction === id
                      ? 'border-primary text-primary bg-primary/10 shadow-md'
                      : 'border-border text-foreground/80 hover:border-primary/50 hover:text-foreground hover:bg-secondary/70'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {activeAction === id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                    ) : (
                      <Icon className={`w-3.5 h-3.5 group-hover:text-primary transition-colors ${hasContent ? 'text-primary/60' : 'text-foreground/20'}`} />
                    )}
                    {label}
                  </span>
                  <Sparkle className={`w-3 h-3 ${activeAction === id ? 'opacity-100 text-primary' : 'opacity-0 group-hover:opacity-40'} transition-opacity`} />
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Result Area with improved contrast */}
          <div className="space-y-4 pt-2">
            {!isGenerating && summary && (
              <SummaryCard summary={summary} isTyping={isTyping} />
            )}

            {!isGenerating && thinkPartnerData && (
              <ThinkPartnerCard
                data={thinkPartnerData}
                hasInserted={hasInserted}
                onInsert={onInsertThinkPartner}
                onUndo={onUndoThinkPartner}
                onDismiss={onDismissThinkPartner}
              />
            )}
          </div>
            </>
          )}
        </div>
      </div>
      
      {/* Sidebar Side Light */}
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
    </aside>
  </>
  );
}

function SummaryCard({ summary, isTyping }) {
  return (
    <div className="bg-secondary/30 rounded-2xl border border-primary/30 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-700">
      <div className="p-6">
        <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-4 text-primary flex items-center gap-2.5">
          <AlignLeft className="w-3.5 h-3.5" /> Synthesized Essence
        </h4>
        <p className="text-sm text-foreground leading-relaxed font-bold italic">
          &ldquo;{summary}&rdquo;
          {isTyping && (
            <span className="inline-block w-1 h-3.5 bg-primary ml-1 animate-pulse align-text-bottom shadow-[0_0_10px_color-mix(in_srgb,var(--color-primary)_50%,transparent)]" />
          )}
        </p>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
    </div>
  );
}

function ThinkPartnerCard({ data, hasInserted, onInsert, onUndo, onDismiss }) {
  const sections = [
    { key: 'risks',             label: '⚠️ Missing Risks',         color: 'text-rose-500',    tag: 'ul' },
    { key: 'practicalInsights', label: 'Practical Insights',        color: 'text-blue-500',    tag: 'ul' },
    { key: 'simpleImprovements',label: 'Simple Improvements',       color: 'text-emerald-500', tag: 'ul' },
    { key: 'flaws',             label: '🔍 Flaws in Thinking',      color: 'text-amber-500',   tag: 'ul' },
    { key: 'businessModels',    label: '💼 Business Models',        color: 'text-primary',     tag: 'ul' },
    { key: 'executionPlan',     label: '📋 Execution Plan',         color: 'text-emerald-500', tag: 'ol' },
    { key: 'competitors',       label: '🏢 Competitors & Landscape', color: 'text-blue-500',   tag: 'ul' },
  ];

  return (
    <div className="bg-secondary/30 rounded-2xl border border-pink-500/30 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-700">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-pink-500/10 pb-4">
          <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-pink-500 flex items-center gap-2.5">
            <BrainCircuit className="w-3.5 h-3.5" /> Neural Expansion
          </h4>
          <div className="flex items-center gap-2">
            {hasInserted ? (
              <button
                onClick={onUndo}
                className="px-2.5 py-1 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 text-[9px] font-black uppercase tracking-widest text-amber-500 rounded-lg active:scale-95 transition-all shadow-[0_0_15px_rgba(245,158,11,0.1)]"
              >
                Undo Add
              </button>
            ) : (
              onInsert && (
                <button
                  onClick={onInsert}
                  className="px-2.5 py-1 bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/35 text-[9px] font-black uppercase tracking-widest text-pink-500 rounded-lg active:scale-95 transition-all shadow-[0_0_15px_rgba(236,72,153,0.1)]"
                >
                  Add to Note
                </button>
              )
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                title="Dismiss Card"
                className="p-1 hover:bg-pink-500/10 border border-transparent hover:border-pink-500/25 text-pink-500/70 hover:text-pink-500 rounded-lg active:scale-95 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {sections.map(({ key, label, color, tag: Tag }) => {
          const items = data[key];
          if (!items || items.length === 0) return null;
          return (
            <div key={key}>
              <h5 className={`text-[9px] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5 ${color}`}>
                {label}
              </h5>
              <Tag className="space-y-1.5 pl-3 list-disc text-xs text-foreground font-bold" style={Tag === 'ol' ? { listStyleType: 'decimal' } : {}}>
                {items.map((item, idx) => (
                  <li key={idx} className="leading-relaxed">{item}</li>
                ))}
              </Tag>
            </div>
          );
        })}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-pink-500/60 to-transparent" />
    </div>
  );
}

function ReportSection({ icon: Icon, title, tone, items, fallback }) {
  const safeItems = Array.isArray(items) ? items.filter(Boolean) : [];

  return (
    <section className="rounded-lg border border-border bg-card/70 p-4">
      <h5 className={`text-[9px] font-black uppercase tracking-[0.25em] mb-3 flex items-center gap-2 ${tone}`}>
        <Icon className="w-3.5 h-3.5" />
        {title}
      </h5>
      {safeItems.length > 0 ? (
        <div className="space-y-2">
          {safeItems.map((item, index) => (
            <div key={`${title}-${index}`} className="rounded-md bg-secondary/45 border border-border/70 p-3">
              <p className="text-xs font-bold text-foreground leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs font-bold text-muted-foreground">{fallback}</p>
      )}
    </section>
  );
}
