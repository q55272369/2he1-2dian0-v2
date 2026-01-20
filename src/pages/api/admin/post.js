import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

export default async function handler(req, res) {
  const notion = new Client({
    auth: process.env.NOTION_KEY || process.env.NOTION_TOKEN,
  });
  const n2m = new NotionToMarkdown({ notionClient: notion });

  // 从 URL 参数获取文章 ID (?id=xxx)
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: 'Missing id' });
  }

  try {
    // 1. 获取页面属性
    const page = await notion.pages.retrieve({ page_id: id });
    
    // 2. 获取页面内容并转为 Markdown
    const mdblocks = await n2m.pageToMarkdown(id);
    const mdString = n2m.toMarkdownString(mdblocks);

    // 3. 整理返回数据
    const props = page.properties;
    const postData = {
      id: page.id,
      title: props.title?.title?.[0]?.plain_text || '无标题',
      slug: props.slug?.rich_text?.[0]?.plain_text || '',
      status: props.status?.select?.name || 'Published',
      content: mdString.parent || '', // Markdown 内容
      properties: props, // 原始属性备用
    };

    res.status(200).json({ success: true, post: postData });
  } catch (error) {
    console.error('Post API Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}