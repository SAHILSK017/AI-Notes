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
  const [isTyping, setIsTyping] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [checkedItems, setCheckedItems] = useState({});

  const typingRef = useRef(null);
  const cooldownRef = useRef(null);
  const isInitialized = useRef(false);
  const lastNoteId = useRef(id);

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
      setCheckedItems({});
      setSaveStatus('Saved');
    }
  }, [id]);

  useEffect(() => {
    if (note && note._id === id && !isInitialized.current) {
      isInitialized.current = true;
      setTitle(note.title || '');
      setContent(note.content || '');
      setTags(note.tags?.join(', ') || '');
      if (note.aiSummary) setDisplayedSummary(note.aiSummary);
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

    updateMutation.mutate({
      title: debouncedTitle || note.title,
      content: debouncedContent,
      tags: debouncedTags.split(',').map(t => t.trim()).filter(Boolean)
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTitle, debouncedContent, debouncedTags]);

  useEffect(() => {
    if (
      isInitialized.current &&
      content.length > 30 &&
      (!title || title === 'Untitled Note') &&
      !aiMutation.isLoading &&
      cooldownSeconds === 0 &&
      saveStatus === 'Saved'
    ) {
      aiMutation.mutate('auto_title');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedContent]);

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
    mutationFn: async (action) => {
      setActiveAction(action);
      const res = await api.post(`/notes/${id}/ai`, { action });
      return { data: res.data, action };
    },
    onSuccess: ({ data, action }) => {
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
      
      setActiveAction(null);
      startCooldown(data.cached ? 2 : 5);
      queryClient.invalidateQueries({ queryKey: ['note', id] });
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('AI generation complete!');
    },
    onError: (err) => {
      setActiveAction(null);
      const serverMsg = err?.response?.data?.message;
      toast.error(serverMsg || 'AI generation failed');
      startCooldown(5);
    }
  });

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
    setCheckedItems(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return {
    id,
    note,
    isLoading,
    editorState: { title, setTitle, content, setContent, tags, setTags, saveStatus, setSaveStatus },
    uiState: { isSidebarOpen, setIsSidebarOpen, isDeleteModalOpen, setIsDeleteModalOpen },
    aiState: {
      isGenerating: aiMutation.isLoading,
      activeAction,
      isOnCooldown: cooldownSeconds > 0,
      cooldownSeconds,
      summary: displayedSummary,
      isTyping,
      actionItems: note?.aiActionItems || [],
      checkedItems,
      toggleCheck,
      triggerAction: (action) => aiMutation.mutate(action)
    },
    actions: {
      goBack: () => router.push('/dashboard'),
      share: () => shareMutation.mutate(),
      delete: () => deleteMutation.mutate(),
    }
  };
}
