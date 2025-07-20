import {Dimensions, PixelRatio, Platform} from 'react-native';

export const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} =
  Dimensions.get('window');

const width = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT);
const height = Math.max(SCREEN_HEIGHT, SCREEN_WIDTH);

// based on iPhone 8's scale
const wscale = width / 360;
const hscale = height / 640;

export function normalize(size: number, based?: string) {
  if (Platform.OS === 'web') {
    return Math.round(PixelRatio.roundToNearestPixel(size));
  }
  const newSize = based === 'height' ? size * hscale : size * wscale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let globalId = 0;
export function getUniqueGlobalId() {
  return globalId++;
}

export async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
