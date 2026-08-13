type Props = {
  title: string;
  subtitle?: string;
  aspect?: "square" | "portrait" | "wide" | "phone";
  className?: string;
};

const aspectClass = {
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  wide: "aspect-[16/9]",
  phone: "aspect-[9/16]",
};

export function ImagePlaceholder({
  title,
  subtitle,
  aspect = "portrait",
  className = "",
}: Props) {
  return (
    <div
      className={`${aspectClass[aspect]} ${className} group relative overflow-hidden rounded-[2rem] border border-rose-200/80 bg-gradient-to-br from-rose-50 via-white to-amber-50 shadow-soft`}
    >
      <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_20%_20%,rgba(244,114,182,.22),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(251,191,36,.15),transparent_26%)]" />
      <div className="relative flex h-full flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-rose-200 bg-white/90 text-3xl shadow-sm">
          📸
        </div>
        <p className="max-w-xs font-semibold text-rose-950">{title}</p>
        {subtitle ? (
          <p className="mt-2 max-w-xs text-sm leading-6 text-rose-900/60">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}
