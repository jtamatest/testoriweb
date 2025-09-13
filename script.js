window.addEventListener("DOMContentLoaded", () => {
  const texts = document.querySelectorAll(".video-content");
  const bar = document.querySelector(".barline");

  texts.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add("show");
      // ถ้าเป็น element สุดท้าย → รอจนโชว์เสร็จแล้วค่อยโชว์แถบ
      if (i === texts.length - 1) {
        setTimeout(() => {
          bar.classList.add("animate");
        }, 500); // รอ 0.5s หลังข้อความขึ้นเต็ม
      }
    }, i * 400); // หน่วงแต่ละตัว 0.4s ให้ขึ้นต่อเนื่อง
  });
});

  setTimeout(() => {
      document.querySelector(".barline")?.classList.add("animate");
    }, 1300); // เริ่มหลังเฟดจบ (1s + 0.3s delay)


document.addEventListener('DOMContentLoaded', () => {
  /* ===== Shrink header on scroll (desktop / mobile) ===== */
  const header = document.getElementById('mainHeader');
  if (!header) return; // กัน error ถ้าไม่พบหัว

  const headerOverlay = header.querySelector('.overlay');
  const root = document.documentElement;

  // media query ไว้รู้ว่าอยู่โหมด desktop เมื่อไหร่
  const mqDesktop = window.matchMedia('(min-width:1024px)');

  // เก็บ config ตามโหมด
  let maxHeight = 120;
  let minHeight = 76;
  let scrollRange = 80;
  let swapAt = 20;

  function applyDims(isDesktop) {
    maxHeight   = isDesktop ? 120 : 60;
    minHeight   = isDesktop ? 76  : 44;
    scrollRange = isDesktop ? 80  : 50;
    swapAt      = 20;
  }

  function setHeaderVar(px) {
    root.style.setProperty('--header-h', px + 'px');
  }

  // คำนวณ + เพ้นท์ตามสภาพล่าสุด
  function updateDimsAndPaint() {
    applyDims(mqDesktop.matches);
    setHeaderVar(maxHeight);   // ให้เริ่มต้นด้วยความสูงใหญ่สุด
    onScroll();                // วาดเฟรมแรกให้ตรงกับตำแหน่ง scroll ปัจจุบัน
  }

  let ticking = false;
  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    const clamped = Math.min(Math.max(y, 0), scrollRange);

    // ไล่ระดับความสูงตามสัดส่วนการเลื่อน
    const h = maxHeight - (clamped / scrollRange) * (maxHeight - minHeight);
    setHeaderVar(h);

    // ทำ overlay ค่อย ๆ ชัด
    if (headerOverlay) {
      const progress = clamped / scrollRange; // 0..1
      headerOverlay.style.opacity = progress.toFixed(3);
    }

    // toggle สลับโลโก้/ตัวหนังสือ
    document.body.classList.toggle('swap', y > swapAt);

    ticking = false;
  }

  // เริ่มทำงาน
  updateDimsAndPaint();

  // scroll: ใช้ rAF กัน jank
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  // เปลี่ยนขนาดหน้าต่างหรือหมุนจอ → อัปเดต config + เพ้นท์ใหม่
  window.addEventListener('resize', updateDimsAndPaint);
  // ข้าม breakpoint desktop/mobile → อัปเดตทันที
  mqDesktop.addEventListener?.('change', updateDimsAndPaint);

  /* ===== Mobile drawer (hamburger) ===== */
  const hamburger = document.querySelector('.hamburger');
  const menuOverlay = document.getElementById('menuOverlay');

  const isOpen = () => document.body.classList.contains('menu-open');
  const openMenu = () => {
    document.body.classList.add('menu-open', 'noscroll');
    hamburger?.classList.add('active');
    hamburger?.setAttribute('aria-expanded', 'true');
    menuOverlay?.setAttribute('aria-hidden', 'false');
  };
  const closeMenu = () => {
    document.body.classList.remove('menu-open', 'noscroll');
    hamburger?.classList.remove('active');
    hamburger?.setAttribute('aria-expanded', 'false');
    menuOverlay?.setAttribute('aria-hidden', 'true');
  };

  if (hamburger && menuOverlay) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      isOpen() ? closeMenu() : openMenu();
    });

    // คลิกฉากมืดเพื่อปิด
    menuOverlay.addEventListener('click', (e) => {
      if (e.target === menuOverlay) closeMenu();
    });

    // กด Esc เพื่อปิด
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) closeMenu();
    });

    // คลิกลิงก์ในเมนูปิดออก
    menuOverlay.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMenu);
    });
  }

  /* ===== Auto-resume video on tab return ===== */
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      const v = document.querySelector('.video-bg');
      v?.play?.().catch(() => {});
    }
  });
});


/* ****** Picture load ******/
(() => {
  const grid = document.getElementById('memory');
  const lb   = document.getElementById('lightbox');
  const img  = document.getElementById('lbImg');
  const prev = document.getElementById('lbPrev');
  const next = document.getElementById('lbNext');
  const close= document.getElementById('lbClose');

  const items = Array.from(grid.querySelectorAll('.tile img'));
  let i = -1;

  function open(k){
    i = k;
    img.src = items[i].dataset.full || items[i].src;
    img.alt = items[i].alt || '';
    lb.classList.add('open');
    lb.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function hide(){
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    setTimeout(()=> img.src='', 150);
  }
  function go(n){ open((i + n + items.length) % items.length); }

  items.forEach((el,idx)=> el.addEventListener('click', ()=> open(idx)));
  prev.addEventListener('click', e=>{ e.stopPropagation(); go(-1); });
  next.addEventListener('click', e=>{ e.stopPropagation(); go(1);  });
  close.addEventListener('click', hide);
  lb.addEventListener('click', e=>{ if(e.target === lb) hide(); });

  window.addEventListener('keydown', e=>{
    if(!lb.classList.contains('open')) return;
    if(e.key === 'Escape') hide();
    if(e.key === 'ArrowLeft')  go(-1);
    if(e.key === 'ArrowRight') go(1);
  });
})();

  document.querySelectorAll('.memory img').forEach(img => {
    img.setAttribute('loading', 'lazy');
    img.setAttribute('decoding', 'async');
  });