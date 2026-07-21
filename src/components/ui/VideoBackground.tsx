"use client";

import React, {
  VideoHTMLAttributes,
  forwardRef,
  useEffect,
  useRef,
  useImperativeHandle,
} from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface VideoBackgroundProps
  extends VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  poster?: string;
  objectPosition?: string;
  overlayOpacity?: string;
}

export const VideoBackground = forwardRef<
  HTMLVideoElement,
  VideoBackgroundProps
>(
  (
    {
      src,
      poster,
      objectPosition = "70% center",
      overlayOpacity,
      className,
      ...props
    },
    ref
  ) => {
    const internalVideoRef = useRef<HTMLVideoElement | null>(null);
    const targetTimeRef = useRef<number>(0);
    const rafIdRef = useRef<number | null>(null);
    const isSeekingRef = useRef<boolean>(false);
    const isPlayingRef = useRef<boolean>(false);
    const isPlayPendingRef = useRef<boolean>(false);
    const seekedListenerAttachedRef = useRef<boolean>(false);

    // Forward the ref properly to HTMLVideoElement
    useImperativeHandle(ref, () => internalVideoRef.current as HTMLVideoElement);

    // Prevent multiple play() calls
    const safePlay = async () => {
      const video = internalVideoRef.current;
      if (!video || isPlayingRef.current || isPlayPendingRef.current) return;

      try {
        isPlayPendingRef.current = true;
        await video.play();
        isPlayingRef.current = true;
      } catch (err) {
        console.warn("Video play prevented or interrupted:", err);
      } finally {
        isPlayPendingRef.current = false;
      }
    };

    // Pause video while desktop scrubbing
    const safePause = () => {
      const video = internalVideoRef.current;
      if (!video) return;
      video.pause();
      isPlayingRef.current = false;
    };

    // RAF seeking loop
    const updateSeekPosition = () => {
      const video = internalVideoRef.current;
      if (video && isSeekingRef.current) {
        if (Math.abs(video.currentTime - targetTimeRef.current) > 0.01) {
          video.currentTime = targetTimeRef.current;
        }
      }
      rafIdRef.current = requestAnimationFrame(updateSeekPosition);
    };

    useEffect(() => {
      const video = internalVideoRef.current;
      if (!video) return;

      // Start RAF loop
      rafIdRef.current = requestAnimationFrame(updateSeekPosition);

      // Prevent duplicate seeked listeners
      const handleSeeked = () => {
        isSeekingRef.current = false;
      };

      if (!seekedListenerAttachedRef.current) {
        video.addEventListener("seeked", handleSeeked);
        seekedListenerAttachedRef.current = true;
      }

      // Cleanup: Cancel RAF on unmount
      return () => {
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
        if (seekedListenerAttachedRef.current && video) {
          video.removeEventListener("seeked", handleSeeked);
          seekedListenerAttachedRef.current = false;
        }
      };
    }, []);

    // Desktop vs Mobile Scrubbing handlers
    const scrubTo = (newTime: number) => {
      const video = internalVideoRef.current;
      if (!video) return;

      targetTimeRef.current = newTime;
      isSeekingRef.current = true;

      const isMobile = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

      if (!isMobile) {
        // Pause video while desktop scrubbing
        safePause();
      }
    };

    const finishScrub = () => {
      const isMobile = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

      if (isMobile) {
        // Resume playback on mobile only
        safePlay();
      }
    };

    return (
      <>
        <video
          ref={internalVideoRef}
          autoPlay
          muted
          loop
          playsInline
          poster={poster}
          className={twMerge(
            clsx("absolute inset-0 h-full w-full object-cover", className)
          )}
          style={{ objectPosition }}
          {...props}
        >
          <source src={src} type="video/mp4" />
        </video>
        {overlayOpacity && (
          <div
            className={twMerge(
              clsx("absolute inset-0 bg-black pointer-events-none", overlayOpacity)
            )}
          />
        )}
      </>
    );
  }
);

VideoBackground.displayName = "VideoBackground";
