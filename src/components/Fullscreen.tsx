"use client";

import { useEffect, useState } from "react";

export default function Fullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  return (
    <button
      onClick={toggleFullscreen}
      className="btn btn-circle btn-ghost absolute top-4 right-4"
      aria-label="Toggle fullscreen"
    >
      {isFullscreen ? "Exit" : "Full"}
    </button>
  );
}
