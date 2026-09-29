import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Floating "back to top" button. Appears once the page has scrolled past
 * a threshold, hides otherwise. Smooth-scrolls on click and respects
 * `prefers-reduced-motion`.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? 'auto' : 'smooth',
    });
  };

  return (
    <Button
      variant="default"
      size="icon"
      type="button"
      onClick={handleClick}
      aria-label="Back to top"
      // Fixed bottom-right with a safe-area offset so it doesn't crash
      // into mobile gesture bars. Hidden when not scrolled.
      className={
        'fixed bottom-5 right-5 z-30 h-10 w-10 rounded-full border border-primary/20 bg-primary text-primary-foreground shadow-md transition-all duration-200 sm:bottom-6 sm:right-6 ' +
        (visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-2 opacity-0')
      }
    >
      <ArrowUp className="h-4 w-4" aria-hidden="true" />
    </Button>
  );
}