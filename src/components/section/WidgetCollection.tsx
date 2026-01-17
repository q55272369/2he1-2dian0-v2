import { ProfileWidget } from '../widget/ProfileWidget'
import { StatsWidget } from '../widget/StatsWidget'

export const WidgetCollection = ({
  widgets,
}: {
  widgets: { [key: string]: any }
}) => {
  // 优先获取 announcement 数据，如果没有则传空数组防止报错
  const announcements = widgets.announcement || []

  return (
    <div
      className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8" // 稍微优化了gap，在移动端单列，桌面端双列
      data-aos="fade-up"
    >
      <ProfileWidget data={widgets.profile} />
      {/* 将公告数据传递给右侧组件 */}
      <StatsWidget data={announcements} />
    </div>
  )
}
