/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react'
// @ts-ignore
import { createPortal } from 'react-dom'
import Link from 'next/link'

// 硬编码商家编号
const SHOP_CODE = "PRO-001A"

// 默认兜底背景图
const DEFAULT_COVER = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"

export const StatsWidget = ({ data }: { data: any[] }) => {
  const [showModal, setShowModal] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // 轮播状态
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 1. 数据源判断与处理
  // 如果传入的 data 有内容，就用 data；否则使用兜底数据
  const hasData = data && Array.isArray(data) && data.length > 0;
  
  const announcements = hasData ? data : [
    {
      id: 'default',
      title: '暂无公告',
      slug: '#', 
      excerpt: '请在 Notion 中添加 type 为 Announcement 的内容...',
      cover: DEFAULT_COVER
    }
  ]

  const currentPost = announcements[currentIndex]

  // 2. 关键修复：精准映射你的数据库字段
  // 优先读取你截图里的 'cover' 字段，如果没有才读默认的 'page_cover'
  const coverImage = currentPost.cover || currentPost.page_cover || DEFAULT_COVER
  
  // 优先读取你截图里的 'excerpt' 字段，如果没有才读 'summary'
  const summaryText = currentPost.excerpt || currentPost.summary || ''
  
  // 3. 路由处理：直接跳转到 /[slug]
  const href = currentPost.slug === '#' 
    ? '#' 
    : (currentPost.slug.startsWith('/') ? currentPost.slug : `/${currentPost.slug}`)

  // 自动轮播
  useEffect(() => {
    if (announcements.length <= 1) return
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % announcements.length)
        setIsAnimating(false)
      }, 500)
    }, 5000)
    return () => clearInterval(interval)
  }, [announcements.length])

  const handleCopy = () => {
    navigator.clipboard.writeText(SHOP_CODE)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  // 弹窗组件
  const Modal = () => {
    if (!mounted) return null
    // @ts-ignore
    return createPortal(
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
        <style jsx>{`
          @keyframes modalEnter { 0% { opacity: 0; transform: scale(0.95) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
          .animate-modal-enter { animation: modalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        `}</style>
        
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
          onClick={() => setShowModal(false)}
        ></div>
        
        <div className="relative z-10 w-full max-w-[260px] overflow-hidden rounded-2xl animate-modal-enter
          bg-[#1c1c1e]/90 backdrop-blur-2xl border border-white/10 shadow-2xl p-5 text-center"
        >
          <h3 className="text-lg font-bold text-white mb-4 tracking-wide">
            我的 PRO ID
          </h3>
          
          <div 
            onClick={handleCopy}
            className="group relative cursor-pointer mb-4 p-3 bg-black/40 rounded-xl border border-white/5 shadow-inner hover:border-blue-500/50 transition-colors"
          >
            <span className="text-xl font-mono font-bold text-white tracking-widest select-all">
              {SHOP_CODE}
            </span>
            <div className={`absolute inset-0 flex items-center justify-center rounded-xl bg-blue-600 transition-all duration-200 ${isCopied ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
              <span className="text-xs font-bold text-white">已复制 ✅</span>
            </div>
          </div>

          <button
            onClick={() => setShowModal(false)}
            className="w-full py-2 rounded-lg bg-white text-black text-xs font-bold hover:bg-gray-200 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>,
      document.body
    )
  }

  return (
    <React.StrictMode>
      {showModal && <Modal />}

      {/* 外部容器 */}
      <div className="relative h-full w-full group/card transition-transform duration-500 ease-out hover:scale-[1.015]">
        
        {/* 流光边缘 */}
        <div className="absolute -inset-[1px] rounded-[26px] bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-0 group-hover/card:opacity-100 blur-[2px] transition-opacity duration-500"></div>

        {/* 主体 */}
        <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-[#151516] flex flex-col">
          
          {/* ================= 背景图层 ================= */}
          <div className="absolute inset-0 z-0">
             <div className={`absolute inset-0 transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                <img 
                  src={coverImage} 
                  alt="cover" 
                  className="w-full h-full object-cover opacity-70" // 提高一点透明度让图片更清晰
                />
             </div>
             {/* 遮罩：保证文字可读 */}
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          </div>

          {/* ================= 内容层 ================= */}
          <div className="relative z-10 flex flex-col h-full justify-between p-6">
            
            {/* 上半部分：公告内容 */}
            <Link 
              href={href} 
              className={`flex-1 flex flex-col justify-center group/text ${currentPost.slug === '#' ? 'cursor-default' : 'cursor-pointer'}`}
            >
               {/* 标题：font-extrabold */}
               <h2 className={`text-xl font-extrabold text-white leading-tight tracking-tight mb-3 drop-shadow-md transition-opacity duration-500 ${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'} ${currentPost.slug !== '#' && 'group-hover/text:text-blue-300'} transition-colors`}>
                 {currentPost.title}
               </h2>
               
               {/* 摘要：调用 excerpt */}
               <p className={`text-xs text-gray-200 font-medium line-clamp-2 leading-relaxed transition-opacity duration-500 delay-75 ${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                 {summaryText}
               </p>
            </Link>

            {/* 下半部分：PRO ID 按钮 */}
            <div className="w-full mt-4 border-t border-white/20 pt-4">
              <button 
                onClick={() => setShowModal(true)} 
                className="group/btn relative w-full h-10 rounded-xl overflow-hidden
                  bg-white/10 backdrop-blur-md border border-white/20
                  text-xs font-bold text-white tracking-wide
                  transition-all duration-300
                  hover:bg-white/20 hover:border-white/40 active:scale-95 shadow-lg"
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                  <span>🆔</span>
                  <span>我的 PRO ID</span>
                </div>
                <style jsx>{`@keyframes shimmer { 0% { transform: translateX(-150%) skewX(-20deg); } 100% { transform: translateX(150%) skewX(-20deg); } } .animate-shimmer { animation: shimmer 1.5s infinite; }`}</style>
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-shimmer z-0"></div>
              </button>
            </div>

          </div>
        </div>
      </div>
    </React.StrictMode>
  )
}
