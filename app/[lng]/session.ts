import 'server-only';

import {createServerComponentClient} from '@supabase/auth-helpers-nextjs';
import {cookies} from 'next/headers';
import {redirect, RedirectType} from 'next/navigation';
import {getAppearance, getProfile} from '@/app/libs/supabase/metadata';
import type {Database} from '@/app/libs/supabase/supabase';

export interface CatchSessionIfYouCanOptions {
  lng?: string;
  redirectUrl?: string | URL;
  redirectType?: RedirectType;
}

function getRedirectUrl(options: Omit<CatchSessionIfYouCanOptions, 'redirectType'>) {
  const {lng, redirectUrl} = options;
  if (typeof redirectUrl === 'string') {
    return redirectUrl;
  } else if (redirectUrl instanceof URL) {
    return redirectUrl.toString();
  } else {
    return lng ? `/${lng}` : '/';
  }
}

export function createSupabaseClient() {
  const cookieStore = cookies();
  return createServerComponentClient<Database>({cookies: () => cookieStore});
}

export async function catchMeIfYouCan(options?: CatchSessionIfYouCanOptions) {
  const {lng, redirectUrl, redirectType} = options ?? {};
  const supabase = createSupabaseClient();
  const response = await supabase.auth.getUser();
  if (response.error !== null) {
    redirect(getRedirectUrl({lng, redirectUrl}), redirectType);
  }

  const user = response.data.user;
  const profile = getProfile(user);
  const appearance = getAppearance(user);
  return {supabase, user, profile, appearance};
}
