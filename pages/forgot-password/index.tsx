import { Formik, Form, Field, ErrorMessage } from 'formik';
import Image from 'next/image';
import * as Yup from 'yup';
import { useState } from 'react';
import toast from '@/helpers/toast';
import Link from 'next/link';
import { urls } from '@/config/urls';
import RootLayout from '@/components/layouts/RootLayout';
import Head from 'next/head';
import axios from '../api/axios';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { ButtonLoading } from '@/components/ButtonLoading';

interface LoginFormValues {
  email: string;
}

const initialValues: LoginFormValues = {
  email: '',
};

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      setLoading(true);
      await axios.post('/password/reset-password/send-email', {
        email: values.email,
      });
      toast('We have sent a password recovery email to your email.', {
        type: 'success',
        theme: 'colored',
      });
      router.push(urls.login);
    } catch (error: any) {
      const message = error.message || 'Something went wrong.';
      toast(message, {
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
        <title>Cutoshi | Forgot Password</title>
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
              {t('reset_password')}
            </p>
            <p className="text-sm lg:text-lg mb-5 text-white">
              {t('enter_your_email_address_and_we_will_send_a_password_reset_email')}
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
                    <div className="flex flex-col gap-2 mb-0">
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        placeholder={t('email')}
                        className="auth-input"
                      />
                      <ErrorMessage name="email" component="p" className="text-red text-sm" />
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

export default ForgotPassword;
