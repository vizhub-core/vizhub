import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
} from 'react';
import { translations } from './translations';

type Language = {
  code: string;
  name: string;
  flag: string;
};

type LanguageContextType = {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  languages: Language[];
  t: (key: string) => string;
};

// Top 10 most spoken languages in the world by number of native speakers
export const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文 (Chinese)', flag: '🇨🇳' },
  { code: 'es', name: 'Español (Spanish)', flag: '🇪🇸' },
  { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'ar', name: 'العربية (Arabic)', flag: '🇸🇦' },
  { code: 'bn', name: 'বাংলা (Bengali)', flag: '🇧🇩' },
  {
    code: 'pt',
    name: 'Português (Portuguese)',
    flag: '🇧🇷',
  },
  { code: 'ru', name: 'Русский (Russian)', flag: '🇷🇺' },
  { code: 'ja', name: '日本語 (Japanese)', flag: '🇯🇵' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳' },
  // Additional languages
  { code: 'fr', name: 'Français (French)', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch (German)', flag: '🇩🇪' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ur', name: 'اردو (Urdu)', flag: '🇵🇰' },
  { code: 'mr', name: 'मराठी (Marathi)', flag: '🇮🇳' },
  { code: 'ko', name: '한국어 (Korean)', flag: '🇰🇷' },
];

const LanguageContext = createContext<
  LanguageContextType | undefined
>(undefined);

export const LanguageProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // Set English as the default language
  const [currentLanguage, setCurrentLanguage] =
    useState<Language>(languages[0]);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    // Here you would implement the actual language change logic
    // For example, using i18n library
    document.documentElement.lang = language.code;
    localStorage.setItem(
      'preferredLanguage',
      language.code,
    );

    // Show a visual notification when language changes
    const notification = document.createElement('div');
    notification.textContent = `Language changed to ${language.name}`;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#007bff';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '8px';
    notification.style.boxShadow =
      '0 4px 12px rgba(0, 0, 0, 0.2)';
    notification.style.zIndex = '9999';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease';

    document.body.appendChild(notification);

    // Fade in
    setTimeout(() => {
      notification.style.opacity = '1';
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  // Translation function
  const t = (key: string) => {
    const langTranslations =
      translations[
        currentLanguage.code as keyof typeof translations
      ] || translations.en;
    return (
      (langTranslations as any)[key] ||
      (translations.en as any)[key] ||
      key
    );
  };

  return (
    <LanguageContext.Provider
      value={{ currentLanguage, setLanguage, languages, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    // Return a default context instead of throwing an error
    // This helps prevent crashes when the provider isn't available
    return {
      currentLanguage: languages[0],
      setLanguage: () =>
        console.warn('LanguageProvider not found'),
      languages,
      t: (key: string) => key, // Return the key as fallback
    };
  }
  return context;
};
