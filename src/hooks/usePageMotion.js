import { useEffect } from 'react';

export default function usePageMotion(pageRef, progressRef) {
  useEffect(() => {
    const page = pageRef.current;
    const targets = [...page.querySelectorAll('[data-reveal]')];
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer;
    let frame = 0;

    const reveal = (element) => {
      element.classList.add('is-revealed');
      observer?.unobserve(element);
    };

    const configureReveals = () => {
      observer?.disconnect();
      if (media.matches || !('IntersectionObserver' in window)) {
        targets.forEach(reveal);
        return;
      }

      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal(entry.target);
        });
      }, { threshold: 0, rootMargin: '0px 0px -48px 0px' });

      targets.forEach((element) => {
        element.classList.add('motion-ready');
        if (!element.classList.contains('is-revealed')) observer.observe(element);
      });
    };

    const updateProgress = () => {
      frame = 0;
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      const progress = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
      progressRef.current?.style.setProperty('--scroll-progress', progress);
    };

    const requestProgress = () => {
      if (!frame) frame = requestAnimationFrame(updateProgress);
    };

    // Keyboard navigation must never land on an invisible reveal target.
    const onFocus = (event) => {
      targets.forEach((element) => {
        if (element.contains(event.target)) reveal(element);
      });
    };

    configureReveals();
    updateProgress();
    const resizeObserver = new ResizeObserver(requestProgress);
    resizeObserver.observe(page);
    media.addEventListener('change', configureReveals);
    window.addEventListener('scroll', requestProgress, { passive: true });
    window.addEventListener('resize', requestProgress);
    page.addEventListener('focusin', onFocus);

    return () => {
      observer?.disconnect();
      resizeObserver.disconnect();
      cancelAnimationFrame(frame);
      media.removeEventListener('change', configureReveals);
      window.removeEventListener('scroll', requestProgress);
      window.removeEventListener('resize', requestProgress);
      page.removeEventListener('focusin', onFocus);
      targets.forEach((element) => element.classList.remove('motion-ready'));
    };
  }, [pageRef, progressRef]);
}
