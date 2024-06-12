import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Loading from '../common/Loading';
import { useAppSelector } from '@/hooks/useConnect';
import { TOKEN_SYMBOL } from '@/constants/information';

export const Account = () => {
  const user = useAppSelector((state) => state.account.user);
  const { t } = useTranslation();

  return (
    <div className="flex flex-col bg-background_card rounded-2xl w-full h-full px-4 py-3">
      {!user ? (
        <div className="w-full h-full flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <>
          <p className="text-black text-xl mb-2">{t('account')}</p>

          <div className="flex flex-row bg-[#FFCB00] relative px-3 py-2 rounded-full mb-4 gap-2">
            <p className="text-xs text-black line-clamp-1">{t('email_verification')}</p>
            {user.isEmailConfirmed ? (
              <p className="text-xs text-black">{t('confirmed')}</p>
            ) : (
              <Link href={'/profile?tab=personal-info'} className="text-xs text-dark">
                <p className="text-xs text-black underline">{t('resend')}</p>
              </Link>
            )}
            <div className="bg-white p-0.5 rounded-full absolute -top-2 right-0">
              <Image
                src={user.isEmailConfirmed ? '/svg/ok.svg' : '/svg/attention.svg'}
                alt="check"
                width={16}
                height={16}
              />
            </div>
          </div>

          <div className="flex flex-row gap-2 bg-[#F2CC9C] justify-center items-center relative px-3 py-2 rounded-full mb-4">
            <Image src="/svg/wallet.svg" alt="check" width={20} height={20} />
            <p className={classNames('text-xs text-black truncate flex-1 line-clamp-1')}>
              {user?.wallet && user?.wallet !== '' ? user?.wallet : '---'}
            </p>
            <Link href={'/profile?tab=wallet-details'} className="text-xs text-black underline">
              {user?.wallet ? t('edit') : t('add_wallet')}
            </Link>
          </div>

          <>
            <div className="flex-1" />
            <p className="text-text_description text-xs">
              *{t('account_wallet_description', { value: TOKEN_SYMBOL })}
            </p>
          </>
        </>
      )}
    </div>
  );
};
