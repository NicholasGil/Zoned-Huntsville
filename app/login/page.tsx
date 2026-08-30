import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { requestMagicLink } from "@/app/login/actions";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  const query = await searchParams;
  const status = typeof query.status === "string" ? query.status : null;
  const error = typeof query.error === "string" ? query.error : null;

  return (
    <PageShell>
      <h1 className="font-serif text-4xl text-ink">Sign in</h1>
      <p className="mt-4 max-w-xl text-muted">
        Request a Supabase magic link. No password. The link lands on
        /auth/confirm.
      </p>

      <form action={requestMagicLink} className="mt-10 max-w-md">
        <label htmlFor="login-email" className="block text-sm text-ink">
          Email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-2 w-full border border-rule bg-paper px-3 py-2"
        />
        <button
          type="submit"
          className="mt-4 bg-brick px-4 py-2.5 text-sm text-paper hover:bg-brick-dark"
        >
          Email me a sign-in link
        </button>
      </form>

      {error === "invalid-email" ? (
        <p className="mt-4 text-sm text-brick" role="alert">
          That email address is not valid.
        </p>
      ) : null}
      {error === "not-configured" ? (
        <p className="mt-4 text-sm text-brick" role="alert">
          Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and
          NEXT_PUBLIC_SUPABASE_ANON_KEY.
        </p>
      ) : null}
      {error === "send-failed" ? (
        <p className="mt-4 text-sm text-brick" role="alert">
          Supabase did not send the link. Check the project auth settings.
        </p>
      ) : null}
      {error === "auth" ? (
        <p className="mt-4 text-sm text-brick" role="alert">
          The magic-link callback could not create a session.
        </p>
      ) : null}
      {status === "sent" ? (
        <p className="mt-4 text-sm text-muted" role="status">
          If that address is accepted, a sign-in email is on the way.
        </p>
      ) : null}
    </PageShell>
  );
}
