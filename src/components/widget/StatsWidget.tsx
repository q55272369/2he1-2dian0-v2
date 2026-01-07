import { BlogStats } from '@/src/types/blog'
import React, { useState, useEffect, useCallback } from 'react'
// @ts-ignore
import { createPortal } from 'react-dom'
import { WidgetContainer } from './WidgetContainer'

const SHOP_CODE = "PRO-001A"
const ONE_STOP_URL = "https://login.1zs.top/"

/**
 * 独立 Modal 组件
 */
const MemberModal = ({ isOpen, onClose, isCopied, onCopy }: any) => {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  if (!mounted || !isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative z-10 w-full max-w-[300px] overflow-hidden rounded-3xl bg-[#1c1c1e]/90 backdrop-blur-2xl border border-white/10 shadow-2xl animate-modal-enter">
        <div className="p-8 text-center flex flex-col items-center">
          <h3 className="text-xl font-bold text-white mb-2">👑永久会员：￥000</h3>
          <p className="text-xs text-gray-400 mb-6 leading-relaxed px-2">请打开网页右下角客服工具发送当前站点编号，按照指引完成注册及购买，点击复制👇</p>
          
          <div onClick={onCopy} className="group relative cursor-pointer w-full mb-6 p-4 rounded-2xl bg-black/40 border border-white/5 transition-all hover:bg-black/60">
            <span className="text-2xl font-mono font-bold text-white tracking-widest block">{SHOP_CODE}</span>
            <div className={`absolute inset-0 flex items-center justify-center rounded-2xl bg-blue-600/90 transition-all ${isCopied ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
              <span className="text-xs font-bold text-white">✨ 复制成功</span>
            </div>
          </div>
          
          <button type="button" className="w-full py-3 rounded-xl text-sm font-bold text-black bg-white active:scale-95 transition-transform" onClick={onClose}>
            关闭
          </button>

          <p className="mt-6 text-[10px] text-gray-500/60 font-light tracking-wide leading-relaxed">
            当前服务由 PRO+ 寄售平台提供支持 · 详情请查看{' '}
            <a 
              href="https://pro-plus.top" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition-colors underline decoration-gray-500/30 underline-offset-2 cursor-pointer"
            >
              pro-plus.top
            </a>
          </p>
        </div>
      </div>
      <style jsx>{` @keyframes modalEnter { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } } .animate-modal-enter { animation: modalEnter 0.3s ease-out forwards; } `}</style>
    </div>,
    document.body
  )
}

/**
 * 主挂件组件
 */
export const StatsWidget = ({ data }: { data: BlogStats }) => {
  const [showModal, setShowModal] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const handleCopy = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(SHOP_CODE)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }, [])

  if (!mounted) return null

  return (
    <WidgetContainer>
      <style jsx global>{`
        @keyframes shimmer { 0% { transform: translateX(-150%) skewX(-20deg); } 100% { transform: translateX(150%) skewX(-20deg); } }
        @keyframes borderFlow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-shimmer { animation: shimmer 2s infinite linear; }
        .animate-border-flow { background-size: 200% 200%; animation: borderFlow 4s ease infinite; }
      `}</style>

      {showModal && (
        <MemberModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
          isCopied={isCopied} 
          onCopy={handleCopy} 
        />
      )}

      <div className="relative h-full w-full group/card transition-all duration-300">
        <div className="absolute -inset-[1px] rounded-[26px] bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-0 group-hover/card:opacity-70 blur-sm animate-border-flow transition-opacity"></div>

        {/* 容器增加 pb-5 (原本 padding 可能不均)，确保底部有呼吸感 */}
        <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-[#151516]/80 backdrop-blur-2xl p-4 sm:p-6 flex flex-col justify-between min-h-[190px]">
          
          {/* 标题区域 */}
          <div className="flex items-center justify-center gap-2.5 mb-2 sm:mb-4 mt-1">
             <h2 className="text-lg sm:text-2xl font-extrabold text-white tracking-wide antialiased">
               会员服务
             </h2>
             <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
             </span>
          </div>

          {/* 按钮区域 */}
          <div className="flex flex-col gap-2 sm:gap-3 w-full"> 
              <button 
                onClick={() => setShowModal(true)} 
                type="button" 
                className="group/btn relative w-full h-8 sm:h-10 rounded-lg sm:rounded-xl overflow-hidden
                  bg-white text-black text-[10px] sm:text-xs font-black tracking-widest transition-all active:scale-95"
              >
                <span className="relative z-10">👑 会员价格</span>
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover/btn:animate-shimmer z-0"></div>
              </button>

              <button 
                onClick={() => window.open(ONE_STOP_URL, '_blank')} 
                type="button" 
                className="group/btn relative w-full h-8 sm:h-10 rounded-lg sm:rounded-xl overflow-hidden
                  bg-red-600 text-white text-[10px] sm:text-xs font-black tracking-widest transition-all active:scale-95 shadow-lg shadow-red-900/20" 
              >
                <span className="relative z-10">前往一站式</span>
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer z-0"></div>
              </button>
          </div>
          
          {/* 底部信息：改为右对齐，并增加 pb-1 让它上浮一点 */}
          <div className="mt-auto pt-4 flex justify-end items-center pr-1 pb-1">
            <span className="text-[7px] sm:text-[9px] text-gray-500/50 font-bold tracking-[0.1em] uppercase antialiased">
              PRO+ SUPPORT
            </span>
          </div>
        </div>
      </div>
    </WidgetContainer>
  )
}
