/* ============================================================
   KidzGPT Landing Page — JavaScript
   Scroll reveals, navbar, counters, interactions, video
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // -------- Navbar scroll effect --------
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // -------- Mobile hamburger --------
  const hamburger = document.getElementById('navHamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const spans = hamburger.querySelectorAll('span');
      if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.querySelectorAll('span').forEach(s => {
          s.style.transform = '';
          s.style.opacity = '';
        });
      });
    });
  }

  // -------- Scroll Reveal --------
  const revealEls = document.querySelectorAll(
    '.learning-paths, .experience, .trial-banner-section, .trust-section, .testimonials, .cta-section, ' +
    '.paths-grid, .experience-grid, .trust-stats, .testimonials-track'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Add reveal-children animation
        const staggerEls = entry.target.querySelectorAll('.exp-card, .trust-stat, .path-card, .testimonial-card');
        staggerEls.forEach((el, i) => {
          el.style.transitionDelay = `${i * 0.1}s`;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => {
    // Initial hidden state for staggered children
    const children = el.querySelectorAll('.exp-card, .trust-stat, .path-card, .testimonial-card');
    children.forEach(child => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(20px)';
      child.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });
    observer.observe(el);
  });

  // -------- Section titles reveal --------
  document.querySelectorAll('.section-title-center').forEach(title => {
    title.style.opacity = '0';
    title.style.transform = 'translateY(20px)';
    title.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';

    const titleObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.3 });
    titleObserver.observe(title);
  });

  // -------- Global Course video — auto play on hover --------
  const globalVideo = document.getElementById('globalCourseVideo');
  if (globalVideo) {
    const card = globalVideo.closest('.path-card');
    if (card) {
      card.addEventListener('mouseenter', () => {
        globalVideo.play().catch(() => {});
      });
      card.addEventListener('mouseleave', () => {
        globalVideo.pause();
      });
    }
    // Also autoplay on scroll into view
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          globalVideo.play().catch(() => {});
        } else {
          globalVideo.pause();
        }
      });
    }, { threshold: 0.5 });
    videoObserver.observe(globalVideo);
  }

  // -------- Testimonial carousel --------
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');

  if (track && prevBtn && nextBtn) {
    const cards = track.querySelectorAll('.testimonial-card');
    let currentIndex = 0;

    // On mobile, show one at a time
    const updateMobileCarousel = () => {
      if (window.innerWidth <= 900) {
        cards.forEach((card, i) => {
          card.style.display = i === currentIndex ? 'block' : 'none';
        });
      } else {
        cards.forEach(card => card.style.display = '');
      }
    };

    prevBtn.addEventListener('click', () => {
      currentIndex = currentIndex > 0 ? currentIndex - 1 : cards.length - 1;
      updateMobileCarousel();
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = currentIndex < cards.length - 1 ? currentIndex + 1 : 0;
      updateMobileCarousel();
    });

    updateMobileCarousel();
    window.addEventListener('resize', updateMobileCarousel);
  }

  // -------- Smooth scroll --------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const hash = this.getAttribute('href');
      if (hash === '#') return;
      const target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 16;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // -------- Card tilt (desktop) --------
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.exp-card, .trust-stat').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(500px) rotateX(${y * -6}deg) rotateY(${x * 6}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

});
