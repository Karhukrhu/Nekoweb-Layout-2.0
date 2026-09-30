  document.addEventListener('DOMContentLoaded', function() {
    const toggles = document.querySelectorAll('.dropdown-toggle');
    const allDropdowns = document.querySelectorAll('.dropdown-content');

    // 1. Handle clicking the toggle buttons (Open/Close)
    toggles.forEach(toggle => {
      toggle.addEventListener('click', function(event) {
        event.preventDefault(); 
        
        const currentDropdown = this.nextElementSibling;
        const isAlreadyOpen = currentDropdown && currentDropdown.classList.contains('open');

        // Close all dropdowns first
        allDropdowns.forEach(dropdown => {
          dropdown.classList.remove('open');
        });

        // If the one you clicked wasn't already open, open it now
        if (currentDropdown && !isAlreadyOpen) {
          currentDropdown.classList.add('open');
        }
      });
    });

    // 2. Handle clicking ANYWHERE ELSE on the page to close the menu
    document.addEventListener('click', function(event) {
      // Check if the click happened INSIDE a dropdown menu
      const isClickInsideMenu = event.target.closest('.dropdown-content');
      
      // Check if the click happened ON a toggle button
      const isClickOnToggle = event.target.closest('.dropdown-toggle');

      // If the click was NEITHER of those, close all dropdowns
      if (!isClickInsideMenu && !isClickOnToggle) {
        allDropdowns.forEach(dropdown => {
          dropdown.classList.remove('open');
        });
      }
    });
  });

    document.addEventListener('DOMContentLoaded', function() {
  
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mainMenuList = document.querySelector('.main-menu-list');

  if (hamburgerBtn && mainMenuList) {
    hamburgerBtn.addEventListener('click', function() {
      // Toggle the 'active' class on the button (for the X animation)
      this.classList.toggle('active');
      
      // Toggle the 'mobile-active' class on the menu (to show/hide it)
      mainMenuList.classList.toggle('mobile-active');

      document.body.classList.toggle('no-scroll'); 
    });
  }

});

document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    // Get all gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    let currentIndex = 0;
    
    // Build an array of objects containing the FULL image and caption
    const images = Array.from(galleryItems).map(item => ({
        fullSrc: item.dataset.full,          // <-- Reads the data-full attribute
        caption: item.dataset.caption || ''
    }));

    // Open lightbox on click
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            openLightbox();
        });
    });

    function openLightbox() {
        lightboxImage.src = images[currentIndex].fullSrc; // <-- Uses the full-size URL
        lightboxCaption.textContent = images[currentIndex].caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        setTimeout(() => { lightboxImage.src = ''; }, 300); // Clear src after animation
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

    // Event listeners
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById('lightbox-overlay');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const standardLinks = document.querySelectorAll('a.lightbox');

    standardLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const img = link.querySelector('img');
            if (img) {
                lightboxImg.src = img.src; 
                lightboxCaption.textContent = img.alt || ''; 
                overlay.classList.add('active');
                document.body.classList.add('no-scroll');
            }
        });
    });
});

// ==========================================
// ADD-ON: Lightbox for standard <a class="lightbox"> images
// (This runs independently and will NOT break your existing .gallery-item logic)
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // 1. Find ONLY <a> tags with class "lightbox"
    const imageLinks = document.querySelectorAll('a.lightbox');
    
    // 2. Find your existing lightbox elements (uses the IDs/classes your working gallery already uses)
    const overlay = document.getElementById('lightbox') || document.getElementById('lightbox-overlay');
    const overlayImg = document.querySelector('.lightbox-image') || document.getElementById('lightbox-img');
    const overlayCaption = document.querySelector('.lightbox-caption') || document.getElementById('lightbox-caption');

    // 3. Add click event to each image link
    imageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Stop the link from navigating
            
            const img = this.querySelector('img');
            if (!img || !overlay) return; // Safety check

            // Feed the image and alt text into your existing lightbox
            if (overlayImg) overlayImg.src = img.src;
            if (overlayCaption) overlayCaption.textContent = img.alt || '';

            // Activate the lightbox using the exact same methods your gallery uses
            overlay.classList.add('active');
            
            // Match whatever your existing script uses to stop scrolling:
            document.body.style.overflow = 'hidden'; 
            // OR if your site uses a class: document.body.classList.add('no-scroll');
        });
    });
});