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
  LabelList,
} from "recharts";
import { Indicator, RESPONSIBLES } from "@/data/mockData";

type Props = {
  data: Indicator[];
};

type TooltipPayloadItem = { name: string; value: number; fill: string };
type TooltipProps = { active?: boolean; payload?: TooltipPayloadItem[]; label?: string };

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + (p.value ?? 0), 0);
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
    return RESPONSIBLES.map((r) => {
      const items = data.filter((d) => d.responsible === r);
      return {
        name: r,
        "Проблемные": items.filter((d) => d.isProblem === 1).length,
        "Непроблемные": items.filter((d) => d.isProblem === 0).length,
      };
    });
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} layout="vertical" barSize={22} margin={{ left: 0, right: 32, top: 4, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", fontFamily: "IBM Plex Mono" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
          width={90}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))" }} />
        <Legend iconType="square" iconSize={9} wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
        <Bar dataKey="Проблемные" stackId="a" fill="hsl(var(--problem))" radius={[0, 0, 0, 0]}>
          <LabelList
            dataKey="Проблемные"
            position="inside"
            style={{ fill: "#fff", fontSize: 11, fontFamily: "IBM Plex Mono", fontWeight: 500 }}
            formatter={(v: number) => (v > 0 ? v : "")}
          />
        </Bar>
        <Bar dataKey="Непроблемные" stackId="a" fill="hsl(var(--ok))" radius={[0, 2, 2, 0]}>
          <LabelList
            dataKey="Непроблемные"
            position="insideRight"
            style={{ fill: "#fff", fontSize: 11, fontFamily: "IBM Plex Mono", fontWeight: 500 }}
            formatter={(v: number) => (v > 0 ? v : "")}
          />
          <LabelList
            content={(props) => {
              const { x, y, width, height, index } = props as { x: number; y: number; width: number; height: number; index: number };
              const row = chartData[index];
              if (!row) return null;
              const total = (row["Проблемные"] as number) + (row["Непроблемные"] as number);
              return (
                <text
                  x={x + width + 6}
                  y={y + height / 2}
                  dominantBaseline="middle"
                  fill="hsl(var(--foreground))"
                  fontSize={11}
                  fontFamily="IBM Plex Mono"
                  fontWeight={600}
                >
                  {total}
                </text>
              );
            }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}