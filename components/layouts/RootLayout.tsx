import { useAppSelector } from '@/hooks/useConnect';
import Script from 'next/script';
import React, { ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

type RootProps = {
  children: ReactNode;
};

const RootLayout: React.FC<RootProps> = ({ children }) => {
  const language = useAppSelector((state) => state.settings.language);
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  return <>{children}</>;
};

export default RootLayout;
