
(() => {
  const KEY='bankranking_cookie_preferences_v1';
  const defaults={essential:true,analytics:false,marketing:false};
  function read(){try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch(e){return {...defaults}}}
  function save(p){try{localStorage.setItem(KEY,JSON.stringify(p))}catch(e){}}
  function sync(){
    const p=read();
    document.querySelectorAll('[data-cookie-pref]').forEach(el=>{
      const k=el.dataset.cookiePref;
      el.checked=!!p[k];
      if(k==='essential') el.disabled=true;
    });
  }
  function open(){
    const modal=document.getElementById('cookie-modal');
    if(modal){sync();modal.classList.add('open')}
  }
  function close(){document.getElementById('cookie-modal')?.classList.remove('open')}
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-cookie-settings]')){e.preventDefault();open()}
    if(e.target.closest('[data-cookie-close]'))close()
    if(e.target.closest('[data-cookie-save]')){
      const p={essential:true,analytics:false,marketing:false};
      document.querySelectorAll('[data-cookie-pref]').forEach(el=>p[el.dataset.cookiePref]=!!el.checked);
      save(p); close();
    }
  });
  document.getElementById('cookie-modal')?.addEventListener('click',e=>{if(e.target.id==='cookie-modal')close()});
})();
