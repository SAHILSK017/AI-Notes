'use client';

import { useState } from 'react';
import { useNoteEditor } from '../../../../hooks/useNoteEditor';
import EditorHeader from '../../../../components/NoteEditor/EditorHeader';
import EditorArea from '../../../../components/NoteEditor/EditorArea';
import AiSidebar from '../../../../components/NoteEditor/AiSidebar';
import DeleteConfirmModal from '../../../../components/DeleteConfirmModal';

export default function NoteEditor() {
  const [autoSuggestEnabled, setAutoSuggestEnabled] = useState(true);
  const {
    id,
    note,
    isLoading,
    editorState,
    uiState,
    aiState,
    actions
  } = useNoteEditor();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex h-full w-full absolute inset-0 overflow-hidden bg-background">
      <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
        <EditorHeader
          onBack={actions.goBack}
          onToggleSidebar={() => uiState.setIsSidebarOpen(!uiState.isSidebarOpen)}
          saveStatus={editorState.saveStatus}
          onDelete={() => uiState.setIsDeleteModalOpen(true)}
          onShare={actions.share}
          isPublic={note?.isPublic}
          isDeleting={false}
          isSharing={false}
          onUndo={aiState.undoThinkPartner}
          canUndo={aiState.hasInserted}
          autoSuggestEnabled={autoSuggestEnabled}
          onToggleAutoSuggest={() => setAutoSuggestEnabled(prev => !prev)}
        />

        <EditorArea
          noteId={id}
          title={editorState.title}
          setTitle={editorState.setTitle}
          content={editorState.content}
          setContent={editorState.setContent}
          tags={editorState.tags}
          setTags={editorState.setTags}
          onStatusChange={editorState.setSaveStatus}
          autoSuggestEnabled={autoSuggestEnabled}
          isAiGenerating={aiState.isGenerating}
          activeAiAction={aiState.activeAction}
          isLiveTaskEnabled={aiState.isLiveTaskEnabled}
          onLiveTaskCommit={aiState.refreshLiveTasks}
          actionItems={aiState.actionItems}
          checkedItems={aiState.checkedItems}
          onToggleCheck={aiState.toggleCheck}
        />
      </div>

      {/* Mobile Backdrop for AI Sidebar Drawer */}
      {uiState.isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 md:hidden animate-in fade-in duration-200"
          onClick={() => uiState.setIsSidebarOpen(false)}
        />
      )}

      {uiState.isSidebarOpen && (
        <AiSidebar
          isGenerating={aiState.isGenerating}
          activeAction={aiState.activeAction}
          isOnCooldown={aiState.isOnCooldown}
          cooldownSeconds={aiState.cooldownSeconds}
          onAction={aiState.triggerAction}
          hasContent={!!editorState.content}
          isLiveTaskEnabled={aiState.isLiveTaskEnabled}
          insightReport={aiState.insightReport}
          isInsightReportOpen={aiState.isInsightReportOpen}
          onViewInsightReport={aiState.viewInsightReport}
          onDismissInsightReport={aiState.dismissInsightReport}
          summary={aiState.summary}
          isTyping={aiState.isTyping}
          thinkPartnerData={aiState.thinkPartnerData}
          onInsertThinkPartner={aiState.insertThinkPartner}
          onUndoThinkPartner={aiState.undoThinkPartner}
          onDismissThinkPartner={aiState.dismissThinkPartner}
          hasInserted={aiState.hasInserted}
          onClose={() => uiState.setIsSidebarOpen(false)}
          noteId={id}
          noteContext={{
            title: editorState.title,
            content: editorState.content,
            tags: editorState.tags
          }}
        />
      )}

      <DeleteConfirmModal 
        isOpen={uiState.isDeleteModalOpen}
        onClose={() => uiState.setIsDeleteModalOpen(false)}
        onConfirm={actions.delete}
        isLoading={false}
      />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex h-full animate-pulse bg-background">
      <div className="flex-1 flex flex-col">
        <div className="h-24 border-b border-border/40 bg-background/60 backdrop-blur-2xl shrink-0 px-6 md:px-12 flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="h-3 w-32 rounded bg-secondary" />
            <div className="h-6 w-48 rounded bg-secondary" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-40 rounded-xl bg-secondary" />
            <div className="h-10 w-10 rounded-xl bg-secondary" />
          </div>
        </div>
        <div className="flex-1 p-8 md:p-24 max-w-[1200px] w-full mx-auto space-y-12">
          <div className="h-16 w-3/4 rounded-2xl bg-secondary" />
          <div className="h-10 w-1/4 rounded-xl bg-secondary" />
          <div className="space-y-4 pt-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-4 bg-secondary rounded-full" style={{ width: `${100 - (i % 3) * 10}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
