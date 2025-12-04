'use client'
import type { FC } from 'react'
import React from 'react'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import type { IChatItem } from '../type'

import ImageGallery from '@/app/components/base/image-gallery'

type IQuestionProps = Pick<IChatItem, 'id' | 'content' | 'useCurrentUserAvatar'> & {
  imgSrcs?: string[]
}

const Question: FC<IQuestionProps> = ({ id, content, useCurrentUserAvatar, imgSrcs }) => {
  return (
    <div key={id} className="animate-fade-in">
      {/* ChatGPT-style user message layout */}
      <div className="py-4 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-4">
            {/* User Avatar */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-[var(--sidebar-hover)] flex items-center justify-center overflow-hidden">
                <UserCircleIcon className="w-8 h-8 text-[var(--text-muted)]" />
              </div>
            </div>

            {/* Message Content */}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-[var(--text-primary)] text-sm mb-1">You</div>

              <div className="text-[var(--text-primary)] text-[15px] leading-relaxed">
                {imgSrcs && imgSrcs.length > 0 && (
                  <div className="mb-3">
                    <ImageGallery srcs={imgSrcs} />
                  </div>
                )}
                <div className="prose prose-invert max-w-none whitespace-pre-wrap">
                  {content}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(Question)
