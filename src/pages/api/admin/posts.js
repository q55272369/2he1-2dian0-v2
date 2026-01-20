import { Client } from '@notionhq/client';

export default async function handler(req, res) {
  const notion = new Client({
    auth: process.env.NOTION_KEY || process.env.NOTION_TOKEN,
  });
  const databaseId = process.env.NOTION_DATABASE_ID || process.env.NOTION_PAGE_ID;

  try {
    // 查询 Notion 数据库
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: 'date', // 假设你的日期字段叫 'date'，如果报错改 'Created' 或 'Date'
          direction: 'descending',
        },
      ],
    });

    // 格式化数据以适应后台前端
    const posts = response.results.map((page) => {
      // 获取各个字段，做容错处理
      const props = page.properties;
      return {
        id: page.id,
        title: props.title?.title?.[0]?.plain_text || props.Page?.title?.[0]?.plain_text || '无标题',
        slug: props.slug?.rich_text?.[0]?.plain_text || '',
        status: props.status?.select?.name || props.Status?.select?.name || 'Published',
        date: props.date?.date?.start || props.Date?.date?.start || '',
        // 这里只是预览，不需要完整内容
      };
    });

    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error('Posts API Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}