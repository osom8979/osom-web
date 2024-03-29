'use client';

import {useRouter} from 'next/navigation';
import {
  type HTMLAttributes,
  type PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {toastError} from '@/app/components/toast';
import {HttpStatusError} from '@/app/exceptions';
import SvgSpinners270Ring from '@/app/icons/spinners/SvgSpinners270Ring';
import useTranslation from '@/app/libs/i18n/client';

export const DEFAULT_ERROR_TIMEOUT_MILLISECONDS = 4_000;

type OnClick = () => Promise<void>;

// eslint-disable-next-line no-unused-vars
type OnChangePending = (pending: boolean) => Promise<void>;

type OnComplete = () => Promise<void>;

// eslint-disable-next-line no-unused-vars
type OnError = (error: string) => Promise<void>;

type ErrorFeedbackType = 'label' | 'toast';

interface RequestButtonProps
  extends Omit<
    PropsWithChildren<HTMLAttributes<HTMLButtonElement>>,
    'lang' | 'onClick' | 'onError'
  > {
  lng?: string;
  errorTimeout?: number;
  disabled?: boolean;
  noRefresh?: boolean;
  errorFeedbackType?: ErrorFeedbackType;
  noErrorFeedback?: boolean;
  recoverPendingState?: boolean;
  onClick?: OnClick;
  onChangePending?: OnChangePending;
  onComplete?: OnComplete;
  onError?: OnError;
  spinnerClassName?: string;
}

export default function RequestButton(props: RequestButtonProps) {
  const {
    children,
    lng,
    errorTimeout,
    disabled,
    noRefresh,
    errorFeedbackType,
    noErrorFeedback,
    recoverPendingState,
    onClick,
    onChangePending,
    onComplete,
    onError,
    spinnerClassName,
    className,
    ...attrs
  } = props;
  const {t} = useTranslation(lng, 'http-status');
  const [pending, setPending] = useState<undefined | true>();
  const [error, setError] = useState<undefined | string>();
  const [errorTimeoutId, setErrorTimeoutId] = useState<undefined | number>();
  const router = useRouter();

  const isDisabled = useMemo(() => {
    return disabled || pending;
  }, [disabled, pending]);

  useEffect(() => {
    return () => {
      if (typeof errorTimeoutId !== 'undefined') {
        clearTimeout(errorTimeoutId);
      }
    };
  }, [errorTimeoutId]);

  const handleClick = async () => {
    if (pending) {
      return;
    }

    if (typeof errorTimeoutId !== 'undefined') {
      clearTimeout(errorTimeoutId);
      setError(undefined);
      setErrorTimeoutId(undefined);
      return;
    }

    setPending(true);
    if (onChangePending) {
      await onChangePending(true);
    }

    console.assert(typeof error === 'undefined');
    console.assert(typeof errorTimeoutId === 'undefined');

    try {
      if (onClick) {
        await onClick();
      }
    } catch (e) {
      setPending(undefined);
      if (onChangePending) {
        await onChangePending(false);
      }

      let errorMessage: string;
      if (e instanceof HttpStatusError) {
        errorMessage = t(`http_status.${e.statusCode}`, {defaultValue: e.message});
      } else {
        errorMessage = String(e);
      }

      if (onError) {
        await onError(errorMessage);
      }

      if (!noErrorFeedback) {
        if (errorFeedbackType === 'label') {
          setError(errorMessage);
          const timeoutId = setTimeout(() => {
            setError(undefined);
            setErrorTimeoutId(undefined);
          }, errorTimeout ?? DEFAULT_ERROR_TIMEOUT_MILLISECONDS);
          setErrorTimeoutId(timeoutId as unknown as number);
        } else {
          toastError(errorMessage);
        }
      }
      return;
    }

    if (!noRefresh) {
      router.refresh();
    }
    if (onComplete) {
      await onComplete();
    }
    if (recoverPendingState) {
      setPending(undefined);
      if (onChangePending) {
        await onChangePending(false);
      }
    }
  };

  const ButtonBody = () => {
    if (pending) {
      return <SvgSpinners270Ring className={spinnerClassName} />;
    }
    if (error) {
      return <p className="text-clip">{error}</p>;
    }
    return children;
  };

  const buttonClassName = useMemo(() => {
    const classes = className?.split(' ').map(v => v.trim()) ?? [];
    if (classes.findIndex(v => v === 'btn') === -1) {
      classes.push('btn');
    }
    if (isDisabled && classes.findIndex(v => v === 'btn-disabled') === -1) {
      classes.push('btn-disabled');
    }
    return classes.join(' ');
  }, [className, isDisabled]);

  return (
    <button
      type="button"
      role="button"
      lang={lng}
      className={buttonClassName}
      onClick={handleClick}
      data-disabled={isDisabled}
      aria-disabled={isDisabled}
      data-error={error}
      {...attrs}
    >
      <ButtonBody />
    </button>
  );
}
