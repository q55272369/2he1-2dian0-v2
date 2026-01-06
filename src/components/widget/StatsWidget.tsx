import { BlogStats } from '@/src/types/blog'
import React, { useState, useEffect } from 'react'
// @ts-ignore
import { createPortal } from 'react-dom'
import { WidgetContainer } from './WidgetContainer'

// 硬编码商家编号
const SHOP_CODE = "PRO-000"

export const StatsWidget = ({ data }: { data: BlogStats }) => {
  const [showModal, setShowModal] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(SHOP_CODE)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  // 禁止背景滚动
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
        {/* 注入弹窗动画 CSS */}
        <style jsx>{`
          @keyframes modalEnter {
            0% { opacity: 0; transform: scale(0.95) translateY(10px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
          .animate-modal-enter {
            animation: modalEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>

        {/* 1. 全屏遮罩：渐变黑 + 模糊 */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 ease-out"
          onClick={() => setShowModal(false)}
        ></div>
        
        {/* 2. 弹窗主体：高级毛玻璃 + 进场动效 */}
        <div className="relative z-10 w-full max-w-[300px] overflow-hidden rounded-3xl animate-modal-enter
          bg-[#1c1c1e]/85 backdrop-blur-2xl 
          border border-white/10 
          shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          {/* 顶部高光线条 */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          <div className="p-8 text-center flex flex-col items-center">
            
            {/* 标题 */}
            <h3 className="text-xl font-bold text-white mb-2 tracking-wide drop-shadow-sm">
              👑永久会员：￥000
            </h3>
            <p className="text-xs text-gray-400 mb-6 font-medium">
              请打开网页右下角客服工具发送当前站点编号，按照指引完成注册及购买，点击复制👇
            </p>
            
            {/* 编号显示区域：深色凹陷质感 */}
            <div 
              onClick={handleCopy}
              className="group relative cursor-pointer w-full mb-6 p-4 rounded-2xl transition-all duration-300
                bg-black/30 border border-white/5 
                shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)] 
                hover:bg-black/50 hover:border-white/10"
            >
              <span className="text-2xl font-mono font-bold text-white tracking-widest block">
                {SHOP_CODE}
              </span>
              
              {/* 复制成功反馈 (覆盖层) */}
              <div className={`
                absolute inset-0 flex items-center justify-center rounded-2xl 
                bg-blue-600/90 backdrop-blur-sm
                transition-all duration-300 
                ${isCopied ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'}
              `}>
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <span>✨</span> 复制成功
                </span>
              </div>
            </div>

            {/* 关闭按钮：白色悬浮感 */}
            <button
              type="button"
              className="w-full py-3 rounded-xl text-sm font-bold text-black 
                bg-white hover:bg-gray-100 
                shadow-[0_4px_12px_rgba(255,255,255,0.1)] 
                active:scale-95 transition-all duration-200"
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

  return (
    <React.StrictMode>
      {/* 注入按钮流光动画 CSS */}
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
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        .animate-border-flow {
          background-size: 200% 200%;
          animation: borderFlow 3s ease infinite;
        }
      `}</style>

      {showModal && <Modal />}

      {/* 外部组件容器 (保持之前的完美状态) */}
      <div className="relative h-full w-full group/card transition-transform duration-300 ease-out hover:scale-[1.02]">
        
        {/* 流光边缘 */}
        <div className="absolute -inset-[1px] rounded-[26px] bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-0 group-hover/card:opacity-70 blur-sm transition-opacity duration-500 animate-border-flow"></div>

        {/* 毛玻璃卡片本体 */}
        <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-[#151516]/80 backdrop-blur-2xl">
          
          {/* 背景装饰 */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/10 rounded-full blur-[40px] pointer-events-none group-hover/card:bg-blue-600/20 transition-colors duration-500"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-600/10 rounded-full blur-[40px] pointer-events-none group-hover/card:bg-purple-600/20 transition-colors duration-500"></div>

          {/* 内容层 */}
          <div className="relative z-10 flex flex-col h-full justify-between p-6">
            
            {/* 上半部分：标题 */}
            <div className="flex-1 flex flex-col items-center justify-center">
               <h2 className="text-2xl font-extrabold text-white tracking-wide drop-shadow-lg antialiased group-hover/card:text-blue-50 transition-colors">
                 会员服务
               </h2>
            </div>

            {/* 下半部分：动效按钮组 */}
            <div className="flex flex-col gap-3 w-full mt-2"> 
                
                {/* 按钮 1：白色 + 扫光 */}
                <button 
                  onClick={() => setShowModal(true)} 
                  type="button" 
                  className="group/btn relative w-full h-9 rounded-lg overflow-hidden
                    bg-white text-black 
                    text-xs font-bold tracking-wide antialiased
                    shadow-lg shadow-white/5
                    transition-all duration-300
                    hover:shadow-white/20"
                >
                  <span className="relative z-10">👑会员价格</span>
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover/btn:animate-shimmer z-0 pointer-events-none"></div>
                </button>

                {/* 按钮 2：红色 + 扫光 */}
                <button 
                  onClick={() => window.location.href = 'https://login.1zs.top/'} 
                  type="button" 
                  className="group/btn relative w-full h-9 rounded-lg overflow-hidden
                    bg-red-600 text-white 
                    text-xs font-bold tracking-wide antialiased
                    border border-white/5
                    shadow-lg shadow-red-600/20
                    transition-all duration-300
                    hover:bg-red-500 hover:shadow-red-600/40" 
                >
                  <span className="relative z-10">前往一站式</span>
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:animate-shimmer z-0 pointer-events-none"></div>
                </button>

            </div>
          </div>
        </div>
      </div>
    </React.StrictMode>
  )
}
