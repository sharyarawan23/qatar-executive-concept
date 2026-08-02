(()=>{
  const $=(s,c=document)=>c.querySelector(s);
  const $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
  const seg=(v,a,b)=>clamp((v-a)/(b-a));
  const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
  const easeOut=t=>1-Math.pow(1-t,3);

  addEventListener('load',()=>setTimeout(()=>$('#preloader')?.classList.add('is-hidden'),420));

  const cursorDot=$('.cursor-dot');
  const cursorRing=$('.cursor-ring');
  addEventListener('pointermove',e=>{
    if(cursorDot) cursorDot.style.transform=`translate(${e.clientX-2.5}px,${e.clientY-2.5}px)`;
    if(cursorRing) cursorRing.animate({transform:`translate(${e.clientX-18}px,${e.clientY-18}px)`},{duration:260,fill:'forwards'});
  });

  const header=$('#siteHeader');
  const scrollMeter=$('.scroll-meter span');

  const hero=$('#hero');
  const windowObject=$('#windowObject');
  const windowShade=$('#windowShade');
  const cloudVideo=$('#cloudVideo');
  const heroCloudField=$('#heroCloudField');
  const heroCopyLeft=$('.hero-copy-left');
  const heroCopyRight=$('.hero-copy-right');
  const scrollCue=$('.scroll-cue');

  const fleetJourney=$('.fleet-journey');
  const timeStatement=$('#timeStatement');
  const flyLeft=$('#flyWordLeft');
  const flyRight=$('#flyWordRight');
  const fleetJet=$('#fleetJet');
  const fleetTabs=$('#fleetTabs');
  const fleetCopyLeft=$('#fleetCopyLeft');
  const fleetCopyRight=$('#fleetCopyRight');
  const floorplan=$('#floorplanOverlay');
  const fleetProgress=$('.fleet-progress span');

  const updateScroll=()=>{
    const doc=document.documentElement;
    const page=scrollY/Math.max(1,doc.scrollHeight-innerHeight);
    if(scrollMeter) scrollMeter.style.width=`${page*100}%`;
    header?.classList.toggle('is-solid',scrollY>innerHeight*.72);

    if(hero){
      const r=hero.getBoundingClientRect();
      const total=hero.offsetHeight-innerHeight;
      const p=clamp(-r.top/Math.max(1,total));

      const shutterOpen=ease(seg(p,.035,.19));
      if(windowShade) windowShade.style.transform=`translateY(${-shutterOpen*105}%)`;

      const cloudZoom=ease(seg(p,.12,.78));
      if(cloudVideo) cloudVideo.style.transform=`scale(${1+cloudZoom*.42}) translate3d(${-cloudZoom*2.4}%,${-cloudZoom*2}%,0)`;

      const fieldIn=seg(p,.46,.86);
      if(heroCloudField){
        heroCloudField.style.opacity=String(fieldIn);
        heroCloudField.style.transform=`scale(${1.08-fieldIn*.07})`;
      }

      const windowZoom=ease(seg(p,.19,.78));
      const windowFade=1-seg(p,.82,.98);
      if(windowObject){
        windowObject.style.transform=`translate(-50%,-50%) scale(${1+windowZoom*2.75})`;
        windowObject.style.opacity=String(windowFade);
      }

      const copyOut=1-seg(p,.07,.24);
      if(heroCopyLeft){
        heroCopyLeft.style.opacity=String(copyOut);
        heroCopyLeft.style.transform=`translateY(${-seg(p,.07,.24)*45}px)`;
      }
      if(heroCopyRight){
        heroCopyRight.style.opacity=String(copyOut);
        heroCopyRight.style.transform=`translateY(${seg(p,.07,.24)*45}px)`;
      }
      if(scrollCue) scrollCue.style.opacity=String(1-seg(p,.02,.15));
    }

    if(fleetJourney){
      const r=fleetJourney.getBoundingClientRect();
      const total=fleetJourney.offsetHeight-innerHeight;
      const p=clamp(-r.top/Math.max(1,total));

      const timeIn=easeOut(seg(p,.015,.13));
      const timeLift=ease(seg(p,.18,.34));
      const timeOut=1-seg(p,.28,.40);
      if(timeStatement){
        timeStatement.style.opacity=String(timeIn*timeOut);
        timeStatement.style.transform=`translate(-50%,calc(-50% - ${timeLift*24}vh)) scale(${1-timeLift*.035})`;
      }

      const wordsIn=easeOut(seg(p,.30,.44));
      const wordsOut=1-seg(p,.61,.70);
      if(flyLeft){
        flyLeft.style.opacity=String(wordsIn*wordsOut);
        flyLeft.style.transform=`translateY(${(1-wordsIn)*35}px)`;
      }
      if(flyRight){
        flyRight.style.opacity=String(wordsIn*wordsOut);
        flyRight.style.transform=`translateY(${(1-wordsIn)*35}px)`;
      }

      const jetEnter=ease(seg(p,.38,.59));
      const jetRise=ease(seg(p,.59,.73));
      const floorIn=easeOut(seg(p,.83,.94));
      const jetY=(1-jetEnter)*120 - jetRise*31;
      const modelScale=parseFloat(fleetJet?.dataset.modelScale||'1');
      const jetScale=(.52 + jetEnter*.87 - jetRise*.42)*modelScale;
      if(fleetJet){
        fleetJet.style.opacity=String(seg(p,.38,.45)*(1-floorIn*.88));
        fleetJet.style.transform=`translate(-50%,${jetY}vh) scale(${jetScale})`;
        fleetJet.style.filter=`drop-shadow(0 24px 52px rgba(44,34,28,${.20-floorIn*.12})) blur(${floorIn*.25}px)`;
      }

      const detailsIn=easeOut(seg(p,.66,.77));
      const detailsDim=1-seg(p,.86,.95)*.72;
      if(fleetCopyLeft){
        fleetCopyLeft.style.opacity=String(detailsIn*detailsDim);
        fleetCopyLeft.style.transform=`translateX(${(1-detailsIn)*-42}px)`;
        fleetCopyLeft.style.pointerEvents=detailsIn>.7?'auto':'none';
      }
      if(fleetCopyRight){
        fleetCopyRight.style.opacity=String(detailsIn*detailsDim);
        fleetCopyRight.style.transform=`translateX(${(1-detailsIn)*42}px)`;
      }
      if(fleetTabs){
        fleetTabs.style.opacity=String(detailsIn*detailsDim);
        fleetTabs.style.transform=innerWidth>1080?`translateY(-50%) translateX(${(1-detailsIn)*-28}px)`:`translateX(${(1-detailsIn)*-18}px)`;
        fleetTabs.style.pointerEvents=detailsIn>.72?'auto':'none';
      }

      if(floorplan){
        floorplan.style.opacity=String(floorIn);
        floorplan.style.transform=`translate(-50%,-50%) scale(${.86+floorIn*.14})`;
      }

      if(fleetProgress) fleetProgress.style.width=`${p*100}%`;
    }
  };

  addEventListener('scroll',updateScroll,{passive:true});
  addEventListener('resize',updateScroll);
  updateScroll();

  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }),{threshold:.15});
  $$('.reveal').forEach(el=>observer.observe(el));

  const fleetData={
    g700:{
      image:'assets/fleet-g700.png', alt:'Gulfstream G700 top view', eyebrow:'GULFSTREAM G700', short:'G700',
      title:'Beyond<br><em>expectation.</em>',
      description:'The flagship experience: ultra-long-range performance, five living areas and a cabin shaped around privacy and wellbeing.',
      range:'7,750 <b>NM</b>', mach:'0.93', passengers:'13', scale:'1'
    },
    g650er:{
      image:'assets/fleet-g650er.png', alt:'Gulfstream G650ER top view', eyebrow:'GULFSTREAM G650ER', short:'G650ER',
      title:'Supreme<br><em>comfort.</em>',
      description:'A global favourite for non-stop ultra-long-range travel, with advanced cabin technology and Starlink connectivity on equipped aircraft.',
      range:'7,500 <b>NM</b>', mach:'0.90', passengers:'13', scale:'.96'
    },
    global5000:{
      image:'assets/fleet-global5000.png', alt:'Bombardier Global 5000 top view', eyebrow:'BOMBARDIER GLOBAL 5000', short:'GLOBAL 5000',
      title:'Powerful<br><em>versatility.</em>',
      description:'Three spacious cabin zones combine speed, performance and connected comfort for business and lifestyle journeys.',
      range:'5,200 <b>NM</b>', mach:'0.89', passengers:'13', scale:'.91'
    },
    a319:{
      image:'assets/fleet-a319.png', alt:'Airbus A319CJ concept top view', eyebrow:'AIRBUS A319CJ', short:'A319CJ',
      title:'Space<br><em>without limits.</em>',
      description:'An exceptional option for larger groups, with private bedroom, en-suite facilities, dining areas and generous living space.',
      range:'3,700 <b>NM</b>', mach:'0.82', passengers:'19', scale:'1.08'
    }
  };

  let activeFleet='g700';
  const setFleet=(key)=>{
    const data=fleetData[key];
    if(!data) return;
    activeFleet=key;
    $$('#fleetTabs button').forEach(btn=>btn.classList.toggle('is-active',btn.dataset.fleet===key));
    const jet=$('#fleetJet');
    if(jet){
      jet.style.opacity='0';
      setTimeout(()=>{
        jet.src=data.image;
        jet.alt=data.alt;
        jet.dataset.modelScale=data.scale;
        jet.style.opacity='1';
      },180);
    }
    $('#fleetEyebrow').textContent=data.eyebrow;
    $('#fleetName').innerHTML=data.title;
    $('#fleetDescription').textContent=data.description;
    $('#fleetRange').innerHTML=data.range;
    $('#fleetMach').textContent=data.mach;
    $('#fleetPassengers').textContent=data.passengers;
    $('#floorplanAircraft').textContent=data.short;
    $('#viewer360Title').textContent=data.eyebrow.replace('GULFSTREAM ','').replace('BOMBARDIER ','').replace('AIRBUS ','');
  };
  $$('#fleetTabs button').forEach(btn=>btn.addEventListener('click',()=>setFleet(btn.dataset.fleet)));

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
    if(!item||!data) return;
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
      img.alt=btn.querySelector('span')?.textContent||'Experience image';
      $('#experienceCaption').textContent=data.caption;
      $('#experienceIndex').textContent=String(Object.keys(experienceData).indexOf(key)+1).padStart(2,'0');
      img.style.opacity='1';
    },220);
  }));

  $$('.route').forEach(btn=>btn.addEventListener('click',()=>{
    $$('.route').forEach(b=>b.classList.remove('is-active'));
    btn.classList.add('is-active');
    $('#routeCity').textContent=btn.dataset.city||'LONDON';
    $('#routeTime').textContent=btn.dataset.time||'06:45';
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

  const viewer=$('#viewer360');
  const open360=()=>{
    viewer?.classList.add('is-open');
    viewer?.setAttribute('aria-hidden','false');
    document.body.classList.add('is-locked');
  };
  const close360=()=>{
    viewer?.classList.remove('is-open');
    viewer?.setAttribute('aria-hidden','true');
    document.body.classList.remove('is-locked');
  };
  $('#open360')?.addEventListener('click',open360);
  $$('[data-close360]').forEach(btn=>btn.addEventListener('click',close360));

  const scene=$('#viewer360Scene');
  const pan=$('#viewer360Pan');
  let dragging=false,startX=0,offset=0,current=0;
  const setPan=x=>{current=clamp(x,-28,28);if(pan) pan.style.transform=`translateX(${current}%) scale(1.05)`};
  scene?.addEventListener('pointerdown',e=>{dragging=true;startX=e.clientX;offset=current;scene.setPointerCapture(e.pointerId)});
  scene?.addEventListener('pointermove',e=>{if(!dragging)return;setPan(offset+(e.clientX-startX)/8)});
  scene?.addEventListener('pointerup',()=>dragging=false);
  scene?.addEventListener('pointercancel',()=>dragging=false);

  const drawer=$('#bookingDrawer');
  const openBooking=()=>{drawer?.classList.add('is-open');drawer?.setAttribute('aria-hidden','false');document.body.classList.add('is-locked')};
  const closeBooking=()=>{drawer?.classList.remove('is-open');drawer?.setAttribute('aria-hidden','true');document.body.classList.remove('is-locked')};
  $$('.js-book').forEach(b=>b.addEventListener('click',openBooking));
  $$('.js-close-booking').forEach(b=>b.addEventListener('click',closeBooking));
  addEventListener('keydown',e=>{if(e.key==='Escape'){closeBooking();closeMenu();close360()}});

  const tripInput=$('input[name="tripType"]');
  $$('.trip-type button').forEach(btn=>btn.addEventListener('click',()=>{
    $$('.trip-type button').forEach(x=>x.classList.remove('is-active'));
    btn.classList.add('is-active');
    if(tripInput) tripInput.value=btn.dataset.trip||'One way';
  }));

  const dep=$('input[name="departure"]');
  if(dep){const d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());dep.min=d.toISOString().split('T')[0]}

  const form=$('#bookingForm');
  const error=$('#formError');
  const success=$('#bookingSuccess');
  form?.addEventListener('submit',async e=>{
    e.preventDefault();
    if(error) error.textContent='';
    if(!form.checkValidity()){form.reportValidity();return}
    const submit=$('.submit-button',form);
    submit.disabled=true;
    submit.querySelector('span').textContent='SENDING REQUEST…';
    const data=Object.fromEntries(new FormData(form).entries());
    data.createdAt=new Date().toISOString();
    data.source='Qatar Executive premium concept';
    try{
      const response=await fetch('https://wsrxscbhuwwhghwrohez.supabase.co/functions/v1/qatar-executive',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
      if(!response.ok) throw new Error();
      form.hidden=true;success.hidden=false;
    }catch(err){if(error) error.textContent='The request could not be sent. Please call +974 4022 1700 for urgent assistance.'}
    finally{submit.disabled=false;submit.querySelector('span').textContent='SUBMIT FLIGHT REQUEST'}
  });
})();
