
(() => {
  const DATA = window.BANKRANKING_DATA;
  const $ = (s,p=document)=>p.querySelector(s);
  const $$ = (s,p=document)=>[...p.querySelectorAll(s)];
  const market = document.body.dataset.market;
  const category = document.body.dataset.category || "all";
  const page = document.body.dataset.page || "";
  const locale = market ? DATA.markets[market] : null;

  // Mobile nav
  const menuBtn = $(".menu-btn");
  if(menuBtn) menuBtn.addEventListener("click",()=>$(".mobile-nav")?.classList.toggle("open"));

  // Homepage search
  const searchBtn = $("#finder-go");
  if(searchBtn){
    searchBtn.addEventListener("click",()=>{
      const m = $("#finder-market").value;
      const cat = $("#finder-category").value;
      const md = DATA.markets[m];
      const found = md.categories.find(x=>x.id===cat);
      location.href = `${m}/${found ? found.path : ""}`;
    });
    $("#finder-market")?.addEventListener("change", e=>{
      const md = DATA.markets[e.target.value];
      $("#finder-category").innerHTML = md.categories.map(c=>`<option value="${c.id}">${c.label}</option>`).join("");
    });
  }

  // Country / category ranking
  const list = $("#offer-list");
  if(list && locale){
    let state = {fee:false,mobile:false,branches:false,travel:false,sort:"score",selected:new Set()};
    const texts = {
      pl:{fee:"Opłata / mies.",bonus:"Premia",rate:"Oprocentowanie",go:"Przejdź do banku",details:"Zobacz ocenę",compare:"Porównaj",verified:"Warunki sprawdzone",terms:"Warunki i regulamin na stronie banku",no:"Brak ofert spełniających wybrane filtry.",sort:"Sortuj",best:"Najwyższa ocena",feeSort:"Najniższa opłata",bonusSort:"Najwyższa premia"},
      de:{fee:"Gebühr / Monat",bonus:"Bonus",rate:"Zins",go:"Zur Bank",details:"Bewertung ansehen",compare:"Vergleichen",verified:"Konditionen geprüft",terms:"Bedingungen auf der Website der Bank",no:"Keine Angebote passen zu den Filtern.",sort:"Sortieren",best:"Beste Bewertung",feeSort:"Niedrigste Gebühr",bonusSort:"Höchster Bonus"},
      fr:{fee:"Frais / mois",bonus:"Prime",rate:"Taux",go:"Voir la banque",details:"Voir la note",compare:"Comparer",verified:"Conditions vérifiées",terms:"Conditions sur le site de la banque",no:"Aucune offre ne correspond aux filtres.",sort:"Trier",best:"Meilleure note",feeSort:"Frais les plus bas",bonusSort:"Prime la plus élevée"}
    };
    const t=texts[market];

    const sortSelect=$("#sort-select");
    if(sortSelect){
      sortSelect.innerHTML=`<option value="score">${t.best}</option><option value="fee">${t.feeSort}</option><option value="bonus">${t.bonusSort}</option>`;
      sortSelect.addEventListener("change",e=>{state.sort=e.target.value;render()});
    }

    $$(".filter-input").forEach(inp=>inp.addEventListener("change",()=>{
      state[inp.dataset.filter]=inp.checked; render();
    }));
    $("#reset-filters")?.addEventListener("click",()=>{
      $$(".filter-input").forEach(i=>i.checked=false);
      state={...state,fee:false,mobile:false,branches:false,travel:false};
      render();
    });

    function numeric(text){
      if(!text || text==="—") return 0;
      const n=parseFloat(text.replace(/[^\d,.-]/g,"").replace(",","."));
      return Number.isFinite(n)?n:0;
    }
    function filtered(){
      let offers = locale.offers.filter(o=>category==="all" || o.category===category);
      if(state.fee) offers=offers.filter(o=>o.feeFree);
      if(state.mobile) offers=offers.filter(o=>o.mobile);
      if(state.branches) offers=offers.filter(o=>o.branches);
      if(state.travel) offers=offers.filter(o=>o.travel);
      if(state.sort==="score") offers.sort((a,b)=>b.score-a.score);
      if(state.sort==="fee") offers.sort((a,b)=>numeric(a.fee)-numeric(b.fee) || b.score-a.score);
      if(state.sort==="bonus") offers.sort((a,b)=>numeric(b.bonus)-numeric(a.bonus) || b.score-a.score);
      return offers;
    }
    function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
    function render(){
      const offers=filtered();
      $("#result-count") && ($("#result-count").textContent=offers.length);
      if(!offers.length){list.innerHTML=`<div class="empty">${t.no}</div>`;return}
      list.innerHTML=offers.map((o,i)=>`
      <article class="offer-card" data-id="${esc(o.id)}">
        ${i===0?`<div class="offer-ribbon">#1 BankRanking</div>`:""}
        <div class="offer-main">
          <div class="bank-cell">
            <div class="bank-wordmark">${esc(o.bank)}</div>
            <h3>${esc(o.product)}</h3>
            <div class="best">${esc(o.bestFor)}</div>
            <label class="compare-check"><input class="compare-box" type="checkbox" data-id="${esc(o.id)}" ${state.selected.has(o.id)?"checked":""}> ${t.compare}</label>
          </div>
          <div class="offer-center">
            <div class="score-line"><div><span class="score">${o.score.toFixed(1)}<small>/10</small></span><div class="score-label">BankRanking Score</div></div></div>
            <p>${esc(o.summary)}</p>
            <div class="pros">${o.pros.slice(0,4).map(p=>`<div class="pro">${esc(p)}</div>`).join("")}</div>
          </div>
          <div class="offer-stats">
            <div class="stat-grid">
              <div class="stat"><label>${t.fee}</label><strong>${esc(o.fee)}</strong></div>
              <div class="stat"><label>${t.bonus}</label><strong>${esc(o.bonus)}</strong></div>
              <div class="stat"><label>${t.rate}</label><strong>${esc(o.rate)}</strong></div>
            </div>
            <div class="offer-cta">
              <a class="btn btn-blue affiliate" data-bank="${esc(o.bank)}" href="${esc(o.affiliateUrl)}" target="_blank" rel="sponsored nofollow noopener">${t.go} →</a>
              <div class="terms">${t.terms}</div>
            </div>
          </div>
        </div>
        <div class="offer-footer">
          <span class="verified">${t.verified}: ${esc(o.verified)}</span>
          <button class="details-btn" data-id="${esc(o.id)}">${t.details} →</button>
        </div>
      </article>`).join("");

      $$(".details-btn",list).forEach(b=>b.addEventListener("click",()=>openDetails(b.dataset.id)));
      $$(".compare-box",list).forEach(box=>box.addEventListener("change",()=>{
        if(box.checked){
          if(state.selected.size>=3){box.checked=false;alert(market==="pl"?"Możesz porównać maksymalnie 3 oferty.":market==="de"?"Maximal 3 Angebote können verglichen werden.":"Vous pouvez comparer au maximum 3 offres.");return}
          state.selected.add(box.dataset.id);
        } else state.selected.delete(box.dataset.id);
        syncDrawer();
      }));
      syncDrawer();
    }

    const modal=$("#score-modal");
    function openDetails(id){
      const o=locale.offers.find(x=>x.id===id); if(!o||!modal)return;
      const good = market==="pl"?"Zalety":market==="de"?"Stärken":"Points forts";
      const weak = market==="pl"?"Na co uważać":market==="de"?"Zu beachten":"À vérifier";
      const src = market==="pl"?"Źródło warunków":market==="de"?"Quelle der Konditionen":"Source des conditions";
      $("#modal-content").innerHTML=`
        <div class="modal-head"><div><div class="eyebrow">${esc(o.bank)}</div><h3>${esc(o.product)}</h3><p class="muted">${esc(o.bestFor)}</p></div><button class="close" aria-label="Close">×</button></div>
        <div class="score-breakdown">${Object.entries(o.scoreParts).map(([k,v])=>`<div class="score-row"><span>${esc(k)}</span><div class="bar"><span style="width:${v*10}%"></span></div><strong>${v.toFixed(1)}</strong></div>`).join("")}</div>
        <div class="modal-columns"><div><h4>${good}</h4><ul>${o.pros.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div><div><h4>${weak}</h4><ul>${o.cons.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div></div>
        <p style="margin-top:22px"><a class="source-link" href="${esc(o.officialUrl)}" target="_blank" rel="noopener">${src}: ${esc(o.sourceLabel)} ↗</a></p>`;
      modal.classList.add("open");
      $(".close",modal).addEventListener("click",()=>modal.classList.remove("open"));
    }
    modal?.addEventListener("click",e=>{if(e.target===modal)modal.classList.remove("open")});

    const drawer=$("#compare-drawer");
    function syncDrawer(){
      if(!drawer)return;
      const count=state.selected.size;
      $("#compare-count").textContent=count;
      drawer.classList.toggle("open",count>0);
    }
    $("#compare-go")?.addEventListener("click",()=>{
      const ids=[...state.selected];
      const offers=ids.map(id=>locale.offers.find(o=>o.id===id)).filter(Boolean);
      if(offers.length<2){alert(market==="pl"?"Wybierz co najmniej 2 oferty.":market==="de"?"Wählen Sie mindestens 2 Angebote.":"Sélectionnez au moins 2 offres.");return}
      const labels = market==="pl"?
        {title:"Porównanie ofert",score:"Ocena",fee:"Opłata / mies.",bonus:"Premia",rate:"Oprocentowanie",best:"Najlepsze dla"}:
        market==="de"?{title:"Angebote vergleichen",score:"Bewertung",fee:"Gebühr / Monat",bonus:"Bonus",rate:"Zins",best:"Am besten für"}:
        {title:"Comparer les offres",score:"Note",fee:"Frais / mois",bonus:"Prime",rate:"Taux",best:"Idéal pour"};
      $("#modal-content").innerHTML=`
        <div class="modal-head"><h3>${labels.title}</h3><button class="close">×</button></div>
        <div class="compare-table-wrap"><table class="compare-table">
          <tr><th></th>${offers.map(o=>`<th>${esc(o.bank)}<br>${esc(o.product)}</th>`).join("")}</tr>
          <tr><td>${labels.score}</td>${offers.map(o=>`<td><strong>${o.score.toFixed(1)}/10</strong></td>`).join("")}</tr>
          <tr><td>${labels.fee}</td>${offers.map(o=>`<td>${esc(o.fee)}</td>`).join("")}</tr>
          <tr><td>${labels.bonus}</td>${offers.map(o=>`<td>${esc(o.bonus)}</td>`).join("")}</tr>
          <tr><td>${labels.rate}</td>${offers.map(o=>`<td>${esc(o.rate)}</td>`).join("")}</tr>
          <tr><td>${labels.best}</td>${offers.map(o=>`<td>${esc(o.bestFor)}</td>`).join("")}</tr>
        </table></div>`;
      modal.classList.add("open");
      $(".close",modal).addEventListener("click",()=>modal.classList.remove("open"));
    });

    render();
  }
})();
