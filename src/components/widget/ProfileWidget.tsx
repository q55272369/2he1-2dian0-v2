/* eslint-disable @next/next/no-img-element */
import { useScreenSize } from '@/src/hooks/useScreenSize'
import { isValidUrl } from '@/src/lib/util'
import Link from 'next/link'
import React from 'react'
import { DynamicIcon } from '../DynamicIcon'

const LinkIcon = ({ icon }: { icon: string }) => {
  if (!icon) return null;
  const size = 16;
  if (isValidUrl(icon) || icon.startsWith('/')) {
    return <img className="drop-shadow-sm mr-1.5" style={{width: size, height: size}} src={icon} alt="icon" />
  }
  return <div className="drop-shadow-sm mr-1.5"><DynamicIcon nameIcon={icon} propsIcon={{ size }} /></div>
}

export const ProfileWidget = ({ data }: { data: any }) => {
  // 1. 严格使用 Notion 数据库数据
  const avatarSrc = data?.logo?.src || data?.image || data?.avatar || '';
  const name = data?.name || 'PRO BLOG';
  const bio = data?.description || '';

  return (
    <React.StrictMode>
      {/* 复用右侧动效逻辑 */}
      <div className="relative h-full w-full group/card transition-transform duration-500 ease-out hover:scale-[1.01]">
        
        {/* 流光边缘 - 减弱亮度避免刺眼 */}
        <div className="absolute -inset-[1px] rounded-[26px] bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-cyan-500/40 opacity-0 group-hover/card:opacity-100 blur-[2px] transition-opacity animate-border-flow"></div>

        {/* 毛玻璃主体 - 减少 Padding 提高紧凑度 */}
        <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/5 shadow-xl bg-[#151516]/70 backdrop-blur-xl flex flex-col p-4 md:p-5">
          
          {/* 背景极光微调 */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-600/5 rounded-full blur-[30px] pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-600/5 rounded-full blur-[30px] pointer-events-none"></div>

          <div className="relative z-10 flex flex-col h-full justify-between">
            
            {/* 上半部分：头像 + 文字内容 */}
            <div className="flex flex-row items-center gap-4">
                {/* 头像缩小 */}
                <div className="relative shrink-0">
                  <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full ring-1 ring-white/10 overflow-hidden bg-neutral-800">
                    {avatarSrc ? <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg">P</div>}
                  </div>
                </div>

                {/* 只读取 Notion 文字，不添加硬编码内容 */}
                <div className="flex flex-col min-w-0">
                    <h2 className="text-base md:text-lg font-bold text-white tracking-tight antialiased truncate">
                      {name}
                    </h2>
                    <p className="text-[10px] md:text-xs text-gray-400 font-medium line-clamp-2 leading-tight antialiased">
                      {bio}
                    </p>
                </div>
            </div>

            {/* 下半部分：三个按钮 (细长比例还原) */}
            <div className="w-full mt-4">
              <div className="grid grid-cols-3 gap-2 w-full">
                
                {/* 按钮样式：h-9 保持细长，文字 text-[10px] 保持精致 */}
                <Link href="/about" className="group/btn relative h-8 md:h-9 w-full rounded-lg overflow-hidden flex items-center justify-center text-[10px] font-bold text-white transition-all hover:brightness-110 active:scale-95" style={{ background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)' }}>
                  <div className="relative z-10 flex items-center justify-center w-full"><LinkIcon icon="FaCrown" /><span className="hidden sm:inline">入会说明</span><span className="sm:hidden">入会</span></div>
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer z-0"></div>
                </Link>

                <Link href="/download" className="group/btn relative h-8 md:h-9 w-full rounded-lg overflow-hidden flex items-center justify-center text-[10px] font-bold text-white transition-all hover:brightness-110 active:scale-95" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                  <div className="relative z-10 flex items-center justify-center w-full"><LinkIcon icon="IoMdCloudDownload" /><span className="hidden sm:inline">下载说明</span><span className="sm:hidden">下载</span></div>
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer z-0"></div>
                </Link>

                <Link href="/friends" className="group/btn relative h-8 md:h-9 w-full rounded-lg overflow-hidden flex items-center justify-center text-[10px] font-bold text-white transition-all hover:brightness-110 active:scale-95" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #0284c7 100%)' }}>
                  <div className="relative z-10 flex items-center justify-center w-full"><LinkIcon icon="HiOutlineViewGridAdd" /><span className="hidden sm:inline">更多资源</span><span className="sm:hidden">资源</span></div>
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer z-0"></div>
                </Link>

              </div>
            </div>

          </div>
        </div>
      </div>
    </React.StrictMode>
  )
}
