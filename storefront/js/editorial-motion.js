/**
 * LADHA — Automatic Editorial Motion Controller (Jakob's Law UX Standards)
 * - Automatic Hover-to-Play Video Previews (Hero & Products)
 * - Auto-Advancing Lookbook Carousel (Smooth 4s interval, pause on hover/touch)
 * - Global Viewport IntersectionObserver to auto-play background motion loops
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initHoverVideoPreviews();
    initAutoLookbookSlider();
    initVideoViewportObserver();
  });

  /* --------------------------------------------------------------------------
     1. Automatic Hover-to-Play Video Previews (Standard E-Commerce UX)
     -------------------------------------------------------------------------- */
  function initHoverVideoPreviews() {
    // A. Hero lead card hover
    const heroCard = document.querySelector('.hero-lead-card');
    const heroVideo = document.getElementById('hero-piece-video');

    if (heroCard && heroVideo) {
      heroCard.addEventListener('mouseenter', () => {
        heroVideo.currentTime = 0;
        heroVideo.play().catch(() => {});
      });
      heroCard.addEventListener('mouseleave', () => {
        heroVideo.pause();
      });
    }

    // B. Product cards with hover videos
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card) => {
      const hoverVideo = card.querySelector('.product-video-hover');
      if (!hoverVideo) return;

      card.addEventListener('mouseenter', () => {
        hoverVideo.currentTime = 0;
        hoverVideo.play().catch(() => {});
      });

      card.addEventListener('mouseleave', () => {
        hoverVideo.pause();
      });
    });
  }

  /* --------------------------------------------------------------------------
     2. Auto-Advancing Kinetic Lookbook Filmstrip Slider
     -------------------------------------------------------------------------- */
  function initAutoLookbookSlider() {
    const viewport = document.getElementById('lookbook-viewport');
    const track = document.getElementById('lookbook-track');
    const prevBtn = document.getElementById('lookbook-prev');
    const nextBtn = document.getElementById('lookbook-next');
    const frameActiveEl = document.getElementById('lookbook-frame-active');
    const progressFill = document.getElementById('lookbook-progress-fill');

    if (!viewport || !track) return;

    const slides = track.querySelectorAll('.lookbook-slide');
    const totalSlides = slides.length;

    const getScrollStep = () => {
      const firstSlide = slides[0];
      return firstSlide ? firstSlide.offsetWidth + 20 : 360;
    };

    // A. Next / Prev Step Handlers
    const advanceSlide = (direction = 1) => {
      const step = getScrollStep();
      const maxScroll = viewport.scrollWidth - viewport.clientWidth;

      if (direction === 1 && viewport.scrollLeft >= maxScroll - 10) {
        // Loop back to start smoothly
        viewport.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        viewport.scrollBy({ left: direction * step, behavior: 'smooth' });
      }
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        advanceSlide(-1);
        resetAutoTimer();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        advanceSlide(1);
        resetAutoTimer();
      });
    }

    // B. Automatic Progression Timer (Every 4 seconds, pauses on hover/touch)
    let autoTimer = null;
    const AUTO_INTERVAL = 4000;

    const startAutoTimer = () => {
      stopAutoTimer();
      autoTimer = setInterval(() => {
        advanceSlide(1);
      }, AUTO_INTERVAL);
    };

    const stopAutoTimer = () => {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    };

    const resetAutoTimer = () => {
      stopAutoTimer();
      startAutoTimer();
    };

    // Pause on hover, resume on leave
    viewport.addEventListener('mouseenter', stopAutoTimer);
    viewport.addEventListener('mouseleave', startAutoTimer);
    viewport.addEventListener('touchstart', stopAutoTimer, { passive: true });
    viewport.addEventListener('touchend', startAutoTimer, { passive: true });

    startAutoTimer();

    // C. Drag to scroll physics
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    viewport.addEventListener('mousedown', (e) => {
      isDown = true;
      viewport.classList.add('is-dragging');
      startX = e.pageX - viewport.offsetLeft;
      scrollLeft = viewport.scrollLeft;
      stopAutoTimer();
    });

    window.addEventListener('mouseup', () => {
      if (!isDown) return;
      isDown = false;
      viewport.classList.remove('is-dragging');
      startAutoTimer();
    });

    viewport.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - viewport.offsetLeft;
      const walk = (x - startX) * 1.5;
      viewport.scrollLeft = scrollLeft - walk;
    });

    // D. Telemetry & Progress
    const updateProgress = () => {
      const maxScroll = viewport.scrollWidth - viewport.clientWidth;
      if (maxScroll <= 0) return;

      const progress = Math.min(Math.max(viewport.scrollLeft / maxScroll, 0), 1);
      if (progressFill) {
        progressFill.style.width = `${Math.max(progress * 100, 10)}%`;
      }

      const slideWidth = getScrollStep();
      const currentIndex = Math.min(Math.round(viewport.scrollLeft / slideWidth) + 1, totalSlides);
      if (frameActiveEl) {
        frameActiveEl.textContent = currentIndex < 10 ? `0${currentIndex}` : `${currentIndex}`;
      }
    };

    viewport.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* --------------------------------------------------------------------------
     3. Video Viewport IntersectionObserver
     -------------------------------------------------------------------------- */
  function initVideoViewportObserver() {
    // Only auto-play ambient background videos and feed reels, NOT hover preview videos
    const ambientVideos = document.querySelectorAll('.runway-video-bg video, .feed-item video, .lookbook-slide-media video');
    if (!('IntersectionObserver' in window)) return;

    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.2 }
    );

    ambientVideos.forEach((video) => {
      videoObserver.observe(video);
    });
  }
})();