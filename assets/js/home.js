(() => {
 const D=window.BANKRANKING_DATA, $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
 let market='pl',segment='adult';
 const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
 const score=o=>segment==='young'?(o.scoreYoung??o.score):(o.scoreAdult??o.score);
 function render(){const m=D.markets[market],a=m.offers.filter(o=>(o.segments||['young','adult']).includes(segment)).sort((x,y)=>score(y)-score(x)).slice(0,3);$('#home-ranking-country').textContent=m.flag+' '+m.country;$('#home-ranking-link').href=`/${market}/rankings/current-accounts/`;$('#home-top3').innerHTML=a.map((o,i)=>`<div class="home-rank-row"><span class="home-rank-num">#${i+1}</span><img src="${esc(o.logo)}" alt=""><div><strong>${esc(o.bank)}</strong><small>${esc(o.product)}</small></div><span class="home-score">${score(o).toFixed(1)}</span></div>`).join('')}
 $$('.home-market-tab').forEach(b=>b.addEventListener('click',()=>{$$('.home-market-tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');market=b.dataset.market;render()}));
 $$('.home-age-btn').forEach(b=>b.addEventListener('click',()=>{$$('.home-age-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');segment=b.dataset.segment;render()}));
 $('#bank-search-form')?.addEventListener('submit',e=>{e.preventDefault();const q=$('#bank-search').value.trim();location.href='/banks/'+(q?'?q='+encodeURIComponent(q):'')});
 render();
})();