'use client'
import type { FC } from 'react'
import type { FeedbackFunc } from '../type'
import type { ChatItem, VisionFile } from '@/types/app'
import type { Emoji } from '@/types/tools'
import {
  ClipboardIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/outline'
import { SparklesIcon } from '@heroicons/react/24/solid'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import copy from 'copy-to-clipboard'
import StreamdownMarkdown from '@/app/components/base/streamdown-markdown'
import Toast from '@/app/components/base/toast'
import WorkflowProcess from '@/app/components/workflow/workflow-process'
import ImageGallery from '../../base/image-gallery'
import LoadingAnim from '../loading-anim'
import Thought from '../thought'

// ChatGPT-style action button
function ActionButton({ icon, onClick, isActive, tooltip }: {
  icon: React.ReactNode
  onClick?: () => void
  isActive?: boolean
  tooltip?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`p-1.5 rounded-md transition-all duration-200 ${
        isActive
          ? 'text-[var(--accent-color)] bg-[var(--accent-color)]/10'
          : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--sidebar-hover)]'
      }`}
      title={tooltip}
    >
      {icon}
    </button>
  )
}

const RatingIcon: FC<{ isLike: boolean }> = ({ isLike }) => {
  return isLike ? <HandThumbUpIcon className="w-4 h-4" /> : <HandThumbDownIcon className="w-4 h-4" />
}

interface IAnswerProps {
  item: ChatItem
  feedbackDisabled: boolean
  onFeedback?: FeedbackFunc
  isResponding?: boolean
  allToolIcons?: Record<string, string | Emoji>
  suggestionClick?: (suggestion: string) => void
}

// The component needs to maintain its own state to control whether to display input component
const Answer: FC<IAnswerProps> = ({
  item,
  feedbackDisabled = false,
  onFeedback,
  isResponding,
  allToolIcons,
  suggestionClick = () => { },
}) => {
  const { id, content, feedback, agent_thoughts, workflowProcess, suggestedQuestions = [] } = item
  const isAgentMode = !!agent_thoughts && agent_thoughts.length > 0

  const { t } = useTranslation()
  const { notify } = Toast

  const handleCopy = useCallback(() => {
    copy(content)
    notify({ type: 'success', message: t('common.operation.copySuccess') || 'Copied!' })
  }, [content, notify, t])

  const getImgs = (list?: VisionFile[]) => {
    if (!list) { return [] }
    return list.filter(file => file.type === 'image' && file.belongs_to === 'assistant')
  }

  const agentModeAnswer = (
    <div className="space-y-3">
      {agent_thoughts?.map((thought, index) => (
        <div key={index}>
          {thought.thought && (
            <StreamdownMarkdown content={thought.thought} />
          )}
          {!!thought.tool && (
            <Thought
              thought={thought}
              allToolIcons={allToolIcons || {}}
              isFinished={!!thought.observation || !isResponding}
            />
          )}
          {getImgs(thought.message_files).length > 0 && (
            <ImageGallery srcs={getImgs(thought.message_files).map(f => f.url)} />
          )}
        </div>
      ))}
    </div>
  )

  return (
    <div key={id} className="animate-fade-in group">
      {/* ChatGPT-style message layout */}
      <div className="py-4 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-4">
            {/* AI Avatar */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-[var(--accent-color)] flex items-center justify-center">
                {isResponding
                  ? <LoadingAnim type="avatar" />
                  : <SparklesIcon className="w-5 h-5 text-white" />
                }
              </div>
            </div>

            {/* Message Content */}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-[var(--text-primary)] text-sm mb-1">Chtisma</div>

              <div className="text-[var(--text-primary)] text-[15px] leading-relaxed">
                {workflowProcess && (
                  <div className="mb-3">
                    <WorkflowProcess data={workflowProcess} hideInfo />
                  </div>
                )}

                {(isResponding && (isAgentMode ? (!content && (agent_thoughts || []).filter(t => !!t.thought || !!t.tool).length === 0) : !content))
                  ? (
                    <div className="flex items-center gap-2 text-[var(--text-muted)]">
                      <LoadingAnim type="text" />
                      <span className="animate-pulse-slow">Thinking...</span>
                    </div>
                  )
                  : (isAgentMode
                    ? agentModeAnswer
                    : (
                      <div className="prose prose-invert max-w-none">
                        <StreamdownMarkdown content={content} />
                      </div>
                    ))}

                {/* Suggested Questions */}
                {suggestedQuestions.length > 0 && !isResponding && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {suggestedQuestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => suggestionClick(suggestion)}
                        className="px-3 py-2 text-sm rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--text-primary)] transition-all duration-200"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Action buttons - show on hover */}
              {!isResponding && (
                <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ActionButton
                    icon={<ClipboardIcon className="w-4 h-4" />}
                    onClick={handleCopy}
                    tooltip={t('common.operation.copy') || 'Copy'}
                  />
                  {!feedbackDisabled && !item.feedbackDisabled && (
                    <>
                      <ActionButton
                        icon={<HandThumbUpIcon className="w-4 h-4" />}
                        onClick={() => onFeedback?.(id, { rating: feedback?.rating === 'like' ? null : 'like' })}
                        isActive={feedback?.rating === 'like'}
                        tooltip={t('common.operation.like') || 'Like'}
                      />
                      <ActionButton
                        icon={<HandThumbDownIcon className="w-4 h-4" />}
                        onClick={() => onFeedback?.(id, { rating: feedback?.rating === 'dislike' ? null : 'dislike' })}
                        isActive={feedback?.rating === 'dislike'}
                        tooltip={t('common.operation.dislike') || 'Dislike'}
                      />
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
// Custom comparison function for better memoization
function arePropsEqual(prevProps: IAnswerProps, nextProps: IAnswerProps) {
  return (
    prevProps.item.id === nextProps.item.id
    && prevProps.item.content === nextProps.item.content
    && prevProps.item.feedback?.rating === nextProps.item.feedback?.rating
    && prevProps.feedbackDisabled === nextProps.feedbackDisabled
    && prevProps.isResponding === nextProps.isResponding
    && prevProps.item.agent_thoughts?.length === nextProps.item.agent_thoughts?.length
    && prevProps.item.workflowProcess?.status === nextProps.item.workflowProcess?.status
  )
}

export default React.memo(Answer, arePropsEqual)
