// Global type definitions for React Native and Expo

declare global {
  // React Native global variables
  var __DEV__: boolean;
  
  // Process environment variables
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_API_URL?: string;
      EXPO_PUBLIC_API_VERSION?: string;
      EXPO_PUBLIC_ENVIRONMENT?: string;
    }
  }
}

// Expo specific types
declare module 'expo' {
  export * from 'expo/build/Expo.types';
}

// React Native Vector Icons
declare module 'react-native-vector-icons/Ionicons' {
  import { Component } from 'react';
  import { TextStyle, ViewStyle } from 'react-native';

  interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: TextStyle | ViewStyle;
  }

  export default class Icon extends Component<IconProps> {}
}

// Expo Vector Icons
declare module '@expo/vector-icons' {
  export { Ionicons } from '@expo/vector-icons/build/vendor/react-native-vector-icons';
}

// React Native Responsive Dimensions
declare module 'react-native-responsive-dimensions' {
  export function widthPercentageToDP(widthPercent: string | number): number;
  export function heightPercentageToDP(heightPercent: string | number): number;
  export function listenOrientationChange(callback: (orientation: any) => void): void;
  export function removeOrientationListener(): void;
}

// AsyncStorage
declare module '@react-native-async-storage/async-storage' {
  interface AsyncStorageStatic {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
    mergeItem(key: string, value: string): Promise<void>;
    clear(): Promise<void>;
    getAllKeys(): Promise<string[]>;
    multiGet(keys: string[]): Promise<[string, string | null][]>;
    multiSet(keyValuePairs: [string, string][]): Promise<void>;
    multiRemove(keys: string[]): Promise<void>;
    multiMerge(keyValuePairs: [string, string][]): Promise<void>;
  }

  const AsyncStorage: AsyncStorageStatic;
  export default AsyncStorage;
}

export {}; 