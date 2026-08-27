"use client";

import { useEffect } from "react";

/**
 * Progressive enhancement for the hero gallery.
 *
 * The gallery is a scroll-snap strip whose arrows and dots are plain anchor
 * links (#slide-2, …), so it works with no JavaScript. The one thing anchor
 * links get wrong is that following one scrolls the whole page vertically to
 * pull the slide to the top of the viewport — which, on this page, yanks the
 * masthead out of view every time you change slide. This intercepts those
 * clicks and scrolls only the strip sideways, so the slide changes in place and
 * the page never moves.
 *
 * It also takes over the active-dot indicator that :target drives without
 * script: adding `.js` to the hero switches the stylesheet from the :target
 * rule to the `.is-active` class this sets from the strip's scroll position,
 * which keeps working in both LTR and RTL.
 */
export default function HeroCarousel() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".hero");
    const strip = hero?.querySelector<HTMLElement>(".slides");
    if (!hero || !strip) return;

    const slides = Array.from(strip.querySelectorAll<HTMLElement>(".slide"));
    const dots = Array.from(hero.querySelectorAll<HTMLElement>(".dots a"));
    const links = Array.from(
      hero.querySelectorAll<HTMLAnchorElement>(".slide-arrow, .dots a"),
    );
    if (!slides.length) return;

    // Hand the active-dot job to the `.is-active` class; the :target fallback is
    // scoped to `.hero:not(.js)`, so the two never fight over which dot lights.
    hero.classList.add("js");

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const scrollToSlide = (target: HTMLElement) => {
      // Delta in viewport coordinates, so it stays correct whatever the strip's
      // offset parent is, and in RTL where scrollLeft can run negative.
      const delta =
        target.getBoundingClientRect().left - strip.getBoundingClientRect().left;
      strip.scrollBy({ left: delta, behavior: reduceMotion ? "auto" : "smooth" });
    };

    const onClick = (event: MouseEvent) => {
      const link = event.currentTarget as HTMLAnchorElement;
      const id = link.hash.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      event.preventDefault();
      scrollToSlide(target);
    };
    links.forEach((link) => link.addEventListener("click", onClick));

    let frame = 0;
    const markActive = () => {
      frame = 0;
      const stripLeft = strip.getBoundingClientRect().left;
      let active = 0;
      let nearest = Infinity;
      slides.forEach((slide, i) => {
        const distance = Math.abs(slide.getBoundingClientRect().left - stripLeft);
        if (distance < nearest) {
          nearest = distance;
          active = i;
        }
      });
      dots.forEach((dot, i) => dot.classList.toggle("is-active", i === active));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(markActive);
    };
    strip.addEventListener("scroll", onScroll, { passive: true });
    markActive();

    return () => {
      hero.classList.remove("js");
      links.forEach((link) => link.removeEventListener("click", onClick));
      strip.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
