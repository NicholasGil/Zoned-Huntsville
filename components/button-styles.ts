export const focusRing =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

export const primaryButton = `inline-flex min-h-11 items-center justify-center rounded-md bg-action px-6 py-3 text-sm font-semibold text-text-on-action hover:bg-action-hover active:bg-action-active ${focusRing}`;

export const secondaryButton = `inline-flex min-h-11 items-center justify-center rounded-md border border-text bg-transparent px-6 py-3 text-sm font-semibold text-text hover:border-action ${focusRing}`;

export const quietLink = `inline-flex min-h-11 items-center text-sm text-text-muted underline-offset-4 hover:text-text hover:underline ${focusRing}`;

export const inlineLink = `font-semibold text-action underline underline-offset-4 hover:text-action-hover ${focusRing}`;
