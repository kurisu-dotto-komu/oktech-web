import "@/styles/animations.css";

import React from "react";

interface FancyBorderProps {
  children: React.ReactNode;
}

export default function FancyBorder({ children }: FancyBorderProps) {
  return (
    <div className="relative aspect-square h-full w-full">
      <div className="animate-floating absolute inset-0">
        <div className="animate-hexagon-mask absolute inset-0">
          <div className="absolute inset-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
