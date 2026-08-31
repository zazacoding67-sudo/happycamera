import { useState, useEffect } from "react";
import type { Variants, Transition } from "framer-motion";

export const materialEase: Transition["ease"] = [0.4, 0, 0.2, 1];

export const fastTransition: Transition = {
  duration: 0.15,
  ease: materialEase,
};

export const standardTransition: Transition = {
  duration: 0.3,
  ease: materialEase,
};

export const slowTransition: Transition = {
  duration: 0.5,
  ease: materialEase,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: standardTransition },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: fastTransition },
  exit: { opacity: 1, transition: fastTransition },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const scaleOnHover = {
  whileHover: { scale: 1.04 },
  whileTap: { scale: 0.97 },
  transition: standardTransition,
};

export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}

export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setDesktop(mq);
    const handler = (e: MediaQueryListEvent) => setDesktop(e);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  function setDesktop(mq: MediaQueryListEvent | MediaQueryList) {
    setIsDesktop(mq.matches);
  }

  return isDesktop;
}
