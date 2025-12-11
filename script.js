(() => {
  // Ensure DOM is loaded when executing UI behavior
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('canvas-container');

    // Ensure background container visible (in case any previous code hid it)
    if (container) {
      container.style.display = 'block';
      // remove any leftover canvas elements (if old Three.js left one)
      const leftover = container.querySelector('canvas');
      if (leftover) leftover.remove();
    }

    // ---------------------------
    // Status badge interaction
    // ---------------------------
    const statusBadge = document.getElementById('status-badge');
    if (statusBadge) {
      statusBadge.addEventListener('click', () => {
        // toggle aria-pressed and a visual pressed state
        const pressed = statusBadge.getAttribute('aria-pressed') === 'true';
        statusBadge.setAttribute('aria-pressed', String(!pressed));
        // small visual feedback
        statusBadge.animate([
          { transform: 'translateY(0)' },
          { transform: 'translateY(-4px)' },
          { transform: 'translateY(0)' }
        ], { duration: 300, easing: 'ease-out' });
      });
    }

    // ---------------------------
    // Reveal services with IntersectionObserver
    // ---------------------------
    const servicesGrid = document.getElementById('services-grid');
    if (servicesGrid) {
      // if JS disabled or observer unsupported, immediately reveal
      if (!('IntersectionObserver' in window)) {
        servicesGrid.classList.add('revealed');
      } else {
        const io = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // add class to trigger CSS animation
              servicesGrid.classList.add('revealed');

              // optionally stagger child transitions (small JS delay)
              const children = Array.from(servicesGrid.querySelectorAll('.service'));
              children.forEach((el, i) => {
                el.style.transitionDelay = `${i * 80}ms`;
              });

              // stop observing once revealed
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.18 });

        io.observe(servicesGrid);
      }
    }

    // ---------------------------
    // Tiny subtle parallax on mousemove for the background (non-intrusive)
    // disabled on touch devices
    // ---------------------------
    const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    if (!isTouch && container) {
      let lastX = 0, lastY = 0, raf = null;
      const strength = 12; // lower = subtler
      window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * strength;
        const y = (e.clientY / window.innerHeight - 0.5) * strength;
        lastX = x; lastY = y;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          container.style.transform = `translate3d(${lastX}px, ${lastY}px, 0) scale(1.02)`;
        });
      });

      // reset on leave
      window.addEventListener('mouseleave', () => {
        container.style.transform = '';
      });
    }

  }); // DOMContentLoaded
})();
