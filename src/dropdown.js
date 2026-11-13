// ==========================================
// 1. DROPDOWN MENUS
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
  const toggles = document.querySelectorAll('.dropdown-toggle');
  const allDropdowns = document.querySelectorAll('.dropdown-content');

  toggles.forEach(toggle => {
    toggle.addEventListener('click', function(event) {
      event.preventDefault(); 
      const currentDropdown = this.nextElementSibling;
      const isAlreadyOpen = currentDropdown && currentDropdown.classList.contains('open');

      allDropdowns.forEach(dropdown => dropdown.classList.remove('open'));

      if (currentDropdown && !isAlreadyOpen) {
        currentDropdown.classList.add('open');
      }
    });
  });

  document.addEventListener('click', function(event) {
    const isClickInsideMenu = event.target.closest('.dropdown-content');
    const isClickOnToggle = event.target.closest('.dropdown-toggle');

    if (!isClickInsideMenu && !isClickOnToggle) {
      allDropdowns.forEach(dropdown => dropdown.classList.remove('open'));
    }
  });
});

// ==========================================
// 2. HAMBURGER MENU
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mainMenuList = document.querySelector('.main-menu-list');

  if (hamburgerBtn && mainMenuList) {
    hamburgerBtn.addEventListener('click', function() {
      this.classList.toggle('active');
      mainMenuList.classList.toggle('mobile-active');
      document.body.classList.toggle('no-scroll'); 
    });
  }
});

// ==========================================
// 3. LIGHTBOX (Gallery Items)
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.querySelector('.lightbox-image');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');
  
  const galleryItems = document.querySelectorAll('.gallery-item');
  let currentIndex = 0;
  
  const images = Array.from(galleryItems).map(item => ({
    fullSrc: item.dataset.full,
    caption: item.dataset.caption || ''
  }));

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      currentIndex = index;
      openLightbox();
    });
  });

  function openLightbox() {
    lightboxImage.src = images[currentIndex].fullSrc;
    lightboxCaption.textContent = images[currentIndex].caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImage.src = ''; }, 300);
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImage.src = images[currentIndex].fullSrc;
    lightboxCaption.textContent = images[currentIndex].caption;
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImage.src = images[currentIndex].fullSrc;
    lightboxCaption.textContent = images[currentIndex].caption;
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
});

// ==========================================
// 4. LIGHTBOX (Standard Links)
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
  const imageLinks = document.querySelectorAll('a.lightbox');
  const overlay = document.getElementById('lightbox') || document.getElementById('lightbox-overlay');
  const overlayImg = document.querySelector('.lightbox-image') || document.getElementById('lightbox-img');
  const overlayCaption = document.querySelector('.lightbox-caption') || document.getElementById('lightbox-caption');

  imageLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const img = this.querySelector('img');
      if (!img || !overlay) return;

      if (overlayImg) overlayImg.src = img.src;
      if (overlayCaption) overlayCaption.textContent = img.alt || '';

      overlay.classList.add('active');
      document.body.style.overflow = 'hidden'; 
    });
  });
});

// ==========================================
// 5. CURSOR-FOLLOWING TOOLTIPS
// ==========================================
document.addEventListener('mousemove', (e) => {
  const target = e.target.closest('.post-warning, .clique');
  if (target) {
    target.style.setProperty('--mouse-x', e.clientX + 'px');
    target.style.setProperty('--mouse-y', e.clientY + 'px');
  }
});

// ==========================================
// 6. CONTENT WARNING MODAL (Upgraded & Unified)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('custom-warning-modal');
  const messageEl = document.getElementById('modal-warning-message');
  const proceedBtn = document.getElementById('modal-proceed-btn');
  const cancelBtn = document.getElementById('modal-cancel-btn');
  const homeBtn = document.getElementById('modal-home-btn'); // NEW

  // --- HELPER: Formats the comma-separated tags beautifully ---
  function formatWarning(rawWarning, footerNote) {
    const tags = rawWarning.split(',').map(tag => `<strong>${tag.trim()}</strong>`).filter(tag => tag !== '<strong></strong>');
    let formattedMessage = '<p class="sml">This post contains: ';
    
    if (tags.length === 1) {
      formattedMessage += tags[0];
    } else if (tags.length === 2) {
      formattedMessage += `${tags[0]} and ${tags[1]}`;
    } else {
      const lastTag = tags.pop();
      formattedMessage += tags.join(", ") + ", and " + lastTag;
    }
    formattedMessage += '.</p><p class="sml">The post might be for adults only.</p>';
    
    if (footerNote) {
      formattedMessage += `<p class="sml">${footerNote}</p>`;
    }
    return formattedMessage;
  }

  // --- HELPER: Shows the modal ---
  function showModal(message, pendingUrl = '') {
    if (!modal || !messageEl) return;
    messageEl.innerHTML = message;
    modal.dataset.pendingUrl = pendingUrl; 
    modal.style.display = 'flex';
    modal.style.opacity = '1';
    modal.style.visibility = 'visible';
    modal.classList.add('active');
  }

  // 1. Handle "Take Me Home" Button (NEW)
  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      window.location.href = '/'; // Change to '/blog/' if your homepage is there
    });
  }

  // 2. Handle "Proceed" Button
  if (proceedBtn && modal) {
    proceedBtn.addEventListener('click', () => {
      if (modal.dataset.pendingUrl) {
        // Navigating from a link click
        window.location.href = modal.dataset.pendingUrl;
      } else {
        // Already on the post page, just close the modal
        modal.style.display = 'none';
        modal.classList.remove('active');
      }
    });
  }

  // 3. Handle "Cancel" Button & Clicking the Dark Background
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal || e.target.id === 'modal-cancel-btn') {
        modal.style.display = 'none';
        modal.classList.remove('active');
        modal.dataset.pendingUrl = '';
      }
    });
  }

  // 4. Event Delegation: Listen for clicks on links (Blog List / Archive pages)
  document.addEventListener('click', function(e) {
    const link = e.target.closest('.post-title[data-warning]');
    if (link && modal && messageEl) {
      e.preventDefault();
      e.stopPropagation();
      
      const rawWarning = link.getAttribute('data-warning');
      const footerNote = link.getAttribute('data-warning-note');
      showModal(formatWarning(rawWarning, footerNote), link.href);
    }
  });

  // 5. NEW: Auto-trigger on the actual Post Page if it has a warning
  const pageWarningData = document.getElementById('page-warning-data');
  if (pageWarningData) {
    const rawWarning = pageWarningData.getAttribute('data-warning');
    const footerNote = pageWarningData.getAttribute('data-note');
    showModal(formatWarning(rawWarning, footerNote), ''); 
  }
});