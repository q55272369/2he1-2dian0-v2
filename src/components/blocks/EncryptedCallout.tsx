import React, { useState, useEffect, useRef } from 'react'
import { Callout } from './BasicBlock'

export const EncryptedCallout = ({ block, children }: { block: any; children: any }) => {
  // 1. 获取内容与解析
  const richText = block.callout?.rich_text || [];
  const rawText = richText.map((t: any) => t.plain_text).join('') || '';
  const lockMatch = rawText.match(/^LOCK:\s*(.+)$/);
  const isLockedBlock = !!lockMatch;

  if (!isLockedBlock) {
    return <Callout block={block}>{children}</Callout>;
  }

  const correctPassword = lockMatch[1].trim();
  const [input, setInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (localStorage.getItem(`unlocked-${block.id}`) === 'true') {
      setIsUnlocked(true);
    }
  }, [block.id]);

  const handleUnlock = () => {
    if (input === correctPassword) {
      setIsUnlocked(true);
      setError(false);
      localStorage.setItem(`unlocked-${block.id}`, 'true');
    } else {
      setError(true);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
         navigator.vibrate(200);
      }
    }
  };

  // 🎨 预处理 Block (解锁后)
  const cleanBlock = {
    ...block,
    callout: {
      ...block.callout,
      rich_text: [], // 清空标题文字
      icon: null     // 🚫 关键优化：清空图标，防止占据顶部空间
    }
  };

  // ✂️ 内容裁切逻辑 (核心优化)
  // 如果已解锁，我们移除第一个子元素（即那条分割线）
  // 这样就能完美消除分割线带来的横线和上下间距
  const childrenArray = React.Children.toArray(children);
  const unlockedContent = isUnlocked && childrenArray.length > 0 
      ? childrenArray.slice(1) // 切掉第一个(分割线)
      : childrenArray;

  return (
    <div 
        ref={containerRef}
        className={`
            relative my-8 rounded-2xl shadow-2xl group border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black transition-all duration-500 ease-in-out
            ${isUnlocked ? 'border-none shadow-none bg-transparent' : ''} 
        `}
    >
      
      {/* =========================================================
          内容层
          1. 锁定状态：限制高度，模糊
          2. 解锁状态：无限制，清除 padding
      ========================================================= */}
      <div 
        className={`
          relative w-full transition-all duration-700 ease-in-out
          ${isUnlocked ? 'max-h-full opacity-100' : 'max-h-[450px] overflow-hidden'}
          
          /* 🔧 关键 CSS 修正：
             当解锁后，强制移除 Callout 内部默认的 padding，
             让内容直接顶格显示，消除留白。
          */
          [&_.notion-callout]:!p-0
          [&_.notion-callout]:!bg-transparent
          [&_.notion-callout]:!border-none
          [&_.notion-callout]:!m-0
        `}
      >
        
        <div 
            className={`
                h-full w-full
                ${!isUnlocked && 'filter blur-2xl scale-105 opacity-50 pointer-events-none select-none'}
            `}
        >
            <Callout block={cleanBlock}>
                {/* 传入处理过的内容（去掉了分割线） */}
                {unlockedContent}
            </Callout>
        </div>

        {/* 覆盖层：未解锁时的底部遮罩 */}
        {!isUnlocked && (
             <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-[#121212] to-transparent z-10"></div>
        )}

      </div>


      {/* =========================================================
          锁界面 UI (Overlay)
      ========================================================= */}
      {!isUnlocked && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4">
          <div className="relative z-30 flex flex-col items-center w-full max-w-sm p-6 rounded-2xl bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg">
            <h3 className="font-extrabold text-2xl mb-2 text-neutral-900 dark:text-white drop-shadow-md">
              受保护的内容
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-6 font-medium text-center">
              内容已隐藏，请输入密码查看。
            </p>
            <div className="w-full flex flex-col gap-3">
              <input 
                type="password" 
                placeholder="访问密码"
                className={`
                  w-full px-4 py-3 rounded-xl text-center font-bold tracking-widest
                  text-neutral-900 
                  bg-white/60 dark:bg-black/50
                  border-2 backdrop-blur-xl outline-none transition-all
                  placeholder-neutral-500 placeholder:font-normal placeholder:tracking-normal
                  ${error 
                    ? 'border-red-500 ring-2 ring-red-500/30' 
                    : 'border-white/30 dark:border-white/10 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/30'
                  }
                `}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if(error) setError(false);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
              />
              <button 
                onClick={handleUnlock}
                className={`
                  w-full px-6 py-3 rounded-xl font-bold text-white
                  bg-blue-600 hover:bg-blue-500
                  border-b-[4px] border-blue-800 hover:border-blue-700
                  active:border-b-0 active:translate-y-[4px]
                  shadow-lg shadow-blue-900/40
                  transition-all duration-100
                `}
              >
                解锁
              </button>
            </div>
            <div className={`
              mt-3 px-3 py-1 rounded-full text-xs font-bold text-red-600 bg-red-100/90 backdrop-blur-sm
              transition-all duration-300 transform
              ${error ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-90 pointer-events-none absolute'}
            `}>
              密码错误
            </div>
          </div>
        </div>
      )}

      {/* 解锁后的控制按钮 */}
      {isUnlocked && (
        <div className="absolute top-0 right-0 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <button 
             onClick={() => {
               localStorage.removeItem(`unlocked-${block.id}`);
               setIsUnlocked(false);
               if (containerRef.current) {
                   containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
               }
             }}
             className="text-xs bg-neutral-100 dark:bg-neutral-800 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-bl-xl text-neutral-500 transition-colors shadow-sm"
           >
             🔒 重新锁定
           </button>
        </div>
      )}

    </div>
  );
};
