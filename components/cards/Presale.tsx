import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { chains } from '@/helpers/chain';
import { useAppDispatch, useAppSelector } from '@/hooks/useConnect';
import { moneyFormat } from '@/helpers/format';
import Loading from '../common/Loading';
import { TOKEN_SYMBOL } from '@/constants/information';
import { getCurrentPrice } from '@/pages/api/currency.api';

export const Presale: React.FC<{ buyUrl: string }> = ({ buyUrl }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isLoading, setLoading] = useState<boolean>(false);
  const currentStage = useAppSelector((state) => state.currency.currentStage);
  const isEnded = useAppSelector((state) => state.currency.isEnded);
  const currencyPrices = useAppSelector((state) => state.currency.currencyPrices);

  const currency = useMemo(() => {
    if (currencyPrices) {
      return currencyPrices['ETH'];
    }
    return 0;
  }, [currencyPrices]);

  useEffect(() => {
    dispatch(getCurrentPrice('eth'));
  }, [dispatch]);

  return (
    <div className="flex flex-col bg-background_card rounded-2xl w-full h-full px-4 py-3">
      {isLoading ? (
        <div className="w-full h-full items-center justify-center flex">
          <Loading />
        </div>
      ) : (
        <>
          <div className="flex flex-row">
            <p className="text-black text-xl mb-3">{t('presale')} </p>
            <span className="text-red text-xs font-semibold">{t('ended')}</span>
          </div>

          <p className="text-black text-xl font-medium">
            1 {TOKEN_SYMBOL} = ${currentStage?.price}
          </p>
          <p className="text-text_description text-xs mb-4">
            1 USD = {moneyFormat(1 / (currency || 1))} {chains[0].value}
          </p>

          <div className="flex-1"></div>
          {/* <Link
            href={buyUrl}
            className="text-black text-sm border border-primary w-full py-2 text-center font-semibold hover:bg-primary transition duration-200 rounded-full"
          >
            Buy {TOKEN_SYMBOL} Token
          </Link> */}
        </>
      )}
    </div>
  );
};
