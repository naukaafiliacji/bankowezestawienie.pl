
(() => {
  const els=[...document.querySelectorAll('[data-reveal]')];
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}})
  },{threshold:.12});
  els.forEach(el=>io.observe(el));

  document.querySelectorAll('[data-news-form]').forEach(form=>{
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const ok=form.querySelector('input[type=checkbox]');
      if(ok && !ok.checked){ok.focus();return}
      const b=form.querySelector('button');
      b.textContent='Provider connection required';
      setTimeout(()=>b.textContent='Join newsletter',2200);
    })
  });
})();
