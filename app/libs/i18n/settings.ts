import {type InitOptions} from 'i18next/typescript/options';

export const en = 'en';
export const ko = 'ko';

export const FALLBACK_NAMESPACE = ['defaults/common', 'defaults/http-status'];
export const DEFAULT_NAMESPACE = FALLBACK_NAMESPACE;
export const LOAD_NAMESPACES = DEFAULT_NAMESPACE;
export const LANGUAGES = [en, ko];
export const FALLBACK_LANGUAGE = en;
export const USE_LANGUAGE = en;
export const I18N_DEBUG = false;

export const COOKIE_I18N_KEY = 'i18n';

export function defaultServerOptions(
  lng: string = USE_LANGUAGE,
  ns: string | readonly string[] = LOAD_NAMESPACES,
  debug: boolean = I18N_DEBUG
) {
  return {
    debug,
    supportedLngs: LANGUAGES,
    fallbackLng: FALLBACK_LANGUAGE,
    lng,
    fallbackNS: FALLBACK_NAMESPACE,
    defaultNS: DEFAULT_NAMESPACE,
    ns,
  } as InitOptions;
}

export function defaultClientOptions(
  lng = USE_LANGUAGE,
  ns: string | readonly string[] = LOAD_NAMESPACES,
  debug = I18N_DEBUG
) {
  const runsOnServerSide = typeof window === 'undefined';
  return {
    ...defaultServerOptions(lng, ns, debug),
    lng: undefined, // let detect the language on client side
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
    },
    preload: runsOnServerSide ? LANGUAGES : [],
  } as InitOptions;
}