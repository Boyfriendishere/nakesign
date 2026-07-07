/* 專案內頁共用互動:圖片淡入 + lightbox(從 DOM 動態建構,含鍵盤操作)+ compare 滑桿鍵盤支援 + 區塊滾動進場 */
(function(){
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 圖片載入淡入(lazy/eager 通用;不補 .loaded 圖片會停在 opacity:0) */
  document.querySelectorAll('img[loading]').forEach(img=>{
    if(img.complete)img.classList.add('loaded');
    else img.addEventListener('load',()=>img.classList.add('loaded'));
  });

  /* ── Lightbox:每組 .block-gallery 各自成一個切換序列,圖片直接取自 DOM(不需頁面自帶 URL 陣列) ── */
  const lb=document.getElementById('lightbox');
  if(lb){
    const lbImg=document.getElementById('lb-img');
    const lbCount=document.getElementById('lb-count');
    let active=[],activeAlts=[],cur=0;

    function openLb(imgs,alts,i){
      active=imgs;activeAlts=alts;cur=i;
      lbImg.src=active[cur];lbImg.alt=activeAlts[cur]||'';
      lbCount.textContent=(cur+1)+' / '+active.length;
      lb.classList.add('active');
      document.body.style.overflow='hidden';
    }
    function closeLb(){lb.classList.remove('active');document.body.style.overflow='';}
    function goTo(i){
      cur=(i+active.length)%active.length;
      lbImg.classList.add('fading');
      setTimeout(()=>{
        lbImg.src=active[cur];lbImg.alt=activeAlts[cur]||'';
        lbCount.textContent=(cur+1)+' / '+active.length;
        lbImg.classList.remove('fading');
      },200);
    }

    document.querySelectorAll('.block-gallery').forEach(group=>{
      const thumbs=[...group.querySelectorAll('.gallery-thumb')];
      if(!thumbs.length)return;
      const imgs=thumbs.map(t=>{const im=t.querySelector('img');return im.currentSrc||im.src;});
      const alts=thumbs.map(t=>t.querySelector('img').alt);
      thumbs.forEach((t,i)=>{
        t.setAttribute('role','button');
        if(!t.hasAttribute('tabindex'))t.setAttribute('tabindex','0');
        if(!t.hasAttribute('aria-label'))t.setAttribute('aria-label','放大檢視圖片 '+(i+1)+' / '+thumbs.length);
        const open=()=>openLb(imgs,alts,i);
        t.addEventListener('click',open);
        t.addEventListener('keydown',e=>{
          if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}
        });
      });
    });

    const lbClose=document.getElementById('lb-close');
    const lbPrev=document.getElementById('lb-prev');
    const lbNext=document.getElementById('lb-next');
    if(lbClose)lbClose.addEventListener('click',closeLb);
    if(lbPrev)lbPrev.addEventListener('click',()=>goTo(cur-1));
    if(lbNext)lbNext.addEventListener('click',()=>goTo(cur+1));
    lb.addEventListener('click',e=>{if(e.target===lb)closeLb();});
    document.addEventListener('keydown',e=>{
      if(!lb.classList.contains('active'))return;
      if(e.key==='Escape')closeLb();
      if(e.key==='ArrowLeft')goTo(cur-1);
      if(e.key==='ArrowRight')goTo(cur+1);
    });

    /* 觸控滑動切換 */
    let tX=0,tY=0;
    lb.addEventListener('touchstart',e=>{tX=e.changedTouches[0].clientX;tY=e.changedTouches[0].clientY;},{passive:true});
    lb.addEventListener('touchend',e=>{
      const dx=e.changedTouches[0].clientX-tX,dy=e.changedTouches[0].clientY-tY;
      if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy))goTo(dx>0?cur-1:cur+1);
    },{passive:true});
  }

  /* ── Compare 滑桿:鍵盤操作疊加層(不動個別頁面既有的滑鼠/觸控拖曳邏輯) ── */
  document.querySelectorAll('.compare-wrap').forEach(wrap=>{
    const after=wrap.querySelector('.compare-after');
    const handle=wrap.querySelector('.compare-handle');
    if(!after)return;
    if(!wrap.hasAttribute('tabindex'))wrap.setAttribute('tabindex','0');
    wrap.setAttribute('role','slider');
    wrap.setAttribute('aria-label','前後對比滑桿,方向鍵可調整');
    wrap.setAttribute('aria-valuemin','0');
    wrap.setAttribute('aria-valuemax','100');
    wrap.setAttribute('aria-valuenow',Math.round(parseFloat(after.style.width)||50));
    wrap.addEventListener('keydown',e=>{
      let pct=parseFloat(after.style.width)||50;
      if(e.key==='ArrowLeft')pct=Math.max(0,pct-5);
      else if(e.key==='ArrowRight')pct=Math.min(100,pct+5);
      else return;
      e.preventDefault();
      after.style.width=pct+'%';
      if(handle)handle.style.left=pct+'%';
      wrap.setAttribute('aria-valuenow',Math.round(pct));
    });
  });

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
