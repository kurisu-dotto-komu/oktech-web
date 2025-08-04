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
