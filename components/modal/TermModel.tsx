import { TOKEN_SYMBOL } from '@/constants/information';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

interface TermsModalProps {
  isOpen: boolean;
  closeModal: () => void;
  setIsCheck: (isAgree: boolean) => void;
}

const TermsModal = ({ isOpen, closeModal, setIsCheck }: TermsModalProps) => {
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
                  className="text-xl leading-6 text-start font-bold text-black mb-7 uppercase"
                >
                  {t('important_notice')}
                </Dialog.Title>
                <div className="mt-4 flex flex-col gap-4">
                  <p className="text-black text-sm">{t('important_notice_description_1')}</p>
                  <p className="text-black text-sm">{t('important_notice_description_2')}</p>
                  <p className="text-black text-sm">{t('important_notice_description_3')}</p>
                  <p
                    className="text-black text-sm"
                    dangerouslySetInnerHTML={{
                      __html: t('important_notice_description_4', {
                        value: 'help@cutoshi.com',
                      }),
                    }}
                  ></p>
                  <p className="text-black text-sm">{t('important_notice_description_5')}</p>
                </div>

                <div className="mt-4 flex flex-row gap-2 w-full">
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => {
                      closeModal();
                      setIsCheck(true);
                    }}
                  >
                    {t('i_agree')}
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setIsCheck(false);
                      closeModal();
                    }}
                  >
                    {t('Cancel')}
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
export default TermsModal;
