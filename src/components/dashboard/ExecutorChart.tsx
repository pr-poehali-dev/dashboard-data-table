import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Indicator } from "@/data/mockData";

type Props = {
  data: Indicator[];
};

type TooltipPayloadItem = { name: string; value: number; fill: string };
type TooltipProps = { active?: boolean; payload?: TooltipPayloadItem[]; label?: string };

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.length) return null;
  const total = (payload[0]?.value ?? 0) + (payload[1]?.value ?? 0);
  return (
    <div className="bg-card border border-border px-4 py-3 text-sm shadow-sm">
      <p className="font-medium mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.fill }} className="flex justify-between gap-6">
          <span>{p.name}</span>
          <span className="font-mono font-medium">{p.value}</span>
        </p>
      ))}
      <p className="mt-2 pt-2 border-t border-border text-muted-foreground flex justify-between gap-6">
        <span>Всего</span>
        <span className="font-mono font-medium">{total}</span>
      </p>
    </div>
  );
};

export default function ExecutorChart({ data }: Props) {
  const chartData = useMemo(() => {
    const map: Record<string, { ok: number; problem: number }> = {};
    data.forEach((d) => {
      if (!map[d.responsible]) map[d.responsible] = { ok: 0, problem: 0 };
      if (d.isProblem === 1) map[d.responsible].problem++;
      else map[d.responsible].ok++;
    });
    return Object.entries(map).map(([name, v]) => ({
      name: name.split(" ")[0],
      fullName: name,
      "Непроблемные": v.ok,
      "Проблемные": v.problem,
    }));
  }, [data]);

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        Нет данных для отображения
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} barGap={2} barSize={28}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))", fontFamily: "IBM Plex Mono" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))" }} />
        <Legend
          iconType="square"
          iconSize={10}
          wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
        />
        <Bar dataKey="Непроблемные" fill="hsl(var(--ok))" radius={[2, 2, 0, 0]} />
        <Bar dataKey="Проблемные" fill="hsl(var(--problem))" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
