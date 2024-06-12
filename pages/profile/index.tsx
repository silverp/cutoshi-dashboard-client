import { Tab } from '@/components/Tab';
import React, { useCallback, useState } from 'react';
import { withRouter } from 'next/router';
import axios from '../api/axios';
import toast from '@/helpers/toast';
import { useAppDispatch, useAppSelector } from '@/hooks/useConnect';
import { getUser } from '../api/account.api';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { PersonalInfo } from '@/components/profile/PersonalInfo';
import { WalletDetail } from '@/components/profile/WalletDetails';
import { Security } from '@/components/profile/Security';
import { urls } from '@/config/urls';

const Profile = withRouter(({ router }) => {
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.account.user);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const handlerChangeUserProfile = useCallback(
    async (body: object, messageSuccess: string) => {
      try {
        setLoading(true);
        await axios.put('/users/me', body);
        dispatch(getUser());
        toast(messageSuccess, {
          type: 'success',
          theme: 'colored',
        });
      } catch (e: any) {
        toast(e.message, {
          type: 'error',
          theme: 'colored',
        });
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  return (
    <DashboardLayout title="Cutoshi | User Dashboard">
      <div className="p-5 w-full">
        <Tab
          tabs={[
            {
              label: t('personal_info'),
              key: 'personal-info',
              href: { pathname: urls.profile, query: { tab: 'personal-info' } },
            },
            {
              label: t('wallet_details'),
              key: 'wallet-details',
              href: { pathname: urls.profile, query: { tab: 'wallet-details' } },
            },
            {
              label: t('security'),
              key: 'security',
              href: { pathname: urls.profile, query: { tab: 'security' } },
            },
          ]}
          tabActive={router.query.tab as string}
        />
      </div>
      {router.query.tab == 'personal-info' && (
        <PersonalInfo onSubmit={handlerChangeUserProfile} loading={loading} />
      )}
      {router.query.tab == 'wallet-details' && (
        <WalletDetail onSubmit={handlerChangeUserProfile} loading={loading} />
      )}
      {router.query.tab == 'security' && <Security />}
    </DashboardLayout>
  );
});
export default Profile;
