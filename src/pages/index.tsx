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
// 👇 1. 引入获取全部文章和过滤的函数
import { getAllPosts } from '../lib/notion/getAllPosts'
import { filterPublishedPosts } from '../lib/notion/filterPublishedPosts'

import { MainPostsCollection } from '../components/section/MainPostsCollection'
import { MorePostsCollection } from '../components/section/MorePostsCollection'
import { Post, SharedNavFooterStaticProps } from '../types/blog'

const Home: NextPage<{
  posts: Post[]
  widgets: {
    [key: string]: any
  }
}> = ({ posts, widgets }) => {
  return (
    <>
      <ContainerLayout>
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

    // 👇 2. 核心修改：获取所有文章，然后手动分类
    const allPosts = await getAllPosts({ includePages: false })

    // 2.1 过滤出普通的 Post 文章（用于主页列表）
    const postsData = filterPublishedPosts({
      posts: allPosts,
      includedPostTypes: ['Post'], 
    })
    // 按照配置数量截取文章
    const posts = postsData.slice(0, sum)
    const formattedPosts = await formatPosts(posts)

    // 2.2 过滤出 Announcement 公告（用于顶部组件）
    const announcementData = filterPublishedPosts({
      posts: allPosts,
      includedPostTypes: ['Announcement'],
    })
    const formattedAnnouncements = await formatPosts(announcementData)

    // 3. 获取其他常规数据
    const blogStats = await getBlogStats()
    const widgetData = await getWidgets()
    const preFormattedWidgets = await preFormatWidgets(widgetData)
    const formattedWidgets = await formatWidgets(preFormattedWidgets, blogStats)

    // 4. 将公告数据注入到 widgets 对象中
    const finalWidgets = {
      ...formattedWidgets,
      announcement: formattedAnnouncements, // 👈 注入点
    }

    return {
      props: {
        ...sharedPageStaticProps.props,
        posts: formattedPosts,
        widgets: finalWidgets, // 使用包含公告的新 widgets 对象
      },
      revalidate: CONFIG.NEXT_REVALIDATE_SECONDS,
    }
  }
)

const withNavPage = withNavFooter(Home, undefined, true)

export default withNavPage
