/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
// @ts-ignore
import { createPortal } from 'react-dom'

// 硬编码站长ID
const SHOP_CODE = "PRO-0000"

export const StatsWidget = ({ data }: { data: any }) => {
  const [showModal, setShowModal] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  // 1. 数据解析
  const post = data || {};
  
  // 🚫 彻底移除图片逻辑，只使用纯色背景
  
  const title = post.title || '暂无公告';
  const summary = post.summary || post.excerpt || '暂无详细内容...';
  const slug = post.slug ? `/post/${post.slug}` : null;

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
          @keyframes modalEnter { 
            0% { opacity: 0; transform: scale(0.95) translateY(10px); } 
            100% { opacity: 1; transform: scale(1) translateY(0); } 
          }
          .animate-modal-enter { animation: modalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        `}</style>

        {/* 遮罩 */}
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
          onClick={() => setShowModal(false)}
        ></div>
        
        {/* 弹窗主体：保持高级但干净 */}
        <div className="relative z-10 w-full max-w-[300px] overflow-hidden rounded-2xl animate-modal-enter
          bg-[#1c1c1e] border border-white/10 shadow-2xl"
        >
          {/* 顶部微光装饰，保留一点点质感 */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

          <div className="p-8 text-center flex flex-col items-center">
            {/* 图标 */}
            <div className="mb-4 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <span className="text-xl">🆔</span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2 tracking-wide">
              已认证✅
            </h3>
            <p className="text-xs text-gray-400 mb-6 font-medium leading-relaxed">
              您可以通过网页右下角在线客服发送ID用于验证或举报
            </p>
            
            {/* 编号显示区 */}
            <div 
              onClick={handleCopy}
              className="group relative w-full cursor-pointer mb-6 p-4 bg-black/40 rounded-xl border border-white/5 
                transition-all duration-200 active:scale-95"
            >
              <div className="text-center">
                <span className="text-xl font-mono font-bold text-gray-200 tracking-wider group-hover:text-white transition-colors">
                  {SHOP_CODE}
                </span>
              </div>
              
              {/* 复制反馈 */}
              <div className={`
                absolute inset-0 flex items-center justify-center rounded-xl 
                bg-blue-600 transition-all duration-200 
                ${isCopied ? 'opacity-100 visible' : 'opacity-0 invisible'}
              `}>
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  复制成功 ✅
                </span>
              </div>
            </div>

            <button
              type="button"
              className="w-full py-2.5 rounded-lg bg-white text-black text-xs font-bold tracking-wide hover:bg-gray-200 transition-colors"
              onClick={() => setShowModal(false)}
            >
              关闭
            </button>
          </div>
        </div>
      </div>,
      document.body
    )
  }

  // --- 动态渲染标签 ---
  // @ts-ignore
  const Wrapper = slug ? Link : 'div';
  // @ts-ignore
  const wrapperProps = slug 
    ? { href: slug, className: "flex-1 flex flex-col justify-center group/text cursor-pointer relative z-20" } 
    : { className: "flex-1 flex flex-col justify-center relative z-20 opacity-80" };

  return (
    <React.StrictMode>
      <style jsx global>{`
        @keyframes borderFlow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-border-flow { background-size: 200% 200%; animation: borderFlow 3s ease infinite; }
      `}</style>

      {showModal && <Modal />}

      <div className="relative h-full w-full group/card transition-transform duration-500 ease-out hover:scale-[1.015]">
        
        {/* 流光边缘 (保留，这是组件风格统一的关键) */}
        <div className="absolute -inset-[1px] rounded-[26px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-0 group-hover/card:opacity-70 blur-sm transition-opacity duration-500 animate-border-flow"></div>

        {/* 主体容器 */}
        <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-[#151516] flex flex-col">
          
          {/* ================= 背景图层 (纯净版) ================= */}
          <div className="absolute inset-0 z-0">
             {/* 
                回归最简单的深靛蓝到紫色的渐变 
                去掉了所有的纹理叠加、噪点滤镜和复杂光斑
             */}
             <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900">
                 {/* 只保留一个极淡的右上角光晕，增加一点点体积感，不花哨 */}
                 <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-[40px]"></div>
             </div>
             
             {/* 底部黑色渐变，确保文字清晰 */}
             <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
          </div>

          {/* ================= 内容层 ================= */}
          <div className="relative z-10 flex flex-col h-full justify-between p-5 md:p-6">
            
            {/* 上半部分：公告内容 */}
            {/* @ts-ignore */}
            <Wrapper {...wrapperProps}>
               <div className="mb-2 flex items-center gap-1.5 opacity-90">
                 <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
                 <span className="text-[10px] font-bold text-white/80 tracking-widest uppercase">公告</span>
               </div>

               <h2 className="text-xl md:text-2xl font-extrabold text-white leading-tight tracking-tight mb-2 group-hover/text:text-purple-300 transition-colors line-clamp-2">
                 {title}
               </h2>

               <p className="text-xs text-gray-300/90 font-medium line-clamp-2 leading-relaxed">
                 {summary}
               </p>
            </Wrapper>

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
