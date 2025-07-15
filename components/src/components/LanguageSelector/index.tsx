import React, { useEffect } from 'react';
import { Dropdown } from '../bootstrap';
import { useLanguage } from '../LanguageContext';
import './styles.css';

export const LanguageSelector = () => {
  const { currentLanguage, setLanguage, languages } = useLanguage();

  // Initialize language from localStorage on component mount
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem('preferredLanguage');
      if (savedLanguage) {
        const language = languages.find(lang => lang.code === savedLanguage);
        if (language) {
          setLanguage(language);
        }
      }
    } catch (error) {
      console.warn('Error accessing localStorage:', error);
    }
  }, [languages, setLanguage]);

  return (
    <Dropdown align="end" className="language-selector">
      <Dropdown.Toggle 
        as="div" 
        id="language-dropdown"
        className="language-selector-toggle"
      >
        <span className="language-flag">{currentLanguage.flag}</span>
        <span className="language-code d-none d-md-inline">{currentLanguage.code.toUpperCase()}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {languages.map((language) => (
          <Dropdown.Item 
            key={language.code}
            onClick={() => setLanguage(language)}
            active={currentLanguage.code === language.code}
            className="language-item"
          >
            <span className="language-flag me-2">{language.flag}</span>
            <span className="language-name">{language.name}</span>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};
