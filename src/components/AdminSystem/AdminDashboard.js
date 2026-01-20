'use client';
import React, { useState, useEffect } from 'react';
import './admin.css'; // 确保引用了样式

// --- 1. 图标库 ---
const Icons = {
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  CoverMode: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>,
  TextMode: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>,
  GridMode: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
  FolderMode: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>,
  FolderIcon: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff" style={{opacity:0.8}}><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path></svg>,
  Edit: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path></svg>,
  Trash: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
  Tutorial: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
  ChevronDown: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>,
  ArrowUp: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg>,
  ArrowDown: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>,
  Settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
};

// --- 2. 工具函数 ---
const cleanAndFormat = (input) => {
  if (!input) return "";
  try {
    const lines = input.split('\n').map(line => {
      let raw = line.trim();
      if (!raw) return ""; 
      const mdMatch = raw.match(/(?:!|)?\[.*?\]\((.*?)\)/);
      if(mdMatch) raw = mdMatch[1];
      const urlMatch = raw.match(/https?:\/\/[^\s)\]"]+/);
      if(urlMatch) raw = urlMatch[0];
      if (/\.(jpg|jpeg|png|gif|webp|bmp|svg|mp4|mov|webm|ogg|mkv)(\?|$)/i.test(raw)) {
         return `![](${raw})`;
      }
      return raw;
    });
    return lines.filter(l=>l).join('\n');
  } catch (e) { return input; }
};

// --- 3. 组件定义 ---
const FullScreenLoader = () => (<div className="loader-overlay"><div className="loader"><svg viewBox="0 0 200 60" width="200" height="60"><path className="dash" fill="none" stroke="greenyellow" strokeWidth="3" d="M20,50 L20,10 L50,10 C65,10 65,30 50,30 L20,30" /><path className="dash" fill="none" stroke="greenyellow" strokeWidth="3" d="M80,50 L80,10 L110,10 C125,10 125,30 110,30 L80,30 M100,30 L120,50" /><path className="dash" fill="none" stroke="greenyellow" strokeWidth="3" d="M140,30 A20,20 0 1,0 180,30 A20,20 0 1,0 140,30" /></svg></div><div className="loader-text">SYSTEM PROCESSING</div></div>);

const AnimatedBtn = ({ text, onClick, style }) => (<button className="animated-button" onClick={onClick} style={style}><svg viewBox="0 0 24 24" className="arr-2" xmlns="http://www.w3.org/2000/svg"><path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path></svg><span className="text">{text}</span><span className="circle"></span><svg viewBox="0 0 24 24" className="arr-1" xmlns="http://www.w3.org/2000/svg"><path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path></svg></button>);

const SlidingNav = ({ activeIdx, onSelect }) => {
  const icons = [Icons.FolderMode, Icons.CoverMode, Icons.TextMode, Icons.GridMode];
  return (<div className="nav-container"><div className="nav-glider" style={{ left: `${activeIdx * 45 + 5}px`, width: '40px' }} />{icons.map((Icon, i) => (<div key={i} className={`nav-item ${activeIdx === i ? 'active' : ''}`} onClick={() => onSelect(i)}><Icon /></div>))}</div>);
};

const SearchInput = ({ value, onChange }) => (<div className="group"><svg className="search-icon" aria-hidden="true" viewBox="0 0 24 24"><g><path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path></g></svg><input placeholder="Search" type="search" className="input" value={value} onChange={onChange} /></div>);

const StepAccordion = ({ step, title, isOpen, onToggle, children }) => (<div><div className="acc-btn" onClick={onToggle}><div style={{fontWeight:'bold'}}><span style={{color:'greenyellow', marginRight:'10px'}}>Step {step}</span>{title}</div><div style={{transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition:'0.3s'}}><Icons.ChevronDown /></div></div><div className={`acc-content ${isOpen ? 'open' : ''}`}>{children}</div></div>);

// --- 积木编辑器 ---
const BlockBuilder = ({ blocks, setBlocks }) => {
  const [movingId, setMovingId] = useState(null);

  const addBlock = (type) => setBlocks([...blocks, { id: Date.now() + Math.random(), type, content: '', pwd: '' }]);
  const updateBlock = (id, val, key='content') => { setBlocks(blocks.map(b => b.id === id ? { ...b, [key]: val } : b)); };
  const removeBlock = (id) => { setBlocks(blocks.filter(b => b.id !== id)); };

  const moveBlock = (index, direction) => {
    if (direction === -1 && index === 0) return;
    if (direction === 1 && index === blocks.length - 1) return;
    const newBlocks = [...blocks];
    const targetIndex = index + direction;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setBlocks(newBlocks);
    setMovingId(newBlocks[targetIndex].id);
    setTimeout(() => setMovingId(null), 600);
  };

  const getBlockLabel = (type) => {
      if (type === 'h1') return 'H1 标题';
      if (type === 'lock') return '🔒 加密块';
      if (type === 'note') return '💬 注释块';
      return '📄 内容块';
  };

  return (
    <div style={{marginTop:'30px'}}>
      <div style={{display:'flex', gap:'15px', marginBottom:'25px', justifyContent:'center'}}>
          <div className="neo-btn" onClick={()=>addBlock('h1')}>H1 标题</div>
          <div className="neo-btn" onClick={()=>addBlock('text')}>📝 内容块</div>
          <div className="neo-btn" onClick={()=>addBlock('note')}>💬 注释块</div>
          <div className="neo-btn" onClick={()=>addBlock('lock')}>🔒 加密块</div>
      </div>

      <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
        {blocks.map((b, index) => (
          <div key={b.id} className={`block-card ${movingId === b.id ? 'just-moved' : ''}`}>
            <div className="block-left-ctrl">
               <div className="move-btn" onClick={() => moveBlock(index, -1)}><Icons.ArrowUp /></div>
               <div className="move-btn" onClick={() => moveBlock(index, 1)}><Icons.ArrowDown /></div>
            </div>
            
            <div className="block-label">{getBlockLabel(b.type)}</div>
            
            {b.type === 'h1' && <input className="glow-input" placeholder="输入大标题..." value={b.content} onChange={e=>updateBlock(b.id, e.target.value)} style={{fontSize:'20px', fontWeight:'bold'}} />}
            {b.type === 'text' && <textarea className="glow-input" placeholder="输入正文，直接粘贴多行链接..." value={b.content} onChange={e=>updateBlock(b.id, e.target.value)} style={{minHeight:'200px'}} />}
            
            {b.type === 'note' && <textarea className="glow-input" placeholder="输入注释内容..." value={b.content} onChange={e=>updateBlock(b.id, e.target.value)} style={{minHeight:'80px', color: '#ff6b6b', fontFamily: 'monospace', fontSize: '13px'}} />}
            
            {b.type === 'lock' && (
               <div style={{background:'#202024', padding:'10px', borderRadius:'8px'}}>
                 <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px'}}><span>🔑</span><input className="glow-input" placeholder="留空则无密码" value={b.pwd} onChange={e=>updateBlock(b.id, e.target.value, 'pwd')} style={{width:'150px'}} /></div>
                 <textarea className="glow-input" placeholder="输入被加密内容..." value={b.content} onChange={e=>updateBlock(b.id, e.target.value)} style={{minHeight:'200px', border:'1px dashed #555'}} />
               </div>
            )}
            <div className="block-del" onClick={()=>removeBlock(b.id)}><Icons.Trash /></div>
          </div>
        ))}
        {blocks.length === 0 && <div style={{textAlign:'center', color:'#666', padding:'40px', border:'2px dashed #444', borderRadius:'12px'}}>👋 暂无内容，请点击上方按钮添加模块</div>}
      </div>
    </div>
  );
};

// --- Notion 预览组件 ---
const NotionView = ({ blocks }) => (
  <div style={{color:'#e1e1e3', fontSize:'15px', lineHeight:'1.8'}}>
    {blocks?.map((b, i) => {
      const type = b.type; const data = b[type]; const text = data?.rich_text?.[0]?.plain_text || "";
      if(type==='heading_1') return <h1 key={i} style={{fontSize:'1.8em', borderBottom:'1px solid #333', paddingBottom:'8px', margin:'24px 0 12px'}}>{text}</h1>;
      
      if(type==='paragraph') {
          const richText = data?.rich_text?.[0];
          if (richText?.annotations?.code) {
             return <div key={i} style={{margin:'10px 0', borderLeft:'3px solid #ff6b6b', paddingLeft:'10px'}}><span style={{color:'#ff6b6b', fontFamily:'monospace', fontSize:'0.95em'}}>{text}</span></div>;
          }
          return <p key={i} style={{margin:'10px 0', minHeight:'1em'}}>{text}</p>;
      }
      
      if(type==='divider') return <hr key={i} style={{border:'none', borderTop:'1px solid #444', margin:'24px 0'}} />;
      if(type==='image') { const url = data?.file?.url || data?.external?.url; if (!url) return null; const isVideo = url.match(/\.(mp4|mov|webm|ogg)(\?|$)/i); if(isVideo) return <div key={i} style={{display:'flex', justifyContent:'center', margin:'20px 0'}}><div style={{width:'100%', maxHeight:'500px', borderRadius:'8px', background:'#000', display:'flex', justifyContent:'center'}}><video src={url} controls preload="metadata" style={{maxWidth:'100%', maxHeight:'100%'}} /></div></div>; return <div key={i} style={{display:'flex', justifyContent:'center', margin:'20px 0'}}><div style={{width: '100%', height: '500px', background: '#000', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden'}}><img src={url} style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}} alt="" /></div></div>; }
      if(type==='video' || type==='embed') { let url = data?.file?.url || data?.external?.url || data?.url; if(!url) return null; const isY = url.includes('youtube')||url.includes('youtu.be'); if(isY){if(url.includes('watch?v='))url=url.replace('watch?v=','embed/');if(url.includes('youtu.be/'))url=url.replace('youtu.be/','www.youtube.com/embed/');} return <div key={i} style={{display:'flex', justifyContent:'center', margin:'20px 0'}}>{(type==='embed'||isY)?<iframe src={url} style={{width:'100%',maxWidth:'800px',height:'450px',border:'none',borderRadius:'8px',background:'#000'}} allowFullScreen />:<video src={url} controls style={{width:'100%',maxHeight:'500px',borderRadius:'8px',background:'#000'}}/>}</div>; }
      if(type==='callout') return <div key={i} style={{background:'#2d2d30', padding:'20px', borderRadius:'12px', border:'1px solid #3e3e42', display:'flex', gap:'15px', margin:'20px 0'}}><div style={{fontSize:'1.4em'}}>{b.callout.icon?.emoji || '🔒'}</div><div style={{flex:1}}><div style={{fontWeight:'bold', color:'greenyellow', marginBottom:'4px'}}>{text}</div><div style={{fontSize:'12px', opacity:0.5}}>[ 加密内容已受保护 ]</div></div></div>;
      return null;
    })}
  </div>
);

// --- 主组件 ---
export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState('list'), [viewMode, setViewMode] = useState('covered'), [posts, setPosts] = useState([]), [options, setOptions] = useState({ categories: [], tags: [] }), [loading, setLoading] = useState(false), [activeTab, setActiveTab] = useState('Post'), [searchQuery, setSearchQuery] = useState(''), [showAllTags, setShowAllTags] = useState(false), [selectedFolder, setSelectedFolder] = useState(null), [previewData, setPreviewData] = useState(null);
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '', category: '', tags: '', cover: '', status: 'Published', type: 'Post', date: '' }), [currentId, setCurrentId] = useState(null);
  
  const [siteTitle, setSiteTitle] = useState('PROBLOG');
  const [navIdx, setNavIdx] = useState(1); 
  const [expandedStep, setExpandedStep] = useState(1);
  const [editorBlocks, setEditorBlocks] = useState([]);

  useEffect(() => { setMounted(true); }, []);
  const isFormValid = form.title.trim() !== '' && form.category.trim() !== '' && form.date !== '';

  async function fetchData() {
    setLoading(true); 
    try { 
       // 🟢 修复：调用新 API 路径 /api/admin/*
       const r = await fetch('/api/admin/posts'); const d = await r.json(); if (d.success) { setPosts(d.posts || []); setOptions(d.options || { categories: [], tags: [] }); }
       const rConf = await fetch('/api/admin/config'); const dConf = await rConf.json(); 
       if (dConf.success && dConf.siteInfo) setSiteTitle(dConf.siteInfo.title);
    } catch(e) {
       console.warn("Fetch Error", e);
    } finally { setLoading(false); } 
  }
  useEffect(() => { if (mounted) fetchData(); }, [mounted]);

  // 🟢 修复：补全缺失的 deleteTagOption 函数
  const deleteTagOption = (e, tagToDelete) => {
    e.stopPropagation();
    const currentTags = form.tags ? form.tags.split(',').filter(t => t.trim()) : [];
    const newTags = currentTags.filter(t => t.trim() !== tagToDelete).join(',');
    setForm({ ...form, tags: newTags });
  };

  const updateSiteTitle = async () => {
    const newTitle = prompt("请输入新的网站标题:", siteTitle);
    if (newTitle && newTitle !== siteTitle) {
        setLoading(true); await fetch('/api/admin/config', { method: 'POST', body: JSON.stringify({ title: newTitle }) });
        setSiteTitle(newTitle); setLoading(false);
    }
  };

  const handleNavClick = (idx) => { setNavIdx(idx); const modes = ['folder','covered','text','gallery']; setViewMode(modes[idx]); setSelectedFolder(null); };

  // 🟢 保存逻辑
  useEffect(() => {
    if(view !== 'edit') return;
    const newContent = editorBlocks.map(b => {
      let content = b.content || '';
      if (b.type === 'text') content = cleanAndFormat(content); 
      if (b.type === 'note') return `\`${content}\``;
      if (b.type === 'h1') return `# ${content}`;
      if (b.type === 'lock') {
          const lockHeader = b.pwd ? `:::lock ${b.pwd}` : `:::lock`; 
          return `${lockHeader}\n\n${cleanAndFormat(content)}\n\n:::`;
      }
      return content;
    }).join('\n\n'); 
    setForm(prev => ({ ...prev, content: newContent }));
  }, [editorBlocks]);

  const parseContentToBlocks = (md) => {
    if(!md) return [];
    const lines = md.split(/\r?\n/);
    const res = [];
    
    let buffer = []; let isLocking = false; let lockPwd = ''; let lockBuffer = [];  
    const stripMd = (str) => { const match = str.match(/(?:!|)?\[.*?\]\((.*?)\)/); return match ? match[1] : str; };
    const flushBuffer = () => {
      if (buffer.length > 0) {
        const joined = buffer.map(stripMd).join('\n').trim();
        if (joined) {
           if (joined.startsWith('`') && joined.endsWith('`') && joined.length > 1) {
              res.push({ id: Date.now() + Math.random(), type: 'note', content: joined.slice(1, -1) });
           } else {
              res.push({ id: Date.now() + Math.random(), type: 'text', content: joined });
           }
        }
        buffer = [];
      }
    };
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]; const trimmed = line.trim();
      if (!isLocking && trimmed.startsWith(':::lock')) { flushBuffer(); isLocking = true; lockPwd = trimmed.replace(':::lock', '').replace(/[>*\s🔒]/g, '').trim(); continue; }
      if (isLocking && trimmed === ':::') { isLocking = false; const joinedLock = lockBuffer.map(stripMd).join('\n').trim(); res.push({ id: Date.now() + Math.random(), type: 'lock', pwd: lockPwd, content: joinedLock }); lockBuffer = []; continue; }
      if (isLocking) { lockBuffer.push(line); continue; }
      if (trimmed.startsWith('# ')) { flushBuffer(); res.push({ id: Date.now() + Math.random(), type: 'h1', content: trimmed.replace('# ', '') }); continue; }
      if (!trimmed) { flushBuffer(); continue; }
      buffer.push(line);
    }
    flushBuffer();
    return res;
  };

  const handlePreview = (p) => { setLoading(true); fetch('/api/admin/post?id='+p.id).then(r=>r.json()).then(d=>{ if(d.success) setPreviewData(d.post); }).finally(()=>setLoading(false)); };
  const handleEdit = (p) => { setLoading(true); fetch('/api/admin/post?id='+p.id).then(r=>r.json()).then(d=>{ if (d.success) { setForm(d.post); setEditorBlocks(parseContentToBlocks(d.post.content)); setCurrentId(p.id); setView('edit'); setExpandedStep(1); } }).finally(()=>setLoading(false)); };
  const handleCreate = () => { setForm({ title: '', slug: 'p-'+Date.now().toString(36), excerpt:'', content:'', category:'', tags:'', cover:'', status:'Published', type: 'Post', date: new Date().toISOString().split('T')[0] }); setEditorBlocks([]); setCurrentId(null); setView('edit'); setExpandedStep(1); };
  
  const getFilteredPosts = () => {
     let list = posts.filter(p => {
        if (activeTab === 'Page') return p.type === 'Page' && ['about', 'download'].includes(p.slug);
        return p.type === activeTab;
     });
     if (searchQuery) list = list.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
     if (selectedFolder) list = list.filter(p => p.category === selectedFolder);
     if (activeTab === 'Post') {
        const sticky = list.find(p => p.slug === 'announcement');
        const others = list.filter(p => p.slug !== 'announcement');
        if (sticky) return [sticky, ...others];
        return others;
     }
     return list;
  };
  const filtered = getFilteredPosts();
  const displayTags = (options.tags && options.tags.length > 0) ? (showAllTags ? options.tags : options.tags.slice(0, 12)) : [];

  if (!mounted) return null;

  const getStatusStyle = (status) => {
      const isDraft = status === 'Draft';
      return { borderColor: isDraft ? '#f97316' : 'transparent', color: isDraft ? '#f97316' : 'greenyellow', label: isDraft ? '📝 草稿' : '🚀 已发布' };
  };

  return (
    <div style={{ minHeight: '100vh', background: '#303030', padding: '40px 20px' }}>
      <GlobalStyle />
      {loading && <FullScreenLoader />}
      
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
           <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
             {view === 'list' && <SearchInput value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />}
             <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
                <div style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '1px', display:'flex', alignItems:'center', gap:'10px' }}>
                   {siteTitle} <span onClick={updateSiteTitle} style={{cursor:'pointer', opacity:0.5}} title="修改网站标题"><Icons.Settings /></span>
                </div>
             </div>
           </div>
           
           <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
             <button onClick={() => window.open('https://pan.cloudreve.org/xxx', '_blank')} style={{background:'#a855f7', border:'none', padding:'10px 20px', borderRadius:'8px', color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', gap:'5px', fontWeight:'bold', fontSize:'14px'}} className="btn-ia"><Icons.Tutorial /> 教程</button>
             {view === 'list' ? <AnimatedBtn text="发布新内容" onClick={handleCreate} /> : <AnimatedBtn text="返回列表" onClick={() => setView('list')} />}
           </div>
        </header>

        {view === 'list' ? (
          <main>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
               <div style={{background:'#424242', padding:'5px', borderRadius:'12px', display:'flex'}}>{['Post', 'Widget', 'Page'].map(t => <button key={t} onClick={() => { setActiveTab(t); setSelectedFolder(null); }} style={activeTab === t ? {padding:'8px 20px', border:'none', background:'#555', color:'#fff', borderRadius:'10px', fontWeight:'bold', fontSize:'13px', cursor:'pointer'} : {padding:'8px 20px', border:'none', background:'none', color:'#888', borderRadius:'10px', fontWeight:'bold', fontSize:'13px', cursor:'pointer'}}>{t === 'Page' ? '自定义页面' : t === 'Post' ? '已发布' : '组件'}</button>)}</div>
               <SlidingNav activeIdx={navIdx} onSelect={handleNavClick} />
            </div>
            
            <div style={viewMode === 'gallery' || viewMode === 'folder' ? {display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'15px'} : {}}>
              {viewMode === 'folder' && options.categories.map(cat => <div key={cat} onClick={()=>{setSelectedFolder(cat); handleNavClick(1);}} style={{padding:'15px', background:'#424242', borderRadius:'10px', display:'flex', alignItems:'center', gap:'12px', border:'1px solid #555', cursor:'pointer'}} className="btn-ia"><Icons.FolderIcon />{cat}</div>)}
              {viewMode !== 'folder' && filtered.map(p => {
                const st = getStatusStyle(p.status);
                return (
                  <div key={p.id} onClick={() => handlePreview(p)} className="card-item" style={{...(viewMode === 'text' ? {display:'flex', alignItems:'center', padding:'16px 20px'} : viewMode === 'gallery' ? {display:'flex', flexDirection:'column', height:'auto'} : {}), background:'#424242', borderRadius:'12px', marginBottom:'8px', border: `1px solid ${st.borderColor}`}}>
                    {viewMode === 'covered' && <><div style={{width:'160px', flexShrink:0, background:'#303030', display:'flex', alignItems:'center', justifyContent:'center'}}>{p.cover ? <img src={p.cover} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <div style={{fontSize:'28px', color:'#444'}}>{activeTab[0]}</div>}</div><div style={{padding:'20px 35px', flex:1}}><div style={{fontWeight:'bold', fontSize:'20px', color:'#fff', marginBottom:'8px'}}>{p.title}</div><div style={{color:'#fff', fontSize:'12px', opacity:0.8, display:'flex', alignItems:'center', gap:'10px'}}><span style={{border:`1px solid ${st.color}`, color:st.color, padding:'2px 6px', borderRadius:'4px', fontSize:'10px', fontWeight:'bold'}}>{st.label}</span>{p.category} · {p.date}</div></div></>}
                    {viewMode === 'text' && <div style={{flex:1, display:'flex', alignItems:'center'}}><div style={{flex:1, fontSize:'14px', display:'flex', alignItems:'center', gap:'10px'}}><span style={{width:'6px', height:'6px', borderRadius:'50%', background:st.color}}></span>{p.title}</div><div style={{color:'#fff', fontSize:'12px', opacity:0.8}}>{p.category} · {p.date}</div></div>}
                    {viewMode === 'gallery' && <><div style={{height:'140px', background:'#303030', display:'flex', alignItems:'center', justifyContent:'center', position:'relative'}}><div style={{position:'absolute', top:'10px', right:'10px', background:st.color, color:'#000', padding:'2px 6px', borderRadius:'4px', fontSize:'10px', fontWeight:'bold'}}>{p.status === 'Draft' ? 'DRAFT' : 'PUB'}</div>{p.cover ? <img src={p.cover} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <div style={{fontSize:'40px', color:'#444'}}>{activeTab[0]}</div>}</div><div style={{padding:'15px'}}><div style={{fontSize:'14px', fontWeight:'bold', color:'#fff'}}>{p.title}</div><div style={{color:'#fff', fontSize:'12px', opacity:0.8}}>{p.category} · {p.date}</div></div></>}
                    <div className="drawer"><div onClick={(e) => { e.stopPropagation(); handleEdit(p); }} style={{background:'greenyellow', color:'#000'}} className="dr-btn"><Icons.Edit /></div><div onClick={(e) => { e.stopPropagation(); if(confirm('彻底删除？')){setLoading(true); fetch('/api/admin/post?id='+p.id,{method:'DELETE'}).then(()=>fetchData())}}} style={{background:'#ff4d4f'}} className="dr-btn"><Icons.Trash /></div></div>
                  </div>
                );
              })}
            </div>
          </main>
        ) : (
          <main style={{background:'#424242', padding:'30px', borderRadius:'20px', border:'1px solid #555'}}>
            <StepAccordion step={1} title="基础信息" isOpen={expandedStep === 1} onToggle={()=>setExpandedStep(expandedStep===1?0:1)}>
               <div style={{marginBottom:'15px'}}><label style={{display:'block', fontSize:'11px', color:'#bbb', marginBottom:'5px'}}>标题 <span style={{color: '#ff4d4f'}}>*</span></label><input className="glow-input" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} placeholder="输入文章标题..." /></div>
               <div><label style={{display:'block', fontSize:'11px', color:'#bbb', marginBottom:'5px'}}>摘要</label><input className="glow-input" value={form.excerpt} onChange={e=>setForm({...form, excerpt:e.target.value})} placeholder="输入文章摘要..." /></div>
            </StepAccordion>
            <StepAccordion step={2} title="分类与时间" isOpen={expandedStep === 2} onToggle={()=>setExpandedStep(expandedStep===2?0:2)}>
               <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
                 <div><label style={{display:'block', fontSize:'11px', color:'#bbb', marginBottom:'5px'}}>分类 <span style={{color: '#ff4d4f'}}>*</span></label><input className="glow-input" list="cats" value={form.category} onChange={e=>setForm({...form, category:e.target.value})} placeholder="选择或输入分类" /><datalist id="cats">{options.categories.map(o=><option key={o} value={o}/>)}</datalist></div>
                 <div><label style={{display:'block', fontSize:'11px', color:'#bbb', marginBottom:'5px'}}>发布日期 <span style={{color: '#ff4d4f'}}>*</span></label><input className="glow-input" type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} /></div>
               </div>
            </StepAccordion>
            <StepAccordion step={3} title="标签与封面" isOpen={expandedStep === 3} onToggle={()=>setExpandedStep(expandedStep===3?0:3)}>
               <div style={{marginBottom:'15px'}}><label style={{display:'block', fontSize:'11px', color:'#bbb', marginBottom:'5px'}}>标签</label><input className="glow-input" value={form.tags} onChange={e=>setForm({...form, tags:e.target.value})} placeholder="Tag1, Tag2..." /><div style={{marginTop:'10px', display:'flex', flexWrap:'wrap'}}>{displayTags.map(t => <span key={t} className="tag-chip" onClick={()=>{const cur=form.tags ? form.tags.split(',') : []; if(!cur.includes(t)) setForm({...form, tags:[...cur,t].join(',')})}}>{t}<div className="tag-del" onClick={(e)=>{deleteTagOption(e, t)}}>×</div></span>)}{options.tags.length > 12 && <span onClick={()=>setShowAllTags(!showAllTags)} style={{fontSize:'12px', color:'greenyellow', cursor:'pointer', fontWeight:'bold', marginLeft:'5px'}}>{showAllTags ? '收起' : `...`}</span>}</div></div>
               <div><label style={{display:'block', fontSize:'11px', color:'#bbb', marginBottom:'5px'}}>封面图 URL (自动清洗)</label><input className="glow-input" value={form.cover} onChange={e=>setForm({...form, cover:e.target.value})} onBlur={e=>{setForm({...form, cover: cleanAndFormat(e.target.value).replace(/!\[.*\]\((.*)\)/, '$1')})}} placeholder="粘贴链接，自动去除多余参数..." /></div>
            </StepAccordion>
            <StepAccordion step={4} title="发布状态" isOpen={expandedStep === 4} onToggle={()=>setExpandedStep(expandedStep===4?0:4)}>
               <div style={{display:'flex', gap:'20px'}}>
                  <button onClick={()=>setForm({...form, status:'Published'})} style={{flex:1, padding:'15px', borderRadius:'10px', background: form.status==='Published'?'greenyellow':'#333', color: form.status==='Published'?'#000':'#666', border:'1px solid #555', cursor:'pointer', fontWeight:'bold', transition:'0.2s'}}>🚀 已发布 (Published)</button>
                  <button onClick={()=>setForm({...form, status:'Draft'})} style={{flex:1, padding:'15px', borderRadius:'10px', background: form.status==='Draft'?'#ff4d4f':'#333', color: form.status==='Draft'?'#fff':'#666', border:'1px solid #555', cursor:'pointer', fontWeight:'bold', transition:'0.2s'}}>📝 草稿 (Draft)</button>
               </div>
            </StepAccordion>
            <BlockBuilder blocks={editorBlocks} setBlocks={setEditorBlocks} />
            <button onClick={()=>{setLoading(true); fetch('/api/admin/post',{method:'POST', body:JSON.stringify({...form, id:currentId})}).then(()=>{setView('list'); fetchData();})}} disabled={!isFormValid} style={{width:'100%', padding:'20px', background:isFormValid?'#fff':'#222', color:isFormValid?'#000':'#666', border:'none', borderRadius:'12px', fontWeight:'bold', fontSize:'16px', marginTop:'40px', cursor:isFormValid?'pointer':'not-allowed', transition:'0.3s'}}>{currentId ? '保存修改' : '确认发布'}</button>
          </main>
        )}
        {previewData && <div className="modal-bg" onClick={()=>setPreviewData(null)}><div className="modal-box" onClick={e=>e.stopPropagation()}><div style={{padding:'20px 25px', borderBottom:'1px solid #333', display:'flex', justifyContent:'space-between', alignItems:'center'}}><strong>预览: {previewData.title}</strong><button onClick={()=>setPreviewData(null)} style={{background:'none', border:'none', color:'#666', fontSize:'24px', cursor:'pointer'}}>×</button></div><div className="modal-body"><NotionView blocks={previewData.rawBlocks} /></div></div></div>}
      </div>
    </div>
  );
}