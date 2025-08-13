import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { RoughNotation, RoughAnnotationType } from 'rough-notation-native';

const annotationTypes: RoughAnnotationType[] = [
  'underline',
  'box',
  'circle',
  'highlight',
  'strike-through',
  'crossed-off',
  'bracket'
];

export default function App() {
  const [activeType, setActiveType] = useState<RoughAnnotationType>('underline');
  const [show, setShow] = useState(true);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Rough Notation Native Demo</Text>
        
        <View style={styles.demo}>
          <RoughNotation
            type={activeType}
            show={show}
            color="#FF5733"
            animationDuration={1000}
            padding={activeType === 'highlight' ? 0 : 5}
          >
            <Text style={styles.annotatedText}>
              This text has a {activeType} annotation!
            </Text>
          </RoughNotation>
        </View>

        <View style={styles.controls}>
          <Text style={styles.label}>Select annotation type:</Text>
          {annotationTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.button,
                activeType === type && styles.activeButton
              ]}
              onPress={() => setActiveType(type)}
            >
              <Text style={[
                styles.buttonText,
                activeType === type && styles.activeButtonText
              ]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, styles.toggleButton]}
          onPress={() => setShow(!show)}
        >
          <Text style={styles.buttonText}>
            {show ? 'Hide' : 'Show'} Annotation
          </Text>
        </TouchableOpacity>

        <View style={styles.examples}>
          <Text style={styles.sectionTitle}>More Examples:</Text>
          
          <View style={styles.example}>
            <RoughNotation type="underline" color="#3498db">
              <Text style={styles.exampleText}>Underlined text</Text>
            </RoughNotation>
          </View>

          <View style={styles.example}>
            <RoughNotation type="box" color="#e74c3c">
              <Text style={styles.exampleText}>Boxed text</Text>
            </RoughNotation>
          </View>

          <View style={styles.example}>
            <RoughNotation type="circle" color="#2ecc71">
              <Text style={styles.exampleText}>Circled text</Text>
            </RoughNotation>
          </View>

          <View style={styles.example}>
            <RoughNotation type="highlight" color="#f39c12" strokeWidth={40}>
              <Text style={styles.exampleText}>Highlighted text</Text>
            </RoughNotation>
          </View>

          <View style={styles.example}>
            <RoughNotation type="strike-through" color="#9b59b6">
              <Text style={styles.exampleText}>Strike-through text</Text>
            </RoughNotation>
          </View>

          <View style={styles.example}>
            <RoughNotation type="bracket" brackets={['left', 'right']} color="#34495e">
              <Text style={styles.exampleText}>Bracketed text</Text>
            </RoughNotation>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  demo: {
    alignItems: 'center',
    marginBottom: 30,
    minHeight: 100,
    justifyContent: 'center',
  },
  annotatedText: {
    fontSize: 20,
    color: '#333',
    padding: 10,
  },
  controls: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
    color: '#666',
  },
  button: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeButton: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
  activeButtonText: {
    color: '#fff',
  },
  toggleButton: {
    backgroundColor: '#2ecc71',
    borderColor: '#2ecc71',
    marginBottom: 40,
  },
  examples: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  example: {
    marginBottom: 25,
    alignItems: 'flex-start',
  },
  exampleText: {
    fontSize: 18,
    color: '#333',
    padding: 5,
  },
});