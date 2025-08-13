# Rough Notation Native

A React Native compatible fork of [rough-notation](https://github.com/pshihn/rough-notation) - Create and animate hand-drawn annotations in React Native and Expo apps.

## Features

- 🎨 Hand-drawn annotation styles
- 📱 React Native & Expo compatible
- 🎬 Smooth animations
- 🔧 Highly customizable
- 📦 TypeScript support

## Installation

```bash
npm install rough-notation-native rough-native react-native-svg
# or
yarn add rough-notation-native rough-native react-native-svg
```

For Expo projects:
```bash
npx expo install rough-notation-native rough-native react-native-svg
```

## Usage

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { RoughNotation } from 'rough-notation-native';

export default function App() {
  return (
    <View>
      <RoughNotation type="underline" show={true} color="#FF5733">
        <Text>This text is underlined!</Text>
      </RoughNotation>
    </View>
  );
}
```

## Annotation Types

- `underline` - Draw a sketchy underline below the content
- `box` - Draw a box around the content
- `circle` - Draw a circle around the content
- `highlight` - Highlight the content with a sketchy background
- `strike-through` - Draw a strike-through line over the content
- `crossed-off` - Draw an 'X' over the content
- `bracket` - Draw brackets around the content

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `RoughAnnotationType` | `'underline'` | The annotation style |
| `show` | `boolean` | `true` | Whether to show the annotation |
| `animate` | `boolean` | `true` | Whether to animate the annotation |
| `animationDuration` | `number` | `800` | Animation duration in milliseconds |
| `animationDelay` | `number` | `0` | Animation delay in milliseconds |
| `color` | `string` | `'#000'` | Color of the annotation |
| `strokeWidth` | `number` | `2` | Width of the annotation stroke |
| `padding` | `number \| number[]` | `5` | Padding around the annotation |
| `iterations` | `number` | `2` | Number of rough passes to make |
| `rtl` | `boolean` | `false` | Right-to-left animation |
| `brackets` | `BracketType \| BracketType[]` | `['right']` | Bracket types for bracket annotation |
| `multiline` | `boolean` | `false` | Support for multiline annotations |
| `onAnimationComplete` | `() => void` | - | Callback when animation completes |

## Examples

### Multiple Annotations

```tsx
<View>
  <RoughNotation type="box" color="#e74c3c">
    <Text>Important!</Text>
  </RoughNotation>
  
  <RoughNotation type="highlight" color="#f39c12" strokeWidth={40}>
    <Text>Highlighted content</Text>
  </RoughNotation>
  
  <RoughNotation type="circle" color="#2ecc71" padding={15}>
    <Text>Circled text</Text>
  </RoughNotation>
</View>
```

### Animated Sequence

```tsx
const [showFirst, setShowFirst] = useState(false);
const [showSecond, setShowSecond] = useState(false);

useEffect(() => {
  setTimeout(() => setShowFirst(true), 500);
  setTimeout(() => setShowSecond(true), 1500);
}, []);

return (
  <View>
    <RoughNotation type="underline" show={showFirst} color="#3498db">
      <Text>First annotation</Text>
    </RoughNotation>
    
    <RoughNotation type="box" show={showSecond} color="#e74c3c">
      <Text>Second annotation</Text>
    </RoughNotation>
  </View>
);
```

### Custom Brackets

```tsx
<RoughNotation 
  type="bracket" 
  brackets={['left', 'right']} 
  color="#34495e"
>
  <Text>Code snippet</Text>
</RoughNotation>
```

## Differences from Web Version

- Uses `rough-native` instead of `roughjs` for React Native compatibility
- Component-based API instead of imperative API
- Animations use React Native's animation system
- No DOM manipulation - pure React Native components
- Simplified API focused on React Native use cases

## License

MIT