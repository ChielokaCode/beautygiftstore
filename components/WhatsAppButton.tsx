type Props = {
  label: string;
  message?: string;
  className?: string;
};

const PHONE = "2349061815992";

export function WhatsAppButton({
  label,
  message = "Hello, I want to order the handcrafted wrist bead stack. Please help me place my order.",
  className = "",
}: Props) {
  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#167c45] px-7 py-4 text-center text-sm font-extrabold uppercase tracking-wide text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#126b3b] focus:outline-none focus:ring-4 focus:ring-emerald-200 ${className}`}
    >
      <span aria-hidden>💬</span>
      {label}
    </a>
  );
}
