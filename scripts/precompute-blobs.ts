// Scales up paths from blobmaker.com to 100x100 bounding box

// Original DEFAULT_BLOBS from BlobSlideshow.tsx
const originalDefaultBlobs = [
  "M55,-20C60,3,50,28,30,42C10,56,-20,60,-40,48C-60,36,-65,8,-55,-15C-45,-38,-25,-55,5,-54C35,-53,50,-43,55,-20Z",
  "M50,-25C58,0,48,25,28,40C8,55,-22,60,-42,50C-62,40,-67,15,-57,-10C-47,-35,-27,-60,3,-58C33,-56,42,-50,50,-25Z",
  "M60,-22C67,2,52,30,32,45C12,60,-18,62,-38,52C-58,42,-63,12,-53,-12C-43,-36,-23,-54,7,-52C37,-50,53,-46,60,-22Z",
];

// Original blobs from index.astro
const originalIndexBlobs = [
  "M43.1,-32.8C52.5,-22.7,54.2,-5,49.1,8.7C44,22.3,31.9,31.8,16.2,43C0.4,54.2,-19.1,67.1,-31,62.2C-43,57.3,-47.5,34.6,-50.1,14C-52.8,-6.5,-53.5,-24.9,-44.8,-34.8C-36.2,-44.7,-18.1,-46.2,-0.6,-45.8C16.9,-45.3,33.8,-42.9,43.1,-32.8Z",
  "M40.4,-29.2C51.9,-17.8,60.5,-1,57.7,14C54.9,29,40.8,42.2,24.5,49.4C8.3,56.7,-10.1,57.9,-28.7,51.9C-47.3,45.9,-66.2,32.7,-71.3,14.9C-76.4,-2.8,-67.8,-25,-53.6,-37C-39.4,-49,-19.7,-50.7,-2.6,-48.6C14.4,-46.5,28.9,-40.5,40.4,-29.2Z",
  "M48.7,-35.3C61.5,-22.8,69.2,-2.6,64.9,14.3C60.6,31.3,44.5,45,24.8,56.3C5.2,67.6,-17.9,76.4,-36.8,69.9C-55.7,63.3,-70.3,41.3,-74.1,18.6C-78,-4.2,-71.2,-27.7,-57,-40.5C-42.9,-53.3,-21.4,-55.3,-1.7,-53.9C18,-52.5,35.9,-47.8,48.7,-35.3Z",
  "M53,-39.3C62.8,-30.1,60.6,-8.4,53.2,7.5C45.9,23.5,33.5,33.6,20.5,38.2C7.5,42.7,-6,41.6,-21.9,37.1C-37.7,32.7,-55.9,24.8,-60.9,11.4C-65.9,-1.9,-57.7,-20.7,-45.4,-30.5C-33,-40.3,-16.5,-41.1,2.6,-43.1C21.7,-45.1,43.3,-48.5,53,-39.3Z",
  "M38.4,-37.4C47,-19.8,49.4,-4,46.9,12.2C44.3,28.3,36.9,44.8,24.7,50.3C12.5,55.8,-4.6,50.3,-25.1,43.7C-45.7,37,-69.9,29.2,-77.5,12.8C-85.1,-3.6,-76.1,-28.6,-60.5,-47.8C-44.8,-67.1,-22.4,-80.6,-3.8,-77.6C14.9,-74.5,29.7,-55.1,38.4,-37.4Z",
  "M48.5,-47.2C55.6,-29.9,49,-10.1,44.3,10C39.6,30.1,36.9,50.5,25.1,58.9C13.2,67.2,-7.8,63.5,-27.2,54.8C-46.7,46.1,-64.6,32.5,-69.1,15.1C-73.6,-2.3,-64.8,-23.5,-51.1,-42.4C-37.4,-61.3,-18.7,-77.8,1,-78.6C20.7,-79.5,41.5,-64.5,48.5,-47.2Z",
];

// Example usage:
function main() {
  console.log(
    JSON.stringify(
      {
        defaultBlobs: originalDefaultBlobs.map((blob) => scalePathTo100(blob)),
        indexBlobs: originalIndexBlobs.map((blob) => scalePathTo100(blob)),
      },
      null,
      2,
    ),
  );
}

main();

interface PathCommand {
  type: string;
  values: number[];
}

function parsePathData(pathData: string): PathCommand[] {
  const commands: PathCommand[] = [];
  const regex = /([MLHVCSQTAZ])([^MLHVCSQTAZ]*)/gi;
  let match;

  while ((match = regex.exec(pathData)) !== null) {
    const type = match[1].toUpperCase();
    const values = match[2]
      .trim()
      .split(/[\s,]+/)
      .filter(Boolean)
      .map(Number);
    commands.push({ type, values });
  }

  return commands;
}

function getPathBounds(commands: PathCommand[]): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
} {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let currentX = 0;
  let currentY = 0;

  function updateBounds(x: number, y: number) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  commands.forEach((cmd) => {
    switch (cmd.type) {
      case "M": // Move to
        currentX = cmd.values[0];
        currentY = cmd.values[1];
        updateBounds(currentX, currentY);
        break;
      case "L": // Line to
        currentX = cmd.values[0];
        currentY = cmd.values[1];
        updateBounds(currentX, currentY);
        break;
      case "H": // Horizontal line to
        currentX = cmd.values[0];
        updateBounds(currentX, currentY);
        break;
      case "V": // Vertical line to
        currentY = cmd.values[0];
        updateBounds(currentX, currentY);
        break;
      case "C": // Cubic bezier
        for (let i = 0; i < cmd.values.length; i += 2) {
          updateBounds(cmd.values[i], cmd.values[i + 1]);
        }
        currentX = cmd.values[4];
        currentY = cmd.values[5];
        break;
      case "S": // Smooth cubic bezier
        for (let i = 0; i < cmd.values.length; i += 2) {
          updateBounds(cmd.values[i], cmd.values[i + 1]);
        }
        currentX = cmd.values[2];
        currentY = cmd.values[3];
        break;
      case "Q": // Quadratic bezier
        for (let i = 0; i < cmd.values.length; i += 2) {
          updateBounds(cmd.values[i], cmd.values[i + 1]);
        }
        currentX = cmd.values[2];
        currentY = cmd.values[3];
        break;
      case "T": // Smooth quadratic bezier
        currentX = cmd.values[0];
        currentY = cmd.values[1];
        updateBounds(currentX, currentY);
        break;
      case "Z": // Close path
        break;
    }
  });

  return { minX, minY, maxX, maxY };
}

function scaleCommands(
  commands: PathCommand[],
  scale: number,
  offsetX: number,
  offsetY: number,
): PathCommand[] {
  return commands.map((cmd) => {
    const scaledValues = [...cmd.values];

    switch (cmd.type) {
      case "M":
      case "L":
      case "T":
        scaledValues[0] = (scaledValues[0] - offsetX) * scale;
        scaledValues[1] = (scaledValues[1] - offsetY) * scale;
        break;
      case "H":
        scaledValues[0] = (scaledValues[0] - offsetX) * scale;
        break;
      case "V":
        scaledValues[0] = (scaledValues[0] - offsetY) * scale;
        break;
      case "C":
        for (let i = 0; i < 6; i += 2) {
          scaledValues[i] = (scaledValues[i] - offsetX) * scale;
          scaledValues[i + 1] = (scaledValues[i + 1] - offsetY) * scale;
        }
        break;
      case "S":
      case "Q":
        for (let i = 0; i < 4; i += 2) {
          scaledValues[i] = (scaledValues[i] - offsetX) * scale;
          scaledValues[i + 1] = (scaledValues[i + 1] - offsetY) * scale;
        }
        break;
    }

    return { type: cmd.type, values: scaledValues };
  });
}

function commandsToPath(commands: PathCommand[]): string {
  return commands
    .map((cmd) => {
      if (cmd.values.length === 0) return cmd.type;
      return cmd.type + cmd.values.map((v) => v.toFixed(2)).join(",");
    })
    .join("");
}

export function scalePathTo100(pathData: string): string {
  // return pathData;
  const commands = parsePathData(pathData);
  const bounds = getPathBounds(commands);

  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;

  // Calculate scale to fit in 100x100 box while maintaining aspect ratio
  const scale = Math.min(100 / width, 100 / height);

  // Scale and center the path
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;
  const offsetX = bounds.minX - (100 - scaledWidth) / 2 / scale;
  const offsetY = bounds.minY - (100 - scaledHeight) / 2 / scale;

  const scaledCommands = scaleCommands(commands, scale, offsetX, offsetY);
  return commandsToPath(scaledCommands);
}
