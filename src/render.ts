import { Rect, RoughAnnotationConfig, FullPadding, BracketType } from './model';

export interface PathData {
  d: string;
  strokeWidth: number;
  length: number;
}

function parsePadding(config: RoughAnnotationConfig): FullPadding {
  const p = config.padding;
  if (p || (p === 0)) {
    if (typeof p === 'number') {
      return [p, p, p, p];
    } else if (Array.isArray(p)) {
      const pa = p as number[];
      if (pa.length) {
        switch (pa.length) {
          case 4:
            return [...pa] as FullPadding;
          case 1:
            return [pa[0], pa[0], pa[0], pa[0]];
          case 2:
            return [...pa, ...pa] as FullPadding;
          case 3:
            return [...pa, pa[1]] as FullPadding;
          default:
            return [pa[0], pa[1], pa[2], pa[3]];
        }
      }
    }
  }
  return [5, 5, 5, 5];
}

// More organic line generation that mimics natural hand drawing
function generateSketchyLine(x1: number, y1: number, x2: number, y2: number, roughness: number = 1, random: () => number): string {
  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  
  // Use fewer, irregular segments for more organic feel
  const baseSegments = Math.max(2, Math.floor(length / 60));
  const segments: {x: number, y: number}[] = [];
  
  // Create irregular segment spacing (more human-like)
  let accumulatedT = 0;
  for (let i = 0; i < baseSegments; i++) {
    if (i === 0) {
      segments.push({x: x1, y: y1});
    } else if (i === baseSegments - 1) {
      segments.push({x: x2, y: y2});
    } else {
      // Irregular spacing - some segments closer, some farther
      const segmentLength = (1 / baseSegments) * (0.7 + 0.6 * random());
      accumulatedT += segmentLength;
      accumulatedT = Math.min(accumulatedT, 0.95); // Don't go past near-end
      
      const x = x1 + (x2 - x1) * accumulatedT;
      const y = y1 + (y2 - y1) * accumulatedT;
      segments.push({x, y});
    }
  }
  
  // Apply organic roughness to each segment
  for (let i = 0; i < segments.length; i++) {
    if (i === 0 || i === segments.length - 1) {
      // Keep endpoints closer to original with slight variation
      segments[i].x += (random() - 0.5) * roughness * 0.5;
      segments[i].y += (random() - 0.5) * roughness * 0.8;
    } else {
      // Middle points get more natural variation
      const variationX = (random() - 0.5) * roughness * (0.6 + 0.8 * random());
      const variationY = (random() - 0.5) * roughness * (1.2 + 1.0 * random());
      segments[i].x += variationX;
      segments[i].y += variationY;
    }
  }
  
  // Build path with smooth curves between irregular points
  let path = `M${segments[0].x},${segments[0].y}`;
  
  for (let i = 1; i < segments.length; i++) {
    if (i === 1 && segments.length > 2) {
      // Use quadratic curve for first segment
      const cp1x = segments[0].x + (segments[1].x - segments[0].x) * 0.4 + (random() - 0.5) * roughness * 0.8;
      const cp1y = segments[0].y + (segments[1].y - segments[0].y) * 0.4 + (random() - 0.5) * roughness * 1.2;
      path += ` Q${cp1x},${cp1y} ${segments[i].x},${segments[i].y}`;
    } else {
      // Simple lines with natural variation for the rest
      path += ` L${segments[i].x},${segments[i].y}`;
    }
  }
  
  return path;
}

function generateSketchyRect(x: number, y: number, width: number, height: number, roughness: number = 1, random: () => number): string {
  const r = roughness;
  const x1 = x + (random() - 0.5) * r;
  const y1 = y + (random() - 0.5) * r;
  const x2 = x + width + (random() - 0.5) * r;
  const y2 = y + (random() - 0.5) * r;
  const x3 = x + width + (random() - 0.5) * r;
  const y3 = y + height + (random() - 0.5) * r;
  const x4 = x + (random() - 0.5) * r;
  const y4 = y + height + (random() - 0.5) * r;
  
  return `M${x1},${y1} L${x2},${y2} L${x3},${y3} L${x4},${y4} Z`;
}

function generateSketchyEllipse(cx: number, cy: number, width: number, height: number, roughness: number = 1, random: () => number): string {
  const rx = width / 2;
  const ry = height / 2;
  
  // Use proper cubic bezier approximation of ellipse
  let path = '';
  
  // Magic number for cubic bezier ellipse approximation
  const kappa = 0.5522848;
  const ox = rx * kappa; // control point offset x
  const oy = ry * kappa; // control point offset y
  
  // Define the four segments of the ellipse with control points
  const segments = [
    // Top right
    { start: {x: cx + rx, y: cy}, cp1: {x: cx + rx, y: cy - oy}, cp2: {x: cx + ox, y: cy - ry}, end: {x: cx, y: cy - ry} },
    // Top left  
    { start: {x: cx, y: cy - ry}, cp1: {x: cx - ox, y: cy - ry}, cp2: {x: cx - rx, y: cy - oy}, end: {x: cx - rx, y: cy} },
    // Bottom left
    { start: {x: cx - rx, y: cy}, cp1: {x: cx - rx, y: cy + oy}, cp2: {x: cx - ox, y: cy + ry}, end: {x: cx, y: cy + ry} },
    // Bottom right
    { start: {x: cx, y: cy + ry}, cp1: {x: cx + ox, y: cy + ry}, cp2: {x: cx + rx, y: cy + oy}, end: {x: cx + rx, y: cy} }
  ];
  
  // Apply roughness to each point with more variation
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const variationFactor = 0.8 + 0.4 * Math.sin(i * Math.PI * 0.7); // Vary roughness around the circle
    
    // Add more variation to endpoints for sketchier appearance
    segment.start.x += (random() - 0.5) * roughness * variationFactor;
    segment.start.y += (random() - 0.5) * roughness * variationFactor;
    segment.cp1.x += (random() - 0.5) * roughness * variationFactor * 0.8;
    segment.cp1.y += (random() - 0.5) * roughness * variationFactor * 0.8;
    segment.cp2.x += (random() - 0.5) * roughness * variationFactor * 0.8;
    segment.cp2.y += (random() - 0.5) * roughness * variationFactor * 0.8;
    segment.end.x += (random() - 0.5) * roughness * variationFactor;
    segment.end.y += (random() - 0.5) * roughness * variationFactor;
  }
  
  // Build the path
  path = `M${segments[0].start.x},${segments[0].start.y}`;
  
  for (const segment of segments) {
    path += ` C${segment.cp1.x},${segment.cp1.y} ${segment.cp2.x},${segment.cp2.y} ${segment.end.x},${segment.end.y}`;
  }
  
  return path + ' Z';
}

// Calculate path length for SVG path
function calculatePathLength(d: string): number {
  const commands = d.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/g) || [];
  let totalLength = 0;
  let currentX = 0;
  let currentY = 0;

  for (const command of commands) {
    const type = command[0];
    const coords = command.slice(1).trim().split(/[\s,]+/).map(Number).filter(n => !isNaN(n));

    switch (type) {
      case 'M':
        currentX = coords[0];
        currentY = coords[1];
        break;
      case 'L':
        if (coords.length >= 2) {
          const dx = coords[0] - currentX;
          const dy = coords[1] - currentY;
          totalLength += Math.sqrt(dx * dx + dy * dy);
          currentX = coords[0];
          currentY = coords[1];
        }
        break;
      case 'Q':
        if (coords.length >= 4) {
          const dx = coords[2] - currentX;
          const dy = coords[3] - currentY;
          totalLength += Math.sqrt(dx * dx + dy * dy) * 1.1;
          currentX = coords[2];
          currentY = coords[3];
        }
        break;
      case 'C':
        if (coords.length >= 6) {
          const dx = coords[4] - currentX;
          const dy = coords[5] - currentY;
          totalLength += Math.sqrt(dx * dx + dy * dy) * 1.2;
          currentX = coords[4];
          currentY = coords[5];
        }
        break;
      case 'Z':
        break;
    }
  }

  return totalLength;
}

// Simple seeded random number generator
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

export function renderAnnotation(rect: Rect, config: RoughAnnotationConfig, seed: number): PathData[] {
  const paths: PathData[] = [];
  let strokeWidth = config.strokeWidth || 2;
  const padding = parsePadding(config);
  const iterations = config.iterations || 2;
  const rtl = config.rtl ? 1 : 0;
  const roughness = config.type === 'highlight' ? 6 : (config.type === 'circle' ? 5 : 4);
  const random = seededRandom(seed);

  switch (config.type) {
    case 'underline': {
      const y = rect.y + rect.h + padding[2];
      for (let i = rtl; i < iterations + rtl; i++) {
        const d = i % 2
          ? generateSketchyLine(rect.x + rect.w, y, rect.x, y, roughness, random)
          : generateSketchyLine(rect.x, y, rect.x + rect.w, y, roughness, random);
        
        paths.push({ d, strokeWidth, length: calculatePathLength(d) });
      }
      break;
    }
    case 'strike-through': {
      const y = rect.y + (rect.h / 2);
      for (let i = rtl; i < iterations + rtl; i++) {
        const d = i % 2
          ? generateSketchyLine(rect.x + rect.w, y, rect.x, y, roughness, random)
          : generateSketchyLine(rect.x, y, rect.x + rect.w, y, roughness, random);
        
        paths.push({ d, strokeWidth, length: calculatePathLength(d) });
      }
      break;
    }
    case 'box': {
      const x = rect.x - padding[3];
      const y = rect.y - padding[0];
      const width = rect.w + (padding[1] + padding[3]);
      const height = rect.h + (padding[0] + padding[2]);
      
      for (let i = 0; i < iterations; i++) {
        const d = generateSketchyRect(x, y, width, height, roughness, random);
        paths.push({ d, strokeWidth, length: calculatePathLength(d) });
      }
      break;
    }
    case 'bracket': {
      const brackets: BracketType[] = Array.isArray(config.brackets) ? config.brackets : (config.brackets ? [config.brackets] : ['right']);
      const lx = rect.x - padding[3] * 2;
      const rx = rect.x + rect.w + padding[1] * 2;
      const ty = rect.y - padding[0] * 2;
      const by = rect.y + rect.h + padding[2] * 2;
      
      for (const br of brackets) {
        let d = '';
        switch (br) {
          case 'bottom':
            d = `M${lx},${rect.y + rect.h} L${lx},${by} L${rx},${by} L${rx},${rect.y + rect.h}`;
            break;
          case 'top':
            d = `M${lx},${rect.y} L${lx},${ty} L${rx},${ty} L${rx},${rect.y}`;
            break;
          case 'left':
            d = `M${rect.x},${ty} L${lx},${ty} L${lx},${by} L${rect.x},${by}`;
            break;
          case 'right':
            d = `M${rect.x + rect.w},${ty} L${rx},${ty} L${rx},${by} L${rect.x + rect.w},${by}`;
            break;
        }
        if (d) {
          paths.push({ d, strokeWidth, length: calculatePathLength(d) });
        }
      }
      break;
    }
    case 'crossed-off': {
      const x = rect.x;
      const y = rect.y;
      const x2 = x + rect.w;
      const y2 = y + rect.h;
      
      for (let i = rtl; i < iterations + rtl; i++) {
        const d1 = i % 2
          ? generateSketchyLine(x2, y2, x, y, roughness, random)
          : generateSketchyLine(x, y, x2, y2, roughness, random);
        paths.push({ d: d1, strokeWidth, length: calculatePathLength(d1) });
      }
      
      for (let i = rtl; i < iterations + rtl; i++) {
        const d2 = i % 2
          ? generateSketchyLine(x, y2, x2, y, roughness, random)
          : generateSketchyLine(x2, y, x, y2, roughness, random);
        paths.push({ d: d2, strokeWidth, length: calculatePathLength(d2) });
      }
      break;
    }
    case 'circle': {
      const width = rect.w + (padding[1] + padding[3]);
      const height = rect.h + (padding[0] + padding[2]);
      const x = rect.x - padding[3] + (width / 2);
      const y = rect.y - padding[0] + (height / 2);
      
      for (let i = 0; i < iterations; i++) {
        const d = generateSketchyEllipse(x, y, width, height, roughness, random);
        paths.push({ d, strokeWidth, length: calculatePathLength(d) });
      }
      break;
    }
    case 'highlight': {
      strokeWidth = rect.h * 0.95;
      const y = rect.y + (rect.h / 2);
      
      for (let i = rtl; i < iterations + rtl; i++) {
        const d = i % 2
          ? generateSketchyLine(rect.x + rect.w, y, rect.x, y, roughness, random)
          : generateSketchyLine(rect.x, y, rect.x + rect.w, y, roughness, random);
        
        paths.push({ d, strokeWidth, length: calculatePathLength(d) });
      }
      break;
    }
  }

  return paths;
}