import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The flaming ring from the logo artwork, as a reusable button shell. The
 * fire has to be a sibling layer behind an opaque button: putting the filter
 * on the wrapper would filter the button's own text too.
 */
function Aura() {
  return <span aria-hidden className="flame-aura" />;
}

export function FlameLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <div className="flame-wrap">
      <Aura />
      <Link href={href} className="flame-btn">
        {children}
      </Link>
    </div>
  );
}

export function FlameSubmit({ children }: { children: ReactNode }) {
  return (
    <div className="flame-wrap">
      <Aura />
      <button type="submit" className="flame-btn">
        {children}
      </button>
    </div>
  );
}

export function FlameExternal({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <div className="flame-wrap">
      <Aura />
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flame-btn"
      >
        {children}
      </a>
    </div>
  );
}
