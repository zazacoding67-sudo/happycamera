"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface CategoryHeroProps {
  title: string;
  description: string | null;
  videoFilenames: string | string[] | null;
  playbackRate?: number;
}

function formatTitle(s: string): string {
  if (s === "DSLR") return s;
  return s
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function posterFor(filename: string): string {
  return `/videos/${filename.replace(/\.mp4$/i, "-poster.jpg")}`;
}

export default function CategoryHero({
  title,
  description,
  videoFilenames,
  playbackRate = 1,
}: CategoryHeroProps) {
  const displayTitle = formatTitle(title);
  const isArray = Array.isArray(videoFilenames);
  const videoList: string[] = isArray ? videoFilenames : [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [mountedCount, setMountedCount] = useState(1);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const setPlaybackAndPlay = useCallback((el: HTMLVideoElement) => {
    el.playbackRate = playbackRate;
    el.play().catch(() => {});
  }, [playbackRate]);

  const SWAP_MS = 5000;
  const PRELOAD_LEAD_MS = 1500;

  useEffect(() => {
    if (!isArray || videoList.length <= 1) {
      setMountedCount(videoList.length || 1);
      return;
    }
    const swapTimer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % videoList.length);
    }, SWAP_MS);
    const leadTimer = window.setTimeout(() => {
      setMountedCount(Math.min(videoList.length, 2));
    }, SWAP_MS - PRELOAD_LEAD_MS);
    return () => {
      window.clearInterval(swapTimer);
      window.clearTimeout(leadTimer);
    };
  }, [isArray, videoList.length]);

  useEffect(() => {
    videoRefs.current.forEach((ref, i) => {
      if (!ref) return;
      if (i === activeIndex) {
        setPlaybackAndPlay(ref);
      } else {
        ref.pause();
      }
    });
  }, [activeIndex, setPlaybackAndPlay]);

  const setVideoRef = useCallback(
    (el: HTMLVideoElement | null, index: number) => {
      videoRefs.current[index] = el;
    },
    []
  );

  return (
    <div className="relative w-full overflow-hidden h-[250px] md:h-[400px]">
      {videoFilenames ? (
        isArray ? (
          videoList.slice(0, mountedCount).map((filename, i) => (
            <video
              key={filename}
              ref={(el) => setVideoRef(el, i)}
              autoPlay={i === activeIndex}
              loop={i === activeIndex}
              muted
              playsInline
              poster={posterFor(filename)}
              className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ${
                i === activeIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <source src={`/videos/${filename}`} type="video/mp4" />
            </video>
          ))
        ) : (
          <video
            key={String(videoFilenames)}
            ref={(el) => setVideoRef(el, 0)}
            autoPlay
            loop
            muted
            playsInline
            poster={posterFor(videoFilenames)}
            className="absolute inset-0 w-full h-full object-cover z-0"
          >
            <source src={`/videos/${videoFilenames}`} type="video/mp4" />
          </video>
        )
      ) : (
        <div className="absolute inset-0 bg-[#1A1A1A]" />
      )}
      <div className="absolute inset-0 bg-black/40 z-10" />
      <div className="relative z-20 flex flex-col justify-end items-start h-full pb-12 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="w-12 h-1 bg-white mb-6" />
        <h1 className="opacity-0 animate-fade-in-up text-5xl md:text-6xl font-extrabold text-white tracking-tighter font-heading">
          {displayTitle}
        </h1>
        <p className="opacity-0 animate-fade-in-up [animation-delay:200ms] text-lg md:text-xl text-gray-200 max-w-2xl mt-4 font-medium">
          {description || "Explore our curated collection of premium gear."}
        </p>
      </div>
    </div>
  );
}
