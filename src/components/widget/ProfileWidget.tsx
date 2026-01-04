/* eslint-disable @next/next/no-img-element */
import { useScreenSize } from '@/src/hooks/useScreenSize'
import { ProfileWidgetType } from '@/src/lib/blog/format/widget/profile'
import { classNames, isValidUrl } from '@/src/lib/util'
import Link from 'next/link'
import { DynamicIcon } from '../DynamicIcon'
import ImageWithPlaceholder from '../image/ImageWithPlaceholder'
import { WidgetContainer } from './WidgetContainer'

const LinkIcon = ({ icon, hasId }: { icon: string; hasId: boolean }) => {
  const { isMobile, isTablet, isDesktop, isWidescreen } = useScreenSize()

  let iconSize
  if (isMobile || isTablet) {
    iconSize = 15
  }
  if (isDesktop) {
    iconSize = isDesktop && hasId ? 15 : 20
  }
  if (isWidescreen) {
    iconSize = hasId ? 20 : 30
  }

  if (icon === '') {
    return (
      <DynamicIcon
        nameIcon="FaQuestionCircle"
        propsIcon={{
          size: iconSize,
        }}
      />
    )
  }
  if (isValidUrl(icon) || icon.startsWith('/')) {
    return (
      <img
        className="aspect-square w-5 h-5 lg:w-8 lg:h-8 drop-shadow-sm"
        src={icon}
        alt="icon"
      />
    )
  }
  return (
    <div className="drop-shadow-sm">
      <DynamicIcon
        nameIcon={icon}
        propsIcon={{
          size: iconSize,
        }}
      />
    </div>
  )
}

// ⬇️ 新增：定义品牌颜色的辅助函数
const getBrandGradient = (url: string, iconName: string): string => {
  const target = (url + iconName).toLowerCase();
  
  if (target.includes('github')) return 'linear-gradient(135deg, #2b3137 0%, #24292e 100%)'; // GitHub 黑
  if (target.includes('twitter') || target.includes('x.com')) return 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)'; // X/Twitter 黑
  if (target.includes('mail') || target.includes('email')) return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'; // 邮件 黄
  if (target.includes('linkedin')) return 'linear-gradient(135deg, #0077b5 0%, #005582 100%)'; // LinkedIn 蓝
  if (target.includes('bilibili')) return 'linear-gradient(135deg, #00a1d6 0%, #008bb5 100%)'; // B站 蓝
  if (target.includes('instagram')) return 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)'; // INS 彩色
  if (target.includes('rss')) return 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'; // RSS 橙色

  // 默认兜底颜色（如果不匹配上面的，显示默认深灰色）
  return 'linear-gradient(135deg, #525252 0%, #404040 100%)';
}

export const ProfileWidget = ({ config }: { config: ProfileWidgetType }) => {
  const { isMobile, isTablet, isDesktop, isWidescreen } = useScreenSize()

  return (
    <WidgetContainer>
      <div className="flex flex-col gap-5 lg:gap-10">
        {/* 头像区域 */}
        <div className="relative group w-fit mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative aspect-square w-24 h-24 lg:w-32 lg:h-32 rounded-full ring-4 ring-neutral-100 dark:ring-neutral-800 overflow-hidden shadow-xl">
            <ImageWithPlaceholder
              src={config.avatar}
              alt="avatar"
              fill={true}
              containerClassName="w-full h-full"
              className="object-cover"
            />
          </div>
        </div>

        {/* 社交按钮区域 */}
        <div className="flex flex-row justify-center items-center gap-2 lg:gap-4">
          {config.links.map((item, index) => {
            // 获取对应的渐变色样式
            const backgroundStyle = getBrandGradient(item.url, item.icon);

            return (
              <Link
                key={index}
                href={item.url}
                target="_blank"
                // ⬇️ 修复点1：移除 className 中冲突的 gray/neutral 颜色类
                className={classNames(
                  'flex items-center justify-center',
                  'rounded-2xl lg:rounded-3xl',
                  'shadow-lg shadow-neutral-300 dark:shadow-neutral-900', // 保留阴影
                  'text-white', // 强制图标变白
                  'transition-all duration-300 ease-in-out',
                  'hover:scale-110 hover:-translate-y-1',
                  isMobile || isTablet ? 'w-8 h-8' : '',
                  isDesktop ? (config.id ? 'w-8 h-8' : 'w-10 h-10') : '',
                  isWidescreen ? (config.id ? 'w-10 h-10' : 'w-12 h-12') : ''
                )}
                // ⬇️ 修复点2：通过 style 强制应用背景色，且不加 !important
                style={{
                  background: backgroundStyle, 
                  border: '1px solid rgba(255,255,255,0.1)' // 增加一点质感
                }}
              >
                <LinkIcon icon={item.icon} hasId={!!config.id} />
              </Link>
            )
          })}
        </div>
      </div>
    </WidgetContainer>
  )
}
