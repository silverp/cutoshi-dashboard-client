import IntlTelInput, { CountryData } from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Script from 'next/script';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Link from 'next/link';
import toast from '@/helpers/toast';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '@/hooks/useConnect';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import baseAxios from 'axios';
import Select from 'react-select';
import { signUp } from '../api/auth.api';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { urls } from '@/config/urls';
import RootLayout from '@/components/layouts/RootLayout';
import Head from 'next/head';
import { chains } from '@/helpers/chain';
import { ButtonLoading } from '@/components/ButtonLoading';
import { PRESALE_SALE } from '@/config';
import axios from '../api/axios';

const SignUp = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [referral, setReferral] = useState<string | null>(null);

  const [country, setCountry] = useState<string | undefined>(undefined);
  const { query } = useRouter();
  const dispatch = useAppDispatch();
  const [isShowPassword, setShowPassword] = useState<boolean>(false);
  const [isShowConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const router = useRouter();
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      router.replace(urls.dashboard);
    }
  }, [router, token]);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required(t('first_name_is_required')),
    lastName: Yup.string().required(t('last_name_is_required')),
    email: Yup.string().email(t('invalid-email')).required(t('email_is_required')),
    phone: Yup.string(),
    password: Yup.string()
      .min(8, t('please_enter_at_least_8_characters'))
      .required(t('password_is_required')),
    confirmPassword: Yup.string()
      .required(t('confirm_password_is_required'))
      .oneOf([Yup.ref('password')], t('passwords_must_match')),
    // amount: Yup.number()
    //   .required(t('purchase_amount_is_required'))
    //   .positive(t('purchase_amount_must_be_a_positive_number')),
    isEnableNotifications: Yup.bool(),
    isAgreeWithPrivacyPolicy: Yup.bool().oneOf([true]),
  });

  useEffect(() => {
    const getCountry = async () => {
      try {
        const { data } = await baseAxios.get('https://geolocation-db.com/json');
        setCountry(data?.country_code?.toLowerCase() || 'us');
      } catch (error) {
        setCountry('us');
      }
    };
    getCountry();
  }, []);

  useEffect(() => {
    (async () => {
      if (query?.ref && query?.ref !== '') {
        const data: { name: string } = await axios.get('/users/find-by-referral-code', {
          params: {
            referralCode: query?.ref,
          },
        });
        if (data && data?.name) {
          setReferral(data?.name);
        }
      }
    })();
  }, [query?.ref]);

  return (
    <RootLayout>
      <Head>
        <title>Cutoshi | Sign Up</title>
      </Head>
      <Script
        id="clickmagick_cmc"
        dangerouslySetInnerHTML={{
          __html: `
            window.clickmagick_cmc = {
                uid: '184601',
                hid: '696688757',
                cmc_goal: 'e',
                cmc_ref: 'checkout',
                vid_info: 'on',
            }
        `,
        }}
      ></Script>
      <Script src="//cdn.clkmc.com/cmc.js" />
      <Script
        id="clickmagick_cmc"
        dangerouslySetInnerHTML={{
          __html: `
            window.clickmagick_cmc = {
                uid: '184601',
                hid: '696688757',
                cmc_goal: 'e',
                cmc_ref: 'checkout',
                vid_info: 'on',
            }
        `,
        }}
      ></Script>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-YZQPQKGRKR" />
      <Script
        id="google_tag"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag() {
              dataLayer.push(arguments);
            }
            gtag('js', new Date());
            gtag('config', 'G-YZQPQKGRKR');
          `,
        }}
      ></Script>

      <div className="flex w-full h-screen bg-dark">
        <div className="flex flex-col w-full lg:w-1/2 xl:w-1/3 h-full relative overflow-x-hidden items-center t-scrollbar">
          <Image
            src="/login-bg-1.png"
            className="w-[147px] h-[344px] absolute top-0 left-0 z-10"
            alt=""
            width={147}
            height={344}
          />

          <Image
            src="/login-bg-2.png"
            className="w-[452px] h-[354px] absolute bottom-0 -right-[130px] z-10"
            alt=""
            width={452}
            height={354}
          />

          <div className="w-full py-8 flex align-center justify-center">
            <div className="flex justify-center md:justify-start w-full px-[10%]">
              <Link href={urls.dashboard}>
                <Image src="/main-icon.svg" alt="" width={180} height={40} />
              </Link>
            </div>
          </div>

          <div className="flex flex-col w-full items-center z-20 px-[10%] py-[5%]">
            <p className="text-2xl lg:text-4xl mb-2 font-playfair text-white">{t('sign_up')}</p>
            <p className="text-sm lg:text-lg mb-5 text-white">{t('create_a_new_account')}</p>

            {/* form */}
            <div className="w-full flex flex-col gap-2">
              <Formik
                initialValues={{
                  firstName: '',
                  lastName: '',
                  email: '',
                  phone: '',
                  password: '',
                  confirmPassword: '',
                  // amount: '',
                  // chain: chains[0],
                  isEnableNotifications: true,
                  isAgreeWithPrivacyPolicy: true,
                }}
                validationSchema={validationSchema}
                onSubmit={async ({
                  firstName,
                  lastName,
                  email,
                  phone,
                  password,
                  // chain,
                  confirmPassword,
                  // amount,
                }) => {
                  try {
                    dispatch(
                      signUp({
                        data: {
                          firstName,
                          lastName,
                          email,
                          country: country,
                          phoneNumber: phone,
                          password: confirmPassword,
                          paymentMethod: 'eth',
                          paymentAmount: 0,
                          referralCode: query?.ref && (query?.ref as string),
                        },
                        onLoading: (state: boolean) => setLoading(state),
                        onError: (error: string | null) => {
                          toast(error, {
                            type: 'error',
                            theme: 'colored',
                          });
                        },
                      }),
                    );
                  } catch (e: any) {
                    toast(e.message, {
                      type: 'error',
                      theme: 'colored',
                    });
                  }
                }}
              >
                {({ errors, values, setFieldValue }) => (
                  <Form className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <Field
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder={t('first_name')}
                        className="auth-input"
                      />
                      <ErrorMessage name="firstName" component="p" className="text-red text-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Field
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder={t('last_name')}
                        className="auth-input"
                      />
                      <ErrorMessage name="lastName" component="p" className="text-red text-sm" />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        placeholder={t('email')}
                        className="auth-input"
                      />
                      <ErrorMessage name="email" component="p" className="text-red text-sm" />
                    </div>

                    <IntlTelInput
                      inputProps={{
                        className: '!pl-12 auth-input',
                      }}
                      buttonClass="!bg-transparent !border-0 [&>div]:!bg-transparent z-50"
                      containerClass="text-black intl-tel-input w-full [&>div]:!p-2"
                      value={values.phone}
                      country={country}
                      onChange={(phone, data: CountryData) => {
                        setCountry(data?.countryCode?.toLowerCase());
                        setFieldValue('phone', phone);
                      }}
                    />

                    <div className="flex flex-col relative gap-2">
                      <div className="w-full flex items-center">
                        <Field
                          id="password"
                          name="password"
                          type={isShowPassword ? 'text' : 'password'}
                          placeholder={t('password')}
                          className="auth-input"
                        />

                        <div
                          className="absolute right-3 cursor-pointer"
                          onClick={() => {
                            setShowPassword((cur) => !cur);
                          }}
                        >
                          {isShowPassword ? (
                            <Image
                              src="/hide-password-eye.svg"
                              className="w-6 h-6"
                              alt=""
                              width={24}
                              height={24}
                            />
                          ) : (
                            <Image
                              src="/show-password-eye.svg"
                              className="w-6 h-6"
                              alt=""
                              width={24}
                              height={24}
                            />
                          )}
                        </div>
                      </div>

                      <ErrorMessage name="password" component="p" className="text-red text-sm" />
                    </div>

                    <div className="flex flex-col relative gap-2">
                      <div className="w-full flex items-center">
                        <Field
                          id="confirmPassword"
                          name="confirmPassword"
                          type={isShowConfirmPassword ? 'text' : 'password'}
                          placeholder={t('confirm_password')}
                          className="auth-input"
                        />

                        <div
                          className="absolute right-3 cursor-pointer"
                          onClick={() => {
                            setShowConfirmPassword((cur) => !cur);
                          }}
                        >
                          {isShowConfirmPassword ? (
                            <Image
                              src="/hide-password-eye.svg"
                              className="w-6 h-6"
                              alt=""
                              width={24}
                              height={24}
                            />
                          ) : (
                            <Image
                              src="/show-password-eye.svg"
                              className="w-6 h-6"
                              alt=""
                              width={24}
                              height={24}
                            />
                          )}
                        </div>
                      </div>

                      <ErrorMessage
                        name="confirmPassword"
                        component="p"
                        className="text-red text-sm"
                      />
                    </div>

                    {/* <div className="flex flex-col gap-2">
                      <div className="relative flex items-center">
                        <div className="left-4 absolute">
                          <svg
                            width="21"
                            height="21"
                            viewBox="0 0 21 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9.8438 7.07007V9.57257L8.96005 9.26632C8.5138 9.10882 8.24255 8.96007 8.24255 8.19882C8.24255 7.57757 8.7063 7.07007 9.27505 7.07007H9.8438Z"
                              fill="#FCA93D"
                            />
                            <path
                              d="M12.7575 12.8012C12.7575 13.4225 12.2937 13.93 11.725 13.93H11.1562V11.4275L12.04 11.7337C12.4863 11.8912 12.7575 12.04 12.7575 12.8012Z"
                              fill="#FCA93D"
                            />
                            <path
                              d="M14.1663 1.75H6.83375C3.64875 1.75 1.75 3.64875 1.75 6.83375V14.1663C1.75 17.3513 3.64875 19.25 6.83375 19.25H14.1663C17.3513 19.25 19.25 17.3513 19.25 14.1663V6.83375C19.25 3.64875 17.3513 1.75 14.1663 1.75ZM12.4775 10.5C13.16 10.7362 14.07 11.235 14.07 12.8013C14.07 14.1488 13.02 15.2425 11.725 15.2425H11.1562V15.75C11.1562 16.1088 10.8588 16.4062 10.5 16.4062C10.1412 16.4062 9.84375 16.1088 9.84375 15.75V15.2425H9.52875C8.09375 15.2425 6.93 14.0262 6.93 12.5387C6.93 12.18 7.21875 11.8825 7.58625 11.8825C7.945 11.8825 8.2425 12.18 8.2425 12.5387C8.2425 13.3088 8.82 13.93 9.52875 13.93H9.84375V10.9637L8.5225 10.5C7.84 10.2638 6.93 9.765 6.93 8.19875C6.93 6.85125 7.98 5.7575 9.275 5.7575H9.84375V5.25C9.84375 4.89125 10.1412 4.59375 10.5 4.59375C10.8588 4.59375 11.1562 4.89125 11.1562 5.25V5.7575H11.4712C12.9062 5.7575 14.07 6.97375 14.07 8.46125C14.07 8.82 13.7812 9.1175 13.4137 9.1175C13.055 9.1175 12.7575 8.82 12.7575 8.46125C12.7575 7.69125 12.18 7.07 11.4712 7.07H11.1562V10.0363L12.4775 10.5Z"
                              fill="#FCA93D"
                            />
                          </svg>
                        </div>
                        <Field
                          id="amount"
                          name="amount"
                          type="text"
                          placeholder={t('purchase_amount')}
                          className="auth-input !pl-12"
                        />
                      </div>

                      <ErrorMessage name="amount" component="p" className="text-red text-sm" />
                    </div> */}

                    {/* <Select
                      value={values.chain}
                      options={chains}
                      classNames={{
                        menu: () => '!bg-black',
                        menuList: () => 't-scrollbar',
                        control: () =>
                          '!rounded-full h-[42px] text-sm !bg-white/10 border border-neutral-300 !text-white',
                      }}
                      formatOptionLabel={(country) => (
                        <div className="flex flex-row gap-3 px-1">
                          <Image
                            src={country.icon}
                            alt="Logo"
                            className="w-5 h-5"
                            width={20}
                            height={20}
                          />
                          <span className="text-sm text-white">{country.label}</span>
                        </div>
                      )}
                      onChange={(value) => {
                        setFieldValue('chain', value);
                      }}
                    /> */}

                    <div className="flex items-center text-white text-sm">
                      <div className="w-4 mr-3 flex items-center">
                        <Field
                          id="isEnableNotifications"
                          type="checkbox"
                          name="isEnableNotifications"
                          className="w-4 h-4 border border-gray bg-transparent accent-primary"
                        />
                      </div>

                      <label htmlFor="isEnableNotifications">
                        {t('signup_receive_email_message')}
                      </label>
                    </div>

                    <div className="flex items-center text-white text-sm">
                      <div className="w-4 mr-3 flex items-center">
                        <Field
                          id="isAgreeWithPrivacyPolicy"
                          type="checkbox"
                          name="isAgreeWithPrivacyPolicy"
                          className="w-4 h-4 border border-gray bg-transparent accent-primary"
                        />
                      </div>
                      <label htmlFor="isAgreeWithPrivacyPolicy">
                        {t('i_agree_to_the')}{' '}
                        <a
                          className="text-primary"
                          target="_blank"
                          href={`${PRESALE_SALE}/terms-of-use`}
                        >
                          {t('terms_and_conditions')}
                        </a>{' '}
                        {t('as_well_as_the')}{' '}
                        <a
                          className="text-primary"
                          target="_blank"
                          href={`${PRESALE_SALE}/privacy-policy`}
                        >
                          {t('privacy_policy')}
                        </a>
                      </label>
                    </div>

                    {referral && <p className="text-sm text-left text-white/70">Ref: {referral}</p>}

                    <button
                      disabled={!!Object.keys(errors)?.length || loading}
                      className="primary-btn h-10 w-full uppercase rounded-full text-sm font-semibold text-black"
                      type="submit"
                    >
                      {loading && <ButtonLoading />} {t('sign_up')}
                    </button>
                  </Form>
                )}
              </Formik>

              <p className="text-white text-center text-sm">
                {t('already_have_an_account')} {t('please')}{' '}
                <Link href={urls.login} className="text-primary">
                  {t('login')}
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="hidden lg:block lg:w-1/2 xl:w-2/3 h-full p-4">
          <div className="flex justify-center items-center h-full rounded-2xl">
            <Image
              src="/nft-cat.png"
              alt=""
              width={718}
              height={461}
            />
          </div>
        </div>
      </div>
    </RootLayout>
  );
};

export default SignUp;
