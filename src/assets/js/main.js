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

  // Collapsible project list logic
  const projectHeaders = document.querySelectorAll('.project-header');
  projectHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const expanded = header.getAttribute('aria-expanded') === 'true';
      header.setAttribute('aria-expanded', !expanded);
      const detailsId = header.getAttribute('aria-controls');
      const details = document.getElementById(detailsId);
      if (details) {
        details.hidden = expanded;
      }
      // Arrow icon toggle
      const arrow = header.querySelector('.project-arrow');
      if (arrow) {
        arrow.innerHTML = expanded ? '&#x25BC;' : '&#x25B2;';
      }
    });
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

