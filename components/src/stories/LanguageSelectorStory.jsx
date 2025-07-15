import {
  LanguageProvider,
  useLanguage,
} from '../components/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';

// Component to display translated text
const TranslatedContent = () => {
  const { t } = useLanguage();

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '30px',
        marginBottom: '30px',
        textAlign: 'center',
        color: 'white',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      }}
    >
      <h2
        style={{ marginBottom: '20px', color: '#007bff' }}
      >
        {t('greeting')}
      </h2>
      <p
        style={{ fontSize: '1.2rem', marginBottom: '20px' }}
      >
        {t('description')}
      </p>
      <button
        style={{
          background:
            'linear-gradient(135deg, #007bff, #0056b3)',
          border: 'none',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '1rem',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)',
          transition: 'all 0.3s ease',
        }}
      >
        {t('cta')}
      </button>
    </div>
  );
};

const Story = () => {
  return (
    <div
      style={{
        background:
          'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        padding: '20px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <h1
          style={{
            color: 'white',
            marginBottom: '30px',
            textAlign: 'center',
          }}
        >
          Language Selector Component
        </h1>

        <LanguageProvider>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '30px',
            }}
          >
            <LanguageSelector />
          </div>

          <TranslatedContent />
        </LanguageProvider>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            color: 'white',
          }}
        >
          <h2 style={{ marginBottom: '20px' }}>
            Usage Instructions
          </h2>
          <ol style={{ lineHeight: '1.6' }}>
            <li>
              Click on the language selector in the top
              right
            </li>
            <li>
              Select a different language from the dropdown
            </li>
            <li>
              A notification should appear confirming the
              language change
            </li>
            <li>
              The selected language should have a checkmark
              next to it
            </li>
            <li>
              Refresh the page to verify that your language
              preference is remembered
            </li>
          </ol>

          <div
            style={{
              marginTop: '30px',
              padding: '15px',
              background: 'rgba(0, 123, 255, 0.2)',
              borderRadius: '8px',
            }}
          >
            <h3 style={{ marginBottom: '10px' }}>
              Features
            </h3>
            <ul style={{ lineHeight: '1.6' }}>
              <li>
                Displays flag and language code in the
                navbar
              </li>
              <li>
                Shows full language names in the dropdown
              </li>
              <li>
                Persists language selection using
                localStorage
              </li>
              <li>
                Visual feedback when changing languages
              </li>
              <li>
                Supports 16 languages including the top 10
                most spoken languages
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Story;
