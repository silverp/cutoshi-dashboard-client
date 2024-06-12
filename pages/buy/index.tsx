import { Account } from '@/components/cards/Account';
import { Presale } from '@/components/cards/Presale';
import TokenBalance from '@/components/cards/TokenBalance';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Step1 } from '@/components/pages/buy-token/Step1';
import { Step2 } from '@/components/pages/buy-token/Step2';
import { Chain, chains } from '@/helpers/chain';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/hooks/useConnect';
import { getCurrentBonus, getCurrentPrice } from '../api/currency.api';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { urls } from '@/config/urls';

const BuyToken = () => {
  const [chain, setChain] = useState<Chain>(chains[0]);
  const dispatch = useAppDispatch();

  const router = useRouter();

  useEffect(() => {
    router.push(urls.dashboard);
  }, [router]);

  useEffect(() => {
    dispatch(getCurrentBonus());
  }, [dispatch]);

  useEffect(() => {
    if (chain?.value) {
      dispatch(getCurrentPrice(`${chain.value}`.toLowerCase()));
    }
  }, [chain, dispatch]);

  return (
    <DashboardLayout title="Cutoshi | User Dashboard">
      <Script
        id="clickmagick_cmc"
        dangerouslySetInnerHTML={{
          __html: `
            window.clickmagick_cmc = {
              uid: '184601',
              hid: '696688757',
              cmc_goal: 's',
              cmc_ref: 'sale',
              vid_info: 'on',
            }
        `,
        }}
      ></Script>
      <Script src="//cdn.clkmc.com/cmc.js" />

      <div className="p-5 w-full">
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-5">
          <TokenBalance buyUrl="#buy-place" />
          <Presale buyUrl="#buy-place" />
          <Account />

          <div className="col-span-3 mt-4" id="buy-place">
            <div className="mb-10">
              <Step1 chain={chain} onSelect={setChain} />
            </div>
            <div className="mb-10">
              <Step2 chain={chain} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BuyToken;
