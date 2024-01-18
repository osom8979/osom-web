import 'server-only';

import {createRouteHandlerClient} from '@supabase/auth-helpers-nextjs';
import {cookies} from 'next/headers';
import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // The `/api/auth/callback` route is required for the server-side auth
  // flow implemented by the Auth Helpers package.
  // It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-sign-in-with-code-exchange
  const {origin, searchParams} = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';
  const redirectPath = next.startsWith('/') ? next : `/${next}`;

  if (!code) {
    return NextResponse.redirect(`${origin}/pkce/fail?reason=nocode`);
  }

  const supabase = createRouteHandlerClient({cookies});
  const {error} = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.warn('Supabase exchange code error', error);
    return NextResponse.redirect(`${origin}/pkce/fail?reason=exchange`);
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${origin}${redirectPath}`);
}