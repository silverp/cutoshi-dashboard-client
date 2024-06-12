import { Input } from '@/components/Input';
import axios from '@/pages/api/axios';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from '@/helpers/toast';
import { ButtonLoading } from '../ButtonLoading';
import { urls } from '@/config/urls';
import { useAppSelector } from '@/hooks/useConnect';
import UserReferral from '../UserReferral';

export const PersonalInfo = ({
  loading,
  onSubmit,
}: {
  loading: boolean;
  onSubmit: (body: object, messageSuccess: string) => void;
}) => {
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.account.user);

  const [showEdit, setShowEdit] = useState(false);
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [phone, setPhone] = useState<string>();
  const [loadingResend, setLoadingResend] = useState(false);

  useEffect(() => {
    setShowEdit(false);
    setFirstName(user?.firstName);
    setLastName(user?.lastName);
    setPhone(user?.phoneNumber);
  }, [user]);

  const isActiveButton =
    ((firstName && firstName != user?.firstName) ||
      (lastName && lastName != user?.lastName) ||
      (phone && phone != user?.phoneNumber)) &&
    !loading;

  const resendEmail = async () => {
    let body = {
      email: user?.email,
    };
    try {
      setLoadingResend(true);
      await axios.post('/auth/resend-confirm-email', body);
      toast('Confirmation link has been sent.', {
        type: 'success',
        theme: 'colored',
      });
    } catch (e: any) {
      toast(e.message, {
        type: 'error',
        theme: 'colored',
      });
    } finally {
      setLoadingResend(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full p-3 gap-2">
      <div className="bg-background_card w-full flex-1 py-3 px-4 flex flex-col gap-4 rounded-lg">
        <button
          onClick={() => {
            setShowEdit(!showEdit);
          }}
          className="text-sm text-primary w-full text-end underline"
        >
          {t('edit')}
        </button>
        <Input
          changeText={setFirstName}
          editable={showEdit}
          value={showEdit ? firstName : user?.firstName}
          label={t('first_name')}
        />
        <Input
          changeText={setLastName}
          editable={showEdit}
          value={showEdit ? lastName : user?.lastName}
          label={t('last_name')}
        />
        <Input
          changeText={setPhone}
          editable={showEdit}
          value={showEdit ? phone : user?.phoneNumber}
          label={t('contact_phone')}
        />
        <Input
          editable={false}
          renderRight={() => {
            if (user?.isEmailConfirmed) {
              return <Image src={'/svg/ok.svg'} alt="check" className="" width={30} height={30} />;
            } else {
              return (
                <div className="flex flex-row  flex-1 justify-between items-center">
                  <Image
                    src={'/svg/attention.svg'}
                    alt="check"
                    className=""
                    width={25}
                    height={25}
                  />
                  <button
                    onClick={() => {
                      resendEmail();
                    }}
                    className=" flex flex-row gap-2 justify-center items-center bg-primary text-white text-xs px-2 py-1"
                  >
                    {loadingResend && <ButtonLoading />}
                    Resend Email
                  </button>
                </div>
              );
            }
          }}
          value={user?.email}
          label="Email"
        />
        {showEdit && (
          <div className="flex gap-3">
            <button
              onClick={() => {
                if (isActiveButton) {
                  const body = {
                    firstName: firstName,
                    lastName: lastName,
                    phoneNumber: phone,
                  };
                  onSubmit(body, 'Information has been updated');
                }
              }}
              type="button"
              className={classNames(!isActiveButton && 'opacity-80', 'primary-btn mt-2')}
            >
              {loading && <ButtonLoading />}
              {t('submit')}
            </button>

            <button
              type="button"
              onClick={() => setShowEdit(false)}
              className="inline-flex w-fit mt-2 justify-center border border-black bg-inherit text-black text-xs py-2 px-4 font-medium"
            >
              {t('cancel')}
            </button>
          </div>
        )}
      </div>
      <div className="bg-background_card flex-1 py-3 px-4 flex flex-col gap-4 h-fit rounded-lg">
        <div className="w-full flex flex-row justify-between items-center">
          <p className="text-black text-xl font-medium">{t('profile_referrals_card_title')}</p>
          <Link href={urls.referral}>
            <p className="text-sm text-primary text-end underline">{t('more')}</p>
          </Link>
        </div>

        <p className="text-sm text-black">{t('profile_referrals_card_description')}</p>
        <UserReferral />
      </div>
    </div>
  );
};
