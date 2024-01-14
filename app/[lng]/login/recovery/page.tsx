import React from 'react';
import {type I18nRouterProps} from '@/app/[lng]/params';
import CenterMain from '@/app/components/layout/CenterMain';
import useTranslation from '@/app/libs/i18n/server';

export default async function RecoveryPage(props: I18nRouterProps) {
  const lng = props.params.lng;
  const {t} = await useTranslation(lng, 'login-recovery');
  return (
    <CenterMain lng={lng}>
      <div className="card bg-base-100 shadow-lg">
        <form
          noValidate={false}
          className="card-body items-center"
          action="/api/auth/recovery"
          method="post"
        >
          <h2 className="card-title mt-2 mb-6 text-center">{t('title')}</h2>

          <p className="text-center">
            {t('details_1')}
            <br />
            {t('details_2')}
          </p>

          <input
            type="email"
            name="email"
            id="email"
            placeholder={t('email_placeholder')}
            className="input input-bordered w-full placeholder-gray-500 placeholder-opacity-80 mt-4"
          />

          <div className="card-actions mt-6">
            <button type="submit" className="btn btn-primary">
              <span>{t('send')}</span>
            </button>
          </div>
        </form>
      </div>
    </CenterMain>
  );
}
