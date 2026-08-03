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
  const revealJet=$('#fleetJet');
  const fleetProgress=$('.fleet-progress span');

  const updateScroll=()=>{
    const doc=document.documentElement;
    const page=scrollY/Math.max(1,doc.scrollHeight-innerHeight);
    if(scrollMeter) scrollMeter.style.width=`${page*100}%`;
    header?.classList.toggle('is-solid',scrollY>innerHeight*.62);

    if(hero){
      const r=hero.getBoundingClientRect();
      const total=hero.offsetHeight-innerHeight;
      const p=clamp(-r.top/Math.max(1,total));

      const shutterOpen=ease(seg(p,.01,.085));
      if(windowShade) windowShade.style.transform=`translateY(${-shutterOpen*106}%)`;

      const cloudZoom=ease(seg(p,.035,.40));
      if(cloudVideo){
        cloudVideo.style.transform=`scale(${1+cloudZoom*.72}) translate3d(${-cloudZoom*2.5}%,${-cloudZoom*22}%,0)`;
      }

      const fieldIn=easeOut(seg(p,.16,.43));
      if(heroCloudField){
        heroCloudField.style.opacity=String(fieldIn);
        heroCloudField.style.transform=`translate3d(0,${-fieldIn*8}%,0) scale(${1.13-fieldIn*.08})`;
      }

      const windowZoom=ease(seg(p,.05,.43));
      const windowFade=1-seg(p,.41,.57);
      if(windowObject){
        windowObject.style.transform=`translate(-50%,calc(-50% - ${windowZoom*10}vh)) scale(${1+windowZoom*3.7})`;
        windowObject.style.opacity=String(windowFade);
      }

      const copyOut=1-seg(p,.018,.13);
      if(heroCopyLeft){
        heroCopyLeft.style.opacity=String(copyOut);
        heroCopyLeft.style.transform=`translateY(${-seg(p,.025,.14)*42}px)`;
      }
      if(heroCopyRight){
        heroCopyRight.style.opacity=String(copyOut);
        heroCopyRight.style.transform=`translateY(${seg(p,.025,.14)*42}px)`;
      }
      if(scrollCue) scrollCue.style.opacity=String(1-seg(p,.01,.075));
    }

    if(fleetJourney){
      const r=fleetJourney.getBoundingClientRect();
      const total=fleetJourney.offsetHeight-innerHeight;
      const p=clamp(-r.top/Math.max(1,total));

      // Three-step cinematic sequence with earlier statement reveal:
      // 1) statement appears immediately, 2) Fly / Premium, 3) aircraft reveal.
      const timeIn=easeOut(seg(p,0,.10));
      const timeOut=1-ease(seg(p,.22,.38));
      const timeLift=ease(seg(p,.22,.38));
      if(timeStatement){
        timeStatement.style.opacity=String(timeIn*timeOut);
        timeStatement.style.transform=`translate(-50%,calc(-50% + 2.5vh - ${timeLift*8}vh)) scale(${1-timeLift*.02})`;
      }

      const wordsIn=easeOut(seg(p,.28,.40));
      const wordsLift=ease(seg(p,.68,.99));
      const wordsFade=1-seg(p,.995,1);
      if(flyLeft){
        flyLeft.style.opacity=String(wordsIn*wordsFade);
        flyLeft.style.transform=`translate3d(${(1-wordsIn)*-18}px,calc(${(1-wordsIn)*24}px + 7vh - ${wordsLift*42}vh),0)`;
      }
      if(flyRight){
        flyRight.style.opacity=String(wordsIn*wordsFade);
        flyRight.style.transform=`translate3d(${(1-wordsIn)*18}px,calc(${(1-wordsIn)*24}px + 7vh - ${wordsLift*42}vh),0)`;
      }

      const jetEnter=ease(seg(p,.44,.62));
      const jetRise=ease(seg(p,.62,1));
      const jetFade=1-seg(p,.998,1);
      const jetY=(1-jetEnter)*150 - jetRise*270;
      const jetScale=.44 + jetEnter*1.02 - jetRise*.18;
      if(revealJet){
        revealJet.style.opacity=String(seg(p,.44,.52)*jetFade);
        revealJet.style.transform=`translate(-50%,${jetY}vh) scale(${jetScale})`;
      }
      if(fleetProgress) fleetProgress.style.width=`${p*100}%`;
    }
  };
  addEventListener('scroll',updateScroll,{passive:true});
  addEventListener('resize',updateScroll);
  updateScroll();

  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}
  }),{threshold:.14});
  $$('.reveal').forEach(el=>observer.observe(el));

  const fleetData={
    g700:{
      eyebrow:'GULFSTREAM G700',short:'G700',title:'Beyond<br><em>expectation.</em>',
      description:'The flagship experience combines ultra-long-range performance, five living areas and the largest purpose-built business-jet cabin.',
      range:'7,750 nm',mach:'0.93',passengers:'13',zones:'5',
      media:[
        {src:'assets/g700-exterior-square.webp',label:'Exterior',kind:'image',alt:'Gulfstream G700 exterior at sunset'},
        {src:'assets/g700-interior-square.webp',label:'Interior',kind:'image',alt:'Gulfstream G700 luxury cabin'},
        {src:'assets/g700-top-square.webp',label:'Top view',kind:'top',alt:'Gulfstream G700 full top view'},
        {src:'assets/g700-plan-square.webp',label:'Floor plan',kind:'floorplan',alt:'Gulfstream G700 full aircraft cabin plan'}
      ],viewer:'assets/g700-interior-square.webp',plan:'g700'
    },
    g650er:{
      eyebrow:'GULFSTREAM G650ER',short:'G650ER',title:'Supreme<br><em>comfort.</em>',
      description:'A global favourite for effortless ultra-long-range travel, combining industry-leading cabin technology with high-speed connectivity.',
      range:'7,500 nm',mach:'0.90',passengers:'13',zones:'4',
      media:[
        {src:'assets/g650er-exterior-square.webp',label:'Exterior',kind:'image',alt:'Gulfstream G650ER exterior at sunset'},
        {src:'assets/g650er-interior-square.webp',label:'Interior',kind:'image',alt:'Gulfstream G650ER luxury cabin'},
        {src:'assets/g650er-top-square.webp',label:'Top view',kind:'top',alt:'Gulfstream G650ER full top view'},
        {src:'assets/g650er-plan-square.webp',label:'Floor plan',kind:'floorplan',alt:'Gulfstream G650ER full aircraft cabin plan'}
      ],viewer:'assets/g650er-interior-square.webp',plan:'g650er'
    },
    global5000:{
      eyebrow:'BOMBARDIER GLOBAL 5000',short:'GLOBAL 5000',title:'Powerful<br><em>versatility.</em>',
      description:'One of the widest cabins in its class, with three distinct zones for business, dining, relaxation and rest.',
      range:'5,200 nm',mach:'0.89',passengers:'13',zones:'3',
      media:[
        {src:'assets/global5000-exterior-square.webp',label:'Exterior',kind:'image',alt:'Bombardier Global 5000 exterior at sunset'},
        {src:'assets/global5000-interior-square.webp',label:'Interior',kind:'image',alt:'Bombardier Global 5000 luxury cabin'},
        {src:'assets/global5000-top-square.webp',label:'Top view',kind:'top',alt:'Bombardier Global 5000 full top view'},
        {src:'assets/global5000-plan-square.webp',label:'Floor plan',kind:'floorplan',alt:'Bombardier Global 5000 full aircraft cabin plan'}
      ],viewer:'assets/global5000-interior-square.webp',plan:'global5000'
    },
    a319:{
      eyebrow:'AIRBUS A319CJ',short:'A319CJ',title:'Space<br><em>without limits.</em>',
      description:'Created for larger groups and family travel, with private bedroom, en-suite facilities, dining areas and generous living space.',
      range:'3,700 nm',mach:'0.82',passengers:'19',zones:'6',
      media:[
        {src:'assets/a319-exterior-square.webp',label:'Exterior',kind:'image',alt:'Airbus A319CJ exterior at sunset'},
        {src:'assets/a319-interior-square.webp',label:'Interior',kind:'image',alt:'Airbus A319CJ luxury cabin'},
        {src:'assets/a319-top-square.webp',label:'Top view',kind:'top',alt:'Airbus A319CJ full top view'},
        {src:'assets/a319-plan-square.webp',label:'Floor plan',kind:'floorplan',alt:'Airbus A319CJ full aircraft cabin plan'}
      ],viewer:'assets/a319-interior-square.webp',plan:'a319'
    }
  };

  const planSVG=(key)=>{
    const commonStart=`<div class="plan-caption"><span>Cabin configuration</span><strong>${fleetData[key].short}</strong></div>`;
    if(key==='a319'){
      return `${commonStart}<svg viewBox="0 0 520 980" role="img" aria-label="Airbus A319CJ cabin plan"><defs><linearGradient id="planA" x1="0" x2="1"><stop stop-color="#fcf7ef"/><stop offset="1" stop-color="#d8c7b6"/></linearGradient></defs><path d="M260 16C354 48 400 105 400 178v650c0 79-43 125-140 142C163 953 120 907 120 828V178C120 105 166 48 260 16Z" fill="url(#planA)" stroke="#8f7d6e" stroke-width="3"/><g fill="none" stroke="#a99684" stroke-width="2"><rect x="150" y="145" width="220" height="132" rx="18"/><rect x="150" y="298" width="220" height="180" rx="18"/><rect x="150" y="500" width="220" height="166" rx="18"/><rect x="150" y="688" width="220" height="128" rx="18"/></g><g fill="#c7b096" stroke="#8e8175"><rect x="168" y="178" width="54" height="62" rx="10"/><rect x="298" y="178" width="54" height="62" rx="10"/><rect x="168" y="330" width="54" height="72" rx="10"/><rect x="298" y="330" width="54" height="72" rx="10"/><rect x="168" y="422" width="54" height="38" rx="8"/><rect x="298" y="422" width="54" height="38" rx="8"/><rect x="168" y="530" width="54" height="62" rx="10"/><rect x="298" y="530" width="54" height="62" rx="10"/><rect x="168" y="704" width="184" height="76" rx="14"/></g><path d="M260 126v728" stroke="#b6a597" stroke-dasharray="6 8"/></svg>`;
    }
    const configs={
      g700:{zones:[[170,86],[274,92],[385,118],[525,126],[672,116],[810,74]],beds:[[108,188,26,35],[146,188,26,35],[108,294,26,38],[146,294,26,38],[108,412,26,44],[146,412,26,44],[108,552,26,44],[146,552,26,44],[108,700,64,48],[108,822,64,34]]},
      g650er:{zones:[[180,104],[304,114],[438,132],[590,142],[752,94]],beds:[[108,198,26,40],[146,198,26,40],[108,330,26,44],[146,330,26,44],[108,468,26,48],[146,468,26,48],[108,622,64,54],[108,770,64,42]]},
      global5000:{zones:[[210,170],[402,196],[620,182]],beds:[[108,236,26,46],[146,236,26,46],[108,448,26,48],[146,448,26,48],[108,674,64,58],[108,782,64,38]]}
    };
    const c=configs[key];
    const zones=c.zones.map(([y,h])=>`<rect x="104" y="${y}" width="72" height="${h}" rx="8"/>`).join('');
    const seats=c.beds.map(([x,y,w,h])=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/>`).join('');
    return `${commonStart}<svg viewBox="0 0 280 960" role="img" aria-label="${fleetData[key].short} cabin plan"><defs><linearGradient id="plan-${key}" x1="0" x2="1"><stop stop-color="#fcf7ef"/><stop offset="1" stop-color="#d7c6b5"/></linearGradient></defs><path d="M140 12C183 45 198 82 198 132v710c0 60-18 94-58 108-40-14-58-48-58-108V132c0-50 15-87 58-120Z" fill="url(#plan-${key})" stroke="#8f7d6e" stroke-width="2"/><g fill="none" stroke="#aa9787">${zones}</g><g fill="#c8b196" stroke="#8e8175">${seats}</g><path d="M140 145v704" stroke="#b9aa9b" stroke-dasharray="5 7"/></svg>`;
  };

  let activeFleet='g700';
  let activeMedia=0;
  const stage=$('#fleetMediaStage');
  const mediaImage=$('#fleetMediaImage');
  const floorStage=$('#fleetFloorplanStage');
  const thumbs=$('#fleetMediaThumbs');

  const selectMedia=(index)=>{
    const data=fleetData[activeFleet];
    const item=data.media[index];
    if(!item) return;
    activeMedia=index;
    $$('#fleetMediaThumbs button').forEach((b,i)=>b.classList.toggle('is-active',i===index));
    $('#fleetMediaIndex').textContent=String(index+1).padStart(2,'0');
    $('#fleetMediaLabel').textContent=item.label;
    if(item.kind==='floorplan'){
      mediaImage.hidden=true;
      floorStage.hidden=false;
      floorStage.innerHTML=`<div class="plan-caption"><span>Full aircraft cabin plan</span><strong>${data.short}</strong></div><img src="${item.src}" alt="${item.alt||data.short+' cabin plan'}" />`;
      stage.classList.remove('is-top');
      stage.classList.add('is-floorplan');
    }else{
      floorStage.hidden=true;
      mediaImage.hidden=false;
      mediaImage.style.opacity='0';
      setTimeout(()=>{
        mediaImage.src=item.src;
        mediaImage.alt=item.alt;
        stage.classList.remove('is-floorplan');
        stage.classList.toggle('is-top',item.kind==='top');
        mediaImage.style.opacity='1';
      },120);
    }
  };

  const renderThumbs=()=>{
    const data=fleetData[activeFleet];
    thumbs.innerHTML=data.media.map((item,i)=>{
      const image=item.src?`<img src="${item.src}" alt="" />`:'';
      return `<button type="button" data-media="${i}" data-kind="${item.kind}" class="${i===0?'is-active':''}">${image}<span>${item.label}</span></button>`;
    }).join('');
    $$('button',thumbs).forEach(btn=>btn.addEventListener('click',()=>selectMedia(Number(btn.dataset.media))));
  };

  const setFleet=(key)=>{
    const data=fleetData[key];
    if(!data) return;
    activeFleet=key;
    $$('#fleetTabs button').forEach(btn=>btn.classList.toggle('is-active',btn.dataset.fleet===key));
    $('#fleetEyebrow').textContent=data.eyebrow;
    $('#fleetName').innerHTML=data.title;
    $('#fleetDescription').textContent=data.description;
    $('#fleetRange').textContent=data.range;
    $('#fleetMach').textContent=data.mach;
    $('#fleetPassengers').textContent=data.passengers;
    $('#fleetZones').textContent=data.zones;
    $('#viewer360Title').textContent=data.eyebrow;
    const pan=$('#viewer360Pan');
    if(pan) pan.style.backgroundImage=`url('${data.viewer}')`;
    renderThumbs();
    selectMedia(0);
  };
  $$('#fleetTabs button').forEach(btn=>btn.addEventListener('click',()=>setFleet(btn.dataset.fleet)));
  setFleet('g700');

  const experienceData={
    pets:{image:'assets/pets-premium.png',caption:'Your companions, welcomed onboard.'},
    crew:{image:'assets/crew-single-cabin-v2.png',caption:'Signature cabin crew, welcoming guests inside the aircraft with warmth, poise and discretion.'},
    wifi:{image:'assets/starlink-premium.png',caption:'Stay connected to what matters most.'},
    dining:{image:'assets/dining-premium.png',caption:'Dining shaped around your preferences.'}
  };
  $$('.experience-item button').forEach(btn=>btn.addEventListener('click',()=>{
    const item=btn.closest('.experience-item');
    const key=item?.dataset.experience;
    const data=experienceData[key];
    if(!item||!data) return;
    $$('.experience-item').forEach(el=>{const open=el===item;el.classList.toggle('is-open',open);$('i',el).textContent=open?'−':'+'});
    const img=$('#experienceImage');
    if(!img) return;
    img.style.opacity='0';
    setTimeout(()=>{img.src=data.image;img.alt=btn.querySelector('span')?.textContent||'Experience image';$('#experienceCaption').textContent=data.caption;$('#experienceIndex').textContent=String(Object.keys(experienceData).indexOf(key)+1).padStart(2,'0');img.style.opacity='1'},220);
  }));

  $$('.route').forEach(btn=>btn.addEventListener('click',()=>{$$('.route').forEach(b=>b.classList.remove('is-active'));btn.classList.add('is-active');$('#routeCity').textContent=btn.dataset.city||'LONDON';$('#routeTime').textContent=btn.dataset.time||'06:45'}));

  const menuBtn=$('.menu-button');
  const menu=$('#mobileMenu');
  const closeMenu=()=>{menuBtn?.setAttribute('aria-expanded','false');menu?.classList.remove('is-open');menu?.setAttribute('aria-hidden','true');document.body.classList.remove('is-locked')};
  menuBtn?.addEventListener('click',()=>{const open=!menu?.classList.contains('is-open');menuBtn.setAttribute('aria-expanded',String(open));menu?.classList.toggle('is-open',open);menu?.setAttribute('aria-hidden',String(!open));document.body.classList.toggle('is-locked',open)});
  $$('#mobileMenu a').forEach(a=>a.addEventListener('click',closeMenu));

  const viewer=$('#viewer360');
  const open360=()=>{viewer?.classList.add('is-open');viewer?.setAttribute('aria-hidden','false');document.body.classList.add('is-locked')};
  const close360=()=>{viewer?.classList.remove('is-open');viewer?.setAttribute('aria-hidden','true');document.body.classList.remove('is-locked')};
  $('#open360')?.addEventListener('click',open360);
  $$('[data-close360]').forEach(btn=>btn.addEventListener('click',close360));
  const scene=$('#viewer360Scene');
  const pan=$('#viewer360Pan');
  let dragging=false,startX=0,offset=0,current=0;
  const setPan=x=>{current=clamp(x,-28,28);if(pan) pan.style.transform=`translateX(${current}%) scale(1.08)`};
  scene?.addEventListener('pointerdown',e=>{dragging=true;startX=e.clientX;offset=current;scene.setPointerCapture(e.pointerId)});
  scene?.addEventListener('pointermove',e=>{if(dragging)setPan(offset+(e.clientX-startX)/8)});
  scene?.addEventListener('pointerup',()=>dragging=false);
  scene?.addEventListener('pointercancel',()=>dragging=false);

  const drawer=$('#bookingDrawer');
  const openBooking=()=>{drawer?.classList.add('is-open');drawer?.setAttribute('aria-hidden','false');document.body.classList.add('is-locked')};
  const closeBooking=()=>{drawer?.classList.remove('is-open');drawer?.setAttribute('aria-hidden','true');document.body.classList.remove('is-locked')};
  $$('.js-book').forEach(b=>b.addEventListener('click',openBooking));
  $$('.js-close-booking').forEach(b=>b.addEventListener('click',closeBooking));
  addEventListener('keydown',e=>{if(e.key==='Escape'){closeBooking();closeMenu();close360()}});

  const tripInput=$('input[name="tripType"]');
  $$('.trip-type button').forEach(btn=>btn.addEventListener('click',()=>{$$('.trip-type button').forEach(x=>x.classList.remove('is-active'));btn.classList.add('is-active');if(tripInput) tripInput.value=btn.dataset.trip||'One way'}));
  const dep=$('input[name="departure"]');
  if(dep){const d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());dep.min=d.toISOString().split('T')[0]}

  const form=$('#bookingForm');
  const error=$('#formError');
  const success=$('#bookingSuccess');
  form?.addEventListener('submit',async e=>{
    e.preventDefault();if(error) error.textContent='';if(!form.checkValidity()){form.reportValidity();return}
    const submit=$('.submit-button',form);submit.disabled=true;submit.querySelector('span').textContent='SENDING REQUEST…';
    const data=Object.fromEntries(new FormData(form).entries());data.createdAt=new Date().toISOString();data.source='Qatar Executive premium concept';
    try{const response=await fetch('https://wsrxscbhuwwhghwrohez.supabase.co/functions/v1/qatar-executive',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});if(!response.ok) throw new Error();form.hidden=true;success.hidden=false}
    catch(err){if(error) error.textContent='The request could not be sent. Please call +974 4022 1700 for urgent assistance.'}
    finally{submit.disabled=false;submit.querySelector('span').textContent='SUBMIT FLIGHT REQUEST'}
  });
})();
