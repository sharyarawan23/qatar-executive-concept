(()=>{
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
  const seg=(v,a,b)=>clamp((v-a)/(b-a));
  const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
  const easeOut=t=>1-Math.pow(1-t,3);

  addEventListener('load',()=>setTimeout(()=>$('#preloader')?.classList.add('is-hidden'),450));

  const cursorDot=$('.cursor-dot'),cursorRing=$('.cursor-ring');
  addEventListener('pointermove',e=>{if(cursorDot){cursorDot.style.transform=`translate(${e.clientX-2.5}px,${e.clientY-2.5}px)`}if(cursorRing){cursorRing.animate({transform:`translate(${e.clientX-18}px,${e.clientY-18}px)`},{duration:300,fill:'forwards'})}});

  const header=$('#siteHeader'), scrollMeter=$('.scroll-meter span');
  const hero=$('#hero'), windowObject=$('#windowObject'),windowShade=$('#windowShade'),windowLogo=$('#windowLogo'),cloudVideo=$('#cloudVideo');
  const heroCopyLeft=$('.hero-copy-left'),heroCopyRight=$('.hero-copy-right'),scrollCue=$('.scroll-cue');
  const manifest=$('.manifest-jet'),manifestStatement=$('#manifestStatement'),manifestLines=$$('.manifest-line'),heroJet=$('#heroJet'),jetWords=$$('.jet-word'),jetLeft=$('#jetSideLeft'),jetRight=$('#jetSideRight'),manifestProgress=$('.manifest-progress span');

  const onScroll=()=>{
    const doc=document.documentElement;const page=scrollY/Math.max(1,doc.scrollHeight-innerHeight);if(scrollMeter)scrollMeter.style.width=`${page*100}%`;
    header?.classList.toggle('is-solid',scrollY>innerHeight*.75);

    if(hero){
      const r=hero.getBoundingClientRect(), total=hero.offsetHeight-innerHeight, p=clamp(-r.top/Math.max(1,total));
      const shade=seg(p,.02,.16); if(windowShade)windowShade.style.transform=`translateY(${-shade*78}%) scaleY(${1-shade*.38})`;
      const logoUp=ease(seg(p,.12,.34)); if(windowLogo){windowLogo.style.transform=`translate(-50%,calc(-50% - ${logoUp*130}px)) scale(${1-logoUp*.17})`;windowLogo.style.opacity=String(1-seg(p,.30,.47));}
      if(cloudVideo){cloudVideo.style.opacity=String(.10+seg(p,.16,.36)*.9);cloudVideo.style.transform=`scale(${1.05+seg(p,.18,.74)*.36}) translate3d(${seg(p,.18,.74)*-3}%,${seg(p,.18,.74)*-3}%,0)`;}
      const zoom=ease(seg(p,.38,.86));if(windowObject)windowObject.style.transform=`translate(-50%,-50%) scale(${1+zoom*2.8})`;
      const fade=1-seg(p,.78,.96);if(windowObject)windowObject.style.opacity=String(fade);
      const copyOut=1-seg(p,.16,.43);if(heroCopyLeft){heroCopyLeft.style.opacity=String(copyOut);heroCopyLeft.style.transform=`translateY(${-seg(p,.16,.43)*55}px)`}if(heroCopyRight){heroCopyRight.style.opacity=String(copyOut);heroCopyRight.style.transform=`translateY(${seg(p,.16,.43)*55}px)`}if(scrollCue)scrollCue.style.opacity=String(1-seg(p,.04,.18));
    }

    if(manifest){
      const r=manifest.getBoundingClientRect(),total=manifest.offsetHeight-innerHeight,p=clamp(-r.top/Math.max(1,total));
      // First: big statement appears alone.
      manifestLines.forEach((line,i)=>{const inP=easeOut(seg(p,.02+i*.025,.18+i*.025));const outP=seg(p,.30,.46);line.style.opacity=String(inP*(1-outP*.88));line.style.transform=`translate3d(${(1-inP)*(i%2?8:-8)}vw,${outP*-18}vh,0)`;});
      if(manifestStatement)manifestStatement.style.transform=`translate(-50%,calc(-50% - ${seg(p,.30,.48)*18}vh)) scale(${1-seg(p,.30,.48)*.08})`;
      // Then the large jet rises from below and grows.
      const jetIn=ease(seg(p,.29,.66));const jetOut=ease(seg(p,.80,1));const y=(1-jetIn)*92-jetOut*125;const scale=.70+jetIn*.47+jetOut*.09;const op=seg(p,.30,.39)*(1-seg(p,.94,1));
      if(heroJet){heroJet.style.opacity=String(op);heroJet.style.transform=`translate(-50%,calc(-50% + ${y}vh)) scale(${scale})`;}
      jetWords.forEach((w,i)=>{const wIn=seg(p,.42,.58),wOut=seg(p,.76,.90);w.style.opacity=String(wIn*(1-wOut));w.style.transform=`translateY(${(1-wIn)*30-wOut*75}px)`;});
      const copyIn=easeOut(seg(p,.62,.74)),copyOut=1-seg(p,.82,.96),copyY=seg(p,.82,1)*-100;
      if(jetLeft){jetLeft.style.opacity=String(copyIn*copyOut);jetLeft.style.transform=`translate(${(1-copyIn)*-50}px,calc(-50% + ${copyY}px))`;}
      if(jetRight){jetRight.style.opacity=String(copyIn*copyOut);jetRight.style.transform=`translate(${(1-copyIn)*50}px,calc(-50% + ${copyY}px))`;}
      if(manifestProgress)manifestProgress.style.width=`${p*100}%`;
    }
  };
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);onScroll();

  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target)}}),{threshold:.14});$$('.reveal').forEach(el=>observer.observe(el));

  const floorplan=$('#floorplanWrap'),floorBtn=$('[data-floorplan]');floorBtn?.addEventListener('click',()=>{floorplan.classList.toggle('is-map');floorBtn.firstChild.textContent=floorplan.classList.contains('is-map')?'View aircraft ':'Explore cabin layout '});

  const experienceData={
    pets:{image:'https://static.wixstatic.com/media/d37a82_0b0e19363a8b488bacc28ae8bb8a14ec~mv2.png/v1/fill/w_980,h_550,al_c,q_90/d37a82_0b0e19363a8b488bacc28ae8bb8a14ec~mv2.png',fallback:'assets/g700-interior-2-hd.webp',caption:'Your companions, welcomed onboard.'},
    crew:{image:'assets/g700-interior-2-hd.webp',caption:'Attentive service, delivered with discretion.'},
    wifi:{image:'assets/g700-interior-1-hd.webp',caption:'Stay connected to what matters most.'},
    dining:{image:'assets/g700-dining-hd.webp',caption:'Dining shaped around your preferences.'}
  };
  $$('.experience-item button').forEach(btn=>btn.addEventListener('click',()=>{
    const item=btn.closest('.experience-item'),key=item.dataset.experience,data=experienceData[key];
    $$('.experience-item').forEach(el=>{el.classList.toggle('is-open',el===item);$('i',el).textContent=el===item?'−':'+'});
    const img=$('#experienceImage');img.style.opacity='0';setTimeout(()=>{img.src=data.image;img.onerror=()=>{img.onerror=null;img.src=data.fallback||'assets/g700-interior-2-hd.webp'};img.alt=btn.querySelector('span').textContent;$('#experienceCaption').textContent=data.caption;$('#experienceIndex').textContent=String(Object.keys(experienceData).indexOf(key)+1).padStart(2,'0');img.style.opacity='1'},260);
  }));

  $$('.route').forEach(btn=>btn.addEventListener('click',()=>{$$('.route').forEach(b=>b.classList.remove('is-active'));btn.classList.add('is-active');$('#routeCity').textContent=btn.dataset.city;$('#routeTime').textContent=btn.dataset.time}));

  const menuBtn=$('.menu-button'),menu=$('#mobileMenu');const closeMenu=()=>{menuBtn?.setAttribute('aria-expanded','false');menu?.classList.remove('is-open');menu?.setAttribute('aria-hidden','true');document.body.classList.remove('is-locked')};menuBtn?.addEventListener('click',()=>{const open=!menu.classList.contains('is-open');menuBtn.setAttribute('aria-expanded',String(open));menu.classList.toggle('is-open',open);menu.setAttribute('aria-hidden',String(!open));document.body.classList.toggle('is-locked',open)});$$('#mobileMenu a').forEach(a=>a.addEventListener('click',closeMenu));

  const drawer=$('#bookingDrawer');const openBooking=()=>{drawer.classList.add('is-open');drawer.setAttribute('aria-hidden','false');document.body.classList.add('is-locked')};const closeBooking=()=>{drawer.classList.remove('is-open');drawer.setAttribute('aria-hidden','true');document.body.classList.remove('is-locked')};$$('.js-book').forEach(b=>b.addEventListener('click',openBooking));$$('.js-close-booking').forEach(b=>b.addEventListener('click',closeBooking));addEventListener('keydown',e=>{if(e.key==='Escape'){closeBooking();closeMenu()}});
  const tripInput=$('input[name="tripType"]');$$('.trip-type button').forEach(b=>b.addEventListener('click',()=>{$$('.trip-type button').forEach(x=>x.classList.remove('is-active'));b.classList.add('is-active');tripInput.value=b.dataset.trip}));
  const dep=$('input[name="departure"]');if(dep){const d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());dep.min=d.toISOString().split('T')[0]}
  const form=$('#bookingForm'),error=$('#formError'),success=$('#bookingSuccess');form?.addEventListener('submit',async e=>{e.preventDefault();error.textContent='';if(!form.checkValidity()){form.reportValidity();return}const submit=$('.submit-button',form);submit.disabled=true;submit.querySelector('span').textContent='SENDING REQUEST…';const data=Object.fromEntries(new FormData(form).entries());data.createdAt=new Date().toISOString();data.source='Qatar Executive V5 unofficial concept';try{const response=await fetch('https://wsrxscbhuwwhghwrohez.supabase.co/functions/v1/qatar-executive',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});if(!response.ok)throw new Error();form.hidden=true;success.hidden=false}catch{error.textContent='The request could not be sent. Please call +974 4022 1700 for urgent assistance.'}finally{submit.disabled=false;submit.querySelector('span').textContent='SUBMIT FLIGHT REQUEST'}});
})();
