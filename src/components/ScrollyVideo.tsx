'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Rocket, Gauge, Radio, Minimize2, Maximize2, Video } from 'lucide-react';

interface ScrollyVideoProps {
  scrollProgress: number; // 0.0 to 1.0
  isScrollyMode: boolean;
}

export const ScrollyVideo: React.FC<ScrollyVideoProps> = ({
  scrollProgress,
  isScrollyMode
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const targetTimeRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  // Initialize and handle video metadata
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoaded(true);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    if (video.readyState >= 1) {
      setDuration(video.duration);
      setIsLoaded(true);
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  // Update target time when scrollProgress changes
  useEffect(() => {
    if (duration > 0) {
      targetTimeRef.current = Math.min(Math.max(scrollProgress * duration, 0), duration);
    }
  }, [scrollProgress, duration]);

  // Smooth requestAnimationFrame physics lerp loop for scrubbing
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isSeeking = false;

    const onSeeked = () => {
      isSeeking = false;
    };
    video.addEventListener('seeked', onSeeked);

    const updateFrame = () => {
      if (video && !isSeeking && duration > 0) {
        const diff = targetTimeRef.current - video.currentTime;
        if (Math.abs(diff) > 0.03) {
          isSeeking = true;
          // Smoothly advance/reverse video playback to target timestamp
          video.currentTime += diff * 0.25;
        }
      }
      rafRef.current = requestAnimationFrame(updateFrame);
    };

    rafRef.current = requestAnimationFrame(updateFrame);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      video.removeEventListener('seeked', onSeeked);
    };
  }, [duration]);

  // Telemetry metrics derived from scroll progress
  const simulatedMach = (1.0 + scrollProgress * 32.5).toFixed(1);
  const simulatedAltitude = (scrollProgress * 420).toFixed(0);
  const currentMET = (scrollProgress * 520).toFixed(0);

  if (!isScrollyMode && isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-20 left-6 z-40 bg-slate-950/85 backdrop-blur-xl border border-cyan-500/40 p-2.5 rounded-2xl text-cyan-400 hover:text-white shadow-2xl transition-all flex items-center gap-2 text-xs font-mono"
        title="Open Shuttle Launch Video Portal"
      >
        <Video className="w-4 h-4 text-cyan-400" />
        <span>Shuttle Cam</span>
      </button>
    );
  }

  return (
    <div
      className={`fixed transition-all duration-300 z-30 pointer-events-auto shadow-[0_0_30px_rgba(6,182,212,0.25)] rounded-2xl overflow-hidden border border-cyan-500/40 bg-slate-950/90 backdrop-blur-2xl ${
        isExpanded
          ? 'bottom-20 left-6 w-[88vw] sm:w-[540px] h-[320px]'
          : isMinimized
          ? 'hidden'
          : 'bottom-20 left-6 w-[280px] sm:w-[340px] h-[200px]'
      }`}
    >
      {/* Video Header HUD Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-cyan-500/20 text-xs font-mono text-cyan-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="font-semibold tracking-wider flex items-center gap-1">
            <Rocket className="w-3.5 h-3.5 text-cyan-400" />
            SHUTTLE LAUNCH CAM
          </span>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:text-white transition-colors"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 hover:text-white transition-colors"
            title="Minimize"
          >
            &times;
          </button>
        </div>
      </div>

      {/* Scrubbed HTML5 Video Container */}
      <div className="relative w-full h-[calc(100%-48px)] bg-black">
        <video
          ref={videoRef}
          src="/videos/shuttle_scroll.mp4"
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        />

        {/* Scanline CRT overlay effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40" />

        {/* Video Crosshairs and Telemetry Corner Badges */}
        <div className="absolute top-2 left-2 pointer-events-none font-mono text-[10px] text-cyan-400/90 bg-slate-950/60 px-1.5 py-0.5 rounded border border-cyan-500/20">
          MET +00:{currentMET.padStart(3, '0')}s
        </div>

        <div className="absolute top-2 right-2 pointer-events-none font-mono text-[10px] text-amber-300/90 bg-slate-950/60 px-1.5 py-0.5 rounded border border-amber-500/20">
          Mach {simulatedMach}
        </div>
      </div>

      {/* Bottom Telemetry Gauges */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/80 border-t border-cyan-500/20 text-[11px] font-mono text-slate-300">
        <span className="flex items-center gap-1 text-slate-400">
          <Gauge className="w-3 h-3 text-cyan-400" />
          Alt: <strong className="text-white">{simulatedAltitude} km</strong>
        </span>

        <span className="text-cyan-400 font-semibold">
          Scroll Scrub: {(scrollProgress * 100).toFixed(0)}%
        </span>
      </div>
    </div>
  );
};
