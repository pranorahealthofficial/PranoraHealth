'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['confirmed','packed','shipped','out for delivery','delivered','cancelled']

export default function AdminPage() {
  const { user, isAdmin, loading, signOut } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [tab, setTab] = useState('overview')
  const [data, setData] = useState({ products:[], articles:[], orders:[], users:[], subs:[], contacts:[] })
  const [showProductForm, setShowProductForm] = useState(false)
  const [showArticleForm, setShowArticleForm] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [editArticle, setEditArticle] = useState(null)
  const [pForm, setPForm] = useState({ name:'',slug:'',price:'',original_price:'',category:'',tagline:'',description:'',icon:'🌿',color:'#e8f5e9',ingredients:'',benefits:'',how_it_works:'',how_to_use:'',stock:50 })
  const [aForm, setAForm] = useState({ title:'',slug:'',category:'Gut Health',excerpt:'',content:'',icon:'🌿',color:'#e8f5e9',tags:'',read_time:'5 min' })

  useEffect(() => {
    if (!loading) {
      if (!user) { router.push('/auth/login'); return }
      if (!isAdmin) { router.push('/'); toast.error('Admin access required'); return }
      loadAll()
    }
  }, [user, isAdmin, loading])

  async function loadAll() {
    const [p,a,o,u,s,c] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('articles').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false }),
      supabase.from('contacts').select('*').order('created_at', { ascending: false }),
    ])
    setData({ products:p.data||[], articles:a.data||[], orders:o.data||[], users:u.data||[], subs:s.data||[], contacts:c.data||[] })
  }

  function slugify(text) { return text.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') }

  async function saveProduct() {
    const payload = { ...pForm, price:+pForm.price, original_price:+pForm.original_price, stock:+pForm.stock, ingredients:pForm.ingredients.split(',').map(s=>s.trim()).filter(Boolean), benefits:pForm.benefits.split(',').map(s=>s.trim()).filter(Boolean), is_active:true }
    if (!payload.name || !payload.price || !payload.category) { toast.error('Name, Price and Category required'); return }
    if (!payload.slug) payload.slug = slugify(payload.name)
    if (editProduct) {
      await supabase.from('products').update(payload).eq('id', editProduct)
      toast.success('Product updated!')
    } else {
      await supabase.from('products').insert({ ...payload, rating:5.0, review_count:0 })
      toast.success('Product added!')
    }
    setShowProductForm(false); setEditProduct(null)
    setPForm({ name:'',slug:'',price:'',original_price:'',category:'',tagline:'',description:'',icon:'🌿',color:'#e8f5e9',ingredients:'',benefits:'',how_it_works:'',how_to_use:'',stock:50 })
    loadAll()
  }

  async function deleteProduct(id) {
    if (!confirm('Delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    toast.success('Product deleted'); loadAll()
  }

  function editProductClick(p) {
    setEditProduct(p.id)
    setPForm({ ...p, ingredients:(p.ingredients||[]).join(', '), benefits:(p.benefits||[]).join(', ') })
    setShowProductForm(true)
  }

  async function saveArticle() {
    const payload = { ...aForm, tags:aForm.tags.split(',').map(s=>s.trim()).filter(Boolean), is_published:true, author:'Pranora Health Team' }
    if (!payload.title || !payload.excerpt) { toast.error('Title and Excerpt required'); return }
    if (!payload.slug) payload.slug = slugify(payload.title)
    if (editArticle) {
      await supabase.from('articles').update(payload).eq('id', editArticle)
      toast.success('Article updated!')
    } else {
      await supabase.from('articles').insert(payload)
      toast.success('Article published!')
    }
    setShowArticleForm(false); setEditArticle(null)
    setAForm({ title:'',slug:'',category:'Gut Health',excerpt:'',content:'',icon:'🌿',color:'#e8f5e9',tags:'',read_time:'5 min' })
    loadAll()
  }

  async function deleteArticle(id) {
    if (!confirm('Delete this article?')) return
    await supabase.from('articles').delete().eq('id', id)
    toast.success('Article deleted'); loadAll()
  }

  function editArticleClick(a) {
    setEditArticle(a.id)
    setAForm({ ...a, tags:(a.tags||[]).join(', ') })
    setShowArticleForm(true)
  }

  async function updateOrderStatus(orderId, status) {
    await supabase.from('orders').update({ order_status: status }).eq('id', orderId)
    toast.success('Status updated!'); loadAll()
  }

  async function toggleBlock(userId, blocked) {
    await supabase.from('profiles').update({ is_blocked: !blocked }).eq('id', userId)
    toast.success(blocked ? 'User unblocked' : 'User blocked'); loadAll()
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-4xl animate-spin">🌿</div></div>

  const revenue = data.orders.reduce((s,o) => s + o.total, 0)
  const TABS = [['overview','📊 Overview'],['products','🛍 Products'],['orders','📦 Orders'],['articles','📝 Articles'],['users','👥 Users'],['subs','📬 Subscribers'],['contacts','✉️ Messages']]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#1B4D2E] h-14 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <span className="text-xl">🌿</span>
          <span className="font-serif text-lg font-bold text-white">Pranora Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/70 text-sm hidden sm:block">{user?.email}</span>
          <a href="/" className="text-white/80 text-xs border border-white/30 px-3 py-1 rounded-full hover:bg-white/10">View Site</a>
          <button onClick={() => { signOut(); router.push('/') }} className="bg-red-500 text-white text-xs px-3 py-1 rounded-full hover:bg-red-600">Logout</button>
        </div>
      </div>
      <div className="flex">
        <div className="w-48 bg-white border-r border-gray-200 min-h-[calc(100vh-56px)] p-3 flex-shrink-0">
          {TABS.map(([k,l]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold mb-1 transition-all ${tab===k ? 'bg-[#1B4D2E] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="flex-1 p-6 overflow-auto">
          {tab === 'overview' && (
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#1B4D2E] mb-5">Dashboard Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[[data.users.length,'👥','Users','#e8f5e9'],[data.orders.length,'📦','Orders','#fff8e1'],[data.products.length,'🛍','Products','#fce4ec'],[`₹${revenue.toLocaleString('en-IN')}`, '💰','Revenue','#e8f0ff']].map(([v,i,l,bg]) => (
                  <div key={l} className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-2" style={{ background: bg }}>{i}</div>
                    <div className="font-serif text-2xl font-bold text-[#1B4D2E]">{v}</div>
                    <div className="text-sm text-gray-500">{l}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h4 className="font-bold text-[#1B4D2E] mb-3">Recent Orders</h4>
                {data.orders.slice(0,5).map(o => (
                  <div key={o.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0 text-sm flex-wrap gap-2">
                    <span className="font-semibold">#{o.id.slice(-8).toUpperCase()}</span>
                    <span className="text-gray-500">{o.user_name}</span>
                    <span className="font-bold text-[#1B4D2E]">₹{o.total.toLocaleString('en-IN')}</span>
                    <span className="badge-green text-xs">{o.order_status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

{tab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-serif text-2xl font-bold text-[#1B4D2E]">Products</h2>
                <button onClick={() => { setEditProduct(null); setShowProductForm(true) }} className="btn-primary text-sm">➕ Add Product</button>
              </div>
              {showProductForm && (
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                  <h3 className="font-serif text-xl font-bold text-[#1B4D2E] mb-4">{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
                  <div className="grid sm:grid-cols-3 gap-3 mb-3">
                    <div><label className="text-xs font-bold text-[#1B4D2E] block mb-1">Name*</label><input className="input-field text-sm" value={pForm.name} onChange={e => setPForm(p=>({...p,name:e.target.value}))} placeholder="Product Name" /></div>
                    <div><label className="text-xs font-bold text-[#1B4D2E] block mb-1">Price*</label><input type="number" className="input-field text-sm" value={pForm.price} onChange={e => setPForm(p=>({...p,price:e.target.value}))} /></div>
                    <div><label className="text-xs font-bold text-[#1B4D2E] block mb-1">Original Price</label><input type="number" className="input-field text-sm" value={pForm.original_price} onChange={e => setPForm(p=>({...p,original_price:e.target.value}))} /></div>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3 mb-3">
                    <div><label className="text-xs font-bold text-[#1B4D2E] block mb-1">Category*</label><input className="input-field text-sm" value={pForm.category} onChange={e => setPForm(p=>({...p,category:e.target.value}))} /></div>
                    <div><label className="text-xs font-bold text-[#1B4D2E] block mb-1">Stock</label><input type="number" className="input-field text-sm" value={pForm.stock} onChange={e => setPForm(p=>({...p,stock:e.target.value}))} /></div>
                    <div><label className="text-xs font-bold text-[#1B4D2E] block mb-1">Emoji Icon</label><input className="input-field text-sm" value={pForm.icon} onChange={e => setPForm(p=>({...p,icon:e.target.value}))} /></div>
                  </div>
                  <div className="mb-3"><label className="text-xs font-bold text-[#1B4D2E] block mb-1">Tagline</label><input className="input-field text-sm" value={pForm.tagline} onChange={e => setPForm(p=>({...p,tagline:e.target.value}))} /></div>
                  <div className="mb-3"><label className="text-xs font-bold text-[#1B4D2E] block mb-1">Description</label><textarea className="input-field text-sm" rows={2} value={pForm.description} onChange={e => setPForm(p=>({...p,description:e.target.value}))} /></div>
                  <div className="grid sm:grid-cols-2 gap-3 mb-3">
                    <div><label className="text-xs font-bold text-[#1B4D2E] block mb-1">Ingredients (comma separated)</label><input className="input-field text-sm" value={pForm.ingredients} onChange={e => setPForm(p=>({...p,ingredients:e.target.value}))} /></div>
                    <div><label className="text-xs font-bold text-[#1B4D2E] block mb-1">Benefits (comma separated)</label><input className="input-field text-sm" value={pForm.benefits} onChange={e => setPForm(p=>({...p,benefits:e.target.value}))} /></div>
                  </div>
                  <div className="mb-3"><label className="text-xs font-bold text-[#1B4D2E] block mb-1">How It Works</label><textarea className="input-field text-sm" rows={2} value={pForm.how_it_works} onChange={e => setPForm(p=>({...p,how_it_works:e.target.value}))} /></div>
                  <div className="mb-4"><label className="text-xs font-bold text-[#1B4D2E] block mb-1">How to Use</label><textarea className="input-field text-sm" rows={2} value={pForm.how_to_use} onChange={e => setPForm(p=>({...p,how_to_use:e.target.value}))} /></div>
                  <div className="flex gap-3">
                    <button onClick={saveProduct} className="btn-primary text-sm">Save Product</button>
                    <button onClick={() => { setShowProductForm(false); setEditProduct(null) }} className="btn-outline text-sm">Cancel</button>
                  </div>
                </div>
              )}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>{['Product','Category','Price','Stock','Rating','Actions'].map(h => <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600 text-xs">{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {data.products.map(p => (
                        <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3"><div className="flex items-center gap-2"><span className="text-xl">{p.icon}</span><div><div className="font-semibold text-[#1B4D2E]">{p.name}</div><div className="text-xs text-gray-400">{p.tagline}</div></div></div></td>
                          <td className="px-4 py-3"><span className="badge-green">{p.category}</span></td>
                          <td className="px-4 py-3 font-bold text-[#1B4D2E]">₹{p.price}</td>
                          <td className="px-4 py-3">{p.stock}</td>
                          <td className="px-4 py-3 text-[#C9A84C]">★ {p.rating}</td>
                          <td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => editProductClick(p)} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">Edit</button><button onClick={() => deleteProduct(p.id)} className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full">Delete</button></div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {tab === 'orders' && (
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#1B4D2E] mb-5">Orders ({data.orders.length})</h2>
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>{['Order ID','Customer','Date','Total','Status','Update'].map(h => <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600 text-xs">{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {data.orders.map(o => (
                        <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3 font-semibold">#{o.id.slice(-8).toUpperCase()}</td>
                          <td className="px-4 py-3"><div className="font-medium">{o.user_name}</div><div className="text-xs text-gray-400">{o.user_email}</div></td>
                          <td className="px-4 py-3 text-xs text-gray-500">{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                          <td className="px-4 py-3 font-bold text-[#1B4D2E]">₹{o.total.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3"><span className="badge-green">{o.order_status}</span></td>
                          <td className="px-4 py-3">
                            <select value={o.order_status} onChange={e => updateOrderStatus(o.id, e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1">
                              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {tab === 'articles' && (
            <div>
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-serif text-2xl font-bold text-[#1B4D2E]">Articles</h2>
                <button onClick={() => { setEditArticle(null); setShowArticleForm(true) }} className="btn-primary text-sm">✍️ New Article</button>
              </div>
              {showArticleForm && (
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                  <h3 className="font-serif text-xl font-bold text-[#1B4D2E] mb-4">{editArticle ? 'Edit Article' : 'New Article'}</h3>
                  <div className="mb-3"><label className="text-xs font-bold text-[#1B4D2E] block mb-1">Title*</label><input className="input-field text-sm" value={aForm.title} onChange={e => setAForm(p=>({...p,title:e.target.value}))} /></div>
                  <div className="grid sm:grid-cols-3 gap-3 mb-3">
                    <div><label className="text-xs font-bold text-[#1B4D2E] block mb-1">Category</label>
                      <select className="input-field text-sm" value={aForm.category} onChange={e => setAForm(p=>({...p,category:e.target.value}))}>
                        {['Gut Health','Ayurveda','Immunity','Skin and Hair Care','Daily Health Habits','Natural Remedies'].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div><label className="text-xs font-bold text-[#1B4D2E] block mb-1">Read Time</label><input className="input-field text-sm" value={aForm.read_time} onChange={e => setAForm(p=>({...p,read_time:e.target.value}))} /></div>
                    <div><label className="text-xs font-bold text-[#1B4D2E] block mb-1">Emoji Icon</label><input className="input-field text-sm" value={aForm.icon} onChange={e => setAForm(p=>({...p,icon:e.target.value}))} /></div>
                  </div>
                  <div className="mb-3"><label className="text-xs font-bold text-[#1B4D2E] block mb-1">Excerpt*</label><textarea className="input-field text-sm" rows={2} value={aForm.excerpt} onChange={e => setAForm(p=>({...p,excerpt:e.target.value}))} /></div>
                  <div className="mb-3"><label className="text-xs font-bold text-[#1B4D2E] block mb-1">Full Content</label><textarea className="input-field text-sm" rows={5} value={aForm.content} onChange={e => setAForm(p=>({...p,content:e.target.value}))} /></div>
                  <div className="mb-4"><label className="text-xs font-bold text-[#1B4D2E] block mb-1">Tags (comma separated)</label><input className="input-field text-sm" value={aForm.tags} onChange={e => setAForm(p=>({...p,tags:e.target.value}))} /></div>
                  <div className="flex gap-3">
                    <button onClick={saveArticle} className="btn-primary text-sm">Publish Article</button>
                    <button onClick={() => { setShowArticleForm(false); setEditArticle(null) }} className="btn-outline text-sm">Cancel</button>
                  </div>
                </div>
              )}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>{['Article','Category','Read Time','Actions'].map(h => <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600 text-xs">{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {data.articles.map(a => (
                        <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3"><div className="font-semibold text-[#1B4D2E]">{a.icon} {a.title}</div></td>
                          <td className="px-4 py-3"><span className="badge-green">{a.category}</span></td>
                          <td className="px-4 py-3 text-gray-500">{a.read_time}</td>
                          <td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => editArticleClick(a)} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">Edit</button><button onClick={() => deleteArticle(a.id)} className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full">Delete</button></div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {tab === 'users' && (
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#1B4D2E] mb-5">Users ({data.users.length})</h2>
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>{['User','Role','Joined','Status','Action'].map(h => <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600 text-xs">{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {data.users.map(u => (
                        <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-7 h-7 bg-[#1B4D2E] rounded-full flex items-center justify-center text-white text-xs font-bold">{u.full_name?.[0]?.toUpperCase()||'?'}</div><div className="font-semibold">{u.full_name||'—'}</div></div></td>
                          <td className="px-4 py-3"><span className={u.role==='admin' ? 'badge-gold' : 'badge-green'}>{u.role}</span></td>
                          <td className="px-4 py-3 text-xs text-gray-500">{new Date(u.created_at).toLocaleDateString('en-IN')}</td>
                          <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-1 rounded-full ${u.is_blocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{u.is_blocked ? 'Blocked' : 'Active'}</span></td>
                          <td className="px-4 py-3"><button onClick={() => toggleBlock(u.id, u.is_blocked)} className={`text-xs px-3 py-1 rounded-full ${u.is_blocked ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.is_blocked ? 'Unblock' : 'Block'}</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {tab === 'subs' && (
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#1B4D2E] mb-5">Subscribers ({data.subs.length})</h2>
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b"><tr>{['#','Email','Date'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600">{h}</th>)}</tr></thead>
                    <tbody>{data.subs.map((s,i) => <tr key={s.id} className="border-b border-gray-100"><td className="px-4 py-3 text-gray-400">{i+1}</td><td className="px-4 py-3 font-medium">{s.email}</td><td className="px-4 py-3 text-xs text-gray-400">{new Date(s.created_at).toLocaleDateString('en-IN')}</td></tr>)}</tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {tab === 'contacts' && (
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#1B4D2E] mb-5">Messages ({data.contacts.length})</h2>
              <div className="space-y-4">
                {data.contacts.map(c => (
                  <div key={c.id} className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex justify-between mb-2 flex-wrap gap-2">
                      <div className="font-bold text-[#1B4D2E]">{c.name} — {c.email}</div>
                      <div className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString('en-IN')}</div>
                    </div>
                    {c.subject && <div className="text-sm font-semibold text-gray-600 mb-1">Subject: {c.subject}</div>}
                    <p className="text-sm text-gray-600">{c.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}