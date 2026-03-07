// ══ SUPABASE CONFIG ══
const SUPABASE_URL = 'https://atdhhsqommyfdoajrcwu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_0-PwYxjTiT-LJDCZOgyNTQ_Dl1FhlE9';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ══ AUTH ══
async function signUp(email, password, name) {
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
  if (error) throw error;
  return data;
}

async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

async function signOut() {
  await supabase.auth.signOut();
  localStorage.removeItem('ph_cart');
  window.location.href = 'index.html';
}

async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}

async function isAdmin() {
  const user = await getUser();
  if (!user) return false;
  const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  return data?.role === 'admin';
}

// ══ PRODUCTS ══
async function getProducts(limit = 20, category = null) {
  let q = supabase.from('products').select('*').order('created_at', { ascending: false });
  if (category) q = q.eq('category', category);
  if (limit) q = q.limit(limit);
  const { data } = await q;
  return data || [];
}

async function getProduct(id) {
  const { data } = await supabase.from('products').select('*').eq('id', id).single();
  return data;
}

async function saveProduct(product) {
  if (product.id) {
    const { error } = await supabase.from('products').update(product).eq('id', product.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('products').insert(product);
    if (error) throw error;
  }
}

async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

// ══ POSTS ══
async function getPosts(limit = 20, category = null) {
  let q = supabase.from('posts').select('*').eq('published', true).order('created_at', { ascending: false });
  if (category) q = q.eq('category', category);
  if (limit) q = q.limit(limit);
  const { data } = await q;
  return data || [];
}

async function getPost(id) {
  const { data } = await supabase.from('posts').select('*').eq('id', id).single();
  if (data) { await supabase.from('posts').update({ views: (data.views || 0) + 1 }).eq('id', id); }
  return data;
}

async function savePost(post) {
  if (post.id) {
    const { error } = await supabase.from('posts').update(post).eq('id', post.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('posts').insert(post);
    if (error) throw error;
  }
}

async function deletePost(id) {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw error;
}

// ══ COMMENTS ══
async function getComments(postId) {
  const { data } = await supabase.from('comments').select('*').eq('post_id', postId).order('created_at', { ascending: false });
  return data || [];
}

async function addComment(postId, name, email, content) {
  const { error } = await supabase.from('comments').insert({ post_id: postId, user_name: name, user_email: email, content });
  if (error) throw error;
}

// ══ ORDERS ══
async function placeOrder(orderData) {
  const { data, error } = await supabase.from('orders').insert(orderData).select().single();
  if (error) throw error;
  return data;
}

async function getOrders() {
  const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  return data || [];
}

async function updateOrderStatus(id, status) {
  await supabase.from('orders').update({ status }).eq('id', id);
}

// ══ NEWSLETTER ══
async function saveNewsletter(email) {
  await supabase.from('newsletter').insert({ email }).onConflict('email').ignore();
}

// ══ CART ══
function getCart() { return JSON.parse(localStorage.getItem('ph_cart') || '[]'); }
function saveCart(cart) { localStorage.setItem('ph_cart', JSON.stringify(cart)); updateCartCount(); }

function addToCart(id, name, price, image = '', nameHi = '') {
  const cart = getCart();
  const idx = cart.findIndex(i => i.id == id);
  if (idx > -1) cart[idx].qty++;
  else cart.push({ id, name, price, image, nameHi, qty: 1 });
  saveCart(cart);
  showToast('✅ Added to cart!');
}

function removeFromCart(id) {
  saveCart(getCart().filter(i => i.id != id));
}

function cartTotal() { return getCart().reduce((s, i) => s + i.price * i.qty, 0); }

function updateCartCount() {
  const el = document.getElementById('cartCount');
  if (el) el.textContent = getCart().reduce((s, i) => s + i.qty, 0);
}

// ══ UI HELPERS ══
function showToast(msg, dur = 3000) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), dur);
}

function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

async function renderUserNav() {
  const el = document.getElementById('userNav');
  if (!el) return;
  const user = await getUser();
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    const name = profile?.name || user.email.split('@')[0];
    const role = profile?.role || 'user';
    el.innerHTML = `
      <div style="display:flex;align-items:center;gap:.5rem;">
        ${role === 'admin' ? `<a href="admin.html" class="nav-user-btn">⚙️ Admin</a>` : ''}
        <span class="nav-user-btn" style="cursor:default;">👤 ${name}</span>
        <button class="nav-user-btn" onclick="signOut()" style="cursor:pointer;">Logout</button>
      </div>`;
  } else {
    el.innerHTML = `<a href="login.html" class="nav-login-btn">Login / Register</a>`;
  }
}

// ══ CARD TEMPLATES ══
function productCard(p) {
  return `
  <div class="product-card reveal" onclick="location.href='product.html?id=${p.id}'">
    ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
    <img src="${p.image || 'https://images.unsplash.com/photo-1611021061285-c3f6e3f5e8d2?w=400'}" alt="${p.name}" loading="lazy"/>
    <div class="product-body">
      <div class="product-cat">${p.category || 'Herbal'}</div>
      <div class="product-name">${p.name}</div>
      ${p.name_hindi ? `<div class="product-name-hi">${p.name_hindi}</div>` : ''}
      <div class="product-desc">${(p.description || '').substring(0, 80)}...</div>
      <div class="product-footer">
        <div class="product-price">₹${p.price} ${p.original_price ? `<span class="orig">₹${p.original_price}</span>` : ''}</div>
        <button class="add-cart-btn" onclick="event.stopPropagation();addToCart(${p.id},'${p.name}',${p.price},'${p.image || ''}','${p.name_hindi || ''}')">+ Add</button>
      </div>
    </div>
  </div>`;
}

function blogCard(p) {
  return `
  <div class="blog-card reveal" onclick="location.href='post.html?id=${p.id}'">
    <img src="${p.image || 'https://images.unsplash.com/photo-1465844032861-6f939abe6957?w=600'}" alt="${p.title}" loading="lazy"/>
    <div class="blog-body">
      <span class="blog-tag">🌿 ${p.category || 'Health'}</span>
      <div class="blog-title">${p.title}</div>
      ${p.title_hindi ? `<div class="blog-hindi">${p.title_hindi}</div>` : ''}
      <div class="blog-excerpt">${(p.excerpt || '').substring(0, 100)}...</div>
      <div class="blog-meta"><span>📅 ${new Date(p.created_at).toLocaleDateString('en-IN')}</span><span>👁️ ${p.views || 0} views</span></div>
    </div>
  </div>`;
}

// ══ DEFAULT DATA (shown if DB empty) ══
function defaultProducts() {
  return [
    { id:'d1', name:'Ashwagandha Gold', name_hindi:'अश्वगंधा गोल्ड', category:'Supplements', price:499, original_price:799, badge:'BESTSELLER', description:'Premium stress relief with KSM-66 extract. Boosts energy & immunity naturally.', image:'https://images.unsplash.com/photo-1611021061285-c3f6e3f5e8d2?w=400&q=80' },
    { id:'d2', name:'Kumkumadi Face Oil', name_hindi:'कुमकुमादि फेस ऑयल', category:'Skin Care', price:649, original_price:999, badge:'NEW', description:'Ancient saffron-infused oil for glowing, radiant skin. 100% natural.', image:'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80' },
    { id:'d3', name:'Brahmi Hair Oil', name_hindi:'ब्राह्मी केश तेल', category:'Hair Care', price:349, original_price:549, badge:'', description:'Traditional hair growth formula with Brahmi, Bhringraj & Amla.', image:'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80' },
    { id:'d4', name:'Immunity Kadha', name_hindi:'इम्युनिटी काढ़ा', category:'Herbal Tea', price:299, original_price:449, badge:'SALE', description:'Tulsi, Ginger, Turmeric & Pepper blend for daily immunity boost.', image:'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80' },
  ];
}

function defaultPosts() {
  return [
    { id:'b1', title:'Ashwagandha: Complete Guide to Benefits', title_hindi:'अश्वगंधा के फायदे', category:'Herbs', excerpt:'Discover how this ancient Ayurvedic herb can transform your health and boost immunity...', image:'https://images.unsplash.com/photo-1611021061285-c3f6e3f5e8d2?w=600&q=80', created_at: new Date().toISOString(), views: 1240 },
    { id:'b2', title:'Natural Skin Care with Ayurvedic Herbs', title_hindi:'आयुर्वेदिक त्वचा देखभाल', category:'Skin Care', excerpt:'Transform your skin naturally with these powerful Ayurvedic ingredients used for centuries...', image:'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80', created_at: new Date().toISOString(), views: 980 },
    { id:'b3', title:'Ayurvedic Morning Routine for Better Health', title_hindi:'आयुर्वेदिक सुबह की दिनचर्या', category:'Wellness', excerpt:'Start your day right with these simple Ayurvedic morning practices for energy and health...', image:'https://images.unsplash.com/photo-1465844032861-6f939abe6957?w=600&q=80', created_at: new Date().toISOString(), views: 820 },
  ];
}
