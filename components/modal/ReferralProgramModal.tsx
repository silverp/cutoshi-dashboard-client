import { urls } from '@/config/urls';
import { useAppSelector } from '@/hooks/useConnect';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

const ReferralProgramModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const referralPercentage = useAppSelector(
    (state) => state.account.referralOverView?.referralPercentage ?? 0,
  );

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/20" />
        </Transition.Child>
        <div className="fixed inset-0">
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
              <Dialog.Panel className="w-fit max-w-[500px] m-4 border-solid border-2 border-gray_border bg-background_card transform overflow-hidden p-4 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-xl leading-6 text-start font-bold text-black mb-7"
                >
                  {t('referral_program_details')}
                </Dialog.Title>
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-black font-medium">
                    {t('earn_cutoshi_tokens_by_referring_friends_and_family')}
                  </p>
                  <p className="text-sm text-black font-medium">
                    {t('we_have_created_a_referral_system_that_benefits_everyone_who_takes_part')}
                  </p>
                  <p className="text-sm text-black font-medium">
                    {t(
                      'when_friends_are_referred_they_will_receive_a_referral_percentage_additional_tokens_bonus_on_their_first_purchase_you_as_the_referrer_will_receive_the_same_referral_percentage_additional_tokens_bonus_from_that_purchase',
                      { value: referralPercentage },
                    )}
                  </p>
                </div>

                <div className="mt-4 flex gap-3">
                  <button type="button" onClick={onClose} className="primary-btn mt-2">
                    {t('ok')}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      router.push(urls.referral);
                    }}
                    className="cancel-btn mt-2"
                  >
                    {t('more')}
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
export default ReferralProgramModal;
