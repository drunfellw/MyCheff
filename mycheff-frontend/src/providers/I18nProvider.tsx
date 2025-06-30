import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { translations } from '../locales';

type SupportedLanguage = 'tr' | 'en';

interface I18nContextType {
  locale: SupportedLanguage;
  t: (key: string, params?: Record<string, string | number>) => string;
  changeLanguage: (language: SupportedLanguage) => Promise<void>;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const STORAGE_KEY = '@mycheff_language';

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

interface I18nProviderProps {
  children: ReactNode;
}

// Get device language or fallback to Turkish
const getDeviceLanguage = (): SupportedLanguage => {
  const deviceLanguage = Localization.locale.split('-')[0];
  return (deviceLanguage === 'en' || deviceLanguage === 'tr') ? deviceLanguage as SupportedLanguage : 'tr';
};

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [locale, setLocale] = useState<SupportedLanguage>('tr');

  useEffect(() => {
    loadStoredLanguage();
  }, []);

  const loadStoredLanguage = async () => {
    try {
      const storedLanguage = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedLanguage && (storedLanguage === 'tr' || storedLanguage === 'en')) {
        setLocale(storedLanguage as SupportedLanguage);
      } else {
        // Use device language as fallback
        const deviceLang = getDeviceLanguage();
        setLocale(deviceLang);
        await AsyncStorage.setItem(STORAGE_KEY, deviceLang);
      }
    } catch (error) {
      console.error('Error loading stored language:', error);
      setLocale('tr');
    }
  };

  const changeLanguage = async (language: SupportedLanguage) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, language);
      setLocale(language);
    } catch (error) {
      console.error('Error storing language:', error);
    }
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let translation: any = translations[locale];
    
    for (const k of keys) {
      if (translation && typeof translation === 'object' && k in translation) {
        translation = translation[k];
      } else {
        // Fallback to English if key not found in current language
        let englishTranslation: any = translations['en'];
        for (const fallbackK of keys) {
          if (englishTranslation && typeof englishTranslation === 'object' && fallbackK in englishTranslation) {
            englishTranslation = englishTranslation[fallbackK];
          } else {
            // Ultimate fallback to key itself
            console.warn(`Translation key not found: ${key} for locale: ${locale}`);
            return key;
          }
        }
        translation = englishTranslation;
        break;
      }
    }

    if (typeof translation !== 'string') {
      console.warn(`Translation is not a string: ${key} for locale: ${locale}`);
      return key;
    }

    // Replace parameters
    if (params) {
      let result = translation;
      Object.entries(params).forEach(([paramKey, value]) => {
        result = result.replace(`{{${paramKey}}}`, String(value));
      });
      return result;
    }

    return translation;
  };

  const value: I18nContextType = {
    locale,
    t,
    changeLanguage,
    isRTL: false, // Turkish and English are LTR languages
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}; 