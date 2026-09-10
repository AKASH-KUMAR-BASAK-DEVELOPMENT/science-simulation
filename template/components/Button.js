import Link from "next/link";

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
}) {
  const base =
    "lift inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold";
  const styles =
    variant === "primary"
      ? "bg-gradient-to-r from-primary to-primary2 text-white shadow-[0_14px_34px_-10px_rgba(109,94,252,0.7)] hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-10px_rgba(109,94,252,0.75)]"
      : variant === "ghost"
      ? "text-primary hover:text-primary2"
      : "bg-card text-ink ring-1 ring-line shadow-[0_10px_24px_-12px_rgba(28,25,53,0.35)] hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-12px_rgba(28,25,53,0.4)]";

  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  );
}
