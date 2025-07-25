interface SpinningTextProps {
  text: string;
  radius?: number;
  className?: string;
}

export default function SpinningText({ text, radius = 100, className = "" }: SpinningTextProps) {
  // Use exactly 2 repetitions
  const fontSize = 12;

  // Create text with exactly 2 repetitions
  const repeatedText = `${text} • ${text} • `;

  // Magic value for letter-spacing - adjust this for perfect fit
  const letterSpacing = radius * 0.024; // Tweak this multiplier as needed

  return (
    <svg
      className={`absolute user-select-none inset-0 w-full h-full pointer-events-none ${className}`}
      viewBox="0 0 300 300"
    >
      <style>
        {`
          @keyframes rotate-text {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          .rotating-text {
            animation: rotate-text 30s linear infinite;
            transform-origin: 150px 150px;
          }
        `}
      </style>
      <defs>
        <path
          id="text-circle"
          d={`M 150, 150 m -${radius}, 0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
        />
      </defs>
      <g className="rotating-text">
        <text
          className="fill-current text-base-300 opacity-50"
          fontSize={fontSize}
          fontFamily="Space Mono, monospace"
          letterSpacing={letterSpacing}
        >
          <textPath href="#text-circle" startOffset="0%">
            {repeatedText}
          </textPath>
        </text>
      </g>
    </svg>
  );
}
