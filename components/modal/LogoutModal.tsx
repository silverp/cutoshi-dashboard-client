import { urls } from '@/config/urls';
import { useAppDispatch } from '@/hooks/useConnect';
import { RESET_STORE } from '@/store';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

const LogoutModal = ({ isOpen, closeModal }: { isOpen: boolean; closeModal: () => void }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t } = useTranslation();

  const handleLogout = () => {
    dispatch({ type: RESET_STORE });
    router.replace(urls.login);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
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
              <Dialog.Panel className="w-full max-w-[500px] m-4 border-2 border-gray_border bg-background_card transform overflow-hidden p-4 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-xl font-semibold text-black mb-7 text-center">
                  {t('are_you_sure_you_want_to_log_out')}
                </Dialog.Title>

                <div className="flex flex-row w-full gap-2 justify-center">
                  <button type="button" className="primary-btn" onClick={handleLogout}>
                    {t('confirm')}
                  </button>
                  <button type="button" className="cancel-btn" onClick={closeModal}>
                    {t('cancel')}
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
export default LogoutModal;
