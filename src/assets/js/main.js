// Animated Circuit Board Background for Labs Page
function setupMatrixBackground() {
  if (!document.body.classList.contains('labs')) return;
  const canvas = document.getElementById('matrix-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = window.innerWidth;
  let boardHeight = Math.max(window.innerHeight * 3, 3200);
  canvas.width = width;
  canvas.height = boardHeight;

  const staticCanvas = document.createElement('canvas');
  const sctx = staticCanvas.getContext('2d');

  const gridSize = 36;
  let traces = [];
  let chips = [];
  let pulses = [];

  // 8 directions (90-degree and 45-degree PCB routing)
  const dirs = [
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 },
    { dx: 1, dy: 1 },
    { dx: -1, dy: 1 },
    { dx: 1, dy: -1 },
    { dx: -1, dy: -1 }
  ];

  function renderStaticBoard() {
    staticCanvas.width = width;
    staticCanvas.height = boardHeight;

    sctx.fillStyle = '#040906';
    sctx.fillRect(0, 0, width, boardHeight);

    // Draw subtle IC microchip packages
    sctx.strokeStyle = 'rgba(0, 230, 118, 0.22)';
    sctx.fillStyle = '#06110a';
    sctx.lineWidth = 1.2;
    for (const chip of chips) {
      sctx.fillRect(chip.x, chip.y, chip.w, chip.h);
      sctx.strokeRect(chip.x, chip.y, chip.w, chip.h);
      sctx.strokeStyle = 'rgba(0, 230, 118, 0.1)';
      sctx.strokeRect(chip.x + 8, chip.y + 8, chip.w - 16, chip.h - 16);
      sctx.strokeStyle = 'rgba(0, 230, 118, 0.22)';
      for (let py = chip.y + 8; py < chip.y + chip.h - 4; py += 8) {
        sctx.beginPath();
        sctx.moveTo(chip.x - 5, py);
        sctx.lineTo(chip.x, py);
        sctx.moveTo(chip.x + chip.w, py);
        sctx.lineTo(chip.x + chip.w + 5, py);
        sctx.stroke();
      }
    }

    // Draw static copper traces
    sctx.lineCap = 'round';
    sctx.lineJoin = 'round';
    sctx.strokeStyle = 'rgba(22, 101, 52, 0.42)';
    sctx.lineWidth = 1.6;
    for (const trace of traces) {
      const pts = trace.points;
      sctx.beginPath();
      sctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        sctx.lineTo(pts[i].x, pts[i].y);
      }
      sctx.stroke();
    }

    // Draw static via solder pads at start and end of each trace
    for (const trace of traces) {
      const start = trace.points[0];
      const end = trace.points[trace.points.length - 1];
      for (const pt of [start, end]) {
        sctx.beginPath();
        sctx.arc(pt.x, pt.y, 3.2, 0, Math.PI * 2);
        sctx.fillStyle = '#040906';
        sctx.fill();
        sctx.lineWidth = 1.5;
        sctx.strokeStyle = 'rgba(34, 150, 75, 0.55)';
        sctx.stroke();
      }
    }
  }

  function buildCircuit() {
    traces = [];
    chips = [];
    pulses = [];

    boardHeight = Math.max(window.innerHeight * 3, 3200);
    canvas.width = width;
    canvas.height = boardHeight;

    const cols = Math.ceil(width / gridSize);
    const rows = Math.ceil(boardHeight / gridSize);
    const used = new Set();

    // Place a few IC microchip footprints
    const numChips = Math.max(6, Math.floor((cols * rows) / 140));
    for (let c = 0; c < numChips; c++) {
      const cw = (c % 2 === 0) ? 3 : 2;
      const ch = (c % 3 === 0) ? 3 : 2;
      const gx = 2 + Math.floor(Math.random() * Math.max(1, cols - cw - 4));
      const gy = 2 + Math.floor(Math.random() * Math.max(1, rows - ch - 4));
      let overlap = false;
      for (let x = gx - 1; x <= gx + cw; x++) {
        for (let y = gy - 1; y <= gy + ch; y++) {
          if (used.has(`${x},${y}`)) overlap = true;
        }
      }
      if (!overlap) {
        for (let x = gx; x < gx + cw; x++) {
          for (let y = gy; y < gy + ch; y++) {
            used.add(`${x},${y}`);
          }
        }
        chips.push({
          x: gx * gridSize,
          y: gy * gridSize,
          w: cw * gridSize,
          h: ch * gridSize
        });
      }
    }

    // Generate PCB copper traces
    const numTraces = Math.floor((cols * rows) / 7);
    for (let i = 0; i < numTraces; i++) {
      let gx = Math.floor(Math.random() * cols);
      let gy = Math.floor(Math.random() * rows);
      if (used.has(`${gx},${gy}`)) continue;

      const points = [{ x: gx * gridSize, y: gy * gridSize }];
      used.add(`${gx},${gy}`);

      let dir = dirs[Math.floor(Math.random() * dirs.length)];
      const segCount = 3 + Math.floor(Math.random() * 6);

      for (let s = 0; s < segCount; s++) {
        // Prefer continuing in a similar direction or turning 45/90 deg
        if (Math.random() < 0.45) {
          dir = dirs[Math.floor(Math.random() * dirs.length)];
        }
        const nx = gx + dir.dx;
        const ny = gy + dir.dy;
        if (nx < 1 || nx >= cols - 1 || ny < 1 || ny >= rows - 1) break;
        if (used.has(`${nx},${ny}`)) break;

        gx = nx;
        gy = ny;
        used.add(`${gx},${gy}`);
        points.push({ x: gx * gridSize, y: gy * gridSize });
      }

      if (points.length >= 3) {
        // Compute cumulative length for smooth pulse interpolation
        let totalLen = 0;
        const lengths = [0];
        for (let p = 1; p < points.length; p++) {
          const d = Math.hypot(points[p].x - points[p - 1].x, points[p].y - points[p - 1].y);
          totalLen += d;
          lengths.push(totalLen);
        }
        traces.push({ points, lengths, totalLen, endGlow: 0 });
      }
    }

    renderStaticBoard();

    // Spawn initial signal pulses across the full board height
    const maxPulses = Math.min(60, Math.max(18, Math.floor(traces.length / 4)));
    for (let i = 0; i < maxPulses; i++) {
      spawnPulse(true);
    }
  }

  function spawnPulse(randomProgress) {
    if (!traces.length) return;
    const trace = traces[Math.floor(Math.random() * traces.length)];
    pulses.push({
      trace,
      dist: randomProgress ? Math.random() * trace.totalLen : 0,
      speed: 1.4 + Math.random() * 1.6,
      tailLen: 35 + Math.random() * 35
    });
  }

  function getPointAtDist(trace, d) {
    const pts = trace.points;
    const lens = trace.lengths;
    if (d <= 0) return pts[0];
    if (d >= trace.totalLen) return pts[pts.length - 1];
    for (let i = 1; i < lens.length; i++) {
      if (d <= lens[i]) {
        const segLen = lens[i] - lens[i - 1];
        const t = segLen > 0 ? (d - lens[i - 1]) / segLen : 0;
        return {
          x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * t,
          y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * t
        };
      }
    }
    return pts[pts.length - 1];
  }

  function draw() {
    // Blit pre-rendered static circuit board in 1 call
    ctx.drawImage(staticCanvas, 0, 0);

    // Draw glowing end via pads when hit by a pulse
    for (const trace of traces) {
      if (trace.endGlow > 0.02) {
        const end = trace.points[trace.points.length - 1];
        ctx.beginPath();
        ctx.arc(end.x, end.y, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 65, ${trace.endGlow})`;
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = `rgba(105, 240, 174, ${0.6 + trace.endGlow * 0.4})`;
        ctx.stroke();
        trace.endGlow = Math.max(0, trace.endGlow - 0.03);
      }
    }

    // Update and draw live data pulses along traces
    for (let i = 0; i < pulses.length; i++) {
      const p = pulses[i];
      p.dist += p.speed;

      // Draw glowing comet tail in small steps
      const steps = 10;
      for (let s = 0; s < steps; s++) {
        const d1 = p.dist - (s / steps) * p.tailLen;
        const d2 = p.dist - ((s + 1) / steps) * p.tailLen;
        if (d1 <= 0) continue;
        const pt1 = getPointAtDist(p.trace, Math.min(p.trace.totalLen, Math.max(0, d1)));
        const pt2 = getPointAtDist(p.trace, Math.min(p.trace.totalLen, Math.max(0, d2)));
        const alpha = (1 - s / steps) * 0.85;
        ctx.beginPath();
        ctx.moveTo(pt1.x, pt1.y);
        ctx.lineTo(pt2.x, pt2.y);
        ctx.strokeStyle = `rgba(0, 255, 65, ${alpha})`;
        ctx.lineWidth = 2.4;
        ctx.stroke();
      }

      // Draw bright pulse head
      if (p.dist <= p.trace.totalLen) {
        const head = getPointAtDist(p.trace, p.dist);
        ctx.beginPath();
        ctx.arc(head.x, head.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = '#b9f6ca';
        ctx.fill();
      }

      // Trigger end via glow when pulse arrives
      if (p.dist >= p.trace.totalLen && p.dist - p.speed < p.trace.totalLen) {
        p.trace.endGlow = 1;
      }

      // Respawn when tail finishes
      if (p.dist - p.tailLen > p.trace.totalLen) {
        pulses.splice(i, 1);
        i--;
        spawnPulse(false);
      }
    }

    requestAnimationFrame(draw);
  }

  function resize() {
    const newWidth = window.innerWidth;
    if (newWidth !== width) {
      width = newWidth;
      buildCircuit();
    }
  }

  window.addEventListener('resize', resize);
  buildCircuit();
  requestAnimationFrame(draw);
}

document.addEventListener('DOMContentLoaded', function() {
  setupMatrixBackground();
});
// Tabbed Interface Logic for Specializations Page
function setupTabs() {
  // Check if we are on a page with tabs
  const tabsContainer = document.querySelector('.tabs-container');
  if (!tabsContainer) return;

  window.openTab = function (evt, tabName) {
    var i, tabContent, tabLinks;
    console.log('openTab called for:', tabName);
    // Get all elements with class="tab-panel" and hide them
    tabContent = document.getElementsByClassName("tab-panel");
    for (i = 0; i < tabContent.length; i++) {
      tabContent[i].style.display = "none";
      tabContent[i].classList.remove("active");
      console.log('Hiding panel:', tabContent[i].id);
    }
    // Get all elements with class="tab-btn" and remove the class "active"
    tabLinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tabLinks.length; i++) {
      tabLinks[i].className = tabLinks[i].className.replace(" active", "");
      tabLinks[i].setAttribute("aria-selected", "false");
    }
    // Show the current tab, and add an "active" class to the button that opened the tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
      selectedTab.style.display = "block";
      console.log('Showing panel:', tabName);
      // Small delay to allow display:block to apply before adding opacity class for fade effect
      setTimeout(() => {
        selectedTab.classList.add("active");
      }, 10);
    } else {
      console.warn('Panel not found:', tabName);
    }
    if (evt && evt.currentTarget) {
      evt.currentTarget.className += " active";
      evt.currentTarget.setAttribute("aria-selected", "true");
    }
  };
}

// Run on DOMContentLoaded (after other DOMContentLoaded logic)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupTabs);
} else {
  setupTabs();
}
// Speaker Gallery mobile orientation fix
const presentationPosts = document.querySelectorAll('.presentation-post');
presentationPosts.forEach(post => {
  let originalFlex = 'row';
  if (post.getAttribute('style')) {
    const style = post.getAttribute('style');
    const match = style.match(/flex-direction:\s*(row-reverse|row)/);
    if (match) {
      originalFlex = match[1];
    }
  }
  post.dataset.originalFlex = originalFlex;
});

function updateSpeakerGalleryOrientation() {
  if (window.innerWidth < 900) {
    presentationPosts.forEach(post => {
      post.style.flexDirection = 'column';
      post.style.alignItems = 'flex-start';
      post.style.justifyContent = 'flex-start';
      post.style.gap = '1.5rem';
      // Center image in mobile view
      const img = post.querySelector('img');
      if (img) {
        img.style.display = 'block';
        img.style.marginLeft = 'auto';
        img.style.marginRight = 'auto';
      }
    });
  } else {
    presentationPosts.forEach(post => {
      post.style.flexDirection = post.dataset.originalFlex || 'row';
      post.style.alignItems = '';
      post.style.justifyContent = '';
      post.style.gap = '';
      // Restore image margin for desktop
      const img = post.querySelector('img');
      if (img) {
        img.style.display = '';
        img.style.marginLeft = '';
        img.style.marginRight = '';
      }
    });
  }
}
window.addEventListener('resize', updateSpeakerGalleryOrientation);
updateSpeakerGalleryOrientation();
document.addEventListener("DOMContentLoaded", () => {
  console.log("Personal site loaded");

  // Dock Navigation & Mobile Menu Active State
  const dockItems = document.querySelectorAll('.dock-item');
  const mobileLinks = document.querySelectorAll('.mobile-menu-panel .nav-link');
  const currentPath = window.location.pathname;

  function setActive(items) {
    items.forEach(item => {
      const itemPage = item.getAttribute('data-page') ||
        (item.classList.contains('nav-profile') ? 'profile' :
          item.classList.contains('nav-specializations') ? 'specializations' :
            item.classList.contains('nav-speaker') ? 'speaker-gallery' :
              item.classList.contains('nav-labs') ? 'labs' :
                item.classList.contains('nav-blog') ? 'blog' :
                  item.classList.contains('nav-contact') ? 'contact' : '');

      if (currentPath.includes(`/${itemPage}/`) ||
        (currentPath === '/' && itemPage === 'home')) {
        item.classList.add('active');
      }
    });
  }

  setActive(dockItems);
  setActive(mobileLinks);

  // Sticky sidebar scroll highlighting
  const sidebarLinks = document.querySelectorAll(".sidebar-link");
  const sections = document.querySelectorAll(".profile-section, .specializations-section");

  function updateActiveLink() {
    // Get scroll position
    let scrollPosition = window.scrollY + 150;

    // Remove active class from all links
    sidebarLinks.forEach(link => link.classList.remove("active"));

    // Find which section is currently in view
    for (let section of sections) {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        // Find the corresponding link and activate it
        const sectionId = section.id;
        const activeLink = document.querySelector(`.sidebar-link[data-section="${sectionId}"]`);
        if (activeLink) {
          activeLink.classList.add("active");
        }
        break;
      }
    }
  }

  // Handle sidebar link clicks
  sidebarLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const sectionId = link.getAttribute("data-section");
      const section = document.getElementById(sectionId);
      if (section) {
        // Smooth scroll to section
        section.scrollIntoView({ behavior: "smooth" });
        // Update active link after a brief delay
        setTimeout(updateActiveLink, 100);
      }
    });
  });

  // Update active link on scroll
  window.addEventListener("scroll", updateActiveLink);

  // Initial check on page load
  updateActiveLink();

  // Detailed Drawer Logic (Row Expansion)
  const projectGrid = document.getElementById('projects-grid');
  const detailsDrawer = document.getElementById('details-drawer');
  const drawerContent = document.getElementById('drawer-content');
  const drawerCloseBtn = document.querySelector('.drawer-close');
  const projectCards = Array.from(document.querySelectorAll('.project-card'));
  const toggles = document.querySelectorAll('.project-toggle');

  let currentActiveCard = null;

  // Helper to find the last card in the same row as the reference card
  function findRowEndCard(referenceCard) {
    const refTop = referenceCard.offsetTop;
    // Tolerance for sub-pixel rendering differences
    const tolerance = 10;

    // Start searching from the reference card index
    const refIndex = projectCards.indexOf(referenceCard);

    for (let i = refIndex + 1; i < projectCards.length; i++) {
      const card = projectCards[i];
      // If this card is significantly lower, the previous card was the last in the row
      if (card.offsetTop > refTop + tolerance) {
        return projectCards[i - 1];
      }
    }

    // If we reach here, the reference card is in the last row, so the very last card is the end
    return projectCards[projectCards.length - 1];
  }

  function openDrawer(card) {
    if (!detailsDrawer) return;

    // 1. Get content
    const cardId = card.getAttribute('data-id');
    const source = document.getElementById(`source-${cardId}`);

    if (source) {
      drawerContent.innerHTML = source.innerHTML;
      // If there is a video, wait for it to load metadata and then adjust maxHeight
      const video = drawerContent.querySelector('video');
      if (video) {
        video.addEventListener('loadedmetadata', function() {
          detailsDrawer.style.maxHeight = detailsDrawer.scrollHeight + 'px';
        });
        // In case the video is cached and loaded instantly
        if (video.readyState >= 1) {
          detailsDrawer.style.maxHeight = detailsDrawer.scrollHeight + 'px';
        }
      }

      // Initialize any carousel inside the drawer
      initDrawerCarousels(drawerContent);
    }

    // 2. Position the drawer
    const rowEndCard = findRowEndCard(card);

    // Move drawer in DOM after the row-end card
    // Check if it's already there to avoid unnecessary moves
    if (detailsDrawer.previousElementSibling !== rowEndCard) {
      rowEndCard.parentNode.insertBefore(detailsDrawer, rowEndCard.nextSibling);
    }

    // 3. Highlight active card
    if (currentActiveCard) {
      currentActiveCard.classList.remove('active-card');
      const oldToggle = currentActiveCard.querySelector('.project-toggle');
      if (oldToggle) {
        oldToggle.setAttribute('aria-expanded', 'false');
        const label = oldToggle.querySelector('.btn-text') || oldToggle.querySelector('span');
        if (label) label.textContent = 'View Details';
      }
    }
    card.classList.add('active-card');
    currentActiveCard = card;

    const newToggle = card.querySelector('.project-toggle');
    if (newToggle) {
      newToggle.setAttribute('aria-expanded', 'true');
      const label = newToggle.querySelector('.btn-text') || newToggle.querySelector('span');
      if (label) label.textContent = 'Close Details';
    }

      // Show ribbon only on active card
      document.querySelectorAll('.card-ribbon').forEach(ribbon => {
        ribbon.style.display = 'none';
      });
      const ribbon = card.querySelector('.card-ribbon');
      if (ribbon) ribbon.style.display = 'flex';
    // 4. Show drawer
    detailsDrawer.removeAttribute('aria-hidden');
    detailsDrawer.classList.add('open');
    // Set a very large maxHeight to ensure full expansion for any content
    detailsDrawer.style.maxHeight = '5000px';

    // Scroll into view if needed (centering the card and drawer)
    setTimeout(() => {
      // Offset for sticky header (approx 80-100px) + some breathing room
      const offset = card.offsetTop - 110;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }, 150);
  }

  function closeDrawer() {
    if (!detailsDrawer) return;

    detailsDrawer.classList.remove('open');
    detailsDrawer.style.maxHeight = null;
    detailsDrawer.setAttribute('aria-hidden', 'true');

    // Clean up active carousels
    stopDrawerCarousels();

    if (currentActiveCard) {
      currentActiveCard.classList.remove('active-card');
      const toggle = currentActiveCard.querySelector('.project-toggle');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        const label = toggle.querySelector('.btn-text') || toggle.querySelector('span');
        if (label) label.textContent = 'View Details';
      }
      currentActiveCard = null;
    }

      // Hide all ribbons
      document.querySelectorAll('.card-ribbon').forEach(ribbon => {
        ribbon.style.display = 'none';
      });
  }

  let activeCarouselIntervals = [];

  function stopDrawerCarousels() {
    activeCarouselIntervals.forEach(id => clearInterval(id));
    activeCarouselIntervals = [];
  }

  function initDrawerCarousels(container) {
    stopDrawerCarousels();
    const carousels = container.querySelectorAll('.lab-carousel');
    carousels.forEach(carousel => {
      const slides = Array.from(carousel.querySelectorAll('.lab-carousel-slide'));
      const dots = Array.from(carousel.querySelectorAll('.lab-carousel-dot'));
      const counter = carousel.querySelector('.lab-carousel-counter');
      const prevBtn = carousel.querySelector('.lab-carousel-btn.prev');
      const nextBtn = carousel.querySelector('.lab-carousel-btn.next');

      if (!slides.length) return;

      let currentIndex = 0;
      let intervalId = null;

      function update(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        currentIndex = index;

        slides.forEach((slide, i) => {
          slide.classList.toggle('active', i === currentIndex);
        });
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === currentIndex);
        });
        if (counter) {
          counter.textContent = `${currentIndex + 1} / ${slides.length}`;
        }
      }

      function startTimer() {
        stopTimer();
        intervalId = setInterval(() => {
          update(currentIndex + 1);
        }, 5000);
        activeCarouselIntervals.push(intervalId);
      }

      function stopTimer() {
        if (intervalId) {
          clearInterval(intervalId);
          activeCarouselIntervals = activeCarouselIntervals.filter(id => id !== intervalId);
          intervalId = null;
        }
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          update(currentIndex - 1);
          startTimer();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          update(currentIndex + 1);
          startTimer();
        });
      }

      dots.forEach((dot, idx) => {
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          update(idx);
          startTimer();
        });
      });

      carousel.addEventListener('mouseenter', stopTimer);
      carousel.addEventListener('mouseleave', startTimer);

      update(0);
      startTimer();
    });
  }

  // Event Listeners: Clicking anywhere on a card toggles the panel
  projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      e.preventDefault();

      // If clicking the already open card, close it
      if (currentActiveCard === card) {
        closeDrawer();
      } else {
        openDrawer(card);
      }
    });
  });

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeDrawer);
  }

  // High-Res Image Lightbox for Expanded Drawer Images
  const lightbox = document.getElementById('lab-lightbox');
  const lightboxImg = document.getElementById('lab-lightbox-img');
  const lightboxCaption = document.getElementById('lab-lightbox-caption');
  const lightboxCounter = document.getElementById('lab-lightbox-counter');
  const lightboxClose = document.getElementById('lab-lightbox-close');
  const lightboxPrev = document.getElementById('lab-lightbox-prev');
  const lightboxNext = document.getElementById('lab-lightbox-next');

  let lightboxImages = [];
  let lightboxIndex = 0;

  function renderLightboxSlide(index) {
    if (!lightboxImages.length || !lightboxImg) return;
    if (index < 0) index = lightboxImages.length - 1;
    if (index >= lightboxImages.length) index = 0;
    lightboxIndex = index;

    const targetImg = lightboxImages[lightboxIndex];
    lightboxImg.src = targetImg.src;
    lightboxImg.alt = targetImg.alt || '';
    if (lightboxCaption) {
      lightboxCaption.textContent = targetImg.alt || '';
    }

    const hasMultiple = lightboxImages.length > 1;
    if (lightboxPrev) lightboxPrev.hidden = !hasMultiple;
    if (lightboxNext) lightboxNext.hidden = !hasMultiple;
    if (lightboxCounter) {
      lightboxCounter.hidden = !hasMultiple;
      lightboxCounter.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
    }
  }

  function openLightbox(clickedImg) {
    if (!lightbox || !lightboxImg) return;
    const carousel = clickedImg.closest('.lab-carousel');
    if (carousel) {
      lightboxImages = Array.from(carousel.querySelectorAll('.lab-carousel-slide img'));
    } else if (drawerContent) {
      lightboxImages = Array.from(drawerContent.querySelectorAll('img'));
    } else {
      lightboxImages = [clickedImg];
    }

    const startIdx = Math.max(0, lightboxImages.indexOf(clickedImg));
    renderLightboxSlide(startIdx);

    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (drawerContent) {
    drawerContent.addEventListener('click', (e) => {
      const clickedImg = e.target.closest('img');
      if (!clickedImg) return;
      e.stopPropagation();
      openLightbox(clickedImg);
    });
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      renderLightboxSlide(lightboxIndex - 1);
    });
  }
  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      renderLightboxSlide(lightboxIndex + 1);
    });
  }
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lab-lightbox-stage')) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft' && lightboxImages.length > 1) {
      renderLightboxSlide(lightboxIndex - 1);
    } else if (e.key === 'ArrowRight' && lightboxImages.length > 1) {
      renderLightboxSlide(lightboxIndex + 1);
    }
  });

  // Handle Resize: Drawer might need to move if row layout changes
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (currentActiveCard && detailsDrawer.classList.contains('open')) {
        // Re-calculate position
        const rowEndCard = findRowEndCard(currentActiveCard);
        if (detailsDrawer.previousElementSibling !== rowEndCard) {
          // Move styling to hide jump?
          detailsDrawer.style.transition = 'none';
          rowEndCard.parentNode.insertBefore(detailsDrawer, rowEndCard.nextSibling);
          // Force reflow
          void detailsDrawer.offsetHeight;
          detailsDrawer.style.transition = '';
        }
        // Re-adjust height if content wrapped
        detailsDrawer.style.maxHeight = "none";
        const newHeight = detailsDrawer.scrollHeight;
        detailsDrawer.style.maxHeight = newHeight + "px";
      }
    }, 200);
  });

  // Mobile menu logic
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !expanded);
      if (!expanded) {
        mobileMenu.removeAttribute('hidden');
        mobileMenu.setAttribute('aria-expanded', 'true');
      } else {
        mobileMenu.setAttribute('hidden', '');
        mobileMenu.setAttribute('aria-expanded', 'false');
      }
    });
    // Optional: close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        mobileMenu.setAttribute('hidden', '');
        mobileMenu.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
});

let currentDisplayedQuote = '';

function showQuote(quote) {
  const quoteText = document.getElementById('quote-text');
  if (!quoteText) return;

  const quoteToDisplay = (quote && quote !== 'No quote found.') ? quote : null;

  // If no quote and no fallback is displayed yet, show fallback
  if (!quoteToDisplay && !currentDisplayedQuote) {
    const fallbackQuote = "Leadership is not about being in charge. It is about taking care of those in your charge.";
    const fallbackAuthor = "Simon Sinek";
    quoteText.innerHTML = '“' + fallbackQuote + '”' +
      '<span class="quote-credit"> — <span>' + fallbackAuthor + '</span></span>';
    quoteText.classList.add('loaded');
    currentDisplayedQuote = fallbackQuote;
    return;
  }

  // If quote hasn't changed, don't re-inject
  if (quoteToDisplay === currentDisplayedQuote) return;

  if (quoteToDisplay) {
    quoteText.innerHTML = '“' + quoteToDisplay + '”' +
      '<span class="quote-credit"> — <span>JQDb.org</span></span>';
    quoteText.classList.add('loaded');
    currentDisplayedQuote = quoteToDisplay;
  }
}

function fetchLeadershipQuote() {
  const cached = localStorage.getItem('leadershipQuote');

  if (cached) {
    showQuote(cached);
  }

  fetch('https://quote.sorob-bhatia.workers.dev/')
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.text();
    })
    .then(text => {
      const trimmedText = text?.trim();
      if (trimmedText && trimmedText.length > 0) {
        showQuote(trimmedText);
        localStorage.setItem('leadershipQuote', trimmedText);
      } else {
        throw new Error('Empty response');
      }
    })
    .catch(() => {
      if (!currentDisplayedQuote) {
        showQuote(null); // Triggers fallback
      }
    });
}

document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('leadership-quote')) {
    fetchLeadershipQuote();
  }
});

