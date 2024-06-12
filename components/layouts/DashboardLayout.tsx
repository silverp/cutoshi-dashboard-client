import RootLayout from '@/components/layouts/RootLayout';
import { urls } from '@/config/urls';
import { useAppDispatch, useAppSelector } from '@/hooks/useConnect';
import { Disclosure } from '@headlessui/react';
import classNames from 'classnames';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, Fragment, ReactNode, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { LanguageMenu } from '../LanguageMenu';
import { PRESALE_SALE } from '@/config';
import LogoutModal from '../modal/LogoutModal';
import { getConstants } from '@/pages/api/settings.api';
import { getBalance, getUser } from '@/pages/api/account.api';

type LayoutProps = {
  title: string;
  children: ReactNode;
};
const DashboardLayout: FC<LayoutProps> = ({ title, children }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.account.user);
  const [isOpenLogout, setIsOpenLogout] = useState<boolean>(false);
  const [isOpenLeftMenu, setIsOpenLeftMenu] = useState<boolean>(false);
  const token = useAppSelector((state) => state.auth.token);

  const listMenuLeft = useMemo(
    () => [
      {
        id: 1,
        name: t('dashboard'),
        icon: '/svg/dashboard.svg',
        link: urls.dashboard,
      },
      // {
      //   id: 11,
      //   name: t('buy_token'),
      //   link: urls.buy_token,
      //   icon: '/svg/cart.svg',
      // },
      {
        id: 12,
        name: t('profile'),
        link: '/profile?tab=personal-info',
        icon: '/svg/user.svg',
      },
      {
        id: 13,
        name: t('transactions'),
        link: urls.transactions,
        icon: '/svg/transaction.svg',
      },
      {
        id: 13,
        name: t('main_site'),
        link: 'main_site',
        icon: '/svg/icons8-home.svg',
      },
    ],
    [t],
  );

  useEffect(() => {
    if (token) {
      dispatch(getConstants());
      dispatch(getUser());
      dispatch(getBalance());
    }
  }, [dispatch, token]);

  const router = useRouter();
  const route = router.pathname;
  useEffect(() => {
    if (!token) {
      router.replace(urls.login);
    }
  }, [router, token]);

  return (
    <RootLayout>
      <Head>
        <title>{title}</title>
      </Head>
      <main className="flex flex-row">
        <section
          className={twMerge(
            'left-menu group relative bg-background_1 w-[225px] h-screen ease-out duration-300 z-50 aspect-square overflow-x-hidden flex flex-col justify-between t-scrollbar',
            isOpenLeftMenu ? 'w-[80px] max-md:w-[225px] hover:w-[225px] fixed !ml-0' : 'w-[225px]',
          )}
        >
          <div className="flex flex-col">
            <div className="h-[70px] mb-12 px-5 w-full flex items-center justify-between">
              <Link href={urls.dashboard}>
                <Image
                  src={isOpenLeftMenu ? '/svg/small-logo.svg' : '/svg/logo.svg'}
                  alt="logo"
                  width={isOpenLeftMenu ? 26 : 118}
                  height={isOpenLeftMenu ? 26 : 26}
                  className={classNames('object-contain h-[26px] w-auto')}
                />
              </Link>
              <button
                onClick={() => setIsOpenLeftMenu((cur) => !cur)}
                className={twMerge(
                  'mobile-menu',
                  isOpenLeftMenu ? '!hidden max-md:!flex group-hover:!flex on-open' : 'off',
                )}
                id="mobile-collapse"
              >
                <span />
              </button>
            </div>
            <div className="t-scrollbar overflow-x-hidden flex flex-col gap-1">
              {listMenuLeft.map((nav, index) => {
                let isMatched = false;
                if (route === '/') {
                  isMatched = nav.link === route;
                } else {
                  isMatched = nav.link === route || nav.link.startsWith(route);
                }

                return (
                  <Fragment key={index}>
                    <Disclosure as="nav" className={classNames('px-4 py-1')}>
                      {({ open }) => (
                        <Link
                          href={nav.link === 'main_site' ? (PRESALE_SALE as string) : nav.link}
                          target={nav.link === 'main_site' ? '_blank' : '_self'}
                          onClick={() => {
                            setIsOpenLeftMenu(false);
                          }}
                          className={twMerge(
                            'min-h-[44px] flex w-full flex-row p-3 gap-3 items-center cursor-pointer relative rounded-lg',
                            isMatched && 'bg-white/10',
                          )}
                        >
                          <Image alt="Icon" src={nav.icon} height={20} width={16} />
                          <span
                            className={twMerge(
                              'text-white text-sm',
                              isOpenLeftMenu && 'hidden max-md:flex',
                            )}
                          >
                            {nav.name}
                          </span>
                        </Link>
                      )}
                    </Disclosure>
                  </Fragment>
                );
              })}
            </div>
          </div>
          <div className="px-6 h-auto py-4">
            <div className="flex w-full flex-row p-1 gap-3 items-center cursor-pointer relative rounded-lg">
              <LanguageMenu />
            </div>
          </div>
        </section>
        <section
          className={twMerge(
            'right-content h-screen bg-background_card flex-1 ease-out duration-300 w-[calc(100%-264px)] t-scrollbar',
            isOpenLeftMenu && 'md:ml-[80px]',
          )}
        >
          <div className="relative h-[56px] items-center justify-end w-full pr-8 hidden md:flex">
            <div onClick={() => setIsOpenLogout(true)} className="flex justify-end">
              <span className="mr-4 font-medium text-black text-xs">
                {user && `${user?.firstName} ${user?.lastName}`}
              </span>
              <Image src="/svg/logout.svg" className="w-3 h-3" alt="Icon" width={12} height={12} />
            </div>
          </div>
          <div></div>
          <div className="flex flex-col">
            <div className="h-[56px] items-center w-full flex md:hidden relative z-40 bg-background_1">
              <Link href={urls.dashboard} className="absolute left-5">
                <Image src="/svg/logo.svg" width={118} height={28} alt="Logo" />
              </Link>
              <button
                onClick={() => setIsOpenLeftMenu((cur) => !cur)}
                className={classNames(
                  twMerge('mobile-menu', 'md:hidden'),
                  '!h-[56px] !lg:h-[70px]',
                )}
                id="mobile-collapse"
              >
                <span />
              </button>
            </div>
            <div
              onClick={() => setIsOpenLogout(true)}
              className="md:hidden flex justify-end h-[56px] items-center pr-5"
            >
              <span className="mr-4 font-medium text-black text-xs">
                {user && `${user?.firstName} ${user?.lastName}`}
              </span>
              <Image src="/svg/logout.svg" className="w-3 h-3" alt="Icon" width={12} height={12} />
            </div>
          </div>

          <div className="flex flex-col w-full min-h-screen bg-background">
            {children}
            <div className="bottom-space"></div>
          </div>
        </section>
        <LogoutModal closeModal={() => setIsOpenLogout(false)} isOpen={isOpenLogout} />
      </main>
    </RootLayout>
  );
};
export default DashboardLayout;
