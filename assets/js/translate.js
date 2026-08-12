
(() => {
  function startTranslatePrompt(){
    const box = document.getElementById('translate-prompt');
    if(!box) return;
    let lang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    let primary = lang.split('-')[0];
    if(primary === 'en') return;

    const names = {
      pl:'Polish', de:'German', fr:'French', it:'Italian', es:'Spanish',
      nl:'Dutch', sv:'Swedish', pt:'Portuguese', ro:'Romanian', cs:'Czech',
      sk:'Slovak', uk:'Ukrainian', ru:'Russian', tr:'Turkish', ja:'Japanese',
      ko:'Korean', zh:'Chinese', ar:'Arabic', hi:'Hindi'
    };

    const text = box.querySelector('[data-translate-copy]');
    if(text) text.textContent = `Your browser language appears to be ${names[primary] || primary.toUpperCase()}.`;

    const link = box.querySelector('[data-translate-link]');
    if(link){
      const target = encodeURIComponent(primary);
      const url = encodeURIComponent(window.location.href);
      link.href = `https://translate.google.com/translate?sl=en&tl=${target}&u=${url}`;
    }

    box.hidden = false;

    box.querySelector('[data-translate-close]')?.addEventListener('click', () => {
      box.hidden = true;
      try { sessionStorage.setItem('br_translate_dismissed','1'); } catch(e) {}
    });

    try {
      if(sessionStorage.getItem('br_translate_dismissed') === '1') box.hidden = true;
    } catch(e) {}
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startTranslatePrompt);
  else startTranslatePrompt();
})();
