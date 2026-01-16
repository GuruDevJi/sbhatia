document.addEventListener("DOMContentLoaded", () => {
  console.log("Personal site loaded");

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
});

