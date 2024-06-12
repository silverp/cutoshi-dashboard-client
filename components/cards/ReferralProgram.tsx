import { thousandsFormat } from '@/helpers/format';
import { useAppDispatch, useAppSelector } from '@/hooks/useConnect';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReferralProgramModal from '../modal/ReferralProgramModal';
import UserReferral from '../UserReferral';
import { getReferralOverview } from '@/pages/api/account.api';

export const ReferralProgram = () => {
  const { t } = useTranslation();
  const referralOverView = useAppSelector((state) => state.account.referralOverView ?? 0);
  const [isOpenModal, setOpenModal] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getReferralOverview());
  }, [dispatch]);

  return (
    <div className="flex flex-col bg-background_card py-3 px-4 rounded-2xl">
      <p className="text-black text-xl font-medium mb-6">{t('referral_program')}</p>

      <div className="flex flex-row gap-2 items-center mb-10">
        <Image src="/svg/ref_img.svg" width={32} height={32} alt="Icon" />
        <p className="text-sm text-black">
          {t('refer_a_friend_and_earn_up_to_5_with_their_first_token_purchase', {
            value: referralOverView?.referralPercentage,
          })}
        </p>

        <button onClick={() => setOpenModal(true)}>
          <Image
            src={'/svg/info.svg'}
            className="w-5 h-5 object-contain"
            width={20}
            height={20}
            alt={'ref_img'}
          />
        </button>
      </div>

      <div className="flex flex-row mb-10">
        <div className="flex flex-1 flex-col">
          <p className="text-black text-sm mb-0.5 font-semibold">{t('referrals_income')}</p>
          <p className="text-black text-base font-medium">
            {thousandsFormat(referralOverView?.referralIncome)}
          </p>
        </div>
        <div className="flex flex-1 flex-col">
          <p className="text-black text-sm mb-0.5 font-semibold">{t('total_referrals')}</p>
          <p className="text-black text-base font-medium">
            {thousandsFormat(referralOverView?.referrals)}
          </p>
        </div>
      </div>
      <p className=" text-black text-xs mb-2 font-semibold">{t('referral_link')}</p>

      <UserReferral />

      <ReferralProgramModal onClose={() => setOpenModal(false)} isOpen={isOpenModal} />
    </div>
  );
};
