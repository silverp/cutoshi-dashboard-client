import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Presale } from '@/components/cards/Presale';
import TokenBalance from '@/components/cards/TokenBalance';
import { Account } from '@/components/cards/Account';
import { ReferralProgram } from '@/components/cards/ReferralProgram';
import { Community } from '@/components/cards/Community';
import { SaleProgress } from '@/components/pages/home/SaleProgress';
import { useAppDispatch, useAppSelector } from '@/hooks/useConnect';
import { useEffect } from 'react';
import { getCurrentStage, getCurrentStageRaised } from './api/currency.api';
import { urls } from '@/config/urls';
import { syncToCRM } from './api/auth.api';

const Home = () => {
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (token) {
      dispatch(getCurrentStage());
      dispatch(getCurrentStageRaised());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (token) {
      dispatch(syncToCRM());
    }
  }, [dispatch, token]);

  return (
    <DashboardLayout title="Cutoshi | User Dashboard">
      <div className="p-5 w-full">
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-5">
          <TokenBalance buyUrl={urls.buy_token} />
          <Presale buyUrl={urls.buy_token} />
          <Account />

          <div className="col-span-3">
            <SaleProgress />
          </div>

          <ReferralProgram />
          <Community />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
