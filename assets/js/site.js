
(() => {
  const DATA = window.BANKRANKING_DATA;
  const $ = (s,p=document)=>p.querySelector(s);
  const $$ = (s,p=document)=>[...p.querySelectorAll(s)];
  const market = document.body.dataset.market || "";
  const M = market ? DATA.markets[market] : null;
  const UI = window.BANKRANKING_UI || {};
  const t = market ? UI[market] : null;
  const TODAY = new Date("2026-08-12T12:00:00Z");

  const menuBtn = $(".menu-btn");
  if(menuBtn) menuBtn.addEventListener("click",()=>$(".mobile-nav")?.classList.toggle("open"));

  const finder = $("#finder-go");
  if(finder){
    finder.addEventListener("click",()=>{
      const code=$("#finder-market").value;
      const md=DATA.markets[code];
      location.href=`${code}/${md.category.path}`;
    });
  }

  const list=$("#offer-list");
  if(!list || !M || !t) return;

  let state={fee:false,mobile:false,branches:false,travel:false,sort:"score",selected:new Set()};
  const sort=$("#sort-select");
  if(sort){
    sort.innerHTML=`<option value="score">${t.score}</option><option value="benefit">${t.benefit}</option><option value="fee">${t.fee}</option>`;
    sort.addEventListener("change",e=>{state.sort=e.target.value;render()});
  }
  $$(".filter-input").forEach(i=>i.addEventListener("change",()=>{state[i.dataset.filter]=i.checked;render()}));
  $("#reset-filters")?.addEventListener("click",()=>{
    $$(".filter-input").forEach(i=>i.checked=false);
    state={...state,fee:false,mobile:false,branches:false,travel:false};
    render();
  });

  function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
  function numeric(s){
    if(!s) return 0;
    const parts=String(s).match(/\d[\d\s.,]*/g);
    if(!parts) return 0;
    const vals=parts.map(raw=>{
      let x=raw.trim().replace(/\s/g,"");
      const comma=x.lastIndexOf(","), dot=x.lastIndexOf(".");
      if(comma>=0 && dot>=0){
        const dec=Math.max(comma,dot);
        const after=x.length-dec-1;
        if(after>0 && after<=2){
          const sep=x[dec];
          x=x.slice(0,dec).replace(/[.,]/g,"")+"."+x.slice(dec+1);
        } else x=x.replace(/[.,]/g,"");
      } else if(comma>=0 || dot>=0){
        const pos=Math.max(comma,dot), after=x.length-pos-1;
        if(after===3) x=x.replace(/[.,]/g,"");
        else x=x.replace(",",".");
      }
      const n=Number(x); return Number.isFinite(n)?n:0;
    });
    return Math.max(...vals);
  }
  function promo(o){
    if(!o.promoEnd) return "";
    const d=new Date(o.promoEnd+"T23:59:59Z");
    const days=Math.ceil((d-TODAY)/86400000);
    let cls="", text=`${t.promoEnds} ${o.promoEnd.split("-").reverse().join(".")}`;
    if(days===0){cls="urgent";text=t.today}
    else if(days>0 && days<=10){cls="urgent";text=`${days} ${t.days}`}
    else if(days<0){cls="expired";text=`${t.promoEnds} ${o.promoEnd.split("-").reverse().join(".")}`}
    return `<div class="offer-promo ${cls}">● ${esc(text)}</div>`;
  }
  function offers(){
    let a=[...M.offers];
    if(state.fee) a=a.filter(o=>o.feeFree);
    if(state.mobile) a=a.filter(o=>o.mobile);
    if(state.branches) a=a.filter(o=>o.branches);
    if(state.travel) a=a.filter(o=>o.travel);
    if(state.sort==="score") a.sort((x,y)=>y.score-x.score);
    if(state.sort==="benefit") a.sort((x,y)=>numeric(y.benefit)-numeric(x.benefit)||y.score-x.score);
    if(state.sort==="fee") a.sort((x,y)=>numeric(x.fee)-numeric(y.fee)||y.score-x.score);
    return a;
  }

  function render(){
    const a=offers();
    $("#result-count") && ($("#result-count").textContent=a.length);
    list.innerHTML=a.map((o,i)=>`
      <article class="offer-card">
        ${i===0?`<div class="offer-ribbon">#1 BankRanking</div>`:""}
        <div class="offer-main">
          <div class="bank-cell">
            <div class="bank-wordmark">${esc(o.bank)}</div>
            <h3>${esc(o.product)}</h3>
            <div class="best">${esc(o.bestFor)}</div>
            ${promo(o)}
            <label class="compare-check"><input class="compare-box" type="checkbox" data-id="${esc(o.id)}" ${state.selected.has(o.id)?"checked":""}> ${esc(t.compare)}</label>
          </div>
          <div class="offer-center">
            <div class="score-line"><div><span class="score">${o.score.toFixed(1)}<small>/10</small></span><div class="score-label">BankRanking Score</div></div></div>
            <p>${esc(o.summary)}</p>
            <div class="pros">${o.pros.slice(0,4).map(x=>`<div class="pro">${esc(x)}</div>`).join("")}</div>
          </div>
          <div class="offer-stats">
            <div class="stat-grid">
              <div class="stat"><label>${esc(t.monthly)}</label><strong>${esc(o.fee)}</strong></div>
              <div class="stat"><label>${esc(t.start)}</label><strong>${esc(o.benefit)}</strong><div class="offer-type">${esc(o.benefitType)}</div></div>
              <div class="stat"><label>${esc(t.rate)}</label><strong>${esc(o.rate)}</strong></div>
            </div>
            <div class="offer-cta">
              <a class="btn btn-blue" href="${esc(o.affiliateUrl)}" target="_blank" rel="sponsored nofollow noopener">${esc(t.go)} →</a>
              <div class="terms">${esc(t.conditions)}</div>
            </div>
          </div>
        </div>
        <div class="offer-footer">
          <span class="verified">${esc(t.checked)}: ${esc(o.verified)}</span>
          <button class="details-btn" data-id="${esc(o.id)}">${esc(t.details)} →</button>
        </div>
      </article>`).join("");

    $$(".details-btn",list).forEach(b=>b.addEventListener("click",()=>openDetails(b.dataset.id)));
    $$(".compare-box",list).forEach(box=>box.addEventListener("change",()=>{
      if(box.checked){
        if(state.selected.size>=3){box.checked=false; alert("Maximum 3"); return}
        state.selected.add(box.dataset.id);
      } else state.selected.delete(box.dataset.id);
      syncDrawer();
    }));
    syncDrawer();
  }

  const modal=$("#score-modal");
  function openDetails(id){
    const o=M.offers.find(x=>x.id===id); if(!o||!modal)return;
    $("#modal-content").innerHTML=`
      <div class="modal-head">
        <div><div class="eyebrow">${esc(o.bank)}</div><h3>${esc(o.product)}</h3><p class="muted">${esc(o.bestFor)}</p></div>
        <button class="close" aria-label="Close">×</button>
      </div>
      <div class="score-breakdown">${Object.entries(o.scoreParts).map(([k,v])=>`<div class="score-row"><span>${esc(k)}</span><div class="bar"><span style="width:${v*10}%"></span></div><strong>${Number(v).toFixed(1)}</strong></div>`).join("")}</div>
      <div class="modal-columns">
        <div><h4>${esc(t.pros)}</h4><ul>${o.pros.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
        <div><h4>${esc(t.cons)}</h4><ul>${o.cons.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
      </div>
      ${o.promoNote?`<div class="editorial-note"><strong>${esc(o.benefitType)}.</strong> ${esc(o.promoNote)}</div>`:""}
      <p style="margin-top:20px"><a class="source-link" href="${esc(o.officialUrl)}" target="_blank" rel="noopener">${esc(t.source)}: ${esc(o.sourceLabel)} ↗</a></p>`;
    modal.classList.add("open");
    $(".close",modal)?.addEventListener("click",()=>modal.classList.remove("open"));
  }
  modal?.addEventListener("click",e=>{if(e.target===modal)modal.classList.remove("open")});

  const drawer=$("#compare-drawer");
  function syncDrawer(){
    if(!drawer)return;
    $("#compare-count").textContent=state.selected.size;
    drawer.classList.toggle("open",state.selected.size>0);
  }
  $("#compare-go")?.addEventListener("click",()=>{
    const a=[...state.selected].map(id=>M.offers.find(o=>o.id===id)).filter(Boolean);
    if(a.length<2){alert("Choose at least 2 / Wybierz co najmniej 2.");return}
    $("#modal-content").innerHTML=`
      <div class="modal-head"><h3>${esc(t.compareBtn)}</h3><button class="close">×</button></div>
      <div class="compare-table-wrap"><table class="compare-table">
        <tr><th></th>${a.map(o=>`<th>${esc(o.bank)}<br>${esc(o.product)}</th>`).join("")}</tr>
        <tr><td>BankRanking Score</td>${a.map(o=>`<td><strong>${o.score.toFixed(1)}/10</strong></td>`).join("")}</tr>
        <tr><td>${esc(t.monthly)}</td>${a.map(o=>`<td>${esc(o.fee)}</td>`).join("")}</tr>
        <tr><td>${esc(t.start)}</td>${a.map(o=>`<td><strong>${esc(o.benefit)}</strong><br><small>${esc(o.benefitType)}</small></td>`).join("")}</tr>
        <tr><td>${esc(t.rate)}</td>${a.map(o=>`<td>${esc(o.rate)}</td>`).join("")}</tr>
        <tr><td>Best for</td>${a.map(o=>`<td>${esc(o.bestFor)}</td>`).join("")}</tr>
      </table></div>`;
    modal.classList.add("open");
    $(".close",modal)?.addEventListener("click",()=>modal.classList.remove("open"));
  });

  render();
})();
