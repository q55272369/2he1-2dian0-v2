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
        {/* 这里 widgets 就会包含我们注入的 announcement 了 */}
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

    // 1. 获取文章列表
    const posts = await getLimitPosts(sum, ApiScope.Home)
    const formattedPosts = await formatPosts(posts)

    // 2. 获取统计数据
    const blogStats = await getBlogStats()
    
    // 3. 获取所有 Widget 类型的页面 (Raw Data)
    const rawWidgets = await getWidgets()

    // --- 🔥 核心修改：手动提取并格式化 Announcement ---
    // 在 rawWidgets 数组中查找 slug 为 'announcement' 的页面
    const announcementRaw = rawWidgets.find((w: any) => 
      // 兼容两种常见的 slug 存储位置，确保能找到
      w.slug === 'announcement' || w.properties?.slug?.rich_text?.[0]?.plain_text === 'announcement'
    )
    
    let formattedAnnouncement = null
    if (announcementRaw) {
      // 利用现有的 formatPosts 工具把这个 Widget 页面格式化成标准 Post 数据结构
      // formatPosts 接受数组，所以我们包一层 []，然后取第 [0] 个
      const formattedResult = await formatPosts([announcementRaw])
      formattedAnnouncement = formattedResult[0] || null
    }
    // ----------------------------------------------------

    // 4. 执行原有的 Widget 格式化流程 (生成 profile 等)
    const preFormattedWidgets = await preFormatWidgets(rawWidgets)
    const formattedWidgets = await formatWidgets(preFormattedWidgets, blogStats)

    // 5. 🔥 将手动提取的 announcement 强行注入到最终的 widgets 对象中
    formattedWidgets.announcement = formattedAnnouncement

    return {
      props: {
        ...sharedPageStaticProps.props,
        posts: formattedPosts,
        widgets: formattedWidgets, // 现在的 widgets 里已经包含了 announcement
      },
      // revalidate: CONFIG.NEXT_REVALIDATE_SECONDS,
    }
  }
)

const withNavPage = withNavFooter(Home, undefined, true)

export default withNavPage
