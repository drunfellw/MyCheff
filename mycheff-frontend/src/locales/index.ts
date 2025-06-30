import tr from './tr.json';
import en from './en.json';

export const translations = {
  tr,
  en,
};

export type TranslationKeys = keyof typeof tr; 