type Props = {
  label: string;
  value: number | string;
  sub?: string;
  accent?: "default" | "red" | "blue";
};

export default function StatCard({ label, value, sub, accent = "default" }: Props) {
  const accentClass = {
    default: "text-foreground",
    red: "text-red-500",
    blue: "text-blue-500",
  }[accent];

  return (
    <div className="bg-card border border-border p-5 rounded-sm">
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">{label}</p>
      <p className={`text-3xl font-light font-mono ${accentClass}`}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-2">{sub}</p>}
    </div>
  );
}
