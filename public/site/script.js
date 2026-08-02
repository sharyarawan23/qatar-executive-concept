(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const preloader = $('#preloader');
  window.addEventListener('load', () => setTimeout(() => preloader?.classList.add('is-done'), 350));
  setTimeout(() => preloader?.classList.add('is-done'), 2300);

  const cursorDot = $('.cursor-dot');
  const cursorRing = $('.cursor-ring');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
  window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; if (cursorDot) cursorDot.style.transform = `translate(${mouseX}px,${mouseY}px) translate(-50%,-50%)`; });
  const animateCursor = () => { ringX += (mouseX-ringX)*.14; ringY += (mouseY-ringY)*.14; if(cursorRing) cursorRing.style.transform = `translate(${ringX}px,${ringY}px) translate(-50%,-50%)`; requestAnimationFrame(animateCursor); };
  animateCursor();
  $$('a,button,input,select,textarea').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing?.classList.add('is-active'));
    el.addEventListener('mouseleave', () => cursorRing?.classList.remove('is-active'));
  });

  const header = $('#siteHeader');
  const progress = $('.scroll-progress span');
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const segment = (value, start, end) => clamp((value - start) / Math.max(end - start, .0001));
  const easeOut = value => 1 - Math.pow(1 - clamp(value), 3);
  const easeInOut = value => { const p = clamp(value); return p < .5 ? 4*p*p*p : 1 - Math.pow(-2*p + 2, 3)/2; };

  const headerBrand = $('.site-header .brand');
  const journey = $('#jetReveal');
  const windowStage = $('.journey-window-stage');
  const windowWrap = $('.journey-window-wrap');
  const windowLogo = $('.journey-window-logo');
  const windowClouds = $('.journey-clouds');
  const introLeft = $('.journey-intro-left');
  const introRight = $('.journey-intro-right');
  const scrollPrompt = $('.journey-scroll-prompt');
  const skyStage = $('.journey-sky-stage');
  const skyA = $('.sky-depth-a');
  const skyB = $('.sky-depth-b');
  const jetStage = $('.journey-jet-stage');
  const journeyJet = $('.journey-jet');
  const jetCopyLeft = $('.journey-jet-copy-left');
  const jetCopyRight = $('.journey-jet-copy-right');
  const exitShade = $('.journey-exit-shade');
  const journeyProgress = $('.journey-progress span');

  const onScroll = () => {
    const pageY = window.scrollY;
    header?.classList.toggle('is-scrolled', pageY > 40);
    const max = document.documentElement.scrollHeight - innerHeight;
    if(progress) progress.style.width = `${max > 0 ? (pageY/max)*100 : 0}%`;

    if(journey){
      const rect = journey.getBoundingClientRect();
      const total = journey.offsetHeight - innerHeight;
      const pct = clamp(-rect.top / Math.max(total,1));
      const mobile = innerWidth <= 760;

      // Initial logo is inside the window. Header brand fades in as that logo departs.
      const brandIn = segment(pct,.11,.22);
      if(headerBrand){
        headerBrand.style.opacity = String(brandIn);
        headerBrand.style.transform = `translateY(${(1-brandIn)*-14}px)`;
      }

      // Scene 1 — window, open shade and logo.
      const logoLift = easeInOut(segment(pct,.08,.23));
      if(windowLogo){
        windowLogo.style.opacity = String(1 - segment(pct,.15,.25));
        windowLogo.style.transform = `translate(-50%,calc(-50% - ${logoLift*58}vh)) scale(${1-logoLift*.28})`;
      }
      const introFade = 1 - segment(pct,.16,.29);
      if(introLeft){ introLeft.style.opacity = String(introFade); introLeft.style.transform = `translateY(${-segment(pct,.12,.29)*42}px)`; }
      if(introRight){ introRight.style.opacity = String(introFade); introRight.style.transform = `translateY(${-segment(pct,.12,.29)*34}px)`; }
      if(scrollPrompt) scrollPrompt.style.opacity = String(1-segment(pct,.02,.12));

      // Clouds become visible before the camera enters the window.
      const cloudReveal = easeOut(segment(pct,.10,.28));
      if(windowClouds){
        windowClouds.style.opacity = String(.08 + cloudReveal*.92);
        windowClouds.style.transform = `scale(${1.04 + cloudReveal*.32}) translateY(${cloudReveal*-3}%)`;
      }

      // Scene 2 — camera pushes through the window.
      const windowZoom = easeInOut(segment(pct,.22,.47));
      if(windowWrap){
        const zoom = 1 + windowZoom*(mobile ? 5.6 : 6.2);
        windowWrap.style.transform = `translate(-50%,calc(-50% + ${windowZoom*-2}vh)) scale(${zoom})`;
        windowWrap.style.opacity = String(1-segment(pct,.42,.51));
      }
      if(windowStage) windowStage.style.opacity = String(1-segment(pct,.46,.54));

      // Fullscreen cloud scene after passing the frame.
      const skyIn = easeOut(segment(pct,.32,.51));
      const skyOut = segment(pct,.88,1);
      if(skyStage){
        skyStage.style.opacity = String(skyIn*(1-skyOut*.65));
        skyStage.style.transform = `scale(${1.16 - skyIn*.12 + pct*.05})`;
      }
      if(skyA) skyA.style.transform = `translate3d(${pct*-7}vw,${pct*-9}vh,0) scale(${1+pct*.14})`;
      if(skyB) skyB.style.transform = `translate3d(${pct*8}vw,${pct*-15}vh,0) scale(${1+pct*.2})`;

      // Scene 3 — aircraft remains completely hidden, then rises from below and grows.
      const jetEnter = easeInOut(segment(pct,.47,.70));
      const jetExit = easeInOut(segment(pct,.84,1));
      const enterY = (1-jetEnter)*(mobile ? 86 : 98);
      const exitY = jetExit*(mobile ? -112 : -125);
      const scale = .72 + jetEnter*(mobile ? .28 : .34) + jetExit*.10;
      const jetOpacity = segment(pct,.49,.57) * (1-segment(pct,.94,1));
      if(journeyJet){
        journeyJet.style.opacity = String(jetOpacity);
        journeyJet.style.transform = `translate3d(-50%,calc(-50% + ${enterY + exitY}vh),0) scale(${scale})`;
      }
      if(jetStage) jetStage.style.opacity = String(1-segment(pct,.97,1));

      // Side copy appears only after the aircraft reaches the centre.
      const copyIn = easeOut(segment(pct,.68,.77));
      const copyOut = 1-easeInOut(segment(pct,.85,.98));
      const copyOpacity = copyIn*copyOut;
      const copyExitY = segment(pct,.85,1)*-88;
      if(jetCopyLeft){
        jetCopyLeft.style.opacity = String(copyOpacity);
        jetCopyLeft.style.transform = mobile
          ? `translate(${(1-copyIn)*-30}px,${copyExitY}px)`
          : `translate(${(1-copyIn)*-58}px,calc(-50% + ${copyExitY}px))`;
      }
      if(jetCopyRight){
        jetCopyRight.style.opacity = String(copyOpacity);
        jetCopyRight.style.transform = mobile
          ? `translate(${(1-copyIn)*30}px,${copyExitY}px)`
          : `translate(${(1-copyIn)*58}px,calc(-50% + ${copyExitY}px))`;
      }

      if(exitShade) exitShade.style.opacity = String(segment(pct,.88,1));
      if(journeyProgress) journeyProgress.style.width = `${pct*100}%`;
    } else if(headerBrand) {
      headerBrand.style.opacity = '1';
      headerBrand.style.transform = 'none';
    }

    const story = $('.flight-story');
    if(story){
      const rect = story.getBoundingClientRect();
      const total = story.offsetHeight - innerHeight;
      const pct = clamp(-rect.top / Math.max(total,1));
      const image = $('.story-media img');
      const type = $('.story-background-type');
      if(image) image.style.transform = `scale(${1.1 + pct*.12}) translateY(${pct*-3}%)`;
      if(type) type.style.transform = `translateX(${pct*-6}vw)`;
    }
  };
  addEventListener('scroll', onScroll, {passive:true});
  addEventListener('resize', onScroll);
  onScroll();

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        if(entry.target.classList.contains('story-stats')) runCounters(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.16});
  $$('.reveal,.reveal-words,.story-stats').forEach(el => observer.observe(el));

  function runCounters(scope){
    $$('.counter',scope).forEach(el => {
      const target = Number(el.dataset.value || 0); const start = performance.now(); const duration = 1600;
      const step = now => { const p = Math.min(1,(now-start)/duration); const eased = 1-Math.pow(1-p,3); el.textContent = Math.floor(target*eased).toLocaleString(); if(p<1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
  }

  $$('[data-scroll]').forEach(btn => btn.addEventListener('click', () => $(btn.dataset.scroll)?.scrollIntoView({behavior:'smooth'})));

  const menuButton = $('.menu-button');
  const mobileMenu = $('#mobileMenu');
  function closeMenu(){ menuButton?.classList.remove('is-open'); menuButton?.setAttribute('aria-expanded','false'); mobileMenu?.classList.remove('is-open'); mobileMenu?.setAttribute('aria-hidden','true'); document.body.classList.remove('is-locked'); }
  menuButton?.addEventListener('click', () => {
    const open = !mobileMenu.classList.contains('is-open');
    menuButton.classList.toggle('is-open', open); menuButton.setAttribute('aria-expanded', String(open));
    mobileMenu.classList.toggle('is-open', open); mobileMenu.setAttribute('aria-hidden', String(!open)); document.body.classList.toggle('is-locked', open);
  });
  $$('#mobileMenu a,#mobileMenu .js-book').forEach(el => el.addEventListener('click', closeMenu));

  const fleet = [
    { number:'G700', title:'Gulfstream G700', label:'ULTRA-LONG-RANGE FLAGSHIP', image:'assets/g700-exterior.webp', copy:'The largest cabin in business aviation, built for ultra-long-range travel with five distinct living areas and uncompromising comfort.', range:'7,750 nm', passengers:'13', speed:'Mach 0.935', zones:'5' },
    { number:'G650ER', title:'Gulfstream G650ER', label:'GLOBAL PERFORMANCE ICON', image:'assets/g700-exterior.webp', copy:'An ultra-long-range favourite combining exceptional speed, quiet comfort and Starlink-enabled connectivity on select aircraft.', range:'7,500 nm', passengers:'13', speed:'Mach 0.90', zones:'4' },
    { number:'G5000', title:'Bombardier Global 5000', label:'VERSATILE LONG-RANGE', image:'assets/global5000-interior.webp', copy:'A powerful, versatile aircraft with one of the widest cabins in its class—ideal for productive regional and intercontinental travel.', range:'5,200 nm', passengers:'13', speed:'Mach 0.89', zones:'3' },
    { number:'A319CJ', title:'Airbus A319CJ', label:'SPACIOUS GROUP TRAVEL', image:'assets/a319-interior.webp', copy:'Exceptional space for larger groups, featuring private bedroom, en-suite facilities, dining areas and sleeping space for up to twelve.', range:'6,000 nm', passengers:'19', speed:'Mach 0.82', zones:'Multiple' }
  ];
  const fleetStage = $('.fleet-visual');
  $$('.fleet-tab').forEach(tab => tab.addEventListener('click', () => {
    const i = Number(tab.dataset.fleet); const data = fleet[i];
    $$('.fleet-tab').forEach((t,j) => { t.classList.toggle('is-active',j===i); t.setAttribute('aria-selected',String(j===i)); });
    fleetStage?.classList.add('is-changing');
    setTimeout(() => {
      $('[data-fleet-number]').textContent=data.number; $('[data-fleet-title]').textContent=data.title; $('[data-fleet-label]').textContent=data.label;
      $('[data-fleet-count]').textContent=`0${i+1} / 04`; $('[data-fleet-copy]').textContent=data.copy; $('[data-fleet-range]').textContent=data.range;
      $('[data-fleet-passengers]').textContent=data.passengers; $('[data-fleet-speed]').textContent=data.speed; $('[data-fleet-zones]').textContent=data.zones;
      const img=$('[data-fleet-image]'); img.src=data.image; img.alt=data.title;
      fleetStage?.classList.remove('is-changing');
    },330);
  }));

  const routeCode = $('#routeCode'), routeMiles = $('#routeMiles'), destinationPoint = $('#destinationPoint'), routeArc = $('#routeArc');
  $$('.route-button').forEach((btn,index) => btn.addEventListener('click', () => {
    $$('.route-button').forEach(b => b.classList.remove('is-active')); btn.classList.add('is-active');
    routeCode.textContent=btn.dataset.code; routeMiles.textContent=btn.dataset.distance; destinationPoint.textContent=btn.dataset.code;
    routeArc.style.transform=`rotate(${btn.dataset.angle}deg) translateY(-100%)`;
    const points=[[20,27],[8,39],[78,30],[55,78]]; destinationPoint.style.left=points[index][0]+'%'; destinationPoint.style.top=points[index][1]+'%';
  }));

  const drawer = $('#bookingDrawer');
  const bookingPanel = $('.booking-panel');
  function openBooking(){ drawer.classList.add('is-open'); drawer.setAttribute('aria-hidden','false'); document.body.classList.add('is-locked'); setTimeout(() => $('.booking-close')?.focus(),500); }
  function closeBooking(){ drawer.classList.remove('is-open'); drawer.setAttribute('aria-hidden','true'); document.body.classList.remove('is-locked'); }
  $$('.js-book').forEach(btn => btn.addEventListener('click', openBooking));
  $$('.js-close-booking').forEach(btn => btn.addEventListener('click', closeBooking));
  addEventListener('keydown', e => { if(e.key==='Escape') { closeBooking(); closeMenu(); } });

  const tripInput = $('input[name="tripType"]');
  $$('.trip-type button').forEach(btn => btn.addEventListener('click', () => {
    $$('.trip-type button').forEach(b=>b.classList.remove('is-active')); btn.classList.add('is-active'); tripInput.value=btn.dataset.trip;
    $('.return-field').style.opacity = btn.dataset.trip === 'One way' ? '.45' : '1';
  }));

  const departure = $('input[name="departure"]');
  const today = new Date(); today.setMinutes(today.getMinutes()-today.getTimezoneOffset()); if(departure) departure.min=today.toISOString().split('T')[0];

  const form = $('#bookingForm'), error = $('#formError'), success = $('#bookingSuccess');
  form?.addEventListener('submit', async e => {
    e.preventDefault(); error.textContent='';
    if(!form.checkValidity()){ error.textContent='Please complete all required fields and accept the consent checkbox.'; form.reportValidity(); return; }
    const submit = $('.submit-button',form); submit.disabled=true; submit.querySelector('span').textContent='SENDING REQUEST…';
    const data=Object.fromEntries(new FormData(form).entries()); data.createdAt=new Date().toISOString(); data.source='Qatar Executive unofficial concept';
    try{
      if(location.protocol.startsWith('http') && !['localhost','127.0.0.1'].includes(location.hostname)){
        const response=await fetch('https://wsrxscbhuwwhghwrohez.supabase.co/functions/v1/qatar-executive',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
        if(!response.ok) throw new Error('Unable to submit');
      }else{
        const requests=JSON.parse(localStorage.getItem('qe-demo-requests')||'[]'); requests.push(data); localStorage.setItem('qe-demo-requests',JSON.stringify(requests)); await new Promise(r=>setTimeout(r,700));
      }
      form.hidden=true; success.hidden=false; bookingPanel.scrollTo({top:0,behavior:'smooth'});
    }catch(err){ error.textContent='The request could not be sent right now. Please call +974 4022 1700 for urgent assistance.'; }
    finally{ submit.disabled=false; submit.querySelector('span').textContent='SUBMIT FLIGHT REQUEST'; }
  });
})();
