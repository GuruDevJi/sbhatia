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
              item.classList.contains('nav-projects') ? 'projects' :
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
        oldToggle.querySelector('span').textContent = 'View Details';
      }
    }
    card.classList.add('active-card');
    currentActiveCard = card;

    const newToggle = card.querySelector('.project-toggle');
    if (newToggle) {
      newToggle.setAttribute('aria-expanded', 'true');
      newToggle.querySelector('span').textContent = 'Close Details';
    }

    // 4. Show drawer
    detailsDrawer.removeAttribute('aria-hidden');
    detailsDrawer.classList.add('open');
    detailsDrawer.style.maxHeight = detailsDrawer.scrollHeight + "px";

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

    if (currentActiveCard) {
      currentActiveCard.classList.remove('active-card');
      const toggle = currentActiveCard.querySelector('.project-toggle');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.querySelector('span').textContent = 'View Details';
      }
      currentActiveCard = null;
    }
  }

  // Event Listeners
  toggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const card = toggle.closest('.project-card');

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

