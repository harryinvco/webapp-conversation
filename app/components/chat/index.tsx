'use client'
import type { FC } from 'react'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ArrowUpIcon,
  PaperClipIcon,
  StopIcon,
} from '@heroicons/react/24/solid'
import VirtualizedChatList from './virtualized-chat-list'
import type { FeedbackFunc } from './type'
import type { ChatItem, VisionFile, VisionSettings } from '@/types/app'
import { TransferMethod } from '@/types/app'
import Toast from '@/app/components/base/toast'
import ChatImageUploader from '@/app/components/base/image-uploader/chat-image-uploader'
import ImageList from '@/app/components/base/image-uploader/image-list'
import { useImageFiles } from '@/app/components/base/image-uploader/hooks'
import FileUploaderInAttachmentWrapper from '@/app/components/base/file-uploader-in-attachment'
import type { FileEntity, FileUpload } from '@/app/components/base/file-uploader-in-attachment/types'
import { getProcessedFiles } from '@/app/components/base/file-uploader-in-attachment/utils'

export interface IChatProps {
  chatList: ChatItem[]
  /**
   * Whether to display the editing area and rating status
   */
  feedbackDisabled?: boolean
  /**
   * Whether to display the input area
   */
  isHideSendInput?: boolean
  onFeedback?: FeedbackFunc
  checkCanSend?: () => boolean
  onSend?: (message: string, files: VisionFile[]) => void
  useCurrentUserAvatar?: boolean
  isResponding?: boolean
  controlClearQuery?: number
  visionConfig?: VisionSettings
  fileConfig?: FileUpload
}

const Chat: FC<IChatProps> = ({
  chatList,
  feedbackDisabled = false,
  isHideSendInput = false,
  onFeedback,
  checkCanSend,
  onSend = () => { },
  useCurrentUserAvatar,
  isResponding,
  controlClearQuery,
  visionConfig,
  fileConfig,
}) => {
  const { t } = useTranslation()
  const { notify } = Toast
  const isUseInputMethod = useRef(false)

  const [query, setQuery] = React.useState('')
  const queryRef = useRef('')

  const handleContentChange = useCallback((e: any) => {
    const value = e.target.value
    setQuery(value)
    queryRef.current = value
  }, [])

  const logError = useCallback((message: string) => {
    notify({ type: 'error', message, duration: 3000 })
  }, [notify])

  const valid = useCallback(() => {
    const query = queryRef.current
    if (!query || query.trim() === '') {
      logError(t('app.errorMessage.valueOfVarRequired'))
      return false
    }
    return true
  }, [logError, t])

  useEffect(() => {
    if (controlClearQuery) {
      setQuery('')
      queryRef.current = ''
    }
  }, [controlClearQuery])
  const {
    files,
    onUpload,
    onRemove,
    onReUpload,
    onImageLinkLoadError,
    onImageLinkLoadSuccess,
    onClear,
  } = useImageFiles()

  const [attachmentFiles, setAttachmentFiles] = React.useState<FileEntity[]>([])

  const handleSend = useCallback(() => {
    if (!valid() || (checkCanSend && !checkCanSend())) { return }
    const imageFiles: VisionFile[] = files.filter(file => file.progress !== -1).map(fileItem => ({
      type: 'image',
      transfer_method: fileItem.type,
      url: fileItem.url,
      upload_file_id: fileItem.fileId,
    }))
    const docAndOtherFiles: VisionFile[] = getProcessedFiles(attachmentFiles)
    const combinedFiles: VisionFile[] = [...imageFiles, ...docAndOtherFiles]
    onSend(queryRef.current, combinedFiles)
    if (!files.find(item => item.type === TransferMethod.local_file && !item.fileId)) {
      if (files.length) { onClear() }
      if (!isResponding) {
        setQuery('')
        queryRef.current = ''
      }
    }
    if (!attachmentFiles.find(item => item.transferMethod === TransferMethod.local_file && !item.uploadedId)) { setAttachmentFiles([]) }
  }, [valid, checkCanSend, files, attachmentFiles, onSend, onClear, isResponding])

  const handleKeyUp = useCallback((e: any) => {
    if (e.code === 'Enter') {
      e.preventDefault()
      // prevent send message when using input method enter
      if (!e.shiftKey && !isUseInputMethod.current) { handleSend() }
    }
  }, [handleSend])

  const handleKeyDown = useCallback((e: any) => {
    isUseInputMethod.current = e.nativeEvent.isComposing
    if (e.code === 'Enter' && !e.shiftKey) {
      const result = query.replace(/\n$/, '')
      setQuery(result)
      queryRef.current = result
      e.preventDefault()
    }
  }, [query])

  const suggestionClick = useCallback((suggestion: string) => {
    setQuery(suggestion)
    queryRef.current = suggestion
    // Use setTimeout to ensure state is updated before sending
    setTimeout(() => handleSend(), 0)
  }, [handleSend])

  // Memoize chat list to prevent unnecessary re-renders
  const memoizedChatList = useMemo(() => chatList, [chatList])

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [])

  useEffect(() => {
    adjustTextareaHeight()
  }, [query, adjustTextareaHeight])

  const canSend = query.trim().length > 0 && !isResponding

  return (
    <div className="flex flex-col h-full bg-[var(--main-bg)]">
      {/* Chat List - Virtualized for performance */}
      <div className="flex-1 overflow-hidden">
        <VirtualizedChatList
          chatList={memoizedChatList}
          feedbackDisabled={feedbackDisabled}
          onFeedback={onFeedback}
          isResponding={isResponding}
          useCurrentUserAvatar={useCurrentUserAvatar}
          suggestionClick={suggestionClick}
        />
      </div>

      {/* ChatGPT-style Input Area */}
      {!isHideSendInput && (
        <div className="flex-shrink-0 bg-gradient-to-t from-[var(--main-bg)] via-[var(--main-bg)] to-transparent pt-6 pb-4">
          <div className="max-w-3xl mx-auto px-4">
            {/* File/Image previews */}
            {(visionConfig?.enabled && files.length > 0) && (
              <div className="mb-2 p-2 bg-[var(--input-bg)] rounded-t-2xl border border-b-0 border-[var(--border-color)]">
                <ImageList
                  list={files}
                  onRemove={onRemove}
                  onReUpload={onReUpload}
                  onImageLinkLoadSuccess={onImageLinkLoadSuccess}
                  onImageLinkLoadError={onImageLinkLoadError}
                />
              </div>
            )}

            {fileConfig?.enabled && attachmentFiles.length > 0 && (
              <div className="mb-2 p-2 bg-[var(--input-bg)] rounded-t-2xl border border-b-0 border-[var(--border-color)]">
                <FileUploaderInAttachmentWrapper
                  fileConfig={fileConfig}
                  value={attachmentFiles}
                  onChange={setAttachmentFiles}
                />
              </div>
            )}

            {/* Main Input Container */}
            <div className="relative flex items-end bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl shadow-lg transition-all duration-200 focus-within:border-[var(--text-muted)]">
              {/* Attachment button */}
              {(visionConfig?.enabled || fileConfig?.enabled) && (
                <div className="flex-shrink-0 p-2">
                  {visionConfig?.enabled && (
                    <ChatImageUploader
                      settings={visionConfig}
                      onUpload={onUpload}
                      disabled={files.length >= visionConfig.number_limits}
                    />
                  )}
                  {!visionConfig?.enabled && fileConfig?.enabled && (
                    <button className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--sidebar-hover)] transition-colors">
                      <PaperClipIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                className="flex-1 max-h-[200px] py-3 px-3 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-none outline-none text-[15px] leading-6"
                placeholder="Message Chtisma..."
                value={query}
                onChange={handleContentChange}
                onKeyUp={handleKeyUp}
                onKeyDown={handleKeyDown}
                rows={1}
              />

              {/* Send/Stop button */}
              <div className="flex-shrink-0 p-2">
                {isResponding
                  ? (
                    <button
                      className="p-2 rounded-lg bg-[var(--text-muted)] hover:bg-[var(--text-secondary)] transition-colors"
                      title="Stop generating"
                    >
                      <StopIcon className="w-5 h-5 text-[var(--main-bg)]" />
                    </button>
                  )
                  : (
                    <button
                      onClick={handleSend}
                      disabled={!canSend}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        canSend
                          ? 'bg-[var(--text-primary)] hover:bg-[var(--text-secondary)] cursor-pointer'
                          : 'bg-[var(--border-color)] cursor-not-allowed'
                      }`}
                      title="Send message"
                    >
                      <ArrowUpIcon className={`w-5 h-5 ${canSend ? 'text-[var(--main-bg)]' : 'text-[var(--text-muted)]'}`} />
                    </button>
                  )}
              </div>
            </div>

            {/* Helper text */}
            <p className="text-center text-xs text-[var(--text-muted)] mt-2">
              Chtisma can make mistakes. Check important info.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default React.memo(Chat)
