const menuButton=document.getElementById('menuButton');
const menuSheet=document.getElementById('menuSheet');
const closeMenu=document.getElementById('closeMenu');
const setMenu=(open)=>{
  menuSheet.classList.toggle('open',open);
  menuSheet.setAttribute('aria-hidden',String(!open));
  menuButton.setAttribute('aria-expanded',String(open));
  document.body.style.overflow=open?'hidden':'';
};
menuButton?.addEventListener('click',()=>setMenu(true));
closeMenu?.addEventListener('click',()=>setMenu(false));
menuSheet?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});

const tabs=[...document.querySelectorAll('.mobile-tabbar a[href^="#"]')];
const sections=tabs.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    tabs.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${entry.target.id}`));
  });
},{rootMargin:'-35% 0px -55% 0px',threshold:0});
sections.forEach(section=>observer.observe(section));

if('serviceWorker' in navigator){
  window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
}
