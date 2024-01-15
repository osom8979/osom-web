'use client';

import {StatusCodes} from 'http-status-codes';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import React, {useState} from 'react';
import styles from './LoginForm.module.scss';
import {BadRequestError, HttpStatusError, UnauthorizedError} from '@/app/exceptions';
import MdiLogin from '@/app/icons/mdi/MdiLogin';
import SvgSpinners270Ring from '@/app/icons/spinners/SvgSpinners270Ring';
import useTranslation from '@/app/libs/i18n/client';
import {getLoginSchema} from '@/app/schemas/login';

const LOGIN_API_PATH = '/api/auth/login';
const LOGIN_API_METHOD = 'POST';
const LOGIN_API_TIMEOUT_MILLISECONDS = 8_000;

interface LoginSubmitProps {
  lng: string;
  fetchTimeout?: number;
}

export default function LoginForm(props: LoginSubmitProps) {
  const {t} = useTranslation(props.lng, 'login');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [pending, setPending] = useState<undefined | boolean>();
  const [error, setError] = useState<undefined | string>();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const schema = await getLoginSchema(props.lng);
    const validatedFields = schema.safeParse({email, password});
    if (!validatedFields.success) {
      const errors = validatedFields.error.errors;
      console.assert(errors.length >= 1);
      setError(errors[0].message);
      return;
    }

    setPending(true);
    const data = new FormData();
    data.set('email', email);
    data.set('password', password);

    const timeout = props.fetchTimeout ?? LOGIN_API_TIMEOUT_MILLISECONDS;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const fetchOptions = {
        method: LOGIN_API_METHOD,
        signal: controller.signal,
        body: data,
      };

      await fetch(LOGIN_API_PATH, fetchOptions).then(response => {
        switch (response.status) {
          case StatusCodes.OK:
            return;
          case StatusCodes.BAD_REQUEST:
            throw new BadRequestError();
          case StatusCodes.UNAUTHORIZED:
            throw new UnauthorizedError();
          default:
            throw new HttpStatusError(response.status);
        }
      });

      router.push(`/${props.lng}/main`);
    } catch (e) {
      setPending(undefined);

      if (e instanceof BadRequestError) {
        setError(t('bad_request') ?? e.message);
      } else if (e instanceof UnauthorizedError) {
        setError(t('unauthorized') ?? e.message);
      } else if (e instanceof HttpStatusError) {
        setError(e.message);
      } else {
        setError(String(e));
      }
    } finally {
      clearTimeout(timeoutId);
    }
  };

  return (
    <form className={styles.root} onSubmit={handleSubmit}>
      <div className={styles.inputList}>
        <div className={styles.inputItem}>
          <label htmlFor="email">{t('email')}</label>
          <input
            type="email"
            name="email"
            id="email"
            required={true}
            aria-required={true}
            placeholder={t('email_placeholder')}
            aria-placeholder={t('email_placeholder')}
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={pending}
            aria-disabled={pending}
            data-error={error}
            aria-errormessage={error}
          />
        </div>

        <div className={styles.inputItem}>
          <div className="flex justify-between">
            <label htmlFor="password">{t('password')}</label>
            <Link
              href={`/${props.lng}/login/recovery`}
              hrefLang={props.lng}
              rel="noopener noreferrer"
            >
              {t('forgot_password')}
            </Link>
          </div>

          <input
            type="password"
            name="password"
            id="password"
            required={true}
            aria-required={true}
            placeholder={t('password_placeholder')}
            aria-placeholder={t('password_placeholder')}
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={pending}
            aria-disabled={pending}
            data-error={error}
            aria-errormessage={error}
          />
        </div>
      </div>

      <div className={styles.errorBox} data-error={error} aria-errormessage={error}>
        <span>{error}</span>
      </div>

      <button type="submit" disabled={pending} aria-disabled={pending}>
        {pending ? <SvgSpinners270Ring /> : <MdiLogin />}
        <span>{t('login')}</span>
      </button>
    </form>
  );
}
