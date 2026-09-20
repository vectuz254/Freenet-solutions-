import React, { useEffect, useRef } from 'react';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260601_110537_3a579fa0-7bbc-4d94-9d25-0e816c7840f5.mp4';

export const BackgroundVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Desktop Mouse Scrubbing Hook
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let prevX: number | null = null;
    let isSeeking = false;
    let targetTime = 0;
    let pendingScrubTime: number | null = null;

    const handleSeeked = () => {
      isSeeking = false;
      if (pendingScrubTime !== null) {
        const nextTime = pendingScrubTime;
        pendingScrubTime = null;
        isSeeking = true;
        video.currentTime = nextTime;
      }
    };

    video.addEventListener('seeked', handleSeeked);

    const handleMouseMove = (e: MouseEvent) => {
      // Disable scrubbing on viewport widths < 1024
      if (window.innerWidth < 1024) {
        prevX = null;
        return;
      }

      if (!video.duration || isNaN(video.duration)) return;

      if (prevX === null) {
        prevX = e.clientX;
        targetTime = video.currentTime;
        return;
      }

      const delta = e.clientX - prevX;
      prevX = e.clientX;

      // Update scrub position based on horizontal delta
      const scrubDelta = (delta / window.innerWidth) * 0.8 * video.duration;
      targetTime = Math.max(0, Math.min(video.duration, (targetTime || video.currentTime) + scrubDelta));

      if (!isSeeking) {
        isSeeking = true;
        video.currentTime = targetTime;
      } else {
        pendingScrubTime = targetTime;
      }
    };

    const handleMouseLeave = () => {
      prevX = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, []);

  // Mobile Autoplay Hook (< 1024px)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleMobilePlayback = () => {
      if (window.innerWidth < 1024) {
        video.autoplay = true;
        video.loop = true;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    handleMobilePlayback();
    window.addEventListener('resize', handleMobilePlayback);

    return () => {
      window.removeEventListener('resize', handleMobilePlayback);
    };
  }, []);

  return (
    <div className="order-last lg:order-none relative lg:absolute lg:inset-0 lg:z-0 overflow-hidden pointer-events-none w-full aspect-square md:aspect-video lg:aspect-auto lg:h-full bg-neutral-50 lg:bg-transparent">
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover object-right lg:object-right-bottom"
        src={VIDEO_URL}
      />
    </div>
  );
};
