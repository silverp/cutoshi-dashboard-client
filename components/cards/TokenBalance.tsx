import { TOKEN_SYMBOL } from '@/constants/information';
import { thousandsFormat } from '@/helpers/format';
import { useAppSelector } from '@/hooks/useConnect';
import Image from 'next/image';
import React from 'react';
import { useTranslation } from 'react-i18next';

const TokenBalance: React.FC<{ buyUrl: string }> = ({ buyUrl }) => {
  const { t } = useTranslation();
  const balance = useAppSelector((state) => state.account.balance);

  return (
    <div className="flex flex-col bg-background_card w-full h-full rounded-2xl">
      <div className="flex flex-row gap-1 px-4 pt-3 mb-2">
        <p className="text-black text-xl">
          <span className="font-bold">${TOKEN_SYMBOL}</span> {t('token_balance')}
        </p>
        <div className="group relative flex justify-center items-center">
          <Image
            src="/svg/info.svg"
            alt="logo"
            width={16}
            height={16}
            className="w-4 h-4 object-contain"
          />
          <span className="z-50 absolute left-4 scale-0 rounded bg-dark w-[20rem] p-2 text-xs text-white group-hover:scale-100">
            Total Token Balance shows the number of tokens purchased, this does not represent your
            referral balance or bonus balance these balances are displayed separately.
          </span>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row px-4 gap-2 mb-3">
        <div className="flex flex-grow gap-2 items-center">
          <Image src="/cutoshi-circle.png" alt="logo" width={24} height={24} />
          <p className="text-lg font-medium text-black">
            {thousandsFormat(
              (balance?.balance || 0) + (balance?.refBalance || 0) + (balance?.bonusBalance || 0),
            )}
          </p>
        </div>
      </div>
      <div className="flex-1"></div>

      {/* <div className="flex flex-col lg:flex-row px-4 gap-2 mb-3">
        <a
            href={buyUrl}
            className="bg-primary px-4 py-3 text-sm text-black flex justify-center items-center rounded-full w-full"
          >
            {t('buy_token')}
          </a>
      </div> */}
    </div>
  );
};
export default TokenBalance;
