import toast from '@/helpers/toast';
import { useAppSelector } from '@/hooks/useConnect';
import Image from 'next/image';
import React from 'react';
import { useTranslation } from 'react-i18next';

const UserReferral = () => {
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.account.user);

  return (
    <div
      onClick={() => {
        navigator.clipboard.writeText(user?.refLink ?? '');
        toast(t('copied'), {
          type: 'success',
          theme: 'colored',
        });
      }}
      className="flex h-12 bg-primary/40 rounded-lg flex-row w-full gap-2 items-center px-2 mb-4"
    >
      <Image src="/svg/icon_link.svg" alt="check" width={18} height={12} />
      <p className="text-black truncate text-sm flex-1">{user?.refLink}</p>
      <Image src="/svg/icon_copy.svg" alt="check" width={20} height={20} />
    </div>
  );
};

export default UserReferral;
