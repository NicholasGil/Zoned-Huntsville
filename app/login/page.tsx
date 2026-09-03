import type { Metadata } from "next";
import { requestMagicLink } from "@/app/login/actions";
import { PageShell } from "@/components/page-shell";
import {
  formatLoginSendFailedCopy,
  toPublicAuthError,
} from "@/lib/auth-error";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  const query = await searchParams;
  const status = typeof query.status === "string" ? query.status : null;
  const error = typeof query.error === "string" ? query.error : null;
  const sendFailedCopy =
    error === "send-failed"
      ? formatLoginSendFailedCopy(
          toPublicAuthError({
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
          }),
        )
      : null;

  return (
    <PageShell>
      <h1 className="font-sans text-4xl font-semibold text-text">Sign in</h1>
      <p className="mt-4 max-w-xl text-text-muted">
        Enter the email you used at checkout and we&apos;ll send a link that
        opens the guide. No password needed.
      </p>

      <form action={requestMagicLink} className="mt-10 max-w-md">
        <label htmlFor="login-email" className="block text-sm text-text">
          Email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-2 min-h-11 w-full rounded-md border border-border bg-surface px-3 py-2 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        />
        <button
          type="submit"
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-action px-6 py-3 text-sm font-semibold text-text-on-action outline-none hover:bg-action-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:bg-action-active sm:w-auto"
        >
          Send link
        </button>
      </form>

      {error === "invalid-email" ? (
        <p className="mt-4 max-w-md text-sm text-danger" role="alert">
          That email address doesn&apos;t look right. Check it and try again.
        </p>
      ) : null}
      {error === "not-configured" ? (
        <p className="mt-4 max-w-md text-sm text-danger" role="alert">
          Sign-in isn&apos;t available on this site right now. Set
          NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
        </p>
      ) : null}
      {sendFailedCopy ? (
        <p className="mt-4 max-w-md text-sm text-danger" role="alert">
          {sendFailedCopy}
        </p>
      ) : null}
      {error === "auth" ? (
        <p className="mt-4 max-w-md text-sm text-danger" role="alert">
          That sign-in link didn&apos;t work. It may have expired or already
          been used. Send a new one below.
        </p>
      ) : null}
      {status === "sent" ? (
        <p className="mt-4 max-w-md text-sm text-text" role="status">
          Link sent. Check your inbox (and spam) for the sign-in email. Opening
          that link signs you in and takes you straight to the guide.
        </p>
      ) : null}
    </PageShell>
  );
}
