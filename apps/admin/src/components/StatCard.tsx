interface StatCardProps {
  label: string;
  value: string | number;
  helper?: string;
}

export function StatCard({ label, value, helper }: StatCardProps) {
  return (
    <div className="rounded-panel border border-sand/60 bg-white/82 p-5 shadow-soft">
      <p className="text-sm font-semibold text-ink/60">{label}</p>
      <p className="mt-3 text-3xl font-bold text-night">{value}</p>
      {helper ? <p className="mt-2 text-sm text-ink/55">{helper}</p> : null}
    </div>
  );
}
