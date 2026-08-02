(()=>{
  const $=(s,c=document)=>c.querySelector(s);
  const $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
  const seg=(v,a,b)=>clamp((v-a)/(b-a));
  const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
  const easeOut=t=>1-Math.pow(1-t,3);

  addEventListener('load',()=>setTimeout(()=>$('#preloader')?.classList.add('is-hidden'),450));

  const cursorDot=$('.cursor-dot');
  const cursorRing=$('.cursor-ring');
  addEventListener('pointermove',e=>{
    if(cursorDot) cursorDot.style.transform=`translate(${e.clientX-2.5}px,${e.clientY-2.5}px)`;
    if(cursorRing) cursorRing.animate({transform:`translate(${e.clientX-18}px,${e.clientY-18}px)`},{duration:280,fill:'forwards'});
  });

  const header=$('#siteHeader');
  const scrollMeter=$('.scroll-meter span');

  const hero=$('#hero');
  const windowObject=$('#windowObject');
  const windowShade=$('#windowShade');
  const windowLogo=$('#windowLogo');
  const cloudVideo=$('#cloudVideo');
  const heroSkyFill=$('#heroSkyFill');
  const heroCopyLeft=$('.hero-copy-left');
  const heroCopyRight=$('.hero-copy-right');
  const scrollCue=$('.scroll-cue');

  const manifest=$('.manifest-jet');
  const manifestStatement=$('#manifestStatement');
  const manifestLines=$$('.manifest-line');
  const heroJet=$('#heroJet');
  const jetWords=$$('.jet-word');
  const jetLeft=$('#jetSideLeft');
  const jetRight=$('#jetSideRight');
  const manifestProgress=$('.manifest-progress span');

  const onScroll=()=>{
    const doc=document.documentElement;
    const page=scrollY/Math.max(1,doc.scrollHeight-innerHeight);
    if(scrollMeter) scrollMeter.style.width=`${page*100}%`;
    header?.classList.toggle('is-solid',scrollY>innerHeight*.7);

    if(hero){
      const r=hero.getBoundingClientRect();
      const total=hero.offsetHeight-innerHeight;
      const p=clamp(-r.top/Math.max(1,total));

      const shadeOpen=ease(seg(p,.02,.12));
      if(windowShade) windowShade.style.transform=`translateX(-50%) translateY(${-shadeOpen*92}%)`;

      const logoLift=ease(seg(p,.09,.22));
      if(windowLogo){
        windowLogo.style.transform=`translate(-50%,calc(-50% - ${logoLift*95}px)) scale(${1-logoLift*.14})`;
        windowLogo.style.opacity=String(1-seg(p,.16,.28));
      }

      const cloudIn=seg(p,.08,.22);
      const cloudZoom=ease(seg(p,.18,.82));
      if(cloudVideo){
        cloudVideo.style.opacity=String(.62+cloudIn*.38);
        cloudVideo.style.transform=`scale(${1.02+cloudZoom*.34}) translate3d(${cloudZoom*-2.2}%,${cloudZoom*-1.6}%,0)`;
      }
      if(heroSkyFill){
        const fill=seg(p,.42,.9);
        heroSkyFill.style.opacity=String(fill);
        heroSkyFill.style.transform=`scale(${1.06-fill*.05})`;
      }

      const windowZoom=ease(seg(p,.18,.76));
      const windowFade=1-seg(p,.82,.97);
      if(windowObject){
        windowObject.style.transform=`translate(-50%,-50%) scale(${1+windowZoom*2.65})`;
        windowObject.style.opacity=String(windowFade);
      }

      const copyOut=1-seg(p,.08,.26);
      if(heroCopyLeft){
        heroCopyLeft.style.opacity=String(copyOut);
        heroCopyLeft.style.transform=`translateY(${-seg(p,.08,.26)*50}px)`;
      }
      if(heroCopyRight){
        heroCopyRight.style.opacity=String(copyOut);
        heroCopyRight.style.transform=`translateY(${seg(p,.08,.26)*50}px)`;
      }
      if(scrollCue) scrollCue.style.opacity=String(1-seg(p,.03,.16));
    }

    if(manifest){
      const r=manifest.getBoundingClientRect();
      const total=manifest.offsetHeight-innerHeight;
      const p=clamp(-r.top/Math.max(1,total));

      const statementIn=easeOut(seg(p,.02,.16));
      const statementUp=seg(p,.22,.42);
      const statementOut=1-seg(p,.38,.52);
      manifestLines.forEach((line,i)=>{
        const offset=(1-statementIn)*(i%2?5:-5);
        line.style.opacity=String(statementIn*statementOut);
        line.style.transform=`translate3d(${offset}vw,${-statementUp*20}vh,0)`;
      });
      if(manifestStatement){
        manifestStatement.style.opacity=String(statementIn*statementOut);
        manifestStatement.style.transform=`translate(-50%,calc(-50% - ${statementUp*18}vh)) scale(${1-statementUp*.03})`;
      }

      const wordsIn=easeOut(seg(p,.42,.58));
      const wordsOut=1-seg(p,.92,.985);
      jetWords.forEach((word,i)=>{
        const travel=(1-wordsIn)*(i===0?-34:34);
        word.style.opacity=String(wordsIn*wordsOut);
        word.style.transform=`translate3d(0,${travel}px,0)`;
      });

      const jetEnter=ease(seg(p,.44,.68));
      const jetExit=seg(p,.68,.9);
      const jetFadeOut=1-seg(p,.96,.995);
      const jetY=(1-jetEnter)*118 - jetExit*108;
      const jetScale=.56 + jetEnter*.86 - jetExit*.34;
      if(heroJet){
        heroJet.style.opacity=String(seg(p,.44,.5)*jetFadeOut);
        heroJet.style.transform=`translate(-50%,calc(${jetY}vh)) scale(${jetScale})`;
      }

      const detailIn=easeOut(seg(p,.72,.84));
      const detailOut=1-seg(p,.96,.995);
      if(jetLeft){
        jetLeft.style.opacity=String(detailIn*detailOut);
        jetLeft.style.transform=`translate(${(1-detailIn)*-44}px,calc(-50% - ${jetExit*12}vh))`;
      }
      if(jetRight){
        jetRight.style.opacity=String(detailIn*detailOut);
        jetRight.style.transform=`translate(${(1-detailIn)*44}px,calc(-50% - ${jetExit*12}vh))`;
      }
      if(manifestProgress) manifestProgress.style.width=`${p*100}%`;
    }
  };

  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('resize',onScroll);
  onScroll();

  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }),{threshold:.16});
  $$('.reveal').forEach(el=>observer.observe(el));

  const floorplan=$('#floorplanWrap');
  const floorBtn=$('[data-floorplan]');
  floorBtn?.addEventListener('click',()=>{
    floorplan?.classList.toggle('is-highlighted');
    const active=floorplan?.classList.contains('is-highlighted');
    floorBtn.childNodes[0].textContent=active?'Reset layout ':'Highlight living zones ';
  });

  const experienceData={
    pets:{image:'assets/pets-premium.png',caption:'Your companions, welcomed onboard.'},
    crew:{image:'assets/crew-premium.png',caption:'Attentive service, delivered with discretion.'},
    wifi:{image:'assets/starlink-premium.png',caption:'Stay connected to what matters most.'},
    dining:{image:'assets/dining-premium.png',caption:'Dining shaped around your preferences.'}
  };

  $$('.experience-item button').forEach(btn=>btn.addEventListener('click',()=>{
    const item=btn.closest('.experience-item');
    const key=item?.dataset.experience;
    const data=experienceData[key];
    if(!item || !data) return;

    $$('.experience-item').forEach(el=>{
      const open=el===item;
      el.classList.toggle('is-open',open);
      $('i',el).textContent=open?'−':'+';
    });

    const img=$('#experienceImage');
    if(!img) return;
    img.style.opacity='0';
    setTimeout(()=>{
      img.src=data.image;
      img.alt=btn.querySelector('span')?.textContent || 'Experience image';
      $('#experienceCaption').textContent=data.caption;
      $('#experienceIndex').textContent=String(Object.keys(experienceData).indexOf(key)+1).padStart(2,'0');
      img.style.opacity='1';
    },220);
  }));

  $$('.route').forEach(btn=>btn.addEventListener('click',()=>{
    $$('.route').forEach(b=>b.classList.remove('is-active'));
    btn.classList.add('is-active');
    $('#routeCity').textContent=btn.dataset.city || 'LONDON';
    $('#routeTime').textContent=btn.dataset.time || '06:45';
  }));

  const menuBtn=$('.menu-button');
  const menu=$('#mobileMenu');
  const closeMenu=()=>{
    menuBtn?.setAttribute('aria-expanded','false');
    menu?.classList.remove('is-open');
    menu?.setAttribute('aria-hidden','true');
    document.body.classList.remove('is-locked');
  };
  menuBtn?.addEventListener('click',()=>{
    const open=!menu?.classList.contains('is-open');
    menuBtn.setAttribute('aria-expanded',String(open));
    menu?.classList.toggle('is-open',open);
    menu?.setAttribute('aria-hidden',String(!open));
    document.body.classList.toggle('is-locked',open);
  });
  $$('#mobileMenu a').forEach(a=>a.addEventListener('click',closeMenu));

  const drawer=$('#bookingDrawer');
  const openBooking=()=>{drawer?.classList.add('is-open');drawer?.setAttribute('aria-hidden','false');document.body.classList.add('is-locked')};
  const closeBooking=()=>{drawer?.classList.remove('is-open');drawer?.setAttribute('aria-hidden','true');document.body.classList.remove('is-locked')};
  $$('.js-book').forEach(b=>b.addEventListener('click',openBooking));
  $$('.js-close-booking').forEach(b=>b.addEventListener('click',closeBooking));
  addEventListener('keydown',e=>{if(e.key==='Escape'){closeBooking();closeMenu()}});

  const tripInput=$('input[name="tripType"]');
  $$('.trip-type button').forEach(btn=>btn.addEventListener('click',()=>{
    $$('.trip-type button').forEach(x=>x.classList.remove('is-active'));
    btn.classList.add('is-active');
    if(tripInput) tripInput.value=btn.dataset.trip || 'One way';
  }));

  const dep=$('input[name="departure"]');
  if(dep){
    const d=new Date();
    d.setMinutes(d.getMinutes()-d.getTimezoneOffset());
    dep.min=d.toISOString().split('T')[0];
  }

  const form=$('#bookingForm');
  const error=$('#formError');
  const success=$('#bookingSuccess');
  form?.addEventListener('submit',async e=>{
    e.preventDefault();
    if(error) error.textContent='';
    if(!form.checkValidity()){
      form.reportValidity();
      return;
    }
    const submit=$('.submit-button',form);
    submit.disabled=true;
    submit.querySelector('span').textContent='SENDING REQUEST…';
    const data=Object.fromEntries(new FormData(form).entries());
    data.createdAt=new Date().toISOString();
    data.source='Qatar Executive V6 unofficial concept';
    try{
      const response=await fetch('https://wsrxscbhuwwhghwrohez.supabase.co/functions/v1/qatar-executive',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(data)
      });
      if(!response.ok) throw new Error();
      form.hidden=true;
      success.hidden=false;
    }catch(err){
      if(error) error.textContent='The request could not be sent. Please call +974 4022 1700 for urgent assistance.';
    }finally{
      submit.disabled=false;
      submit.querySelector('span').textContent='SUBMIT FLIGHT REQUEST';
    }
  });
})();
