import { Input } from '@/components/Input';
import classNames from 'classnames';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from '@/helpers/toast';
import { ButtonLoading } from '../ButtonLoading';
import { useAppSelector } from '@/hooks/useConnect';

export const WalletDetail = ({
  loading,
  onSubmit,
}: {
  loading: boolean;
  onSubmit: (body: object, messageSuccess: string) => void;
}) => {
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.account.user);

  const [showAddWallet, setShowAddWallet] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>();

  useEffect(() => {
    setShowAddWallet(false);
    setWalletAddress(undefined);
  }, [user]);

  return (
    <div className="flex flex-col lg:flex-row w-full p-3 gap-2">
      <div className="bg-background_card w-full lg:w-1/2 py-3 px-4 flex flex-col gap-4 rounded-lg">
        <p className="text-black text-xl font-medium">{t('wallet_details')}</p>
        {user?.wallet ? (
          <button
            onClick={() => {
              navigator.clipboard.writeText(user?.wallet ?? '');
              toast(t('copied'), {
                type: 'success',
                theme: 'colored',
              });
            }}
            className="text-left flex h-12 bg-primary/40 rounded-lg flex-row w-full gap-2 items-center px-2"
          >
            <p className="text-black truncate text-sm flex-1">{user?.wallet}</p>
            <Image src="/svg/icon_copy.svg" alt="Icon" width={20} height={20} />
          </button>
        ) : (
          <p className="text-black text-sm">
            {t('profile_wallet_card_missing_wallet_description')}
          </p>
        )}
        <button
          onClick={() => setShowAddWallet(!showAddWallet)}
          type="button"
          className="primary-btn"
        >
          {user?.wallet ? t('add_another_wallet_address') : t('add_wallet')}
        </button>

        {showAddWallet && (
          <>
            <Input
              editable={true}
              placeholder={t('wallet_address')}
              value={walletAddress}
              changeText={(value) => setWalletAddress(value.replace(/ /g, ''))}
            />
            <button
              disabled={!walletAddress || loading}
              onClick={() => {
                onSubmit({ wallet: walletAddress }, t('wallet_has_been_added'));
              }}
              type="button"
              className={classNames(
                walletAddress && !loading ? 'opacity-100' : 'opacity-80',
                'primary-btn',
              )}
            >
              {loading && <ButtonLoading />}
              {t('submit')}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
