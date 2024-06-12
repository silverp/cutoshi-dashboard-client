import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ProgressBar from '@ramonak/react-progress-bar';
import { useAppDispatch, useAppSelector } from '@/hooks/useConnect';
import { thousandsFormat } from '@/helpers/format';

import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../tailwind.config.js';
import { getCurrentBonus } from '@/pages/api/currency.api';

const fullConfig = resolveConfig(tailwindConfig);

export const SaleProgress = () => {
  const { t } = useTranslation();
  const { currentStage, currentStageRaised = 0 } = useAppSelector((state) => state.currency);
  const currentBonus = useAppSelector((state) => state.currency.currentBonus);
  const dispatch = useAppDispatch();

  const percent = useMemo(() => {
    if (!currentStage.amount) return 0;
    try {
      return Number(Math.min(100, (currentStageRaised / currentStage.amount) * 100).toFixed(1));
    } catch (error) {
      return 0;
    }
  }, [currentStageRaised, currentStage?.amount]);

  useEffect(() => {
    const element = document.querySelector('.process-bar-label') as HTMLSpanElement;
    if (element) {
      const parent = element.parentNode as HTMLElement;
      if (parent && !parent.classList.contains('process-bar-label-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('process-bar-label-wrapper');
        parent.replaceChild(wrapper, element);
        wrapper.appendChild(element);

        const ping = document.createElement('div');
        ping.classList.add('process-bar-label-ping');
        wrapper.appendChild(ping);
      }
    }
  }, [percent]);

  useEffect(() => {
    dispatch(getCurrentBonus());
  }, [dispatch]);

  return (
    <div className="flex flex-col py-3 px-4">
      <p className="text-black text-2xl lg:text-4xl font-bold mb-4 font-playfair">
        {t('token_sales_progress')}
      </p>

      <div className="flex flex-row gap-2 items-center justify-between mb-6">
        <div>
          <p className="text-xs text-text_description font-semibold mb-2">{t('raised_amount')}</p>
          <p className="text-xl text-background_1 font-medium text-start">
            {thousandsFormat(currentStageRaised)} Cutoshi
          </p>
        </div>

        <div className="flex flex-col items-end">
          <p className="text-xs text-text_description font-semibold mb-2">{t('total_token')}</p>
          <p className="text-xl text-background_1 font-medium text-end">
            {thousandsFormat(currentStage.amount)} Cutoshi
          </p>
        </div>
      </div>

      <ProgressBar
        completed={percent}
        bgColor={fullConfig.theme?.colors?.['primary'] as string}
        borderRadius="0"
        baseBgColor={fullConfig.theme?.colors?.['background_card'] as string}
        labelColor={fullConfig.theme?.colors?.['background_1'] as string}
        labelSize="1rem"
        animateOnRender
        maxCompleted={100}
        className="mb-6 [&>div]:!overflow-visible"
        labelAlignment="right"
        labelClassName="process-bar-label"
      />

      {currentBonus && <p className="text-base text-black font-semibold">{currentBonus?.name}</p>}
    </div>
  );
};
