"use client";

import { useState, useEffect, useRef } from "react";

const SCROLL_THRESHOLD = 10;
const NEAR_TOP = 100;
const TOP_BAND = 80;
const DIRECTION_DEADZONE = 5;

export function useNavVisibility() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollRaf = useRef(0);
  const mouseRaf = useRef(0);
  const mouseInBand = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRaf.current) return;
      scrollRaf.current = requestAnimationFrame(() => {
        scrollRaf.current = 0;
        const currentY = window.scrollY;

        if (currentY < NEAR_TOP || currentY < SCROLL_THRESHOLD) {
          setIsVisible(true);
          lastScrollY.current = currentY;
          return;
        }

        const delta = currentY - lastScrollY.current;

        if (delta > DIRECTION_DEADZONE) {
          if (!mouseInBand.current) setIsVisible(false);
        } else if (delta < -DIRECTION_DEADZONE) {
          setIsVisible(true);
        }

        lastScrollY.current = currentY;
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseInBand.current = e.clientY <= TOP_BAND;
      if (mouseInBand.current) {
        if (mouseRaf.current) return;
        mouseRaf.current = requestAnimationFrame(() => {
          mouseRaf.current = 0;
          setIsVisible(true);
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      if (scrollRaf.current) cancelAnimationFrame(scrollRaf.current);
      if (mouseRaf.current) cancelAnimationFrame(mouseRaf.current);
    };
  }, []);

  return isVisible;
}
