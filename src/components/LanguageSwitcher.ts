/**
 * Language Switcher Component
 *
 * A reusable component that allows users to switch between available languages.
 * The selected language is persisted to localStorage.
 */

import { getCurrentLocale, setCurrentLocale, getLocales, languageNames, type Locale } from '../i18n/utils';

export class LanguageSwitcher {
  private container: HTMLElement;
  private currentLocale: Locale;

  constructor(containerId: string) {
    const element = document.getElementById(containerId);
    if (!element) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.container = element;
    this.currentLocale = getCurrentLocale();
    this.render();
    this.attachEventListeners();
  }

  private render(): void {
    const locales = getLocales();

    this.container.innerHTML = `
      <div class="inline-flex items-center gap-2 bg-white rounded-lg shadow-md border border-gray-200 p-1">
        ${locales.map(locale => `
          <button
            type="button"
            class="language-btn px-3 py-2 rounded-md text-sm font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              locale === this.currentLocale
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }"
            data-locale="${locale}"
            aria-label="Switch to ${languageNames[locale].english}"
            ${locale === this.currentLocale ? 'aria-current="true"' : ''}
          >
            ${languageNames[locale].native}
          </button>
        `).join('')}
      </div>
    `;
  }

  private attachEventListeners(): void {
    this.container.querySelectorAll('.language-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const locale = target.dataset.locale as Locale;

        if (locale && locale !== this.currentLocale) {
          this.changeLanguage(locale);
        }
      });
    });
  }

  private changeLanguage(locale: Locale): void {
    this.currentLocale = locale;
    setCurrentLocale(locale);
    this.render();
    this.attachEventListeners();

    // Dispatch event for app to re-render with new locale
    window.dispatchEvent(new CustomEvent('languagechange', { detail: { locale } }));
  }

  /**
   * Updates the switcher to reflect the current locale
   */
  public update(): void {
    this.currentLocale = getCurrentLocale();
    this.render();
    this.attachEventListeners();
  }
}

/**
 * Creates a language switcher in the specified container
 * @param containerId - The ID of the container element
 * @returns The LanguageSwitcher instance
 */
export function createLanguageSwitcher(containerId: string): LanguageSwitcher {
  return new LanguageSwitcher(containerId);
}