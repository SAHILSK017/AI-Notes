'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '../lib/axios';
import { useDebounce } from '../lib/hooks';

export function useNoteEditor() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [activeAction, setActiveAction] = useState(null);
  const [displayedSummary, setDisplayedSummary] = useState('');
  const [thinkPartnerData, setThinkPartnerData] = useState(null);
  const [history, setHistory] = useState([]);
  const [lastSavedState, setLastSavedState] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [checkedItems, setCheckedItems] = useState({});
  const [generatedActionItems, setGeneratedActionItems] = useState(null);
  const [liveTaskEnabled, setLiveTaskEnabled] = useState(false);
  const [insightReport, setInsightReport] = useState(null);
  const [isInsightReportOpen, setIsInsightReportOpen] = useState(false);

  const typingRef = useRef(null);
  const cooldownRef = useRef(null);
  const isInitialized = useRef(false);
  const lastNoteId = useRef(id);
  const lastTaskContentRef = useRef('');

  const { data: note, isLoading } = useQuery({
    queryKey: ['note', id],
    queryFn: async () => {
      const res = await api.get(`/notes/${id}`);
      return res.data.data;
    },
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (lastNoteId.current !== id) {
      lastNoteId.current = id;
      isInitialized.current = false;
      setTitle('');
      setContent('');
      setTags('');
      setDisplayedSummary('');
      setThinkPartnerData(null);
      setHistory([]);
      setLastSavedState(null);
      setCheckedItems({});
      setGeneratedActionItems(null);
      setLiveTaskEnabled(false);
      setInsightReport(null);
      setIsInsightReportOpen(false);
      lastTaskContentRef.current = '';
      setSaveStatus('Saved');
    }
  }, [id]);

  useEffect(() => {
    if (note && note._id === id && !isInitialized.current) {
      isInitialized.current = true;
      setTitle(note.title || '');
      setContent(note.content || '');
      setTags(note.tags?.join(', ') || '');
      setLastSavedState({
        title: note.title || '',
        content: note.content || '',
        tags: note.tags?.join(', ') || ''
      });
      setHistory([]);
      setGeneratedActionItems(note.aiActionItems || null);

      if (note.aiActionItems && note.aiActionItems.length > 0) {
        const initialChecked = {};
        note.aiActionItems.forEach((item, idx) => {
          if (item && typeof item === 'object') {
            initialChecked[idx] = !!item.completed;
          }
        });
        setCheckedItems(initialChecked);
      } else {
        setCheckedItems({});
      }

      if (note.aiSummary) {
        queueMicrotask(() => setDisplayedSummary(note.aiSummary));
      }
    }
  }, [note, id]);

  const debouncedTitle = useDebounce(title, 1200);
  const debouncedContent = useDebounce(content, 1200);
  const debouncedTags = useDebounce(tags, 1200);

  const updateMutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await api.patch(`/notes/${id}`, updatedData);
      return res.data.data;
    },
    onMutate: () => setSaveStatus('Saving...'),
    onSuccess: () => {
      setSaveStatus('Saved');
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: () => {
      setSaveStatus('Error saving');
      toast.error('Failed to autosave changes');
    }
  });

  useEffect(() => {
    if (!isInitialized.current || !note) return;
    if (!debouncedContent.trim() && !debouncedTitle.trim()) return;

    const savedTags = note.tags?.join(', ') || '';
    const nothingChanged =
      debouncedTitle === note.title &&
      debouncedContent === note.content &&
      debouncedTags === savedTags;

    if (nothingChanged) return;

    if (lastSavedState) {
      const stateChanged =
        lastSavedState.title !== debouncedTitle ||
        lastSavedState.content !== debouncedContent ||
        lastSavedState.tags !== debouncedTags;
      
      if (stateChanged) {
        queueMicrotask(() => {
          setHistory(prev => {
            const nextHist = [...prev, { ...lastSavedState }];
            if (nextHist.length > 20) nextHist.shift();
            return nextHist;
          });
          setLastSavedState({
            title: debouncedTitle,
            content: debouncedContent,
            tags: debouncedTags
          });
        });
      }
    }

    updateMutation.mutate({
      title: debouncedTitle || note.title,
      content: debouncedContent,
      tags: debouncedTags.split(',').map(t => t.trim()).filter(Boolean)
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTitle, debouncedContent, debouncedTags]);

  const runTypingEffect = useCallback((text) => {
    if (typingRef.current) clearInterval(typingRef.current);
    setDisplayedSummary('');
    setIsTyping(true);
    let i = 0;
    typingRef.current = setInterval(() => {
      i++;
      setDisplayedSummary(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(typingRef.current);
        setIsTyping(false);
      }
    }, 12);
  }, []);

  const startCooldown = useCallback((seconds = 5) => {
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    setCooldownSeconds(seconds);
    cooldownRef.current = setInterval(() => {
      setCooldownSeconds(prev => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const aiMutation = useMutation({
    mutationFn: async (variables) => {
      const action = typeof variables === 'string' ? variables : variables.action;
      const text = typeof variables === 'string' ? null : variables.text;
      setActiveAction(action);
      setThinkPartnerData(null);
      if (action === 'insights') setInsightReport(null);
      const payload = text ? { action, text } : { action };
      const res = await api.post(`/notes/${id}/ai`, payload);
      return {
        data: res.data,
        action,
        source: typeof variables === 'string' ? 'manual' : variables.source,
        analyzedText: text || content.trim()
      };
    },
    onSuccess: ({ data, action, source, analyzedText }) => {
      const resData = data.data;
      if (action === 'title' || action === 'auto_title') setTitle(resData.suggestedTitle || '');
      if (['continue_writing', 'expand', 'rewrite', 'simplify', 'grammar'].includes(action)) {
        setContent(resData.text || '');
      }
      if (action === 'tags' && resData.tags) {
        setTags(prev => prev ? `${prev}, ${resData.tags.join(', ')}` : resData.tags.join(', '));
      }
      if (action === 'summary' && resData.summary) {
        runTypingEffect(resData.summary);
      }
      if (action === 'action_items') {
        setLiveTaskEnabled(true);
        const updatedTasks = data.note?.aiActionItems ?? (resData.actionItems || []).map(item => ({ text: item, completed: false }));
        setGeneratedActionItems(updatedTasks);
        
        const nextChecked = {};
        updatedTasks.forEach((item, idx) => {
          nextChecked[idx] = !!item.completed;
        });
        setCheckedItems(nextChecked);
        
        lastTaskContentRef.current = analyzedText;
      }
      if (action === 'think_partner') {
        setThinkPartnerData(resData);
      }
      if (action === 'insights') {
        setInsightReport(resData);
        setIsInsightReportOpen(true);
      }
      
      setActiveAction(null);
      startCooldown(source === 'live_tasks' || data.cached ? 2 : 5);
      queryClient.invalidateQueries({ queryKey: ['note', id] });
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      if (source !== 'live_tasks') {
        toast.success('AI generation complete!');
      }
    },
    onError: (err, variables) => {
      const action = typeof variables === 'string' ? variables : variables?.action;
      if (action === 'action_items') {
        lastTaskContentRef.current = '';
      }
      setActiveAction(null);
      const serverMsg = err?.response?.data?.message;
      toast.error(serverMsg || 'AI generation failed');
      startCooldown(5);
    }
  });

  const refreshLiveTasks = useCallback((nextContent = content) => {
    const text = nextContent.trim();
    if (
      !liveTaskEnabled ||
      !isInitialized.current ||
      text.length < 5 ||
      aiMutation.isPending ||
      lastTaskContentRef.current === text
    ) {
      return;
    }

    aiMutation.mutate({
      action: 'action_items',
      text,
      source: 'live_tasks'
    });
  }, [aiMutation, content, liveTaskEnabled]);

  useEffect(() => {
    if (
      isInitialized.current &&
      content.length > 30 &&
      (!title || title === 'Untitled Note') &&
      !aiMutation.isPending &&
      cooldownSeconds === 0 &&
      saveStatus === 'Saved'
    ) {
      aiMutation.mutate('auto_title');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedContent]);

  const shareMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/notes/${id}/share`);
      return res.data.data;
    },
    onSuccess: (data) => {
      const url = `${window.location.origin}/shared/${data.shareId}`;
      navigator.clipboard.writeText(url);
      toast.success('Public link copied to clipboard!');
      queryClient.invalidateQueries({ queryKey: ['note', id] });
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/notes/${id}`);
    },
    onSuccess: () => {
      toast.success('Note deleted');
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      router.push('/notes');
    }
  });

  const toggleCheck = (index) => {
    if (!note) return;
    const currentItems = generatedActionItems ?? note.aiActionItems ?? [];
    const updatedItems = currentItems.map((item, idx) => {
      const isTarget = idx === index;
      if (typeof item === 'string') {
        return { text: item, completed: isTarget ? !checkedItems[idx] : !!checkedItems[idx] };
      } else {
        return { ...item, completed: isTarget ? !item.completed : !!item.completed };
      }
    });

    setCheckedItems(prev => ({ ...prev, [index]: !prev[index] }));
    setGeneratedActionItems(updatedItems);
    updateMutation.mutate({
      aiActionItems: updatedItems
    });
  };

  const insertThinkPartner = () => {
    if (!thinkPartnerData) return;
    
    // Save state before insertion into history
    setHistory(prev => {
      const nextHist = [...prev, {
        title,
        content,
        tags
      }];
      if (nextHist.length > 20) nextHist.shift();
      return nextHist;
    });
    setLastSavedState({
      title,
      content,
      tags
    });
    
    let markdown = '\n\n---\n### 🧠 AI Thought Expansion\n\n';
    
    if (thinkPartnerData.risks && thinkPartnerData.risks.length > 0) {
      markdown += '#### ⚠️ Missing Risks\n';
      thinkPartnerData.risks.forEach(item => {
        markdown += `- ${item}\n`;
      });
      markdown += '\n';
    }
    
    if (thinkPartnerData.flaws && thinkPartnerData.flaws.length > 0) {
      markdown += '#### 🔍 Flaws in Thinking\n';
      thinkPartnerData.flaws.forEach(item => {
        markdown += `- ${item}\n`;
      });
      markdown += '\n';
    }
    
    if (thinkPartnerData.businessModels && thinkPartnerData.businessModels.length > 0) {
      markdown += '#### 💼 Business Models\n';
      thinkPartnerData.businessModels.forEach(item => {
        markdown += `- ${item}\n`;
      });
      markdown += '\n';
    }
    
    if (thinkPartnerData.executionPlan && thinkPartnerData.executionPlan.length > 0) {
      markdown += '#### 📋 Execution Plan\n';
      thinkPartnerData.executionPlan.forEach((item, idx) => {
        markdown += `${idx + 1}. ${item}\n`;
      });
      markdown += '\n';
    }
    
    if (thinkPartnerData.competitors && thinkPartnerData.competitors.length > 0) {
      markdown += '#### 🏢 Competitors & Landscape\n';
      thinkPartnerData.competitors.forEach(item => {
        markdown += `- ${item}\n`;
      });
      markdown += '\n';
    }
    
    setContent(prev => prev + markdown);
    toast.success('Added thought expansion to your note!');
  };

  const undoThinkPartner = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(prevHist => prevHist.slice(0, -1));
    
    setTitle(prev.title);
    setContent(prev.content);
    setTags(prev.tags);
    setLastSavedState(prev);
    
    toast.success('Undid last saved change!');
  };

  const dismissThinkPartner = () => {
    setThinkPartnerData(null);
    toast.success('Insights dismissed');
  };

  return {
    id,
    note,
    isLoading,
    editorState: { title, setTitle, content, setContent, tags, setTags, saveStatus, setSaveStatus },
    uiState: { isSidebarOpen, setIsSidebarOpen, isDeleteModalOpen, setIsDeleteModalOpen },
    aiState: {
      isGenerating: aiMutation.isPending,
      activeAction,
      isOnCooldown: cooldownSeconds > 0,
      cooldownSeconds,
      summary: displayedSummary,
      isTyping,
      actionItems: generatedActionItems ?? note?.aiActionItems ?? [],
      checkedItems,
      toggleCheck,
      isLiveTaskEnabled: liveTaskEnabled,
      refreshLiveTasks,
      insightReport,
      isInsightReportOpen,
      viewInsightReport: () => setIsInsightReportOpen(true),
      dismissInsightReport: () => setIsInsightReportOpen(false),
      thinkPartnerData,
      insertThinkPartner,
      undoThinkPartner,
      dismissThinkPartner,
      hasInserted: history.length > 0,
      triggerAction: (action) => {
        if (action === 'action_items') {
          if (liveTaskEnabled) {
            setLiveTaskEnabled(false);
            return;
          }

          setLiveTaskEnabled(true);
          aiMutation.mutate({
            action: 'action_items',
            text: content.trim(),
            source: 'manual'
          });
          return;
        }
        aiMutation.mutate(action);
      }
    },
    actions: {
      goBack: () => router.push('/dashboard'),
      share: () => shareMutation.mutate(),
      delete: () => deleteMutation.mutate(),
    }
  };
}
