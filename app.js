(() => {
  'use strict';
  const STORAGE_KEY = 'campusloop-listings-v1';
  const CLAIMS_KEY = 'campusloop-claims-v1';
  const today = new Date();
  const dateOffset = (days) => { const d = new Date(today); d.setDate(d.getDate() + days); return d.toISOString().slice(0, 10); };
  const demoItems = [
    {id:'demo-1',type:'found',category:'Electronics',name:'Wireless earbuds case',location:'Central Library, study zone',date:dateOffset(-1),color:'White',description:'Small white charging case found near the long study tables. Please verify the brand and a distinguishing detail before collecting.',status:'open',createdAt:Date.now()-3600000*5,emoji:'🎧',demo:true},
    {id:'demo-2',type:'lost',category:'Accessories',name:'Olive green bottle',location:'Sports complex entrance',date:dateOffset(-2),color:'Olive green',description:'Reusable bottle with a few small stickers near the bottom. Last seen after an evening practice session.',status:'open',createdAt:Date.now()-3600000*11,emoji:'🧴',demo:true},
    {id:'demo-3',type:'found',category:'Cards & IDs',name:'Plain access card holder',location:'Academic Block 2, ground floor',date:dateOffset(-1),color:'Transparent',description:'Transparent plastic card holder found by the stairs. Sensitive details are intentionally not shown.',status:'open',createdAt:Date.now()-3600000*18,emoji:'💳',demo:true},
    {id:'demo-4',type:'lost',category:'Books & Notes',name:'Engineering notebook',location:'Cafeteria, outdoor tables',date:dateOffset(-3),color:'Blue cover',description:'Blue ruled notebook with handwritten lecture notes. The cover has a small white label.',status:'open',createdAt:Date.now()-3600000*27,emoji:'📓',demo:true},
    {id:'demo-5',type:'found',category:'Keys',name:'Single key with a blue tag',location:'Main auditorium foyer',date:dateOffset(-2),color:'Silver / blue',description:'One silver key attached to a small blue tag. No identifying information is displayed.',status:'open',createdAt:Date.now()-3600000*34,emoji:'🔑',demo:true},
    {id:'demo-6',type:'lost',category:'Electronics',name:'USB-C charging adapter',location:'Computer lab corridor',date:dateOffset(-4),color:'White',description:'Compact white wall adapter, possibly left near the corridor benches after class.',status:'open',createdAt:Date.now()-3600000*49,emoji:'🔌',demo:true},
    {id:'demo-7',type:'found',category:'Clothing',name:'Grey zip-up hoodie',location:'Student activity centre',date:dateOffset(-2),color:'Grey',description:'Grey hoodie found folded over a chair. Please identify a distinctive feature to confirm ownership.',status:'open',createdAt:Date.now()-3600000*54,emoji:'🧥',demo:true},
    {id:'demo-8',type:'lost',category:'Accessories',name:'Black frame spectacles',location:'Lecture Hall 4',date:dateOffset(-1),color:'Black',description:'Black rectangular-frame spectacles, possibly left in the front rows after a lecture.',status:'open',createdAt:Date.now()-3600000*62,emoji:'👓',demo:true},
    {id:'demo-9',type:'found',category:'Other',name:'Small patterned umbrella',location:'Bus stop near campus gate',date:dateOffset(-3),color:'Navy with tiny dots',description:'Foldable umbrella found near the covered waiting area. Handle has a wrist loop.',status:'open',createdAt:Date.now()-3600000*75,emoji:'☂️',demo:true}
  ];
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  let items = loadItems();
  let claims = loadClaims();
  let currentView = 'all';
  let activeDetailId = null;
  let toastTimer;

  function loadItems() {
    try { const stored = localStorage.getItem(STORAGE_KEY); return stored ? JSON.parse(stored) : [...demoItems]; }
    catch { return [...demoItems]; }
  }
  function loadClaims() { try { return JSON.parse(localStorage.getItem(CLAIMS_KEY) || '[]'); } catch { return []; } }
  function saveItems() { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }
  function saveClaims() { localStorage.setItem(CLAIMS_KEY, JSON.stringify(claims)); }
  function escapeHtml(value='') { return String(value).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function formatDate(dateString) { if (!dateString) return 'Date not set'; const d = new Date(`${dateString}T12:00:00`); return d.toLocaleDateString('en-IN',{day:'numeric',month:'short'}); }
  function categoryClass(category) { return ({'Electronics':'electronics','Accessories':'accessories','Cards & IDs':'cards','Books & Notes':'books','Clothing':'clothing','Keys':'keys','Other':'other'})[category] || 'other'; }
  function itemEmoji(item) { if (item.emoji) return item.emoji; return ({'Electronics':'🎧','Accessories':'🎒','Cards & IDs':'💳','Books & Notes':'📚','Clothing':'🧥','Keys':'🔑','Other':'📦'})[item.category] || '📦'; }
  function showToast(message) { const toast=$('#toast'); toast.textContent=message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove('show'),2800); }
  function openModal(id) { const el=document.getElementById(id); el.classList.remove('hidden'); document.body.style.overflow='hidden'; const focus=el.querySelector('input,select,button,textarea'); if(focus) setTimeout(()=>focus.focus(),50); }
  function closeModal(id) { document.getElementById(id).classList.add('hidden'); if (!$$('.modal-backdrop').some(el=>!el.classList.contains('hidden'))) document.body.style.overflow=''; }
  function openListingForm(type='lost') { $('#listing-form').reset(); $('#item-type').value=type; $('#item-date').value=dateOffset(0); $('#modal-title').textContent=type==='found'?'Report a found item':'Report a lost item'; openModal('listing-modal'); }
  function filteredItems() {
    const search=$('#search-input').value.trim().toLowerCase(); const category=$('#category-filter').value; const sort=$('#sort-filter').value;
    let list=[...items];
    if(currentView==='lost'||currentView==='found') list=list.filter(item=>item.type===currentView);
    if(currentView==='claims') list=list.filter(item=>claims.includes(item.id));
    if(category!=='all') list=list.filter(item=>item.category===category);
    if(search) list=list.filter(item=>[item.name,item.category,item.location,item.color,item.description,item.type].some(v=>String(v||'').toLowerCase().includes(search)));
    list.sort((a,b)=>sort==='newest'?(b.createdAt||0)-(a.createdAt||0):(a.createdAt||0)-(b.createdAt||0));
    return list;
  }
  function renderCard(item) {
    const typeLabel=item.status==='resolved'?'REUNITED':item.type.toUpperCase();
    const typeClass=item.status==='resolved'?'type-resolved':`type-${item.type}`;
    const actionLabel=item.status==='resolved'?'View details':(item.type==='found'?'View / claim':'View details');
    return `<article class="item-card"><div class="item-visual visual-${categoryClass(item.category)}"><span class="type-pill ${typeClass}">${typeLabel}</span><span class="item-date">${escapeHtml(formatDate(item.date))}</span><span class="item-emoji" aria-hidden="true">${itemEmoji(item)}</span></div><div class="item-body"><div class="item-meta">${escapeHtml(item.category)}</div><h3 class="item-title">${escapeHtml(item.name)}</h3><p class="item-description">${escapeHtml(item.description||'No additional description provided.')}</p><div class="item-location"><span class="location-pin">⌖</span><span>${escapeHtml(item.location)}</span></div><div class="item-footer"><span class="item-color">${item.color?`Colour: ${escapeHtml(item.color)}`:'Community listing'}</span><button class="card-action" data-detail="${escapeHtml(item.id)}">${actionLabel} →</button></div></div></article>`;
  }
  function render() {
    const visible=filteredItems(); const allOpen=items.filter(i=>i.status!=='resolved');
    $('#stat-total').textContent=items.length; $('#stat-lost').textContent=items.filter(i=>i.type==='lost'&&i.status!=='resolved').length; $('#stat-found').textContent=items.filter(i=>i.type==='found'&&i.status!=='resolved').length; $('#stat-resolved').textContent=items.filter(i=>i.status==='resolved').length;
    $('#nav-all-count').textContent=allOpen.length; $('#nav-lost-count').textContent=items.filter(i=>i.type==='lost'&&i.status!=='resolved').length; $('#nav-found-count').textContent=items.filter(i=>i.type==='found'&&i.status!=='resolved').length; $('#nav-claims-count').textContent=claims.length;
    const titles={all:['All items','Recently posted','Browse the latest lost and found listings around campus.'],lost:['Lost items','Lost around campus','Help someone find what they are missing.'],found:['Found items','Found around campus','Browse items waiting to be reunited with their owners.'],claims:['My claims','Your saved claims','Items you have flagged for follow-up in this browser.']};
    const title=titles[currentView]; $('#breadcrumb-current').textContent=title[0]; $('#board-title').textContent=title[1]; $('#board-description').textContent=title[2];
    $('#results-label').textContent=`Showing ${visible.length} ${visible.length===1?'listing':'listings'}`;
    const hasFilters=$('#search-input').value.trim()||$('#category-filter').value!=='all'||currentView!=='all'; $('#clear-filters').classList.toggle('visible',Boolean(hasFilters));
    $('#item-grid').innerHTML=visible.map(renderCard).join(''); $('#item-grid').classList.toggle('hidden',visible.length===0); $('#empty-state').classList.toggle('hidden',visible.length!==0);
  }
  function showDetails(id) {
    const item=items.find(x=>x.id===id); if(!item)return; activeDetailId=id;
    $('#detail-eyebrow').textContent=item.status==='resolved'?'REUNITED ITEM':`${item.type.toUpperCase()} LISTING`;
    $('#detail-title').textContent=item.name;
    const status=item.status==='resolved'?'Marked as reunited':(item.type==='found'?'Waiting to be claimed':'Still looking');
    const claimButton=item.status==='resolved'?'':(claims.includes(item.id)?'<button class="button button-light" data-unclaim="'+escapeHtml(item.id)+'">Remove claim</button>':'<button class="button button-primary" data-claim="'+escapeHtml(item.id)+'">'+(item.type==='found'?'I think this is mine':'Save for follow-up')+' <span>→</span></button>');
    const resolveButton=item.status==='resolved'?'':'<button class="button button-outline" data-resolve="'+escapeHtml(item.id)+'">Mark reunited</button>';
    const deleteButton=item.demo?'':'<button class="button button-outline" data-delete="'+escapeHtml(item.id)+'">Delete listing</button>';
    $('#detail-content').innerHTML=`<div class="detail-hero"><span class="detail-emoji">${itemEmoji(item)}</span><div><span class="type-pill ${item.status==='resolved'?'type-resolved':`type-${item.type}`}" style="position:static;display:inline-block">${item.status==='resolved'?'REUNITED':item.type.toUpperCase()}</span><p>${escapeHtml(item.category)} · ${escapeHtml(status)}</p></div></div><div class="detail-grid"><div class="detail-field"><span>Location</span><strong>${escapeHtml(item.location)}</strong></div><div class="detail-field"><span>Date</span><strong>${escapeHtml(formatDate(item.date))}</strong></div><div class="detail-field"><span>Colour</span><strong>${escapeHtml(item.color||'Not specified')}</strong></div><div class="detail-field"><span>Listing type</span><strong>${item.type==='lost'?'Lost item':'Found item'}</strong></div></div><p class="detail-description">${escapeHtml(item.description||'No additional description provided.')}</p><p class="field-hint">Prototype note: claims are saved only in this browser. This demo does not contact the poster or verify ownership. Arrange any handover through a safe, official campus channel.</p><div class="detail-actions">${deleteButton}${resolveButton}${claimButton}</div>`;
    openModal('detail-modal');
  }
  function setView(view) { currentView=view; $$('.nav-item').forEach(button=>button.classList.toggle('active',button.dataset.view===view)); render(); $('#board').scrollIntoView({behavior:'smooth',block:'start'}); }
  function createListing(formData) {
    const item={id:`item-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,type:formData.get('type'),category:formData.get('category'),name:String(formData.get('name')).trim(),location:String(formData.get('location')).trim(),date:formData.get('date'),color:String(formData.get('color')||'').trim(),description:String(formData.get('description')||'').trim(),status:'open',createdAt:Date.now(),demo:false};
    if(!item.name||!item.location||!item.date){showToast('Please complete the required fields.');return;}
    items.unshift(item); saveItems(); currentView='all'; $$('.nav-item').forEach(button=>button.classList.toggle('active',button.dataset.view==='all')); $('#search-input').value=''; $('#category-filter').value='all'; $('#sort-filter').value='newest'; closeModal('listing-modal'); render(); showToast('Your listing has been added to the community board.');
  }
  function claimItem(id) { if(!claims.includes(id)){claims.push(id);saveClaims();render();showDetails(id);showToast('Saved to My claims in this browser.');} }
  function unclaimItem(id) { claims=claims.filter(claimId=>claimId!==id);saveClaims();render();showDetails(id);showToast('Removed from My claims.'); }
  function resolveItem(id) { const item=items.find(x=>x.id===id); if(!item)return; item.status='resolved'; saveItems(); closeModal('detail-modal');render();showToast('Listing marked as reunited.'); }
  function deleteItem(id) { const item=items.find(x=>x.id===id); if(!item||item.demo)return; if(!window.confirm('Delete this listing from this browser?'))return;items=items.filter(x=>x.id!==id);claims=claims.filter(x=>x!==id);saveItems();saveClaims();closeModal('detail-modal');render();showToast('Listing deleted.'); }

  $('#hero-report-lost').addEventListener('click',()=>openListingForm('lost'));
  $('#hero-report-found').addEventListener('click',()=>openListingForm('found'));
  $('#board-report').addEventListener('click',()=>openListingForm('lost'));
  $('#sidebar-report').addEventListener('click',()=>openListingForm('found'));
  $('#empty-create').addEventListener('click',()=>openListingForm('lost'));
  $$('.nav-item').forEach(button=>button.addEventListener('click',()=>setView(button.dataset.view)));
  $('#search-input').addEventListener('input',render); $('#category-filter').addEventListener('change',render); $('#sort-filter').addEventListener('change',render);
  $('#clear-filters').addEventListener('click',()=>{$('#search-input').value='';$('#category-filter').value='all';$('#sort-filter').value='newest';if(currentView!=='all')setView('all');else render();});
  $('#listing-form').addEventListener('submit',(event)=>{event.preventDefault();createListing(new FormData(event.currentTarget));});
  $$('[data-close]').forEach(button=>button.addEventListener('click',()=>closeModal(button.dataset.close)));
  $$('.modal-backdrop').forEach(backdrop=>backdrop.addEventListener('click',(event)=>{if(event.target===backdrop)closeModal(backdrop.id);}));
  document.addEventListener('click',(event)=>{const detail=event.target.closest('[data-detail]');if(detail)showDetails(detail.dataset.detail);const claim=event.target.closest('[data-claim]');if(claim)claimItem(claim.dataset.claim);const unclaim=event.target.closest('[data-unclaim]');if(unclaim)unclaimItem(unclaim.dataset.unclaim);const resolve=event.target.closest('[data-resolve]');if(resolve)resolveItem(resolve.dataset.resolve);const del=event.target.closest('[data-delete]');if(del)deleteItem(del.dataset.delete);});
  document.addEventListener('keydown',(event)=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();$('#search-input').focus();}if(event.key==='Escape')$$('.modal-backdrop').forEach(modal=>{if(!modal.classList.contains('hidden'))closeModal(modal.id);});});
  render();
})();
