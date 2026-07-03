/* 專案內頁共用互動:捲動進度線 + 區塊滾動進場(與首頁/About 同一套動態語言) */
(function(){
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 捲動進度髮絲線(元素由此注入,頁面 HTML 不需要各自帶) */
  const bar=document.createElement('div');
  bar.id='progress';
  bar.setAttribute('aria-hidden','true');
  document.body.appendChild(bar);
  let ticking=false;
  addEventListener('scroll',()=>{
    if(ticking)return;
    ticking=true;
    requestAnimationFrame(()=>{
      const max=document.documentElement.scrollHeight-innerHeight;
      bar.style.width=(max>0?scrollY/max*100:0)+'vw';
      ticking=false;
    });
  },{passive:true});

  if(reduced)return;

  /* 區塊滾動進場:前置隱藏狀態由 JS 加上,無 JS 時內容照常顯示 */
  const blocks=[...document.querySelectorAll('.project-body > *, .project-nav')];
  const io=new IntersectionObserver(es=>{
    es.forEach(e=>{
      if(e.isIntersecting){e.target.classList.add('in-view');io.unobserve(e.target);}
    });
  },{rootMargin:'0px 0px -7% 0px',threshold:0.05});
  blocks.forEach(el=>{el.classList.add('rv');io.observe(el);});
})();
