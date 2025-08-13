declare module 'react-native-svg' {
  import React from 'react';
  import { ViewStyle } from 'react-native';

  export interface SvgProps {
    width?: number | string;
    height?: number | string;
    style?: ViewStyle;
    children?: React.ReactNode;
  }

  export interface PathProps {
    d: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number | string;
    strokeDasharray?: number | string;
    strokeDashoffset?: number | string;
  }

  export const Svg: React.FC<SvgProps>;
  export const Path: React.FC<PathProps>;
  export default Svg;
}