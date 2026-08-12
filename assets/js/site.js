(() => {
  const DATA=window.BANKRANKING_DATA;
  const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
  const market=document.body.dataset.market||'';
  const M=market?DATA.markets[market]:null;
  const TODAY=new Date('2026-08-12T12:00:00Z');
  $('.menu-btn')?.addEventListener('click',()=>$('.mobile-nav')?.classList.toggle('open'));

  // Compact full ranking engine.
  const list=$('#offer-list');
  if(list&&M){
    let state={segment:'adult',fee:false,mobile:false,branches:false,travel:false,sort:'score',selected:new Set()};
    const score=o=>state.segment==='young'?(o.scoreYoung??o.score):(o.scoreAdult??o.score);
    const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
    const numeric=s=>{const n=String(s||'').replace(/,/g,'').match(/\d+(?:\.\d+)?/g);return n?Math.max(...n.map(Number)):0};
    const promo=o=>{if(!o.promoEnd)return'';const d=new Date(o.promoEnd+'T23:59:59Z'),days=Math.ceil((d-TODAY)/86400000);let c='',t=`Ends ${o.promoEnd}`;if(days===0){c='urgent';t='Ends today'}else if(days>0&&days<=14){c='urgent';t=`${days} days left`}else if(days<0)c='expired';return `<span class="deadline ${c}">${esc(t)}</span>`};
    const getOffers=()=>{
      let a=M.offers.filter(o=>(o.segments||['young','adult']).includes(state.segment));
      if(state.fee)a=a.filter(o=>o.feeFree); if(state.mobile)a=a.filter(o=>o.mobile); if(state.branches)a=a.filter(o=>o.branches); if(state.travel)a=a.filter(o=>o.travel);
      if(state.sort==='score')a.sort((a,b)=>score(b)-score(a));
      if(state.sort==='benefit')a.sort((a,b)=>numeric(b.benefit)-numeric(a.benefit)||score(b)-score(a));
      if(state.sort==='fee')a.sort((a,b)=>numeric(a.fee)-numeric(b.fee)||score(b)-score(a));
      return a;
    };
    $('#sort-select') && ($('#sort-select').innerHTML='<option value="score">Highest score</option><option value="benefit">Highest benefit</option><option value="fee">Lowest fee</option>');
    $('#sort-select')?.addEventListener('change',e=>{state.sort=e.target.value;render()});
    $$('.segment-btn').forEach(b=>b.addEventListener('click',()=>{$$('.segment-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.segment=b.dataset.segment;state.selected.clear();render()}));
    $$('.filter-input').forEach(i=>i.addEventListener('change',()=>{state[i.dataset.filter]=i.checked;render()}));
    $('#reset-filters')?.addEventListener('click',()=>{$$('.filter-input').forEach(i=>i.checked=false);Object.assign(state,{fee:false,mobile:false,branches:false,travel:false});render()});
    function render(){
      const a=getOffers(); $('#result-count') && ($('#result-count').textContent=a.length);
      $('#segment-copy') && ($('#segment-copy').textContent=state.segment==='young'?'Adjusted for ages 18–26: youth pricing, age waivers and easier youth campaign conditions receive more weight.':'Standard 26+ view: adult pricing and regular eligibility receive more weight.');
      list.innerHTML=a.map((o,i)=>`<article class="rank-row">
        <div class="rank-pos"><strong>#${i+1}</strong><span>${score(o).toFixed(1)}</span></div>
        <div class="rank-brand"><img src="${esc(o.logo)}" alt="${esc(o.bank)} logo"><div><a href="/banks/${esc(o.bank.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''))}/"><strong>${esc(o.bank)}</strong></a><span>${esc(o.product)}</span><small>${esc(o.bestFor)}</small></div></div>
        <div class="rank-data"><div><label>Monthly fee</label><strong>${esc(o.fee)}</strong></div><div><label>Benefit</label><strong>${esc(o.benefit)}</strong><small>${esc(o.benefitType)}</small></div><div><label>Rate / value</label><strong>${esc(o.rate)}</strong></div></div>
        <div class="rank-actions">${promo(o)}${o.ageNote?`<span class="age-chip">Age benefit</span>`:''}<label><input class="compare-box" data-id="${esc(o.id)}" type="checkbox" ${state.selected.has(o.id)?'checked':''}> Compare</label><button class="details-btn" data-id="${esc(o.id)}">Details</button><a class="btn btn-blue btn-small" href="${esc(o.affiliateUrl)}" target="_blank" rel="sponsored nofollow noopener">Visit bank →</a></div>
      </article>`).join('');
      $$('.details-btn',list).forEach(b=>b.addEventListener('click',()=>openDetails(b.dataset.id)));
      $$('.compare-box',list).forEach(b=>b.addEventListener('change',()=>{if(b.checked){if(state.selected.size>=3){b.checked=false;alert('Compare up to 3 offers.');return}state.selected.add(b.dataset.id)}else state.selected.delete(b.dataset.id);syncDrawer()}));
      syncDrawer();
    }
    const modal=$('#score-modal');
    function openDetails(id){const o=M.offers.find(x=>x.id===id);if(!o||!modal)return;$('#modal-content').innerHTML=`<div class="modal-head"><div><img class="modal-logo" src="${esc(o.logo)}" alt=""><h3>${esc(o.bank)} — ${esc(o.product)}</h3><p>${esc(o.bestFor)}</p></div><button class="close">×</button></div><div class="score-breakdown">${Object.entries(o.scoreParts).map(([k,v])=>`<div class="score-row"><span>${esc(k)}</span><div class="bar"><span style="width:${v*10}%"></span></div><strong>${Number(v).toFixed(1)}</strong></div>`).join('')}</div><div class="modal-columns"><div><h4>Strengths</h4><ul>${o.pros.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div><h4>Watch-outs</h4><ul>${o.cons.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div>${o.promoNote?`<div class="editorial-note">${esc(o.promoNote)}</div>`:''}<p><a class="source-link" href="${esc(o.officialUrl)}" target="_blank">Official source ↗</a></p>`;modal.classList.add('open');$('.close',modal)?.addEventListener('click',()=>modal.classList.remove('open'))}
    modal?.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open')});
    const drawer=$('#compare-drawer');
    function syncDrawer(){if(!drawer)return;$('#compare-count').textContent=state.selected.size;drawer.classList.toggle('open',state.selected.size>0)}
    $('#compare-go')?.addEventListener('click',()=>{const a=[...state.selected].map(id=>M.offers.find(o=>o.id===id)).filter(Boolean);if(a.length<2){alert('Choose at least 2 offers.');return}$('#modal-content').innerHTML=`<div class="modal-head"><h3>Compare bank accounts</h3><button class="close">×</button></div><div class="compare-table-wrap"><table class="compare-table"><tr><th></th>${a.map(o=>`<th><img class="compare-logo" src="${esc(o.logo)}" alt=""><br>${esc(o.product)}</th>`).join('')}</tr><tr><td>Score</td>${a.map(o=>`<td><strong>${score(o).toFixed(1)}/10</strong></td>`).join('')}</tr><tr><td>Monthly fee</td>${a.map(o=>`<td>${esc(o.fee)}</td>`).join('')}</tr><tr><td>Benefit</td>${a.map(o=>`<td>${esc(o.benefit)}</td>`).join('')}</tr><tr><td>Rate / value</td>${a.map(o=>`<td>${esc(o.rate)}</td>`).join('')}</tr></table></div>`;modal.classList.add('open');$('.close',modal)?.addEventListener('click',()=>modal.classList.remove('open'))});
    render();
  }
})();