/* eslint-disable @next/next/no-img-element */
import { useScreenSize } from '@/src/hooks/useScreenSize'
import { classNames, isValidUrl } from '@/src/lib/util'
import Link from 'next/link'
import React from 'react' // 👈 关键修复：显式引入 React
import { DynamicIcon } from '../DynamicIcon'
import { WidgetContainer } from './WidgetContainer'

const LinkIcon = ({ icon, hasId }: { icon: string; hasId: boolean }) => {
  if (!icon) return null;
  if (isValidUrl(icon) || icon.startsWith('/')) {
    return (
      <img
        className="w-4 h-4 drop-shadow-sm mr-1.5"
        src={icon}
        alt="icon"
      />
    )
  }
  return (
    <div className="drop-shadow-sm mr-1.5">
      <DynamicIcon nameIcon={icon} propsIcon={{ size: 16 }} />
    </div>
  )
}

export const ProfileWidget = ({ data }: { data: any }) => {
  // 1. 强力查找头像地址
  const avatarSrc = data?.logo?.src || data?.image || data?.avatar || '';
  const name = data?.name || 'Profile';
  const bio = data?.description || 'PRO+创作者';

  return (
    <React.StrictMode>
      {/* 注入动画样式 (确保两个组件都拥有动画) */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(150%) skewX(-20deg); }
        }
        @keyframes borderFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-border-flow {
          background-size: 200% 200%;
          animation: borderFlow 3s ease infinite;
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>

      {/* 
         视觉统一：复用 StatsWidget 的外壳 
      */}
      <div className="relative h-full w-full group/card transition-transform duration-300 ease-out hover:scale-[1.02]">
        
        {/* 流光边缘 */}
        <div className="absolute -inset-[1px] rounded-[26px] bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-0 group-hover/card:opacity-70 blur-sm transition-opacity duration-500 animate-border-flow"></div>

        {/* 毛玻璃卡片本体 */}
        <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-[#151516]/80 backdrop-blur-2xl">
          
          {/* 背景装饰：左侧用紫色调 */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600/10 rounded-full blur-[40px] pointer-events-none group-hover/card:bg-purple-600/20 transition-colors duration-500"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-600/10 rounded-full blur-[40px] pointer-events-none group-hover/card:bg-blue-600/20 transition-colors duration-500"></div>

          {/* 内容层：使用 Flex 布局 */}
          <div className="relative z-10 flex flex-col h-full justify-between p-6">
            
            {/* 上半部分：头像和个人信息 (水平排列，更显高级) */}
            <div className="flex-1 flex flex-row items-center gap-5">
                {/* 头像容器 */}
                <div className="relative group/avatar shrink-0">
                  <div className="absolute -inset-1 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full blur opacity-40 group-hover/avatar:opacity-70 transition duration-500"></div>
                  <div className="relative w-16 h-16 rounded-full ring-2 ring-white/10 overflow-hidden shadow-xl bg-neutral-800">
                    {avatarSrc ? (
                      <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl">P</div>
                    )}
                  </div>
                </div>

                {/* 文字信息 */}
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-extrabold text-white tracking-wide antialiased">
                      {name}
                    </h2>
                    <div 
                        className="text-xs text-gray-400 font-medium tracking-wide line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: bio }} 
                    />
                    <a href="https://pro-plus.top" target="_blank" rel="noreferrer" className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors mt-1 flex items-center gap-1">
                       👉 详情请访问 pro-plus.top
                    </a>
                </div>
            </div>

            {/* 下半部分：功能按钮组 (Grid 布局，三等分，填满底部) */}
            <div className="w-full mt-4">
              <div className="grid grid-cols-3 gap-3 w-full">
                
                {/* 按钮 1: 入会说明 */}
                <Link
                  href="/about"
                  className="group/btn relative h-9 w-full rounded-lg overflow-hidden flex items-center justify-center
                    text-[10px] font-bold text-white tracking-wide antialiased
                    transition-all duration-300
                    hover:scale-[1.05] active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)' }}
                >
                  <div className="relative z-10 flex items-center justify-center gap-1">
                    <LinkIcon icon="FaCrown" hasId={false} />
                    <span>入会说明</span>
                  </div>
                  {/* 扫光层 */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:animate-shimmer z-0 pointer-events-none"></div>
                </Link>

                {/* 按钮 2: 下载说明 */}
                <Link
                  href="/download"
                  className="group/btn relative h-9 w-full rounded-lg overflow-hidden flex items-center justify-center
                    text-[10px] font-bold text-white tracking-wide antialiased
                    transition-all duration-300
                    hover:scale-[1.05] active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
                >
                  <div className="relative z-10 flex items-center justify-center gap-1">
                    <LinkIcon icon="IoMdCloudDownload" hasId={false} />
                    <span>下载说明</span>
                  </div>
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:animate-shimmer z-0 pointer-events-none"></div>
                </Link>

                {/* 按钮 3: 更多资源 */}
                <Link
                  href="/friends"
                  className="group/btn relative h-9 w-full rounded-lg overflow-hidden flex items-center justify-center
                    text-[10px] font-bold text-white tracking-wide antialiased
                    transition-all duration-300
                    hover:scale-[1.05] active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #0284c7 100%)' }}
                >
                  <div className="relative z-10 flex items-center justify-center gap-1">
                    <LinkIcon icon="HiOutlineViewGridAdd" hasId={false} />
                    <span>更多资源</span>
                  </div>
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:animate-shimmer z-0 pointer-events-none"></div>
                </Link>

              </div>
            </div>

          </div>
        </div>
      </div>
    </React.StrictMode>
  )
}
