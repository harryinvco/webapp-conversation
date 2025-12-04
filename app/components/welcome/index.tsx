'use client'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  CodeBracketIcon,
  LightBulbIcon,
  ArrowUpIcon,
} from '@heroicons/react/24/outline'
import { SparklesIcon } from '@heroicons/react/24/solid'
import FileUploaderInAttachmentWrapper from '../base/file-uploader-in-attachment'
import type { AppInfo, PromptConfig } from '@/types/app'
import Toast from '@/app/components/base/toast'
import Select from '@/app/components/base/select'
import { DEFAULT_VALUE_MAX_LEN } from '@/config'

export interface IWelcomeProps {
  conversationName: string
  hasSetInputs: boolean
  isPublicVersion: boolean
  siteInfo: AppInfo
  promptConfig: PromptConfig
  onStartChat: (inputs: Record<string, any>) => void
  canEditInputs: boolean
  savedInputs: Record<string, any>
  onInputsChange: (inputs: Record<string, any>) => void
}

// Quick action suggestions
const suggestions = [
  {
    icon: <DocumentTextIcon className="w-5 h-5" />,
    title: 'Summarize text',
    description: 'Get a concise summary of any document',
    prompt: 'Please summarize the following text: ',
  },
  {
    icon: <CodeBracketIcon className="w-5 h-5" />,
    title: 'Help me code',
    description: 'Debug, write, or explain code',
    prompt: 'I need help with the following code: ',
  },
  {
    icon: <LightBulbIcon className="w-5 h-5" />,
    title: 'Brainstorm ideas',
    description: 'Generate creative ideas for any project',
    prompt: 'Help me brainstorm ideas for: ',
  },
  {
    icon: <ChatBubbleLeftRightIcon className="w-5 h-5" />,
    title: 'Draft a message',
    description: 'Write professional emails or messages',
    prompt: 'Help me write a professional message about: ',
  },
]

const Welcome: FC<IWelcomeProps> = ({
  conversationName,
  hasSetInputs,
  isPublicVersion,
  siteInfo,
  promptConfig,
  onStartChat,
  canEditInputs,
  savedInputs,
  onInputsChange,
}) => {
  const { t } = useTranslation()
  const hasVar = promptConfig.prompt_variables.length > 0
  const [inputValue, setInputValue] = useState('')
  const [inputs, setInputs] = useState<Record<string, any>>(() => {
    if (hasSetInputs) { return savedInputs }
    const res: Record<string, any> = {}
    if (promptConfig) {
      promptConfig.prompt_variables.forEach((item) => {
        res[item.key] = ''
      })
    }
    return res
  })

  useEffect(() => {
    if (!savedInputs) {
      const res: Record<string, any> = {}
      if (promptConfig) {
        promptConfig.prompt_variables.forEach((item) => {
          res[item.key] = ''
        })
      }
      setInputs(res)
    } else {
      setInputs(savedInputs)
    }
  }, [savedInputs, promptConfig])

  const { notify } = Toast
  const logError = (message: string) => {
    notify({ type: 'error', message, duration: 3000 })
  }

  const canChat = () => {
    const inputLens = Object.values(inputs).length
    const promptVariablesLens = promptConfig.prompt_variables.length
    const emptyInput = inputLens < promptVariablesLens || Object.entries(inputs).filter(([k, v]) => {
      const isRequired = promptConfig.prompt_variables.find(item => item.key === k)?.required ?? true
      return isRequired && v === ''
    }).length > 0
    if (emptyInput) {
      logError(t('app.errorMessage.valueOfVarRequired'))
      return false
    }
    return true
  }

  const handleChat = () => {
    if (hasVar && !canChat()) { return }
    onStartChat(inputs)
  }

  const handleSuggestionClick = (prompt: string) => {
    const firstKey = promptConfig.prompt_variables.find(v => v.type === 'string' || v.type === 'paragraph')?.key
    if (firstKey) {
      setInputs({ ...inputs, [firstKey]: prompt })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleChat()
    }
  }

  // If has set inputs already, don't show welcome
  if (hasSetInputs) { return null }

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[var(--main-bg)] px-4 py-8 overflow-y-auto">
      <div className="w-full max-w-3xl mx-auto">
        {/* Logo and greeting */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--accent-color)] mb-6">
            <SparklesIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-semibold text-[var(--text-primary)] mb-2">
            How can I help you today?
          </h1>
          <p className="text-[var(--text-muted)] text-base">
            {siteInfo.description || 'Ask me anything - I\'m here to help with questions, tasks, and creative projects.'}
          </p>
        </div>

        {/* Suggestion cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion.prompt)}
              className="flex items-start gap-3 p-4 rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] hover:bg-[var(--sidebar-hover)] transition-all duration-200 text-left group"
            >
              <div className="flex-shrink-0 p-2 rounded-lg bg-[var(--sidebar-bg)] text-[var(--text-muted)] group-hover:text-[var(--accent-color)] transition-colors">
                {suggestion.icon}
              </div>
              <div>
                <div className="text-sm font-medium text-[var(--text-primary)] mb-0.5">
                  {suggestion.title}
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  {suggestion.description}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Input area for variables or direct chat */}
        {hasVar
          ? (
            <div className="space-y-4 mb-6">
              {promptConfig.prompt_variables.map(item => (
                <div key={item.key}>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    {item.name}
                    {!item.required && <span className="text-[var(--text-muted)] ml-1">({t('app.variableTable.optional')})</span>}
                  </label>
                  {item.type === 'select' && (
                    <Select
                      className="w-full"
                      defaultValue={inputs?.[item.key]}
                      onSelect={i => setInputs({ ...inputs, [item.key]: i.value })}
                      items={(item.options || []).map(i => ({ name: i, value: i }))}
                      allowSearch={false}
                      bgClassName="bg-[var(--input-bg)]"
                    />
                  )}
                  {item.type === 'string' && (
                    <input
                      type="text"
                      placeholder={`Enter ${item.name.toLowerCase()}...`}
                      value={inputs?.[item.key] || ''}
                      onChange={e => setInputs({ ...inputs, [item.key]: e.target.value })}
                      onKeyDown={handleKeyDown}
                      className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-muted)] transition-colors"
                      maxLength={item.max_length || DEFAULT_VALUE_MAX_LEN}
                    />
                  )}
                  {item.type === 'paragraph' && (
                    <textarea
                      placeholder={`Enter ${item.name.toLowerCase()}...`}
                      value={inputs?.[item.key] || ''}
                      onChange={e => setInputs({ ...inputs, [item.key]: e.target.value })}
                      className="w-full h-24 px-4 py-3 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-muted)] transition-colors resize-none"
                    />
                  )}
                  {item.type === 'number' && (
                    <input
                      type="number"
                      placeholder={`Enter ${item.name.toLowerCase()}...`}
                      value={inputs?.[item.key] || ''}
                      onChange={e => setInputs({ ...inputs, [item.key]: e.target.value })}
                      className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-muted)] transition-colors"
                    />
                  )}
                  {item.type === 'file' && (
                    <FileUploaderInAttachmentWrapper
                      fileConfig={{
                        allowed_file_types: item.allowed_file_types,
                        allowed_file_extensions: item.allowed_file_extensions,
                        allowed_file_upload_methods: item.allowed_file_upload_methods!,
                        number_limits: 1,
                        fileUploadConfig: {} as any,
                      }}
                      onChange={files => setInputs({ ...inputs, [item.key]: files[0] })}
                      value={inputs?.[item.key] || []}
                    />
                  )}
                  {item.type === 'file-list' && (
                    <FileUploaderInAttachmentWrapper
                      fileConfig={{
                        allowed_file_types: item.allowed_file_types,
                        allowed_file_extensions: item.allowed_file_extensions,
                        allowed_file_upload_methods: item.allowed_file_upload_methods!,
                        number_limits: item.max_length,
                        fileUploadConfig: {} as any,
                      }}
                      onChange={files => setInputs({ ...inputs, [item.key]: files })}
                      value={inputs?.[item.key] || []}
                    />
                  )}
                </div>
              ))}
            </div>
          )
          : null}

        {/* Start chat button */}
        <button
          onClick={handleChat}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[var(--text-primary)] hover:bg-[var(--text-secondary)] text-[var(--main-bg)] font-medium rounded-xl transition-all duration-200"
        >
          <span>Start chatting</span>
          <ArrowUpIcon className="w-5 h-5" />
        </button>

        {/* Footer */}
        <p className="text-center text-xs text-[var(--text-muted)] mt-6">
          Chtisma can make mistakes. Please verify important information.
        </p>
      </div>
    </div>
  )
}

export default React.memo(Welcome)
