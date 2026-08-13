
(function(){
 const D=window.BANKRANKING_MULTI, code=document.body.dataset.market, m=D.markets[code], cats=D.categories;
 let q=new URLSearchParams(location.search), cat=q.get('cat')||'personal', age=q.get('age')||'adult', mode=q.get('mode')||'bank';
 if(!cats[cat])cat='personal'; if(!['young','adult'].includes(age))age='adult'; if(!['bank','specialist'].includes(mode))mode='bank';
 const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
 const list=$('#rank-list'), title=$('#rank-title'), subtitle=$('#rank-subtitle'), method=$('#method'), ageWrap=$('#age-filter'), providerWrap=$('#provider-filter');
 function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
 function logo(x){ if(x.logo)return x.logo; return 'https://logo.clearbit.com/'+x.domain+'?size=128'; }
 function fallback(x){ if(x.logoFallback)return x.logoFallback; return 'https://www.google.com/s2/favicons?domain='+x.domain+'&sz=128'; }
 function score(x){return cat==='personal'?(age==='young'?(x.scoreYoung??x.score):(x.scoreAdult??x.score)):x.score}
 function rows(){let r=m.rankings[cat];if(cats[cat].group==='investing')r=r?.[mode]||[];return [...(r||[])].sort((a,b)=>score(b)-score(a));}
 function setURL(){let u=new URL(location.href);u.searchParams.set('cat',cat);if(cat==='personal')u.searchParams.set('age',age);else u.searchParams.delete('age');if(cats[cat].group==='investing')u.searchParams.set('mode',mode);else u.searchParams.delete('mode');history.replaceState(null,'',u)}
 function render(){
  $$('.cat-btn').forEach(b=>b.classList.toggle('active',b.dataset.cat===cat));
  ageWrap.classList.toggle('visible',cat==='personal'); providerWrap.classList.toggle('visible',cats[cat].group==='investing');
  $$('#age-filter .pill').forEach(b=>b.classList.toggle('active',b.dataset.age===age)); $$('#provider-filter .pill').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));
  title.textContent=cats[cat].title+' in '+m.country;
  if(cat==='personal') subtitle.textContent=(age==='young'?'18–26 view: youth pricing and age-specific benefits affect the order.':'26+ view: standard adult pricing and conditions affect the order.');
  else if(cats[cat].group==='investing') subtitle.textContent=mode==='bank'?'Bank-first view: traditional banks and bank groups. Switch to Specialist / non-bank market for dedicated brokers, robo-advisors, asset managers and pension platforms.':'Specialist / non-bank market: dedicated platforms and providers. Some may use partner banks or custodians behind the service.';
  else subtitle.textContent='Curated research set for '+m.country+'. Products are scored with category-specific criteria.';
  method.textContent='Method: '+cats[cat].method;
  const r=rows(); if(!r.length){list.innerHTML='<div class="empty">No researched products in this view yet.</div>';return}
  list.innerHTML=r.map((x,i)=>`<article class="rank-row">
    <div class="pos ${i<3?'top':''}">${i+1}</div>
    <div class="provider"><div class="logo-shell"><img class="provider-logo" src="${esc(logo(x))}" onerror="this.onerror=null;this.src='${esc(fallback(x))}'" alt="${esc(x.provider)} logo"></div><div><strong>${esc(x.provider)}</strong><small>${esc(x.product)}</small></div></div>
    <div class="best"><strong>Best for</strong><span>${esc(x.bestFor)}</span><div class="row-links">${x.providerUrl?`<a href="${esc(x.providerUrl)}" target="_blank" rel="noopener">provider ↗</a>`:''}${x.source?`<a href="${esc(x.source)}" target="_blank" rel="noopener">research source ↗</a>`:''}</div></div>
    <div class="metric"><label>Key point</label><strong>${esc(x.metric1)}</strong></div>
    <div class="metric second"><label>Also</label><strong>${esc(x.metric2)}</strong></div>
    <div class="score"><strong>${Number(score(x)).toFixed(1)}</strong><small>/ 10</small></div>
  </article>`).join('');
 }
 $$('.cat-btn').forEach(b=>b.addEventListener('click',()=>{cat=b.dataset.cat;mode='bank';setURL();render()}));
 $$('#age-filter .pill').forEach(b=>b.addEventListener('click',()=>{age=b.dataset.age;setURL();render()}));
 $$('#provider-filter .pill').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;setURL();render()}));
 render();
})();
