import React, { useEffect, useRef, useState, useMemo } from 'react';
import { View, ViewStyle, Animated, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { RoughAnnotationConfig, RoughAnnotationType, Padding, BracketType } from './model';
import { renderAnnotation } from './render';
import { randomSeed } from './utils';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export interface RoughNotationProps {
  children: React.ReactNode;
  type?: RoughAnnotationType;
  animate?: boolean;
  animationDuration?: number;
  animationDelay?: number;
  color?: string;
  strokeWidth?: number;
  padding?: Padding;
  multiline?: boolean;
  iterations?: number;
  rtl?: boolean;
  brackets?: BracketType | BracketType[];
  show?: boolean;
  style?: ViewStyle;
  onAnimationComplete?: () => void;
}

export const RoughNotation: React.FC<RoughNotationProps> = ({
  children,
  type = 'underline',
  animate = true,
  animationDuration = 800,
  animationDelay = 0,
  color = '#000',
  strokeWidth = 2,
  padding = 5,
  multiline = false,
  iterations = 2,
  rtl = false,
  brackets,
  show = true,
  style,
  onAnimationComplete
}) => {
  const containerRef = useRef<View>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, x: 0, y: 0 });
  const animatedValues = useRef<Animated.Value[]>([]);
  const seed = useMemo(() => randomSeed(), []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.measure((_x, _y, width, height, pageX, pageY) => {
        setDimensions({ width, height, x: pageX, y: pageY });
      });
    }
  }, [children]);

  const config: RoughAnnotationConfig = {
    type,
    animate,
    animationDuration,
    color,
    strokeWidth,
    padding,
    multiline,
    iterations,
    rtl,
    brackets
  };

  const paths = useMemo(() => {
    if (!show || dimensions.width === 0 || dimensions.height === 0) {
      return [];
    }
    
    const rect = {
      x: 0,
      y: 0,
      w: dimensions.width,
      h: dimensions.height
    };
    
    return renderAnnotation(rect, config, seed);
  }, [show, dimensions, config, seed]);

  // Initialize animated values for each path
  useEffect(() => {
    if (paths.length > animatedValues.current.length) {
      const diff = paths.length - animatedValues.current.length;
      for (let i = 0; i < diff; i++) {
        animatedValues.current.push(new Animated.Value(0));
      }
    }
  }, [paths]);

  // Run animations when show changes or paths update
  useEffect(() => {
    if (show && animate && paths.length > 0) {
      // Reset all animations
      animatedValues.current.forEach(av => av.setValue(0));

      // Determine if we should run animations sequentially or in parallel
      const isLinearType = ['underline', 'strike-through', 'highlight'].includes(type);
      
      if (isLinearType && paths.length > 1) {
        // For linear annotations with multiple paths, run sequentially
        // Each path gets a portion of the total duration
        const pathDuration = animationDuration / paths.length;
        
        // Create sequential animations
        const animations: Animated.CompositeAnimation[] = [];
        
        // Add initial delay if specified
        if (animationDelay > 0) {
          animations.push(Animated.delay(animationDelay));
        }
        
        // Add each path animation in sequence
        paths.forEach((_, index) => {
          animations.push(
            Animated.timing(animatedValues.current[index], {
              toValue: 1,
              duration: pathDuration,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: false
            })
          );
        });

        // Run animations in sequence
        Animated.sequence(animations).start(({ finished }) => {
          if (finished && onAnimationComplete) {
            onAnimationComplete();
          }
        });
      } else {
        // For other types (box, circle, etc.) or single path, use parallel with stagger
        const animations = paths.map((_, index) => {
          const pathDelay = animationDelay + (index * 100); // 100ms stagger
          return Animated.timing(animatedValues.current[index], {
            toValue: 1,
            duration: animationDuration,
            delay: pathDelay,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false
          });
        });

        // Run all animations in parallel
        Animated.parallel(animations).start(({ finished }) => {
          if (finished && onAnimationComplete) {
            onAnimationComplete();
          }
        });
      }
    } else if (show && !animate) {
      // If not animating, set all values to 1 immediately
      animatedValues.current.forEach(av => av.setValue(1));
    } else if (!show) {
      // Hide immediately
      animatedValues.current.forEach(av => av.setValue(0));
    }
  }, [show, animate, paths, animationDuration, animationDelay, onAnimationComplete, type]);

  const renderPaths = (): React.ReactElement[] => {
    if (!paths.length || !show) return [];
    
    return paths.map((pathData, index) => {
      if (!animate) {
        // No animation - render regular path
        return (
          <Path
            key={index}
            d={pathData.d}
            fill="none"
            stroke={color}
            strokeWidth={pathData.strokeWidth}
          />
        );
      }

      // Get animated value for this path
      const animatedValue = animatedValues.current[index];
      if (!animatedValue) {
        return (
          <Path
            key={index}
            d={pathData.d}
            fill="none"
            stroke={color}
            strokeWidth={pathData.strokeWidth}
          />
        );
      }

      // Calculate animated stroke properties
      const strokeDasharray = pathData.length;
      const animatedStrokeDashoffset = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [pathData.length, 0]
      });

      return (
        <AnimatedPath
          key={index}
          d={pathData.d}
          fill="none"
          stroke={color}
          strokeWidth={pathData.strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={animatedStrokeDashoffset}
        />
      );
    });
  };

  return (
    <View ref={containerRef} style={[{ position: 'relative' }, style]}>
      {children}
      {dimensions.width > 0 && (
        <Svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: dimensions.width,
            height: dimensions.height,
            pointerEvents: 'none',
            overflow: 'visible'
          }}
          width={dimensions.width}
          height={dimensions.height}
        >
          {renderPaths()}
        </Svg>
      )}
    </View>
  );
};

export { RoughAnnotationType, Padding, BracketType } from './model';