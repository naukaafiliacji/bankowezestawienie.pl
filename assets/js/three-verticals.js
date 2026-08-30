
(function(){
 // V36_DATA_GUARD: fail visibly instead of leaving an empty ranking if the data asset is unavailable.
 const D=window.BANKRANKING_MULTI;
 const b=document.body;
 if(!D || !D.markets){
   const list=document.getElementById('rank-list');
   const title=document.getElementById('ranking-title');
   if(title) title.textContent='Ranking data could not be loaded';
   if(list) list.innerHTML='<div class="no-filter-results"><strong>Ranking data is temporarily unavailable.</strong><span>Please refresh the page. If the problem persists, the data asset did not load.</span></div>';
   return;
 }
 const m=D.markets[b.dataset.market];
 const g=b.dataset.group;
 const cats=D.categories;
 const allowed=JSON.parse(b.dataset.categories);

 let params=new URLSearchParams(location.search);
 let cat=params.get('cat')||allowed[0];
 if(!allowed.includes(cat))cat=allowed[0];

 let mode='bank';
 let age=params.get('age')==='26plus'?'adult':'young';

 const bs=[...document.querySelectorAll('.cat-btn')];
 const pbs=[...document.querySelectorAll('.provider-btn')];
 const pw=document.querySelector('.provider-toggle');
 const title=document.getElementById('ranking-title');
 const sub=document.getElementById('ranking-sub');
 const method=document.getElementById('ranking-method');
 const list=document.getElementById('rank-list');

 const ageWrap=document.getElementById('age-filter');
 const ageBtns=[...document.querySelectorAll('.age-btn')];
 const search=document.getElementById('bank-search');
 const sort=document.getElementById('ranking-sort');
 const promoOnly=document.getElementById('promo-only');
 const freeOnly=document.getElementById('free-only');
 const reset=document.getElementById('reset-filters');
 const filterCount=document.getElementById('filter-count');

 function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
 function favicon(d){return 'https://www.google.com/s2/favicons?domain='+encodeURIComponent(d)+'&sz=256'}
 function lg(x){return x.logo||x.logoFallback||favicon(x.domain)}
 function providerUrl(x){return x.providerUrl||('https://'+x.domain)}
 function rawRows(){
   const d=m.rankings[cat];
   return g==='investing'?((d&&d[mode])||[]):(Array.isArray(d)?d:[]);
 }
 function score(x){
   if(g==='banking'&&cat==='personal'){
     return Number(age==='young'?(x.scoreYoung??x.score):(x.scoreAdult??x.score));
   }
   return Number(x.score||0);
 }
 function nums(s){
   return (String(s||'').match(/\d+(?:[.,]\d+)?/g)||[]).map(v=>Number(v.replace(',','.'))).filter(Number.isFinite);
 }
 function maxNum(s){const a=nums(s);return a.length?Math.max(...a):-1}
 function bonusValue(x){
   const s=((x.metric2||'')+' '+(x.bestFor||'')).toLowerCase();
   if(!/(bonus|premi|reward|cashback|welcome|up to|do \d|zysk|offer)/i.test(s))return -1;
   return maxNum((x.metric2||'')+' '+(x.bestFor||''));
 }
 function feeValue(x){
   const s=String(x.metric1||'').toLowerCase();
   if(!/(pln|eur|gbp|sek|czk|dkk|ron|huf|€|£|zł|fee|month|account)/i.test(s))return Infinity;
   const a=nums(s);
   return a.length?Math.min(...a):Infinity;
 }
 function hasOffer(x){return bonusValue(x)>0}
 function isFree(x){return feeValue(x)===0}

 function filteredRows(){
   let r=[...rawRows()];
   const q=(search?.value||'').trim().toLowerCase();
   if(q)r=r.filter(x=>((x.provider||'')+' '+(x.product||'')).toLowerCase().includes(q));
   if(promoOnly?.checked)r=r.filter(hasOffer);
   if(freeOnly?.checked)r=r.filter(isFree);

   const s=sort?.value||'recommended';
   r.sort((a,b)=>{
     if(s==='name')return String(a.provider).localeCompare(String(b.provider));
     if(s==='bonus'){
       const av=bonusValue(a),bv=bonusValue(b);
       if(av!==bv)return bv-av;
     }
     if(s==='fee'){
       const av=feeValue(a),bv=feeValue(b);
       if(av!==bv)return av-bv;
     }
     return score(b)-score(a);
   });
   return r;
 }

 function updateURL(){
   const u=new URL(location.href);
   u.searchParams.set('cat',cat);
   if(g==='banking'&&cat==='personal')u.searchParams.set('age',age==='young'?'18-26':'26plus');
   else u.searchParams.delete('age');
   history.replaceState(null,'',u);
 }


 const focusMap={
   personal:'monthly costs · welcome offers · card and ATM conditions · digital access',
   business:'recurring cost · payments · cards and team access · business tools',
   joint:'shared access · recurring cost · cards · mobile banking',
   student:'fees · student eligibility · travel use · welcome benefits',
   youth:'age eligibility · fees · card and app access · controls',
   child:'parental controls · fees · age rules · child-friendly banking',
   savings:'interest terms · access to money · balance conditions · protection',
   deposits:'rate · term · minimum deposit · early-withdrawal rules',
   business_savings:'rate · liquidity · business eligibility · balance conditions',
   child_savings:'interest · age eligibility · parental access · conditions',
   investment:'fees · product range · custody structure · usability',
   funds:'fund range · total costs · recurring investing · usability',
   managed:'total costs · diversification · management model · minimum investment',
   self_directed:'trading costs · market access · platform tools · FX and custody',
   retirement:'tax wrapper · total costs · investment choice · flexibility',
   business_investing:'corporate eligibility · costs · investment range · reporting'
 };

 function ctaLabel(){
   if(g==='banking')return 'Open account';
   if(g==='saving')return 'View product';
   return 'View provider';
 }

 function researchOrder(){
   return [...rawRows()].sort((a,b)=>score(b)-score(a));
 }
 function researchPosition(x){
   const rr=researchOrder();
   const idx=rr.indexOf(x);
   return {index:idx<0?rr.findIndex(y=>y.provider===x.provider&&y.product===x.product):idx,total:rr.length,rows:rr};
 }
 function methodFactors(){
   return String(cats[cat].method||'').split(' · ').map(s=>s.trim()).filter(Boolean);
 }
 function verifyCopy(){
   if(g==='banking')return 'Check the full fee-waiver rules, card and ATM pricing, eligibility requirements and any promotional conditions directly with the provider before applying.';
   if(g==='saving')return 'Check the current rate period, balance caps, access or withdrawal rules, eligibility and the applicable deposit-protection framework before placing money.';
   return 'Check the complete fee schedule, instrument availability, custody and FX charges, account eligibility and the relevant tax treatment before investing.';
 }
 function sourceType(x){
   if(!x.source)return '';
   try{
     const a=new URL(x.source,location.href), b=new URL(providerUrl(x),location.href);
     const ah=a.hostname.replace(/^www\./,''), bh=b.hostname.replace(/^www\./,'');
     return (ah===bh||ah.endsWith('.'+bh)||bh.endsWith('.'+ah))?'Primary provider source':'Research / coverage source';
   }catch(e){return 'Research source'}
 }
 function analysisId(x,i){
   return 'analysis-'+String(x.provider||'provider').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'-'+i;
 }

 function render(){
   bs.forEach(x=>x.classList.toggle('active',x.dataset.cat===cat));
   const inv=g==='investing';
   if(pw)pw.classList.toggle('visible',inv);
   pbs.forEach(x=>x.classList.toggle('active',x.dataset.mode===mode));

   const personal=g==='banking'&&cat==='personal';
   if(ageWrap)ageWrap.hidden=!personal;
   ageBtns.forEach(x=>x.classList.toggle('active',x.dataset.age===age));

   const r=filteredRows();
   if(filterCount)filterCount.textContent=r.length;

   title.textContent=cats[cat].title+' in '+m.country;
   let ageText=personal?(age==='young'?' · age 18–26':' · age 26+'):'';
   sub.textContent=inv
     ? (mode==='bank'
       ? r.length+' bank / bank-group providers shown. Switch to Specialist market for non-bank investment platforms.'
       : r.length+' specialist providers shown. Availability and tax treatment can differ by country.')
     : r.length+' matching providers'+ageText+'. Use the filters to compare the ranking, listed fees and welcome offers.';

   method.textContent='Weighted model: '+(cats[cat].method||('Comparison factors: '+(focusMap[cat]||'costs · access · product terms · usability')));

   if(!r.length){
     list.innerHTML='<div class="no-filter-results"><strong>No matching accounts.</strong><span>Change or reset the filters to see more providers.</span></div>';
     return;
   }

   list.innerHTML=r.map((x,i)=>{
     const pos=researchPosition(x);
     const rankIndex=Math.max(0,pos.index);
     const above=rankIndex>0?pos.rows[rankIndex-1]:null;
     const aid=analysisId(x,i);
     const factors=methodFactors();
     const positionCopy=rankIndex===0
       ? `${esc(x.provider)} is in the leading position under the current ${esc(cats[cat].title.toLowerCase())} model.`
       : `${esc(x.provider)} sits below ${esc(above?above.provider:'the provider above it')} in the current weighted model. This means the combined result is lower under these category assumptions — not that the higher-ranked provider is universally better for every customer.`;
     const evidenceLabel=sourceType(x);
     return `<div class="rank-row">
       <div class="provider-cell">
         <img class="provider-logo" src="${esc(lg(x))}" onerror="this.onerror=null;this.src='${favicon(x.domain)}'" alt="${esc(x.provider)}">
         <div class="provider-copy"><strong>${esc(x.provider)}</strong><small>${esc(x.product)}</small></div>
       </div>
       <div class="card-metrics">
         <div class="metric-card metric-card-best">
           <label>Best for</label>
           <strong>${esc(x.bestFor)}</strong>
         </div>
         <div class="metric-card">
           <label>Key point</label>
           <strong>${esc(x.metric1)}</strong>
         </div>
         <div class="metric-card">
           <label>Also</label>
           <strong>${esc(x.metric2)}</strong>
         </div>
       </div>
       <div class="rank-cta">
         <a href="${esc(providerUrl(x))}" target="_blank" rel="noopener">${ctaLabel()} <span>↗</span></a>
         <button type="button" class="analysis-toggle" data-analysis-toggle aria-expanded="false" aria-controls="${aid}">View analysis ↓</button>
       </div>
       <div class="rank-analysis-panel" id="${aid}">
         <div class="analysis-intro">
           <div><span class="analysis-eyebrow">RESEARCH ANALYSIS</span><h3>Why this position</h3></div>
           <p>This analysis explains the main evidence behind <strong>${esc(x.provider)}</strong>'s current place in the ranking. The position is based on the weighted category factors and segment assumptions shown below, without converting the result into a numerical or qualitative grade.</p>
         </div>
         <div class="analysis-grid">
           <section><span class="analysis-label">Why it ranks here</span><p>The current comparison record identifies <strong>${esc(x.bestFor)}</strong> as the clearest use case. It also flags <strong>${esc(x.metric1)}</strong> and <strong>${esc(x.metric2)}</strong> as relevant product details in this comparison.</p></section>
           <section><span class="analysis-label">Position context</span><p>${positionCopy}</p></section>
           <section><span class="analysis-label">What to verify</span><p>${verifyCopy()}</p></section>
           <section><span class="analysis-label">Research record</span><p>Research snapshot: <strong>${esc(D.updatedDisplay||D.updated||'Current')}</strong>. Category: <strong>${esc(cats[cat].title)}</strong>${g==='banking'&&cat==='personal'?` · Segment: <strong>${age==='young'?'18–26':'26+'}</strong>`:''}.</p></section>
         </div>
         <div class="analysis-factors"><span class="analysis-label">Weighted factors used for every provider in this ranking</span><div>${factors.map(f=>`<span>${esc(f)}</span>`).join('')}</div></div>
         <div class="analysis-evidence"><span class="analysis-label">Evidence & documentation</span><div class="analysis-links"><a href="${esc(providerUrl(x))}" target="_blank" rel="noopener">Provider page ↗</a>${x.source?`<a href="${esc(x.source)}" target="_blank" rel="noopener">${esc(evidenceLabel)} ↗</a>`:''}<a href="/methodology/">Methodology ↗</a><a href="/research/">Research framework ↗</a></div></div>
       </div>
     </div>`;
   }).join('');
 }

 bs.forEach(x=>x.addEventListener('click',()=>{
   cat=x.dataset.cat;
   mode='bank';
   if(search)search.value='';
   if(promoOnly)promoOnly.checked=false;
   if(freeOnly)freeOnly.checked=false;
   if(sort)sort.value='recommended';
   updateURL();render();
 }));

 pbs.forEach(x=>x.addEventListener('click',()=>{mode=x.dataset.mode;render()}));
 ageBtns.forEach(x=>x.addEventListener('click',()=>{age=x.dataset.age;updateURL();render()}));

 [search,sort,promoOnly,freeOnly].filter(Boolean).forEach(x=>{
   x.addEventListener(x===search?'input':'change',render);
 });

 if(reset)reset.addEventListener('click',()=>{
   if(search)search.value='';
   if(sort)sort.value='recommended';
   if(promoOnly)promoOnly.checked=false;
   if(freeOnly)freeOnly.checked=false;
   age='young';
   updateURL();render();
 });

 list.addEventListener('click',e=>{
   const btn=e.target.closest('[data-analysis-toggle]');
   if(!btn)return;
   const row=btn.closest('.rank-row');
   const open=!row.classList.contains('analysis-open');
   row.classList.toggle('analysis-open',open);
   btn.setAttribute('aria-expanded',String(open));
   btn.textContent=open?'Hide analysis ↑':'View analysis ↓';
 });

 render();
})();
