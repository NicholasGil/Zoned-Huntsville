import type { Metadata } from "next";
import { requestMagicLink } from "@/app/login/actions";
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
  title: "Sign in",
};

const ERRORS: ReadonlyArray<SendLinkError> = [
  "invalid-email",
  "not-configured",
  "send-failed",
  "auth",
];

function readError(value: string | null): SendLinkError | null {
  return ERRORS.find((known) => known === value) ?? null;
}

export default async function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  const query = await searchParams;
  const status = typeof query.status === "string" ? query.status : null;
  const error = readError(typeof query.error === "string" ? query.error : null);
  const authError =
    error === "send-failed"
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
      <h1 className="font-sans text-4xl font-semibold text-text">Sign in</h1>
      <p className="mt-4 max-w-xl text-text-muted">
        Enter the email you used at checkout and we&apos;ll send a link that
        opens the guide. No password needed.
      </p>

      <SendLinkForm
        action={requestMagicLink}
        inputId="login-email"
        label="Checkout email"
        className="mt-8 max-w-md"
      />

      <SendLinkStatus
        sent={status === "sent"}
        error={error}
        sendFailedCopy={authError ? formatLoginSendFailedCopy(authError) : null}
        supportDetail={authError ? formatLoginSendFailedDetail(authError) : null}
      />
    </PageShell>
  );
}
