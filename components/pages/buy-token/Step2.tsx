import React, { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import axios from '@/pages/api/axios';
import { Chain, PromoCode } from '@/types';
import { Transaction } from '@/types';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/hooks/useConnect';
import toast from '@/helpers/toast';
import Loading from '@/components/common/Loading';
import { TOKEN_NAME, TOKEN_SYMBOL } from '@/constants/information';
import TermsModal from '@/components/modal/TermModel';
import { ButtonLoading } from '@/components/ButtonLoading';
import { thousandsFormat } from '@/helpers/format';
import PayingPayment from '@/components/modal/PayingPayment';

export const Step2 = ({ chain }: { chain: Chain }) => {
  const { t } = useTranslation();
  const currentStage = useAppSelector((state) => state.currency?.currentStage);
  const currentBonus = useAppSelector((state) => state.currency?.currentBonus);

  const [privateCode, setPrivateCode] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [isCheck, setCheck] = useState<boolean>(false);
  const [loadingPayment, setLoadingPayment] = useState<boolean>(false);
  const [loadingCheckPrivateCode, setLoadingCheckPrivateCode] = useState<boolean>(false);
  const [isOpenTerms, setOpenTerms] = useState<boolean>(false);
  const [showErrorPromoCode, setShowErrorPromoCode] = useState<boolean>(false);
  const [promoCode, setPromoCode] = useState<PromoCode | undefined>(undefined);
  const currencyPrices = useAppSelector((state) => state.currency.currencyPrices);

  const currency = useMemo(() => {
    if (currencyPrices) {
      const key = chain.value.toUpperCase() as keyof typeof currencyPrices;
      return currencyPrices[key];
    }
    return 0;
  }, [currencyPrices, chain]);

  const [modalPaymentDetail, setModalPaymentDetail] = useState<{
    isOpen: boolean;
    data?: Transaction;
  }>({
    isOpen: false,
    data: undefined,
  });

  const checkPromoCode = useCallback(async (code: string) => {
    try {
      setLoadingCheckPrivateCode(true);
      const data: PromoCode = await axios.get(`/promo-codes/${code}/check`);
      setPromoCode(data);
    } catch (e) {
      setShowErrorPromoCode(true);
    } finally {
      setLoadingCheckPrivateCode(false);
    }
  }, []);

  const handleBuyToken = async () => {
    let body: any = {
      amount: amount,
      currency: `${chain.value}`.toLowerCase(),
      requestAmountInPC: `${Number(amount || 0) / (currency || 1)}`,
    };
    if (promoCode) {
      body['promoCode'] = privateCode;
    }
    try {
      setLoadingPayment(true);
      const data: Transaction = await axios.post('/transactions', body);
      if (data) setModalPaymentDetail({ isOpen: true, data });
    } catch (e: any) {
      toast(e.message, {
        type: 'error',
        theme: 'colored',
      });
    } finally {
      setLoadingPayment(false);
    }
  };

  const minimum = useMemo(() => {
    if (!currentStage || !currentStage?.price) {
      return 0;
    }
    return `$${currentStage?.minPurchase ?? 0} ~ (
          ${Math.floor(currentStage?.minPurchase / (currentStage?.price || 1))}
          ${TOKEN_SYMBOL}) ${t('minimum_conclusion_amount_is_required')}`;
  }, [currentStage, t]);

  const totalToken = useMemo(() => {
    if (!currentStage) return 0;
    let amountInt = parseInt(amount || '0');
    let _totalToken = currentStage?.price ? Math.round(amountInt / (currentStage?.price || 1)) : 0;
    return _totalToken;
  }, [currentStage, amount]);

  const saleBonus = useMemo(() => {
    let saleCurrentBonus = 0;
    let saleBonusPromoCode = 0;
    let amountInt = parseInt(amount || '0');

    if (!currentStage) return 0;

    if (currentBonus) {
      let bonus = [];
      const threshold = currentBonus?.threshold ?? [];
      for (let index = 0; index < threshold.length; index++) {
        const element = threshold[index];
        bonus.push(element);
      }
      if (bonus.length > 0) {
        const bonusSatisfy = bonus
          .filter((e) => amountInt >= e.purchaseFrom && amountInt <= e.purchaseTo)
          .at(-1);
        console.log('Bonus satisfy', bonusSatisfy?.bonusPercent);
        if (bonusSatisfy?.bonusPercent && currentStage.price) {
          saleCurrentBonus = Math.round(
            (amountInt / currentStage.price) * (bonusSatisfy.bonusPercent / 100),
          );
        }
      }
    }
    if (promoCode) {
      saleBonusPromoCode =
        (promoCode?.bonusPercent / 100) * totalToken + (promoCode?.additionalBonus || 0);
    }

    return saleCurrentBonus + saleBonusPromoCode;
  }, [currentStage, currentBonus, promoCode, amount, totalToken]);

  const promoCodeContent = useMemo(() => {
    if (!promoCode) return '';
    return (
      promoCode && (
        <p className="text-xs mt-2 italic text-black">
          {!!promoCode?.bonusPercent && `Bonus ${promoCode?.bonusPercent || 0}%`}{' '}
          {!!promoCode?.additionalBonus && promoCode?.bonusPercent && ' and '}{' '}
          {!!promoCode?.additionalBonus &&
            `Additional ${promoCode?.additionalBonus} ${TOKEN_SYMBOL}`}
        </p>
      )
    );
  }, [promoCode]);

  if (!currentStage) {
    return (
      <div className="flex flex-col lg:flex-row w-full lg:w-2/3 gap:2 lg:gap-10 items-center justify-center">
        <Loading />
      </div>
    );
  }

  const isActive =
    !showErrorPromoCode &&
    isCheck &&
    amount &&
    !loadingPayment &&
    parseInt(amount) >= currentStage!.minPurchase;

  const isActiveApplyPrivateCode =
    !loadingCheckPrivateCode && privateCode && parseInt(amount) >= currentStage.minPurchase;

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[auto_1fr] w-full gap-5">
      <p className="text-white text-sm font-semibold mt-0.5 w-12">{t('step')} 2</p>

      <div className="w-full max-w-[720px]">
        <div className="mb-5">
          <p className="text-base text-black font-bold mb-2">{t('step_2_title')}</p>
          <p className="text-sm text-black">{t('step_2_description', { value: TOKEN_NAME })}</p>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center mb-4 gap-3">
          <input
            onFocus={() => {
              if (!amount) {
                setAmount(`${currentStage?.minPurchase || 50}`);
              }
            }}
            value={amount}
            onChange={(event) => {
              setAmount(event.target.value);
            }}
            placeholder={`${t('amount_in')} USD`}
            className="placeholder-black/60 bg-[#FFF8EF] text-base flex flex-row text-black h-10 w-full lg:w-1/3 items-center px-4 rounded-full"
          />
          <p className="text-sm text-black">
            ~ {thousandsFormat(parseInt(amount || '0') / (currency || 1))} {chain?.value} ={' '}
            {totalToken} ${TOKEN_SYMBOL}
          </p>
        </div>

        <p className="text-sm text-black mb-6">{minimum}</p>

        <div className="flex flex-col lg:flex-row bg-[#F1D8B8] px-5 py-3 w-full mb-6">
          <div className="flex flex-1 flex:row lg:flex-col justify-between gap-1">
            <p className="text-black/80 text-xs uppercase">{t('amount_purchased')}</p>
            <p className="text-black text-lg font-medium">{thousandsFormat(totalToken)}</p>
          </div>
          <div className="flex flex-1 flex:row lg:flex-col justify-between gap-1">
            <p className="text-black/80 text-xs uppercase">{t('sale_bonus')}</p>
            <p className="text-black text-lg font-medium">{thousandsFormat(saleBonus)}</p>
          </div>
          <div className="flex flex-1 flex:row lg:flex-col justify-between gap-1">
            <p className="text-black/80 text-xs uppercase">
              {t('total')} {TOKEN_SYMBOL}
            </p>
            <p className="text-primary text-lg font-medium">
              {thousandsFormat(totalToken + saleBonus)}
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-7">
          <div className="flex flex-col w-full lg:w-2/3">
            <input
              placeholder={t('promo_code_optional')}
              onChange={(event) => {
                setPromoCode(undefined);
                setShowErrorPromoCode(false);
                setPrivateCode(event.target.value);
              }}
              className="placeholder-black/60 bg-[#FFF8EF] text-base text-black flex flex-row h-10 w-full items-center px-5 rounded-full"
            />
            {showErrorPromoCode && (
              <p className="text-xs mt-2 italic text-red">{t('code_not_found')}</p>
            )}
            {promoCodeContent}
          </div>

          <button
            disabled={!isActiveApplyPrivateCode}
            onClick={() => {
              checkPromoCode(privateCode);
            }}
            className="primary-btn text-black w-full lg:w-1/3 rounded-full h-10"
          >
            {loadingCheckPrivateCode && <ButtonLoading />}
            {t('apply_promo_code')}
          </button>
        </div>

        <p className="text-black text-sm italic mb-3">{t('process_description')}</p>

        <div className="flex flex-row items-center gap-2">
          <input
            type="checkbox"
            checked={isCheck}
            onChange={() => setCheck(!isCheck)}
            className="w-4 h-4 border border-gray bg-transparent accent-primary"
          />
          <span className="text-black text-xs">
            {t('buying_policy_checkbox_label')}{' '}
            <span
              onClick={() => setOpenTerms(true)}
              className="text-primary underline cursor-pointer"
            >
              {t('token_purchase_agreement_and_token_sale_terms')}
            </span>
          </span>
        </div>
        <button
          disabled={!isActive}
          onClick={handleBuyToken}
          className="primary-btn rounded-full w-full lg:w-fit my-6 h-10"
        >
          {loadingPayment && <ButtonLoading />}
          <>
            {t('make_payment')}{' '}
            {!loadingPayment && (
              <Image width={20} height={20} alt={'button'} src={'/svg/payment_button.svg'} />
            )}
          </>
        </button>
        <p className="text-black/80 text-sm italic">
          {t(
            'the_tokens_will_appear_on_your_dashboard_after_payment_has_been_successfully_made_please_note_that_your_tokens_will_be_distributed_to_your_wallet_after_completion_of_the_final_presale_stage',
            { value: TOKEN_SYMBOL },
          )}
        </p>
      </div>
      <PayingPayment
        closeModal={() => setModalPaymentDetail({ isOpen: false, data: undefined })}
        isOpen={modalPaymentDetail.isOpen}
        data={modalPaymentDetail.data}
      />
      <TermsModal
        isOpen={isOpenTerms}
        setIsCheck={setCheck}
        closeModal={() => setOpenTerms(false)}
      />
    </div>
  );
};
