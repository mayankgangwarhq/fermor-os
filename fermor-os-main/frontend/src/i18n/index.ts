import { Language } from '../types';
import en from './locales/en';
import hi from './locales/hi';
import mr from './locales/mr';
import ur from './locales/ur';
import bn from './locales/bn';
import gu from './locales/gu';
import pa from './locales/pa';
import ta from './locales/ta';
import te from './locales/te';
import kn from './locales/kn';
import ml from './locales/ml';
import or from './locales/or';
import as from './locales/as';
import ne from './locales/ne';
import sa from './locales/sa';
import fa from './locales/fa';
import ar from './locales/ar';

export type TranslationKey = keyof typeof en;

export const locales: Record<Language, Record<string, string>> = {
  en,
  hi,
  mr,
  ur,
  bn,
  gu,
  pa,
  ta,
  te,
  kn,
  ml,
  or,
  as,
  ne,
  sa,
  fa,
  ar,
};

/**
 * Global translation resolver with fallback to English and then to the provided fallback text or raw key.
 */
export function translate(lang: Language, key: string, fallback?: string): string {
  const currentLocale = locales[lang];
  if (currentLocale && currentLocale[key]) {
    return currentLocale[key];
  }
  // Fallback to English
  if (locales.en && locales.en[key]) {
    return locales.en[key];
  }
  return fallback || key;
}

export * from './languages';
