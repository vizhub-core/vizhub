import { Footer } from '../Footer';
import { useLanguage } from '../LanguageContext';
import './styles.scss';

export const CreateVizPageBody = ({
  // Viz preview list props.
  renderVizPreviews,
}) => {
  const { t } = useLanguage();

  return (
    <div className="vh-page vh-create-viz-page">
      <div className="create-viz-content vh-page-container">
        <div className="create-viz-header">
          <div className="header-content">
            <h1>{t('create.page.title')}</h1>
            <div className="vh-lede-01">
              {t('create.page.subtitle')
                .split(' ')
                .map((word, index, array) => {
                  if (
                    word ===
                    t('create.page.subtitle.emphasized')
                  ) {
                    return (
                      <span key={index}>
                        <span className="emphasized">
                          {word}
                        </span>
                        {index === array.length - 1
                          ? ''
                          : ' '}
                      </span>
                    );
                  }
                  return index === array.length - 1
                    ? word
                    : word + ' ';
                })}
            </div>
            <p className="create-viz-description">
              {t('create.page.description')}
            </p>
          </div>
        </div>

        {renderVizPreviews()}
      </div>
      <Footer />
    </div>
  );
};
