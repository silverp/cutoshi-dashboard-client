import { useState } from 'react';
import axios from '../api/axios';
import toast from '@/helpers/toast';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import RootLayout from '@/components/layouts/RootLayout';
import { urls } from '@/config/urls';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { ButtonLoading } from '@/components/ButtonLoading';

interface FormValues {
  password: string;
  confirmPassword: string;
}

const initialValues: FormValues = {
  password: '',
  confirmPassword: '',
};

const ResetPassword = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [isShowPassword, setShowPassword] = useState<boolean>(false);
  const [isShowConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, t('please_enter_at_least_8_characters'))
      .required(t('password_is_required')),
    confirmPassword: Yup.string()
      .required(t('confirm_password_is_required'))
      .oneOf([Yup.ref('password')], t('passwords_must_match')),
  });

  const handleSubmit = async (value: FormValues) => {
    if (loading) {
      return;
    }
    const data = {
      password: value.password,
      token: router.query?.token,
    };
    try {
      setLoading(true);
      await axios.post('/password/reset-password', data);
      toast(t('password_has_been_changed'), {
        type: 'success',
        theme: 'colored',
      });
      router.replace(urls.login);
    } catch (e: any) {
      toast(e.message, {
        type: 'error',
        theme: 'colored',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <RootLayout>
      <Head>
        <title>Cutoshi | Reset Password</title>
      </Head>

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
            <p className="text-2xl lg:text-4xl mb-2 font-playfair text-white">
              {t('set_new_password')}
            </p>
            <p className="text-sm lg:text-lg mb-5 text-white">
              {t('now_you_can_set_a_new_password')}
            </p>

            {/* form */}
            <div className="w-full flex flex-col">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ errors }) => (
                  <Form className="flex flex-col gap-4">
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

                    <button
                      disabled={!!Object.keys(errors)?.length || loading}
                      className="primary-btn h-10 w-full uppercase rounded-full text-sm font-semibold text-black"
                      type="submit"
                    >
                      {loading && <ButtonLoading />} {t('submit')}
                    </button>
                  </Form>
                )}
              </Formik>

              <p className="text-white text-center text-sm mt-4">
                {t('back_to')}{' '}
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
export default ResetPassword;
