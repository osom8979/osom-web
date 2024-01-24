import {createServerComponentClient} from '@supabase/auth-helpers-nextjs';
import {cookies} from 'next/headers';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import LoginForm from './_LoginForm';
import OAuthLoginButton from './_OAuthLoginButton';
import {type I18nRouterProps} from '@/app/[lng]/params';
import CenterDialog from '@/app/components/CenterDialog';
import MdiDiscord from '@/app/icons/mdi/MdiDiscord';
import MdiGithub from '@/app/icons/mdi/MdiGithub';
import MdiGoogle from '@/app/icons/mdi/MdiGoogle';
import useTranslation from '@/app/libs/i18n/server';
import {appPaths} from '@/app/paths';

export default async function LoginPage(props: I18nRouterProps) {
  const lng = props.params.lng;
  const cookieStore = cookies();
  const supabase = createServerComponentClient({cookies: () => cookieStore});
  const user = await supabase.auth.getUser();
  const hasSession = user.error === null;
  if (hasSession) {
    redirect(`/${lng}`);
  }

  const {t} = await useTranslation(lng, 'login');
  return (
    <CenterDialog lng={lng}>
      <div className="osom-card">
        <div className="card-body items-center">
          <h2 className="card-title mb-6 text-center">{t('title')}</h2>

          <div className="my-6 w-full space-y-4">
            <OAuthLoginButton provider="google" lng={lng}>
              <MdiGoogle className="w-6 h-6" />
              <span>{t('oauth.login_google')}</span>
            </OAuthLoginButton>

            <OAuthLoginButton provider="github" lng={lng}>
              <MdiGithub className="w-6 h-6" />
              <span>{t('oauth.login_github')}</span>
            </OAuthLoginButton>

            <OAuthLoginButton provider="discord" lng={lng}>
              <MdiDiscord className="w-6 h-6" />
              <span>{t('oauth.login_discord')}</span>
            </OAuthLoginButton>
          </div>

          <div className="flex items-center w-full my-4">
            <hr className="w-full"></hr>
            <span className="px-3 whitespace-nowrap">{t('or')}</span>
            <hr className="w-full"></hr>
          </div>

          <LoginForm lng={lng} buttonLabel={t('login')} />

          <p className="text-sm text-center my-6">
            {t('no_account')}
            <Link
              href={`/${lng}${appPaths.signup}`}
              hrefLang={lng}
              rel="noopener noreferrer"
              className="link link-primary ml-1"
            >
              {t('signup_link')}
            </Link>
          </p>
        </div>
      </div>
    </CenterDialog>
  );
}
