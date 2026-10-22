// Motion spec: the only springs, staggers and offsets the site uses.
import { animate, inView, scroll } from 'motion';

export const spring = {
  /** button press, toggles, the tick landing (~220ms) */
  snappy: { type: 'spring', stiffness: 420, damping: 32 },
  /** reveals, swaps, shared-element moves (~420ms) */
  smooth: { type: 'spring', stiffness: 220, damping: 28 },
  /** hero assembly, large travel (~650ms) */
  gentle: { type: 'spring', stiffness: 120, damping: 22 },
} as const;

export const stagger = { line: 0.06, part: 0.09 };
export const rise = 24;

export const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const finePointer = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/** Section entrance: parts marked [data-reveal] arrive in reading order, once. */
export function initReveals() {
  document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    inView(
      group,
      () => {
        const parts = group.querySelectorAll<HTMLElement>('[data-reveal]');
        parts.forEach((el, i) => {
          if (reducedMotion()) {
            el.classList.add('is-in');
            return;
          }
          const delay = i * stagger.part;
          const done = () => el.classList.add('is-in');
          // Headlines rise out of a mask; the photograph opens like a shutter; everything else rises.
          if (el.dataset.reveal === 'clip') {
            el.style.opacity = '1';
            animate(
              el,
              { clipPath: ['inset(0 0 100% 0)', 'inset(0 0 -20% 0)'], transform: ['translateY(40%)', 'translateY(0%)'] },
              { ...spring.gentle, delay },
            ).then(done);
          } else if (el.dataset.reveal === 'open') {
            el.style.opacity = '1';
            animate(el, { clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'] }, { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }).then(done);
          } else {
            animate(
              el,
              { opacity: [0, 1], transform: [`translateY(${rise}px)`, 'translateY(0px)'] },
              { ...spring.smooth, delay },
            ).then(done);
          }
        });
      },
      { amount: 0.15 },
    );
  });
}

/** Magnetic pull towards the cursor, up to 10px. Fine pointers only. */
export function magnetic(el: HTMLElement, strength = 10) {
  if (!finePointer() || reducedMotion()) return;
  let frame = 0;
  el.addEventListener('pointermove', (e) => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 2 * strength;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 2 * strength;
      animate(el, { transform: `translate(${x}px, ${y}px)` }, spring.snappy);
    });
  });
  el.addEventListener('pointerleave', () => {
    cancelAnimationFrame(frame);
    animate(el, { transform: 'translate(0px, 0px)' }, spring.smooth);
  });
  el.addEventListener('pointerdown', () => {
    animate(el, { transform: 'translate(0px, 0px) scale(0.97)' }, spring.snappy);
  });
}

/** A slow, scroll-locked drift on a photograph inside a cropping frame. */
export function drift(img: HTMLElement, frame: HTMLElement) {
  if (reducedMotion()) return;
  scroll(animate(img, { transform: ['scale(1.12) translateY(-3%)', 'scale(1.02) translateY(3%)'] }, { ease: 'linear' }), {
    target: frame,
    offset: ['start end', 'end start'],
  });
}

/** Theme switch: the new theme opens as a circle from the toggle (View Transitions where supported). */
export function switchTheme(apply: () => void, from: HTMLElement) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
  if (!doc.startViewTransition || reducedMotion()) return apply();
  const r = from.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  doc.startViewTransition(apply).ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 520, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' },
    );
  });
}

/** Run looping CSS illustrations only while they are on screen. */
export function playWhenVisible(selector: string) {
  document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    inView(el, () => {
      el.classList.add('is-playing');
      return () => el.classList.remove('is-playing');
    }, { amount: 0.3 });
  });
}
