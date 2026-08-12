const LIVE_SHOP='https://linktr.ee/destinedskinn';
const products=[
  {id:'soap-01',name:'Signature Soap Bar',category:'soap',tag:'featured',copy:'Preview inventory slot for a core Destined Skinn soap bar. Replace with the brand-approved product name, image, price and checkout URL.',price:null},
  {id:'soap-02',name:'Daily Soap Bar',category:'soap',tag:'featured',copy:'Preview inventory slot for another current soap bar in the collection.',price:null},
  {id:'body-01',name:'Body Care',category:'body',tag:'',copy:'Preview inventory slot for a current Destined Skinn body-care product.',price:null},
  {id:'soap-03',name:'Ritual Soap Bar',category:'soap',tag:'',copy:'Preview inventory slot for an additional soap-bar option.',price:null},
  {id:'body-02',name:'Skin Ritual',category:'body',tag:'',copy:'Preview inventory slot ready for an approved body-care product.',price:null},
  {id:'drop-01',name:'Current Drop',category:'featured',tag:'featured',copy:'A live-shop gateway for whatever Destined Skinn is currently offering.',price:null}
];

const state={route:'home',filter:'all',query:'',cart:JSON.parse(localStorage.getItem('ds-cart')||'[]'),saved:JSON.parse(localStorage.getItem('ds-saved')||'[]')};
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const persist=()=>{localStorage.setItem('ds-cart',JSON.stringify(state.cart));localStorage.setItem('ds-saved',JSON.stringify(state.saved));};
const toast=(message)=>{const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),1700)};
const isSaved=id=>state.saved.includes(id);

function card(product){
  return `<article class="product-card" data-id="${product.id}">
    <button class="fav ${isSaved(product.id)?'active':''}" data-favorite="${product.id}" aria-label="Save ${product.name}">${isSaved(product.id)?'♥':'♡'}</button>
    <button class="product-visual" data-open-product="${product.id}" aria-label="View ${product.name}" style="border:0;width:100%;cursor:pointer"><span class="mini-soap">Skinn</span></button>
    <div class="product-meta"><span class="preview-tag">Preview item</span><h3>${product.name}</h3><p>${product.category==='soap'?'Soap bar':'Body care'} · Final price pending</p></div>
    <div class="product-actions"><button data-open-product="${product.id}">View details</button><button data-add="${product.id}">Add to bag +</button></div>
  </article>`;
}

function renderProducts(){
  const q=state.query.trim().toLowerCase();
  const visible=products.filter(p=>{
    const filterMatch=state.filter==='all'||p.category===state.filter||p.tag===state.filter;
    const queryMatch=!q||`${p.name} ${p.category} ${p.copy}`.toLowerCase().includes(q);
    return filterMatch&&queryMatch;
  });
  $('#productGrid').innerHTML=visible.length?visible.map(card).join(''):`<div class="empty-state"><span>⌕</span><h2>No match.</h2><p>Try another search or category.</p></div>`;
  $('#featuredProducts').innerHTML=products.filter(p=>p.tag==='featured').slice(0,3).map(card).join('');
  const saved=products.filter(p=>state.saved.includes(p.id));
  $('#savedGrid').innerHTML=saved.map(card).join('');
  $('#savedEmpty').style.display=saved.length?'none':'block';
}

function route(name){
  state.route=name;
  $$('.view').forEach(v=>v.classList.toggle('active',v.dataset.view===name));
  $$('.tabbar [data-route]').forEach(b=>b.classList.toggle('active',b.dataset.route===name));
  window.scrollTo({top:0,behavior:'smooth'});
  if(name==='shop') setTimeout(()=>$('#searchInput')?.focus({preventScroll:true}),200);
}

function setFilter(filter){
  state.filter=filter||'all';
  $$('#chips [data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter===state.filter));
  renderProducts();
}

function openSheet(sheet){
  $('#backdrop').classList.add('show');
  sheet.classList.add('open');
  sheet.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
}
function closeSheets(){
  $('#backdrop').classList.remove('show');
  $$('.sheet').forEach(s=>{s.classList.remove('open');s.setAttribute('aria-hidden','true')});
  document.body.style.overflow='';
}

function openProduct(id){
  const p=products.find(x=>x.id===id); if(!p)return;
  $('#productSheetContent').innerHTML=`
    <div class="sheet-product-art"><span class="mini-soap">Skinn</span></div>
    <div class="sheet-product-copy"><span class="preview-tag">Preview inventory</span><h2>${p.name}</h2><p>${p.copy}</p><p><strong>Price:</strong> pending brand-approved catalog data.</p><button class="pill primary full" data-add="${p.id}">Add to bag</button><a class="pill full" style="margin-top:10px" href="${LIVE_SHOP}" target="_blank" rel="noreferrer">Open live shop ↗</a></div>`;
  openSheet($('#productSheet'));
}

function addToCart(id){
  const item=state.cart.find(x=>x.id===id);
  if(item)item.qty+=1; else state.cart.push({id,qty:1});
  persist();renderCart();toast('Added to bag');
}
function removeFromCart(id){state.cart=state.cart.filter(x=>x.id!==id);persist();renderCart();}
function renderCart(){
  const count=state.cart.reduce((n,x)=>n+x.qty,0);$('#cartCount').textContent=count;
  $('#cartItems').innerHTML=state.cart.length?state.cart.map(item=>{const p=products.find(x=>x.id===item.id);return `<div class="cart-item"><div class="cart-thumb">Skinn</div><div><h4>${p?.name||'Product'}</h4><small>Qty ${item.qty} · price pending</small></div><button data-remove="${item.id}" aria-label="Remove">×</button></div>`}).join(''):`<div class="empty-state"><span>Bag</span><h2>Your bag is empty.</h2><p>Add something from the collection.</p></div>`;
  $('#cartTotal').textContent=state.cart.length?'Pending':'—';
}
function toggleFavorite(id){
  state.saved=state.saved.includes(id)?state.saved.filter(x=>x!==id):[...state.saved,id];persist();renderProducts();toast(state.saved.includes(id)?'Saved to your shelf':'Removed from saved');
}

function handleClick(e){
  const routeEl=e.target.closest('[data-route]');
  if(routeEl){e.preventDefault();if(routeEl.dataset.filter)setFilter(routeEl.dataset.filter);route(routeEl.dataset.route);return;}
  const filter=e.target.closest('[data-filter]');if(filter&&filter.closest('#chips')){setFilter(filter.dataset.filter);return;}
  const open=e.target.closest('[data-open-product]');if(open){openProduct(open.dataset.openProduct);return;}
  const add=e.target.closest('[data-add]');if(add){addToCart(add.dataset.add);return;}
  const fav=e.target.closest('[data-favorite]');if(fav){toggleFavorite(fav.dataset.favorite);return;}
  const remove=e.target.closest('[data-remove]');if(remove){removeFromCart(remove.dataset.remove);return;}
  if(e.target.closest('[data-close]'))closeSheets();
}
document.addEventListener('click',handleClick);
$('#backdrop').addEventListener('click',closeSheets);
$('#cartToggle').addEventListener('click',()=>{renderCart();openSheet($('#cartSheet'))});
$('#searchToggle').addEventListener('click',()=>route('shop'));
$('#searchInput').addEventListener('input',e=>{state.query=e.target.value;renderProducts()});
$('#clearSearch').addEventListener('click',()=>{$('#searchInput').value='';state.query='';renderProducts();$('#searchInput').focus()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSheets()});

renderProducts();renderCart();route('home');
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));