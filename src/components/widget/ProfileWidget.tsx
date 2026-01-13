/* eslint-disable @next/next/no-img-element */
import { useScreenSize } from '@/src/hooks/useScreenSize'
import { classNames, isValidUrl } from '@/src/lib/util'
import Link from 'next/link'
import React from 'react' 
import { DynamicIcon } from '../DynamicIcon'

// 修正 LinkIcon 定义，移除不必要的 hasId
const LinkIcon = ({ icon }: { icon: string }) => {
  if (!icon) return null;
  if (isValidUrl(icon) || icon.startsWith('/')) {
    return (
      <img
        className="w-4 h-4 md:w-5 md:h-5 drop-shadow-sm sm:mr-1.5"
        src={icon}
        alt="icon"
      />
    )
  }
  return (
    <div className="drop-shadow-sm sm:mr-1.5">
      <DynamicIcon nameIcon={icon} propsIcon={{ size: 18 }} />
    </div>
  )
}

export const ProfileWidget = ({ data }: { data: any }) => {
  // 严格同步 Notion 数据库数据
  const avatarSrc = data?.logo?.src || data?.image || data?.avatar || '';
  const name = data?.name || 'Profile';
  const bio = data?.description || 'PRO+创作者';

  return (
    <React.StrictMode>
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

      {/* 组件容器：悬浮缩放动效 */}
      <div className="relative h-full w-full group/card transition-transform duration-300 ease-out hover:scale-[1.02]">
        
        {/* 流光边缘 */}
        <div className="absolute -inset-[1px] rounded-[26px] bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-0 group-hover/card:opacity-70 blur-sm transition-opacity duration-500 animate-border-flow"></div>

        {/* 毛玻璃卡片本体 */}
        <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-[#151516]/80 backdrop-blur-2xl">
          
          {/* 背景光斑装饰 */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/10 rounded-full blur-[40px] pointer-events-none group-hover/card:bg-blue-600/20 transition-colors duration-500"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-600/10 rounded-full blur-[40px] pointer-events-none group-hover/card:bg-purple-600/20 transition-colors duration-500"></div>

          <div className="relative z-10 flex flex-col h-full justify-between p-5 md:p-6">
            
            {/* 上半部分：内容读取自 Notion */}
            <div className="flex-1 flex flex-row items-center gap-4 md:gap-5">
                <div className="relative group/avatar shrink-0">
                  <div className="absolute -inset-1 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full blur opacity-40 transition duration-500"></div>
                  <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full ring-2 ring-white/10 overflow-hidden shadow-xl bg-neutral-800">
                    {avatarSrc ? (
                      <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl font-bold">P</div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1 min-w-0">
                    <h2 className="text-lg md:text-xl font-extrabold text-white tracking-wide antialiased truncate">
                      {name}
                    </h2>
                    <div 
                        className="text-[10px] md:text-xs text-gray-400 font-medium tracking-wide line-clamp-2 leading-snug"
                        dangerouslySetInnerHTML={{ __html: bio }} 
                    />
                </div>
            </div>

            {/* 下半部分：三个按钮 (并排缩放展示) */}
            <div className="w-full mt-5">
              {/* grid-cols-3 确保移动端也强制并排，gap-1.5 保持紧凑 */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-3 w-full">
                
                {/* 按钮 1: 入会说明 */}
                <Link
                  href="/about"
                  className="group/btn relative h-10 md:h-11 w-full rounded-xl overflow-hidden flex items-center justify-center
                    text-[10px] md:text-xs font-extrabold text-white tracking-wide antialiased
                    transition-all duration-300
                    hover:scale-[1.05] active:scale-95 shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)' }}
                >
                  <div className="relative z-10 flex items-center justify-center">
                    <LinkIcon icon="FaCrown" />
                    <span className="hidden xs:inline">入会说明</span>
                  </div>
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:animate-shimmer z-0 pointer-events-none"></div>
                </Link>

                {/* 按钮 2: 下载说明 */}
                <Link
                  href="/download"
                  className="group/btn relative h-10 md:h-11 w-full rounded-xl overflow-hidden flex items-center justify-center
                    text-[10px] md:text-xs font-extrabold text-white tracking-wide antialiased
                    transition-all duration-300
                    hover:scale-[1.05] active:scale-95 shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
                >
                  <div className="relative z-10 flex items-center justify-center">
                    <LinkIcon icon="IoMdCloudDownload" />
                    <span className="hidden xs:inline">下载说明</span>
                  </div>
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:animate-shimmer z-0 pointer-events-none"></div>
                </Link>

                {/* 按钮 3: 更多资源 */}
                <Link
                  href="/friends"
                  className="group/btn relative h-10 md:h-11 w-full rounded-xl overflow-hidden flex items-center justify-center
                    text-[10px] md:text-xs font-extrabold text-white tracking-wide antialiased
                    transition-all duration-300
                    hover:scale-[1.05] active:scale-95 shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #0284c7 100%)' }}
                >
                  <div className="relative z-10 flex items-center justify-center">
                    <LinkIcon icon="HiOutlineViewGridAdd" />
                    <span className="hidden xs:inline">更多资源</span>
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
