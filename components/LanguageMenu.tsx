import { useAppDispatch } from '@/hooks/useConnect';
import { setLanguage } from '@/store/settings.slice';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { key: 'gb', name: 'English' },
  { key: 'de', name: 'Germany' },
  { key: 'es', name: 'Spanish' },
  { key: 'fr', name: 'French' },
  { key: 'pt', name: 'Portuguese' },
  { key: 'tr', name: 'Turkish' },
  { key: 'ru', name: 'Russian' },
  { key: 'it', name: 'Italian' },
  { key: 'id', name: 'Indonesia' },
  { key: 'ni', name: 'Arabic' },
  { key: 'cn', name: 'China' },
];

const LANGUAGE_SELECTOR_ID = 'language-selector';

export const LanguageMenu = () => {
  const [isShowingModel, setShowingModel] = useState(false);
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();

  const selectedLanguage = languages.find((language) => language.key === i18n.language);

  const handleLanguageChange = async (language: { key: string; name: string }) => {
    dispatch(setLanguage(language.key));
    setShowingModel(false);
  };

  useEffect(() => {
    const handleWindowClick = (event: any) => {
      const target = event.target.closest('button');
      if (target && target.id === LANGUAGE_SELECTOR_ID) {
        return;
      }
      setShowingModel(false);
    };
    window.addEventListener('click', handleWindowClick);
    return () => {
      window.removeEventListener('click', handleWindowClick);
    };
  }, []);

  return (
    <div className="relative w-auto">
      <button
        onClick={() => {
          setShowingModel((prev) => !prev);
        }}
        id={LANGUAGE_SELECTOR_ID}
        className="btn btn-link btn-sm border-0 flex flex-row items-center gap-2 text-white text-sm"
      >
        <span className={`fi fi-${selectedLanguage?.key} mr-[2px]`} />
        {selectedLanguage?.name}
      </button>

      {isShowingModel && (
        <div
          className="absolute bottom-11 left-0 mt-2.5 p-3 rounded-sm shadow-lg bg-white w-32"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby={LANGUAGE_SELECTOR_ID}
        >
          <div className="py-[1px] grid grid-cols-1 gap-2.5" role="none">
            {languages.map((language, index) => {
              return (
                <div
                  key={index}
                  onClick={() => handleLanguageChange(language)}
                  className={classNames(
                    selectedLanguage?.key === language.key && 'bg-border-gray',
                    'px-1 py-1 text-sm text-start items-center inline-flex hover:bg-border-gray text-guerrilla cursor-pointer',
                  )}
                  role="menuitem"
                >
                  <span className={`fi fi-${language.key} mr-1`}></span>
                  <span className="truncate ml-2.5 text-dark">{language.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
