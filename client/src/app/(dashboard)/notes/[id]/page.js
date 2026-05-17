'use client';

import { useNoteEditor } from '../../../../hooks/useNoteEditor';
import EditorHeader from '../../../../components/NoteEditor/EditorHeader';
import EditorArea from '../../../../components/NoteEditor/EditorArea';
import AiSidebar from '../../../../components/NoteEditor/AiSidebar';
import DeleteConfirmModal from '../../../../components/DeleteConfirmModal';

export default function NoteEditor() {
  const {
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
    <div className="flex h-full w-full absolute inset-0 overflow-hidden">
      <div className="flex-1 flex flex-col h-full bg-[#0f1115] relative overflow-hidden">
        <EditorHeader
          onBack={actions.goBack}
          onToggleSidebar={() => uiState.setIsSidebarOpen(!uiState.isSidebarOpen)}
          saveStatus={editorState.saveStatus}
          onDelete={() => uiState.setIsDeleteModalOpen(true)}
          onShare={actions.share}
          isPublic={note?.isPublic}
          isDeleting={false}
          isSharing={false}
        />

        <EditorArea
          title={editorState.title}
          setTitle={editorState.setTitle}
          content={editorState.content}
          setContent={editorState.setContent}
          tags={editorState.tags}
          setTags={editorState.setTags}
          onStatusChange={editorState.setSaveStatus}
        />
      </div>

      {uiState.isSidebarOpen && (
        <AiSidebar
          isGenerating={aiState.isGenerating}
          activeAction={aiState.activeAction}
          isOnCooldown={aiState.isOnCooldown}
          cooldownSeconds={aiState.cooldownSeconds}
          onAction={aiState.triggerAction}
          hasContent={!!editorState.content}
          summary={aiState.summary}
          isTyping={aiState.isTyping}
          actionItems={aiState.actionItems}
          checkedItems={aiState.checkedItems}
          onToggleCheck={aiState.toggleCheck}
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
    <div className="flex h-full animate-pulse bg-[#0f1115]">
      <div className="flex-1 flex flex-col">
        <div className="h-24 border-b border-[#2d3139]/50 bg-[#0a0b0d]/60 backdrop-blur-2xl shrink-0 px-12 flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="h-3 w-32 rounded bg-white/5" />
            <div className="h-6 w-48 rounded bg-white/5" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-40 rounded-xl bg-white/5" />
            <div className="h-10 w-10 rounded-xl bg-white/5" />
          </div>
        </div>
        <div className="flex-1 p-24 max-w-[1200px] w-full mx-auto space-y-12">
          <div className="h-16 w-3/4 rounded-2xl bg-[#1b1f27]" />
          <div className="h-10 w-1/4 rounded-xl bg-[#1b1f27]" />
          <div className="space-y-4 pt-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-4 bg-[#1b1f27] rounded-full" style={{ width: `${100 - (i % 3) * 10}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
