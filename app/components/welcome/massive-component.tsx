'use client'
import type { FC } from 'react'
import React from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import {
  PencilIcon,
  MegaphoneIcon,
} from '@heroicons/react/24/solid'
import s from './style.module.css'
import type { AppInfo } from '@/types/app'
import Button from '@/app/components/base/button'

export const AppInfoComp: FC<{ siteInfo: AppInfo }> = ({ siteInfo }) => {
  return (
    <div className='flex flex-col items-center'>
      <img src="/chtisma-logo.png" alt="Chtisma" className="w-40 h-40 object-contain mb-6 drop-shadow-lg" />
      <div className='flex items-center py-2 text-2xl font-bold text-red-700 rounded-md'>
        <span>Welcome to Chtisma AI</span>
      </div>
      <p className='text-sm text-gray-500 text-center'>{siteInfo.description}</p>
    </div>
  )
}

export const QuickAction: FC<{
  icon: React.ReactNode
  title: string
  description: string
  onClick: () => void
}> = ({ icon, title, description, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col p-4 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-red-300 hover:shadow-md transition-all duration-200 group"
    >
      <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600 mb-3 group-hover:bg-red-100 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-xs text-gray-500 line-clamp-2">{description}</p>
    </div>
  )
}

export const Announcement: FC<{
  title: string
  date: string
  content: string
}> = ({ title, date, content }) => {
  return (
    <div className="p-4 bg-red-50 rounded-xl border border-red-100">
      <div className="flex items-start space-x-3">
        <MegaphoneIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
          <span className="text-xs text-red-500 block mb-1">{date}</span>
          <p className="text-xs text-gray-600">{content}</p>
        </div>
      </div>
    </div>
  )
}

export const PromptTemplate: FC<{ html: string }> = ({ html }) => {
  return (
    <div
      className={' box-border text-sm text-gray-700'}
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  )
}

export const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.75 1C2.75 0.723858 2.52614 0.5 2.25 0.5C1.97386 0.5 1.75 0.723858 1.75 1V1.75H1C0.723858 1.75 0.5 1.97386 0.5 2.25C0.5 2.52614 0.723858 2.75 1 2.75H1.75V3.5C1.75 3.77614 1.97386 4 2.25 4C2.52614 4 2.75 3.77614 2.75 3.5V2.75H3.5C3.77614 2.75 4 2.52614 4 2.25C4 1.97386 3.77614 1.75 3.5 1.75H2.75V1Z" fill="#DC2626" />
    <path d="M2.75 8.5C2.75 8.22386 2.52614 8 2.25 8C1.97386 8 1.75 8.22386 1.75 8.5V9.25H1C0.723858 9.25 0.5 9.47386 0.5 9.75C0.5 10.0261 0.723858 10.25 1 10.25H1.75V11C1.75 11.2761 1.97386 11.5 2.25 11.5C2.52614 11.5 2.75 11.2761 2.75 11V10.25H3.5C3.77614 10.25 4 10.0261 4 9.75C4 9.47386 3.77614 9.25 3.5 9.25H2.75V8.5Z" fill="#DC2626" />
    <path d="M6.96667 1.32051C6.8924 1.12741 6.70689 1 6.5 1C6.29311 1 6.10759 1.12741 6.03333 1.32051L5.16624 3.57494C5.01604 3.96546 4.96884 4.078 4.90428 4.1688C4.8395 4.2599 4.7599 4.3395 4.6688 4.40428C4.578 4.46884 4.46546 4.51604 4.07494 4.66624L1.82051 5.53333C1.62741 5.60759 1.5 5.79311 1.5 6C1.5 6.20689 1.62741 6.39241 1.82051 6.46667L4.07494 7.33376C4.46546 7.48396 4.578 7.53116 4.6688 7.59572C4.7599 7.6605 4.8395 7.7401 4.90428 7.8312C4.96884 7.922 5.01604 8.03454 5.16624 8.42506L6.03333 10.6795C6.1076 10.8726 6.29311 11 6.5 11C6.70689 11 6.89241 10.8726 6.96667 10.6795L7.83376 8.42506C7.98396 8.03454 8.03116 7.922 8.09572 7.8312C8.1605 7.7401 8.2401 7.6605 8.3312 7.59572C8.422 7.53116 8.53454 7.48396 8.92506 7.33376L11.1795 6.46667C11.3726 6.39241 11.5 6.20689 11.5 6C11.5 5.79311 11.3726 5.60759 11.1795 5.53333L8.92506 4.66624C8.53454 4.51604 8.422 4.46884 8.3312 4.40428C8.2401 4.3395 8.1605 4.2599 8.09572 4.1688C8.03116 4.078 7.98396 3.96546 7.83376 3.57494L6.96667 1.32051Z" fill="#DC2626" />
  </svg>
)

export const ChatBtn: FC<{ onClick: () => void, className?: string }> = ({
  className,
  onClick,
}) => {
  const { t } = useTranslation()
  return (
    <Button
      type='primary'
      className={cn(className, `space-x-2 flex items-center ${s.customBtn} !bg-red-600 hover:!bg-red-700`)}
      onClick={onClick}
    >
      <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M18 10.5C18 14.366 14.418 17.5 10 17.5C8.58005 17.506 7.17955 17.1698 5.917 16.52L2 17.5L3.338 14.377C2.493 13.267 2 11.934 2 10.5C2 6.634 5.582 3.5 10 3.5C14.418 3.5 18 6.634 18 10.5ZM7 9.5H5V11.5H7V9.5ZM15 9.5H13V11.5H15V9.5ZM9 9.5H11V11.5H9V9.5Z" fill="white" />
      </svg>
      {t('app.chat.startChat')}
    </Button>
  )
}

export const EditBtn = ({ className, onClick }: { className?: string, onClick: () => void }) => {
  const { t } = useTranslation()

  return (
    <div
      className={cn('px-2 flex space-x-1 items-center rounded-md  cursor-pointer', className)}
      onClick={onClick}
    >
      <PencilIcon className='w-3 h-3' />
      <span>{t('common.operation.edit')}</span>
    </div>
  )
}

export const ChtismaLogo = () => (
  <div className={s.chtismaLogo} />
)

export const InnovacoLogo = () => (
  <div className={s.logo} />
)
