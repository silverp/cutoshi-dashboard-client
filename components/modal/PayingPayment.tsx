import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import { Fragment } from 'react';
import toast from '@/helpers/toast';
import Link from 'next/link';
import { Transaction } from '@/types';
import { useTranslation } from 'react-i18next';
import { urls } from '@/config/urls';

const PayingPayment = ({
  isOpen,
  closeModal,
  data,
  disableViewTransaction,
}: {
  disableViewTransaction?: boolean;
  isOpen: boolean;
  data?: Transaction;
  closeModal: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 t-scrollbar">
          <div className="flex min-h-full items-center justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-[500px] m-4 border-solid border-2 border-gray_border bg-background_card transform overflow-hidden p-4 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl leading-6 text-start font-bold text-black mb-7"
                >
                  {t('your_payment_details')}
                </Dialog.Title>
                <div className="mt-4 flex flex-col gap-4">
                  <p className=" text-lg text-primary ">
                    {t('your_order_no')} <span className=" font-bold">{data?.publicId}</span>{' '}
                    {t('has_been_placed_successfully')}
                  </p>
                  <p className=" text-black text-base">
                    {t('please_send')}{' '}
                    <span className="font-bold text-primary">
                      {data?.requestAmountInPc} {data?.currency.toUpperCase()}
                    </span>{' '}
                    {t(
                      'to_the_address_below_the_token_balance_will_appear_in_your_account_only_after_your_transaction_gets_approved',
                    )}
                  </p>
                  <p className="text-black text-sm">
                    {t('make_your_payments_to_the_below_address')}
                  </p>
                  {data?.qr && <Image src={data?.qr} width={240} height={240} alt="qr" />}

                  <div className=" flex flex-col gap-3">
                    <p className="text-black text-sm">{t('address')}</p>
                    <div className="w-full bg-primary/40 flex flex-row items-center justify-between px-2 h-12 rounded-lg">
                      <p className="text-black text-sm truncate">{data?.payAddress}</p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(data?.payAddress!);
                          toast(t('copied'), {
                            type: 'success',
                            theme: 'colored',
                          });
                        }}
                      >
                        <Image src="/svg/icon_copy.svg" alt="copy" width={20} height={20} />
                      </button>
                    </div>
                  </div>
                  <div className=" flex flex-col gap-3">
                    <p className="text-black text-sm">{t('amount')}</p>
                    <div className="w-full bg-primary/40 flex flex-row  items-center justify-between px-2 h-12 rounded-lg">
                      <p className="text-black text-sm truncate">{data?.requestAmountInPc}</p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${data?.requestAmountInPc}`);
                          toast(t('copied'), {
                            type: 'success',
                            theme: 'colored',
                          });
                        }}
                      >
                        <Image src="/svg/icon_copy.svg" alt="copy" width={20} height={20} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-row gap-2 w-full">
                  {!disableViewTransaction && (
                    <Link href={urls.transactions}>
                      <button type="button" className="primary-btn mt-2" onClick={closeModal}>
                        {t('view_transaction')}
                      </button>
                    </Link>
                  )}
                  <button type="button" className="cancel-btn mt-2" onClick={closeModal}>
                    {t('close')}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
export default PayingPayment;
