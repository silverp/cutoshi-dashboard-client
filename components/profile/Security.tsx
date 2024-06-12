import axios from '@/pages/api/axios';
import * as Yup from 'yup';
import { Input } from '@/components/Input';
import { Form, Formik, FormikProps } from 'formik';
import React, { useCallback, useRef, useState } from 'react';
import toast from '@/helpers/toast';
import { useTranslation } from 'react-i18next';
import { ButtonLoading } from '../ButtonLoading';

export const Security = () => {
  const { t } = useTranslation();
  const [showEdit, setShowEdit] = useState(false);
  const refForm = useRef<
    | FormikProps<{ newPassword: string; confirmPassword: string; currentPassword: string }>
    | undefined
  >();
  const [loading, setLoading] = useState<boolean>(false);

  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required(t('current_password_is_required')),
    newPassword: Yup.string()
      .min(8, t('please_enter_at_least_8_characters'))
      .required(t('password_is_required')),
    confirmPassword: Yup.string()
      .required(t('confirm_password_is_required'))
      .oneOf([Yup.ref('newPassword')], t('passwords_must_match')),
  });

  const handlerUpdatePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      try {
        setLoading(true);
        await axios.put('/users/me/change-password', {
          oldPassword: currentPassword,
          newPassword: newPassword,
        });
        refForm.current?.resetForm();
        toast(t('password_has_been_changed'), {
          type: 'success',
          theme: 'colored',
        });
        setShowEdit(!showEdit);
      } catch (e: any) {
        toast(e.message, {
          type: 'error',
          theme: 'colored',
        });
      } finally {
        setLoading(false);
      }
    },
    [showEdit, setShowEdit, t],
  );
  return (
    <div className="flex flex-col lg:flex-row w-full p-3 gap-2">
      <div className="bg-background_card w-full lg:w-1/2 py-3 px-4 flex flex-col gap-4 rounded-lg">
        <div className="w-full flex flex-row justify-between items-center">
          <p className="text-black text-xl font-medium">{t('password_settings')}</p>

          <button
            onClick={() => setShowEdit(!showEdit)}
            className="text-sm text-primary text-end underline"
          >
            {t('edit')}
          </button>
        </div>

        <Formik<{ newPassword: string; confirmPassword: string; currentPassword: string }>
          validationSchema={validationSchema}
          onSubmit={({ currentPassword, newPassword }) => {
            handlerUpdatePassword(currentPassword, newPassword);
          }}
          innerRef={refForm.current as any}
          initialValues={{
            newPassword: '',
            confirmPassword: '',
            currentPassword: '',
          }}
        >
          {({ errors, values, setFieldValue }) => (
            <Form className="flex flex-col gap-2 w-full flex-1 pr-3">
              <Input
                require
                security
                changeText={(value) => setFieldValue('currentPassword', value.replace(/\s/g, ''))}
                editable={showEdit}
                value={values.currentPassword}
                label={t('current_password')}
                placeholder={t('current_password')}
              />
              {errors.currentPassword && (
                <p className="text-red text-sm">{errors.currentPassword}</p>
              )}

              <Input
                require
                security
                changeText={(value) => setFieldValue('newPassword', value.replace(/\s/g, ''))}
                editable={showEdit}
                value={values.newPassword}
                label={t('new_password')}
                placeholder={t('new_password')}
              />
              {errors.newPassword && <p className="text-red text-sm">{errors.newPassword}</p>}

              <Input
                require
                security
                changeText={(value) => setFieldValue('confirmPassword', value.replace(/\s/g, ''))}
                editable={showEdit}
                value={values.confirmPassword}
                label={t('confirm_password')}
                placeholder={t('confirm_password')}
              />
              {errors.confirmPassword && (
                <p className="text-red text-sm">{errors.confirmPassword}</p>
              )}

              {showEdit && (
                <div className="mt-4 flex gap-3">
                  <button type="submit" className="primary-btn mt-2">
                    {loading && <ButtonLoading />}
                    {t('submit')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEdit(false);
                    }}
                    className="cancel-btn mt-2"
                  >
                    {t('cancel')}
                  </button>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
