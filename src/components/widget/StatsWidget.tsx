/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
// @ts-ignore
import { createPortal } from 'react-dom'

// 硬编码站长ID
const SHOP_CODE = "PRO-001A"

export const StatsWidget = ({ data }: { data: any }) => {
  const [showModal, setShowModal] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  // 1. 数据解析修正
  const post = data || {};
  
  // 📸 核心修复：直接读取 cover 字符串，不再找 .source
  // formatPosts 处理后的 cover 就是 url 字符串
  const coverSrc = post.cover || post.pageCover || ''; 
  
  const title = post.title || '暂无公告';
  const summary = post.summary || post.excerpt || '暂无详细内容...';
  
  // 🔗 链接修复：确保 slug 存在
  const slug = post.slug;

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(SHOP_CODE)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [showModal])

  // --- 弹窗组件 ---
  const Modal = () => {
    if (!mounted) return null
    // @ts-ignore
    return createPortal(
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
        <style jsx>{`
          @keyframes modalEnter { 0% { opacity: 0; transform: scale(0.95) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
          .animate-modal-enter { animation: modalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        `}</style>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={() => setShowModal(false)}></div>
        <div className="relative z-10 w-full max-w-[260px] overflow-hidden rounded-2xl animate-modal-enter bg-[#1c1c1e]/90 backdrop-blur-xl border border-white/10 shadow-2xl text-center p-6">
          <h3 className="text-base font-bold text-white mb-4 tracking-wide">站长 ID</h3>
          <div onClick={handleCopy} className="group relative cursor-pointer p-3 bg-black/50 rounded-xl border border-white/5 hover:border-blue-500/50 transition-all active:scale-95">
            <span className="text-xl font-mono font-bold text-white tracking-wider">{SHOP_CODE}</span>
            <div className={`absolute inset-0 flex items-center justify-center rounded-xl bg-blue-600 transition-all duration-200 ${isCopied ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
              <span className="text-xs font-bold text-white">已复制 ✅</span>
            </div>
          </div>
          <button className="mt-5 w-full py-2 rounded-lg bg-white text-black text-xs font-bold hover:bg-gray-200 transition-colors" onClick={() => setShowModal(false)}>关闭</button>
        </div>
      </div>,
      document.body
    )
  }

  // --- 内部内容组件 (复用) ---
  const CardContent = () => (
    <>
      <div className="mb-2 flex items-center gap-1.5 opacity-90">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-[10px] font-bold text-white/80 tracking-widest uppercase">公告</span>
      </div>
      <h2 className="text-xl md:text-2xl font-extrabold text-white leading-tight tracking-tight mb-2 group-hover/text:text-purple-300 transition-colors line-clamp-2">
          {title}
      </h2>
      <p className="text-xs text-gray-300/90 font-medium line-clamp-2 leading-relaxed">
          {summary}
      </p>
    </>
  );

  return (
    <React.StrictMode>
      <style jsx global>{`
        @keyframes borderFlow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-border-flow { background-size: 200% 200%; animation: borderFlow 3s ease infinite; }
      `}</style>

      {showModal && <Modal />}

      <div className="relative h-full w-full group/card transition-transform duration-500 ease-out hover:scale-[1.015]">
        <div className="absolute -inset-[1px] rounded-[26px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-0 group-hover/card:opacity-70 blur-sm transition-opacity duration-500 animate-border-flow"></div>
        <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-[#151516] flex flex-col">
          
          {/* 背景图层 */}
          <div className="absolute inset-0 z-0">
            {coverSrc ? (
              <img 
                src={coverSrc} 
                alt={title} 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-110 opacity-90"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-[40px]"></div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20"></div>
          </div>

          <div className="relative z-10 flex flex-col h-full justify-between p-5 md:p-6">
            
            {/* 上半部分：公告内容 */}
            {/* 🛑 修复跳转逻辑：显式使用 Link 或 div，不再使用动态组件，避免 Hydration 错误 */}
            {slug ? (
              <Link href={`/post/${slug}`} className="flex-1 flex flex-col justify-center group/text cursor-pointer relative z-20">
                <CardContent />
              </Link>
            ) : (
              <div className="flex-1 flex flex-col justify-center relative z-20 opacity-80 cursor-default">
                <CardContent />
              </div>
            )}

            {/* 下半部分：站长 ID 按钮 */}
            <div className="w-full mt-4 relative z-20">
              <button 
                onClick={(e) => {
                  e.preventDefault(); 
                  e.stopPropagation();
                  setShowModal(true);
                }} 
                type="button" 
                className="w-full h-9 rounded-xl flex items-center justify-center gap-2
                  bg-white/10 backdrop-blur-md border border-white/10
                  text-xs font-bold text-white tracking-wide
                  transition-all duration-300
                  hover:bg-white/20 hover:scale-[1.02] active:scale-95 active:bg-white/5"
              >
                <span className="text-sm">🆔</span>
                <span>站长 ID</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </React.StrictMode>
  )
}
