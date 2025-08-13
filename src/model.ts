export const DEFAULT_ANIMATION_DURATION = 800;

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type RoughAnnotationType = 'underline' | 'box' | 'circle' | 'highlight' | 'strike-through' | 'crossed-off' | 'bracket';
export type FullPadding = [number, number, number, number];
export type Padding = number | [number, number] | FullPadding;
export type BracketType = 'left' | 'right' | 'top' | 'bottom';

export interface RoughAnnotationConfig {
  type: RoughAnnotationType;
  animate?: boolean;
  animationDuration?: number;
  color?: string;
  strokeWidth?: number;
  padding?: Padding;
  multiline?: boolean;
  iterations?: number;
  rtl?: boolean;
  brackets?: BracketType | BracketType[];
}