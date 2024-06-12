import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// https://translate.i18next.com: use this tool
// https://textedit.tools/snakecase

import cn from './locales/cn/translation.json';
import de from './locales/de/translation.json';
import gb from './locales/gb/translation.json';
import es from './locales/es/translation.json';
import fr from './locales/fr/translation.json';
import id from './locales/id/translation.json';
import it from './locales/it/translation.json';
import ni from './locales/ni/translation.json';
import pt from './locales/pt/translation.json';
import ru from './locales/ru/translation.json';
import tr from './locales/tr/translation.json';
import { store } from '@/store';

// { key: "gb", name: "English" }
// { key: "de", name: "Germany" }
// { key: "es", name: "Spanish" }
// { key: "fr", name: "French" }
// { key: "pt", name: "Portuguese" }
// { key: "tr", name: "Turkish" }
// { key: "ru", name: "Russian" }
// { key: "it", name: "Italian" }
// { key: "id", name: "Indonesia" }
// { key: "ni", name: "Arabic" }
// { key: "cn", name: "China" }

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      de: {
        translation: de,
      },
      cn: {
        translation: cn,
      },
      gb: {
        translation: gb,
      },
      es: {
        translation: es,
      },
      fr: {
        translation: fr,
      },
      id: {
        translation: id,
      },
      it: {
        translation: it,
      },
      ni: {
        translation: ni,
      },
      pt: {
        translation: pt,
      },
      ru: {
        translation: ru,
      },
      tr: {
        translation: tr,
      },
    },
    lng: store.getState().settings.language || 'gb',
    fallbackLng: 'gb',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
