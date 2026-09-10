import type { Metadata } from "next";
import { requestMagicLink, unlockGuideWithEmail } from "@/app/login/actions";
import {
  GuideUnlockForm,
  GuideUnlockStatus,
  readGuideUnlockError,
} from "@/components/guide-unlock-form";
import { PageShell } from "@/components/page-shell";
import {
  SendLinkForm,
  SendLinkStatus,
  type SendLinkError,
} from "@/components/send-link-form";
import {
  formatLoginSendFailedCopy,
  formatLoginSendFailedDetail,
  toPublicAuthError,
} from "@/lib/auth-error";

export const metadata: Metadata = {
  title: "Open your guide",
};

const MAGIC_ERRORS: ReadonlyArray<SendLinkError> = [
  "invalid-email",
  "not-configured",
  "send-failed",
  "auth",
];

function readMagicError(value: string | null): SendLinkError | null {
  return MAGIC_ERRORS.find((known) => known === value) ?? null;
}

export default async function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  const query = await searchParams;
  const status = typeof query.status === "string" ? query.status : null;
  const errorParam = typeof query.error === "string" ? query.error : null;
  const unlockError = readGuideUnlockError(errorParam);
  const magicError = unlockError ? null : readMagicError(errorParam);
  const authError =
    magicError === "send-failed"
      ? toPublicAuthError({
          message:
            typeof query.auth_message === "string"
              ? query.auth_message
              : undefined,
          code:
            typeof query.auth_code === "string" ? query.auth_code : undefined,
          status:
            typeof query.auth_status === "string"
              ? Number(query.auth_status)
              : undefined,
        })
      : null;

  return (
    <PageShell>
      <h1 className="font-sans text-4xl font-semibold text-text">Open your guide</h1>
      <p className="mt-4 max-w-xl text-text-muted">
        Enter the email you used at checkout. If we find your purchase, we open
        the guide in this browser — no password and no email to click.
      </p>

      <GuideUnlockForm
        action={unlockGuideWithEmail}
        inputId="guide-unlock-email"
        returnTo="/login"
        className="mt-8 max-w-md"
      />

      <GuideUnlockStatus error={unlockError} />

      <section
        id="magic-link"
        aria-labelledby="magic-link-heading"
        className="mt-12 max-w-md border-t border-border pt-10"
      >
        <h2
          id="magic-link-heading"
          className="font-sans text-lg font-semibold text-text"
        >
          Prefer email instead?
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          On another device, we can send a one-time link to your inbox. That is
          optional — the form above is the usual way back in.
        </p>
        <SendLinkForm
          action={requestMagicLink}
          inputId="login-email"
          label="Checkout email"
          className="mt-6"
        />
        <SendLinkStatus
          sent={status === "sent"}
          error={magicError}
          sendFailedCopy={authError ? formatLoginSendFailedCopy(authError) : null}
          supportDetail={authError ? formatLoginSendFailedDetail(authError) : null}
        />
      </section>
    </PageShell>
  );
}
