export function VerifyToken({ children }: { children: string }) {
  return <span className="font-mono text-[0.95em]">⟦VERIFY: {children}⟧</span>;
}
