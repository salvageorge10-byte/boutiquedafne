const body=document.body;
const menuButton=document.querySelector('.menu-toggle');
const mobileNav=document.querySelector('.mobile-nav');
const drawer=document.querySelector('.order-drawer');
const backdrop=document.querySelector('.drawer-backdrop');
const closeDrawerButton=document.querySelector('.drawer-close');
const orderItems=document.querySelector('#orderItems');
const emptyOrder=document.querySelector('#emptyOrder');
const orderCount=document.querySelector('#orderCount');
const whatsappOrder=document.querySelector('#whatsappOrder');
const toast=document.querySelector('.toast');
let selected=[];

document.querySelector('#year').textContent=new Date().getFullYear();

function positionMobileNav(){
  const headerBottom=document.querySelector('.site-header').getBoundingClientRect().bottom;
  mobileNav.style.top=`${Math.max(0,headerBottom)}px`;
  mobileNav.style.height=`calc(100dvh - ${Math.max(0,headerBottom)}px)`;
}

menuButton.addEventListener('click',()=>{
  const open=body.classList.toggle('menu-open');
  if(open)positionMobileNav();
  menuButton.setAttribute('aria-expanded',String(open));
  menuButton.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');
});
window.addEventListener('resize',()=>{if(body.classList.contains('menu-open'))positionMobileNav()},{passive:true});
window.addEventListener('scroll',()=>{if(body.classList.contains('menu-open'))positionMobileNav()},{passive:true});
mobileNav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
  body.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded','false');
}));

function openDrawer(){
  body.classList.add('drawer-open');
  drawer.setAttribute('aria-hidden','false');
  closeDrawerButton.focus();
}
function closeDrawer(){
  body.classList.remove('drawer-open');
  drawer.setAttribute('aria-hidden','true');
}
document.querySelectorAll('.order-trigger,.order-trigger-inline').forEach(button=>button.addEventListener('click',openDrawer));
closeDrawerButton.addEventListener('click',closeDrawer);
backdrop.addEventListener('click',closeDrawer);
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeDrawer();body.classList.remove('menu-open')}});

function updateOrder(){
  orderItems.innerHTML='';
  selected.forEach((product,index)=>{
    const item=document.createElement('div');
    item.className='order-item';
    item.innerHTML=`<span>${product}</span><button type="button" data-index="${index}">Quitar</button>`;
    orderItems.appendChild(item);
  });
  orderCount.textContent=selected.length;
  emptyOrder.hidden=selected.length>0;
  whatsappOrder.classList.toggle('disabled',selected.length===0);
  const message=`Hola Boutique Dafne, quisiera consultar por:\n${selected.map(item=>`• ${item}`).join('\n')}`;
  whatsappOrder.href=selected.length?`https://wa.me/?text=${encodeURIComponent(message)}`:'#';
}
document.querySelectorAll('.add-product').forEach(button=>button.addEventListener('click',()=>{
  const product=button.dataset.product;
  if(!selected.includes(product)){
    selected.push(product);
    button.classList.add('added');
    button.textContent='✓';
    updateOrder();
    toast.classList.add('show');
    setTimeout(()=>toast.classList.remove('show'),1700);
  }else{openDrawer()}
}));
orderItems.addEventListener('click',event=>{
  const button=event.target.closest('button[data-index]');
  if(!button)return;
  const name=selected[Number(button.dataset.index)];
  selected.splice(Number(button.dataset.index),1);
  const productButton=[...document.querySelectorAll('.add-product')].find(item=>item.dataset.product===name);
  if(productButton){productButton.classList.remove('added');productButton.textContent='+'}
  updateOrder();
});

document.querySelectorAll('.filter').forEach(filter=>filter.addEventListener('click',()=>{
  document.querySelectorAll('.filter').forEach(item=>item.classList.remove('active'));
  filter.classList.add('active');
  const category=filter.dataset.filter;
  document.querySelectorAll('.product-card').forEach(card=>{
    card.classList.toggle('hidden',category!=='all'&&!card.dataset.category.includes(category));
  });
}));

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}});
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(element=>observer.observe(element));
updateOrder();
