import CONFIG from '@/blog.config'
import { GetStaticProps, GetStaticPropsContext, NextPage } from 'next'
import ContainerLayout from '../components/post/ContainerLayout'
import { WidgetCollection } from '../components/section/WidgetCollection'
import withNavFooter from '../components/withNavFooter'
import { formatPosts } from '../lib/blog/format/post'
import { formatWidgets, preFormatWidgets } from '../lib/blog/format/widget'
import getBlogStats from '../lib/blog/getBlogStats'
import { withNavFooterStaticProps } from '../lib/blog/withNavFooterStaticProps'
import { getWidgets } from '../lib/notion/getBlogData'
import { getLimitPosts } from '../lib/notion/getDatabase'

import { MainPostsCollection } from '../components/section/MainPostsCollection'
import { MorePostsCollection } from '../components/section/MorePostsCollection'
import { Post, SharedNavFooterStaticProps } from '../types/blog'
import { ApiScope } from '../types/notion'

const Home: NextPage<{
  posts: Post[]
  widgets: {
    [key: string]: any
  }
}> = ({ posts, widgets }) => {
  return (
    <>
      <ContainerLayout>
        {/* widgets 已经包含了我们注入的 announcement */}
        <WidgetCollection widgets={widgets} />
        <div data-aos="fade-up" data-aos-delay={300}>
          <MainPostsCollection posts={posts} />
        </div>
      </ContainerLayout>
      <MorePostsCollection posts={posts} />
    </>
  )
}

export const getStaticProps: GetStaticProps = withNavFooterStaticProps(
  async (
    _context: GetStaticPropsContext,
    sharedPageStaticProps: SharedNavFooterStaticProps
  ) => {
    const { LARGE, MEDIUM, SMALL, MORE } = CONFIG.HOME_POSTS_COUNT
    const sum = LARGE + MEDIUM + SMALL + MORE

    // 1. 获取普通文章列表
    const posts = await getLimitPosts(sum, ApiScope.Home)
    const formattedPosts = await formatPosts(posts)

    // 2. 获取统计数据
    const blogStats = await getBlogStats()
    
    // 3. 获取所有 Widget 类型的页面 (原始数据)
    const rawWidgets = await getWidgets()

    // --- 🔥 核心修复逻辑开始 ---
    // 第一步：把所有 Widget 原始数据，统一“清洗”成标准的 Post 格式
    // 这样我们就能直接拿到 title, slug, cover, excerpt 等字段，不用手动去翻 properties
    const allFormattedWidgets = await formatPosts(rawWidgets)

    // 第二步：在清洗后的数据中，精确查找 slug 为 'announcement' 的那一条
    // 注意：这里直接对比 slug 字符串，绝对准确
    const announcementData = allFormattedWidgets.find((p) => p.slug === 'announcement')
    // --- 核心修复逻辑结束 ---

    // 4. 执行原有的 Widget 格式化流程 (用于 Profile 等组件)
    const preFormattedWidgets = await preFormatWidgets(rawWidgets)
    const formattedWidgets = await formatWidgets(preFormattedWidgets, blogStats)

    // 5. 将找到的公告数据注入到最终对象中
    // 使用 as any 绕过 TS 检查
    ;(formattedWidgets as any).announcement = announcementData || null

    return {
      props: {
        ...sharedPageStaticProps.props,
        posts: formattedPosts,
        widgets: formattedWidgets,
      },
      // revalidate: CONFIG.NEXT_REVALIDATE_SECONDS,
    }
  }
)

const withNavPage = withNavFooter(Home, undefined, true)

export default withNavPage
