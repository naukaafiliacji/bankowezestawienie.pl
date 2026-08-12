
const locale = document.documentElement.lang || 'en';

const copy = {
  pl: {
    all:"Wszystkie", personal:"Konta osobiste", savings:"Oszczędności", business:"Firmowe",
    sort:"Sortuj:", recommended:"Polecane", bonus:"Najwyższy bonus", fee:"Najniższa opłata",
    feeLabel:"Opłata / mies.", bonusLabel:"Bonus", ratingLabel:"Ocena", details:"Szczegóły",
    open:"Przejdź do banku", disclosure:"Link może być afiliacyjny",
    demo:"Dane ofert na tej wersji demonstracyjnej są przykładowe. Przed publikacją uzupełnij aktualne warunki i linki afiliacyjne."
  },
  de: {
    all:"Alle", personal:"Girokonten", savings:"Sparen", business:"Geschäft",
    sort:"Sortieren:", recommended:"Empfohlen", bonus:"Höchster Bonus", fee:"Niedrigste Gebühr",
    feeLabel:"Gebühr / Monat", bonusLabel:"Bonus", ratingLabel:"Bewertung", details:"Details",
    open:"Zur Bank", disclosure:"Link kann ein Affiliate-Link sein",
    demo:"Die Angebotsdaten in dieser Demo sind Platzhalter. Vor Veröffentlichung aktuelle Konditionen und Affiliate-Links eintragen."
  },
  fr: {
    all:"Tous", personal:"Comptes courants", savings:"Épargne", business:"Pro",
    sort:"Trier :", recommended:"Recommandé", bonus:"Bonus le plus élevé", fee:"Frais les plus bas",
    feeLabel:"Frais / mois", bonusLabel:"Bonus", ratingLabel:"Note", details:"Détails",
    open:"Voir la banque", disclosure:"Ce lien peut être affilié",
    demo:"Les offres de cette démo sont des exemples. Remplacez-les par les conditions et liens d’affiliation actuels avant publication."
  }
};

const offers = {
  pl: [
    {bank:"Bank Alpha", product:"Konto Komfort", category:"personal", fee:0, bonus:300, rating:4.8, url:"#"},
    {bank:"Bank Nova", product:"Konto Online", category:"personal", fee:0, bonus:250, rating:4.6, url:"#"},
    {bank:"Bank Prime", product:"Konto Everyday", category:"personal", fee:5, bonus:400, rating:4.5, url:"#"},
    {bank:"Bank Alpha", product:"Konto Oszczędnościowe", category:"savings", fee:0, bonus:0, rating:4.7, url:"#"},
    {bank:"Bank Nova", product:"Oszczędności Plus", category:"savings", fee:0, bonus:100, rating:4.4, url:"#"},
    {bank:"Bank Prime", product:"Konto Biznes", category:"business", fee:0, bonus:500, rating:4.6, url:"#"}
  ],
  de: [
    {bank:"Bank Alpha", product:"Girokonto Smart", category:"personal", fee:0, bonus:150, rating:4.8, url:"#"},
    {bank:"Bank Nova", product:"Girokonto Online", category:"personal", fee:0, bonus:100, rating:4.6, url:"#"},
    {bank:"Bank Prime", product:"Girokonto Plus", category:"personal", fee:4.9, bonus:200, rating:4.5, url:"#"},
    {bank:"Bank Alpha", product:"Tagesgeld", category:"savings", fee:0, bonus:0, rating:4.7, url:"#"},
    {bank:"Bank Nova", product:"SparKonto", category:"savings", fee:0, bonus:50, rating:4.4, url:"#"},
    {bank:"Bank Prime", product:"Business Konto", category:"business", fee:0, bonus:250, rating:4.6, url:"#"}
  ],
  fr: [
    {bank:"Banque Alpha", product:"Compte Essentiel", category:"personal", fee:0, bonus:120, rating:4.8, url:"#"},
    {bank:"Banque Nova", product:"Compte Online", category:"personal", fee:0, bonus:80, rating:4.6, url:"#"},
    {bank:"Banque Prime", product:"Compte Plus", category:"personal", fee:4.5, bonus:160, rating:4.5, url:"#"},
    {bank:"Banque Alpha", product:"Livret Flexible", category:"savings", fee:0, bonus:0, rating:4.7, url:"#"},
    {bank:"Banque Nova", product:"Épargne Plus", category:"savings", fee:0, bonus:40, rating:4.4, url:"#"},
    {bank:"Banque Prime", product:"Compte Pro", category:"business", fee:0, bonus:200, rating:4.6, url:"#"}
  ]
};

function money(v){
  if(locale==="pl") return `${String(v).replace(".",",")} zł`;
  return `${String(v).replace(".",",")} €`;
}
function feeText(v){ return v === 0 ? "0" + (locale==="pl" ? " zł" : " €") : money(v); }

const list = document.querySelector("#offer-list");
if(list){
  const c = copy[locale] || copy.pl;
  let active = "all";
  let sort = "recommended";

  document.querySelector("#demo-note").textContent = c.demo;
  document.querySelector("#sort-label").textContent = c.sort;
  document.querySelector("#sort-select").innerHTML = `
    <option value="recommended">${c.recommended}</option>
    <option value="bonus">${c.bonus}</option>
    <option value="fee">${c.fee}</option>`;

  document.querySelectorAll(".tab").forEach(btn=>{
    const key = btn.dataset.category;
    btn.textContent = c[key];
    btn.addEventListener("click",()=>{
      document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      active=key; render();
    });
  });

  document.querySelector("#sort-select").addEventListener("change",e=>{sort=e.target.value;render()});

  function render(){
    let data = [...offers[locale]];
    if(active!=="all") data=data.filter(x=>x.category===active);
    if(sort==="bonus") data.sort((a,b)=>b.bonus-a.bonus);
    if(sort==="fee") data.sort((a,b)=>a.fee-b.fee || b.rating-a.rating);
    if(sort==="recommended") data.sort((a,b)=>b.rating-a.rating);

    list.innerHTML = data.map((o,i)=>`
      <article class="offer-card">
        <div class="rank-badge">#${i+1}</div>
        <div>
          <div class="bank-name">${o.bank}</div>
          <div class="offer-title">${o.product}</div>
          <div class="rating">★ ${o.rating.toFixed(1)} / 5</div>
        </div>
        <div class="metric">
          <div class="metric-label">${c.feeLabel}</div>
          <div class="metric-value">${feeText(o.fee)}</div>
        </div>
        <div class="metric">
          <div class="metric-label">${c.bonusLabel}</div>
          <div class="metric-value">${money(o.bonus)}</div>
        </div>
        <div class="offer-actions">
          <a class="btn btn-primary affiliate-link" href="${o.url}" rel="sponsored nofollow" data-bank="${o.bank}">${c.open} →</a>
          <span class="small-link">${c.disclosure}</span>
        </div>
      </article>`).join("");

    document.querySelectorAll(".affiliate-link").forEach(a=>{
      a.addEventListener("click",()=>{
        console.log("affiliate_click",{bank:a.dataset.bank,locale});
      });
    });
  }
  render();
}
