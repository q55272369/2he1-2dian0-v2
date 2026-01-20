import { Client } from '@notionhq/client';

export default async function handler(req, res) {
  const notion = new Client({ auth: process.env.NOTION_KEY || process.env.NOTION_TOKEN });
  const databaseId = process.env.NOTION_DATABASE_ID || process.env.NOTION_PAGE_ID;

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [{ property: 'date', direction: 'descending' }],
    });

    const categories = new Set();
    const tags = new Set();

    const posts = response.results.map((page) => {
      const p = page.properties;
      
      // 提取分类和标签
      const catName = p.category?.select?.name || p.Category?.select?.name;
      if (catName) categories.add(catName);
      
      const tagNames = p.tags?.multi_select?.map(t => t.name) || [];
      tagNames.forEach(t => tags.add(t));

      return {
        id: page.id,
        // 核心字段
        title: p.title?.title?.[0]?.plain_text || p.Page?.title?.[0]?.plain_text || '无标题',
        slug: p.slug?.rich_text?.[0]?.plain_text || '',
        
        // 元数据
        category: catName || '',
        tags: tagNames.join(','),
        
        // 状态 (已发布/草稿)
        status: p.status?.select?.name || p.status?.status?.name || 'Published',
        
        // 日期
        date: p.date?.date?.start || '',
        
        // 封面
        cover: p.cover?.file?.url || p.cover?.external?.url || '',

        // ✅✅✅【关键修复】必须返回 type 字段！
        // 前端默认只显示 type 为 'Post' 的内容。
        // 如果 Notion 里没填 type，我们默认它就是 'Post'，保证能显示出来。
        type: p.type?.select?.name || p.Type?.select?.name || 'Post' 
      };
    });

    res.status(200).json({ 
      success: true, 
      posts,
      options: {
        categories: Array.from(categories),
        tags: Array.from(tags)
      }
    });

  } catch (error) {
    console.error('Posts API Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}