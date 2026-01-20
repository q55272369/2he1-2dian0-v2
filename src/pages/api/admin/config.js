import { Client } from '@notionhq/client';

export default async function handler(req, res) {
  // 1. 初始化 Notion 客户端
const notion = new Client({
    auth: process.env.NOTION_KEY || process.env.NOTION_TOKEN,
  });
  const databaseId = process.env.NOTION_DATABASE_ID || process.env.NOTION_PAGE_ID;

  try {
    // 2. 获取数据库信息
    const response = await notion.databases.retrieve({ database_id: databaseId });
    const title = response.title?.[0]?.plain_text || 'PROBLOG';
    
    // 3. 成功返回 (状态码 200)
    res.status(200).json({ success: true, siteInfo: { title } });
  } catch (error) {
    console.error('Config API Error:', error);
    // 4. 失败返回 (状态码 500)
    res.status(500).json({ success: false, error: error.message });
  }
}