
(function(){
 const D=window.BANKRANKING_MULTI;
 const b=document.body;
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
   if(!/(bonus|premi|reward|cashback|welcome|offer|up to|otrzymaj|zysk|save|interest)/i.test(s))return -1;
   return maxNum((x.metric2||'')+' '+(x.bestFor||''));
 }
 function feeValue(x){
   const s=String(x.metric1||'').toLowerCase();
   if(!/(pln|eur|gbp|sek|czk|dkk|ron|huf|€|£|zł|fee|month|account|mies|per month)/i.test(s))return Infinity;
   const a=nums(s);
   return a.length?Math.min(...a):Infinity;
 }
 function hasOffer(x){return bonusValue(x)>0}
 function isFree(x){return feeValue(x)===0}

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

 function ctaLabel(){
   if(g==='banking')return 'Open account';
   if(g==='saving')return 'View product';
   return 'View provider';
 }
 function columnLabels(){
   if(g==='banking') return ['Provider','Highlight','Key details','Action'];
   if(g==='saving') return ['Provider','Why it stands out','Key details','Action'];
   return ['Provider','Best for','Key details','Action'];
 }
 function chipText(x){
   if(hasOffer(x)) return 'Special offer';
   if(g==='banking'){
     if(cat==='student') return 'Student account';
     if(cat==='youth') return 'Youth account';
     if(cat==='child') return 'Children account';
     if(cat==='business') return 'Business account';
     if(cat==='joint') return 'Joint account';
     return 'Personal account';
   }
   if(g==='saving'){
     if(cat==='deposits') return 'Fixed-term deposit';
     if(cat==='business_savings') return 'Business savings';
     if(cat==='child_savings') return 'Children savings';
     return 'Savings';
   }
   if(g==='investing'){
     if(mode==='specialist') return 'Specialist market';
     return 'Bank-based investing';
   }
   return cats[cat].title;
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
   const ageText=personal?(age==='young'?' · age 18–26':' · age 26+'):'';
   sub.textContent=inv
     ? (mode==='bank'
       ? r.length+' bank / bank-group providers shown. Switch to Specialist market for non-bank investment platforms.'
       : r.length+' specialist providers shown. Availability and tax treatment can differ by country.')
     : r.length+' matching providers'+ageText+'. Use the filters to compare welcome offers, fees and strengths.';

   method.textContent='Comparison factors: '+(focusMap[cat]||'costs · access · product terms · usability');

   if(!r.length){
     list.innerHTML='<div class="no-filter-results"><strong>No matching accounts.</strong><span>Change or reset the filters to see more providers.</span></div>';
     return;
   }

   const heads=columnLabels();
   const tableHead = `<div class="rank-table-head">
      <div class="th-provider">${heads[0]}</div>
      <div class="th-highlight">${heads[1]}</div>
      <div class="th-details">${heads[2]}</div>
      <div class="th-action">${heads[3]}</div>
   </div>`;

   list.innerHTML = tableHead + r.map((x,i)=>`
     <div class="rank-row">
       <div class="rank-no ${i<3?'top':''}">${i+1}</div>

       <div class="provider-cell">
         <img class="provider-logo" src="${esc(lg(x))}" onerror="this.onerror=null;this.src='${favicon(x.domain)}'" alt="${esc(x.provider)}">
         <div class="provider-copy">
           <strong>${esc(x.provider)}</strong>
           <small>${esc(x.product)}</small>
         </div>
       </div>

       <div class="rank-highlight-col">
         <span class="rank-chip">${esc(chipText(x))}</span>
         <div class="rank-detail-block">
           <label>Best for</label>
           <strong>${esc(x.bestFor)}</strong>
         </div>
         ${x.source?`<a class="source-link" href="${esc(x.source)}" target="_blank" rel="noopener">research source ↗</a>`:''}
       </div>

       <div class="rank-details-col">
         <div class="rank-detail-block">
           <label>Key point</label>
           <strong>${esc(x.metric1)}</strong>
         </div>
         <div class="rank-detail-block">
           <label>Also</label>
           <strong>${esc(x.metric2)}</strong>
         </div>
       </div>

       <div class="rank-cta">
         <a href="${esc(providerUrl(x))}" target="_blank" rel="noopener">${ctaLabel()} <span>↗</span></a>
       </div>
     </div>
   `).join('');
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

 render();
})();
