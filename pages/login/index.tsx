import { Formik, Form, Field, ErrorMessage } from 'formik';
import Link from 'next/link';
import toast from '@/helpers/toast';
import * as Yup from 'yup';
import { login } from '../api/auth.api';
import { useAppDispatch, useAppSelector } from '@/hooks/useConnect';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { urls } from '@/config/urls';
import Image from 'next/image';
import Head from 'next/head';
import RootLayout from '@/components/layouts/RootLayout';
import { ButtonLoading } from '@/components/ButtonLoading';
import Script from 'next/script';

interface LoginFormValues {
  email: string;
  password: string;
}

const initialValues: LoginFormValues = {
  email: '',
  password: '',
};

const Login = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [isShowPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      router.replace(urls.dashboard);
    }
  }, [router, token]);

  const handleTogglePassword = () => {
    setShowPassword((cur) => !cur);
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email(t('invalid-email')).required(t('email_is_required')),
    password: Yup.string().required(t('password_is_required')),
  });

  const handleSubmit = (values: LoginFormValues) => {
    if (loading) {
      return;
    }
    dispatch(
      login({
        data: {
          email: values.email,
          password: values.password,
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
  };

  return (
    <RootLayout>
      <Head>
        <title>Cutoshi | Log In</title>
      </Head>
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

          <div className="flex flex-col w-full items-center z-20 px-[10%] py-4">
            <p className="text-2xl lg:text-4xl mb-8 font-playfair text-white">{t('login')}</p>

            {/* form */}
            <div className="w-full flex flex-col">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ errors }) => (
                  <Form className="flex flex-col">
                    <div className="flex flex-col relative gap-2 mb-3">
                      <label htmlFor="email" className="text-white text-sm">
                        {t('your_email')}
                      </label>

                      <Field
                        id="email"
                        name="email"
                        type="email"
                        placeholder={t('email')}
                        className="auth-input"
                      />
                      <ErrorMessage name="email" component="p" className="text-red text-sm" />
                    </div>

                    <div className="flex flex-col relative gap-2 mb-3">
                      <label htmlFor="password" className="text-white text-sm">
                        {t('password')}
                      </label>

                      <div className="w-full flex items-center">
                        <Field
                          id="password"
                          name="password"
                          type={isShowPassword ? 'text' : 'password'}
                          placeholder={t('password')}
                          className="auth-input"
                        />

                        <div
                          className="password__toggle absolute right-3 cursor-pointer"
                          onClick={handleTogglePassword}
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

                    <div className="flex flex-col justify-center mb-4">
                      <Link href={urls.forgot_password} className="text-sm text-primary text-right">
                        {t('forgot_password')}
                      </Link>
                    </div>

                    <button
                      disabled={!!Object.keys(errors)?.length || loading}
                      className="primary-btn h-10 w-full uppercase rounded-full text-sm font-semibold text-black"
                      type="submit"
                    >
                      {loading && <ButtonLoading />} {t('login')}
                    </button>
                  </Form>
                )}
              </Formik>

              <p className="text-white text-center text-sm mt-4">
                {t('don_t_have_an_account_yet')}{' '}
                <Link href={urls.sign_up} className="text-primary">
                  {t('sign_up')}
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

export default Login;
