import Image from 'next/image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

const urls = [
  {
    icon: '/svg/x.svg',
    label: 'Twitter',
    url: 'https://twitter.com/EverlodgeHQ',
  },
  {
    icon: '/svg/telegram.svg',
    label: 'Telegram',
    url: 'https://t.me/cutoshi',
  },
];

export const Community = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col bg-background_card py-3 px-4 rounded-2xl">
      <p className="text-black text-xl font-medium mb-5">{t('join_our_community')}</p>

      <div className="flex flex-col gap-2 items-center">
        {urls.map((e, index) => (
          <Link
            target="_blank"
            key={index}
            href={e.url}
            className="flex items-center w-full h-auto rounded-lg bg-background_1 p-4 gap-4"
          >
            <Image width={24} height={24} className="object-contain" src={e.icon} alt="X" />
            <p className="text-sm text-white font-medium">{e.label}</p>
            <div className="flex-1"></div>
            <Image
              width={21}
              height={21}
              className="object-contain"
              src="/svg/right-arrow.svg"
              alt="Icon"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};
