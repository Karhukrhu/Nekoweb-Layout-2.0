    document.addEventListener('DOMContentLoaded', function() {
      const backToTopBtn = document.getElementById('back-to-top');

      // Show/hide button on scroll
      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
          backToTopBtn.classList.add('show');
        } else {
          backToTopBtn.classList.remove('show');
        }
      });

      // Smooth scroll to top when clicked
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    });