import { TOKEN_SYMBOL } from '@/constants/information';
import { chains } from '@/helpers/chain';
import { Chain } from '@/types';
import Image from 'next/image';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const Step1 = ({ chain, onSelect }: { chain: Chain; onSelect: Function }) => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[auto_1fr] w-full gap-5">
      <p className="text-white text-sm font-semibold mt-0.5 w-12">{t('step')} 1</p>
      <div className="w-full max-w-[720px]">
        <div className="mb-5">
          <p className="text-base text-black font-bold mb-2">{t('step_1_title')}</p>
          <p className="text-sm text-black">{t('step_1_description', { value: TOKEN_SYMBOL })}</p>
        </div>
        <div className="relative w-full">
          {show && (
            <div className="border-2 border-gray_border overscroll-contain z-10 bg-background_card w-full absolute top-12 left-0 flex flex-col gap-5 p-3">
              {chains.map((e, index) => {
                return (
                  <div
                    onClick={() => {
                      setShow(false);
                      onSelect(e);
                    }}
                    key={index}
                    className="flex flex-row gap-2"
                  >
                    <Image src={e.icon} width={15} height={15} alt="Icon" />
                    <p className="text-xs text-black">{e.label}</p>
                  </div>
                );
              })}
            </div>
          )}

          <div
            onClick={() => setShow((cur) => !cur)}
            className="flex flex-row h-10 w-full items-center gap-2 px-2 rounded-full bg-background_card"
          >
            {!!chain?.icon && <Image src={chain.icon} width={20} height={20} alt="ChainIcon" />}

            <p className="text-sm text-black">{chain?.label}</p>
            <div className="flex-1" />
            <Image src={'/svg/icon-dropdown.svg'} width={20} height={20} alt="dropdown" />
          </div>
        </div>
      </div>
    </div>
  );
};
