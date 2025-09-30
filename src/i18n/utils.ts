/**
 * i18n Utilities
 *
 * This module provides translation utilities for the Kudos Class application.
 * It supports Danish (da) as the default language and English (en) as a secondary language.
 *
 * The translation system is designed to be compatible with Weblate for future integration.
 */

export type Locale = 'da' | 'en';

export const defaultLocale: Locale = 'da';
export const locales: Locale[] = ['da', 'en'];

// Language display names
export const languageNames: Record<Locale, { native: string; english: string }> = {
  da: { native: 'Dansk', english: 'Danish' },
  en: { native: 'English', english: 'English' }
};

// Translation dictionaries - loaded dynamically
let translations: Record<Locale, any> = {
  da: {},
  en: {}
};

/**
 * Loads translation files for a specific locale
 */
async function loadTranslations(locale: Locale): Promise<void> {
  try {
    const module = await import(`./locales/${locale}.json`);
    translations[locale] = module.default;
  } catch (error) {
    console.error(`Failed to load translations for locale: ${locale}`, error);
  }
}

/**
 * Initializes the i18n system by loading all translation files
 */
export async function initI18n(): Promise<void> {
  await Promise.all(locales.map(locale => loadTranslations(locale)));
}

/**
 * Gets a nested translation value from the translations object
 * @param obj - The object to traverse
 * @param path - The path to the value (e.g., 'setup.className.label')
 * @returns The translation string or undefined if not found
 */
function getNestedValue(obj: any, path: string): string | undefined {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Gets a translation for a given key and locale
 * @param key - The translation key (e.g., 'setup.className.label')
 * @param locale - The locale to use (defaults to default locale)
 * @param fallback - Optional fallback string if translation not found
 * @returns The translated string
 */
export function t(key: string, locale: Locale = defaultLocale, fallback?: string): string {
  const translation = getNestedValue(translations[locale], key);

  if (translation) {
    return translation;
  }

  // Fallback to default locale if different
  if (locale !== defaultLocale) {
    const defaultTranslation = getNestedValue(translations[defaultLocale], key);
    if (defaultTranslation) {
      return defaultTranslation;
    }
  }

  // Use fallback or return key
  return fallback || key;
}

/**
 * Gets the current locale from localStorage or returns the default
 */
export function getCurrentLocale(): Locale {
  if (typeof window === 'undefined') {
    return defaultLocale;
  }

  const stored = localStorage.getItem('kudos-locale');
  if (stored && locales.includes(stored as Locale)) {
    return stored as Locale;
  }

  return defaultLocale;
}

/**
 * Sets the current locale in localStorage
 */
export function setCurrentLocale(locale: Locale): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (!locales.includes(locale)) {
    console.error(`Invalid locale: ${locale}`);
    return;
  }

  localStorage.setItem('kudos-locale', locale);

  // Dispatch custom event for locale change
  window.dispatchEvent(new CustomEvent('localechange', { detail: { locale } }));
}

/**
 * Gets all available locales
 */
export function getLocales(): Locale[] {
  return [...locales];
}

/**
 * Checks if a locale is valid
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

/**
 * Gets the language name for a locale
 */
export function getLanguageName(locale: Locale, displayLocale?: Locale): string {
  return displayLocale ? languageNames[locale][displayLocale === 'en' ? 'english' : 'native'] : languageNames[locale].native;
}