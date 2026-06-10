import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Indicator, RESPONSIBLES } from "@/data/mockData";

type Props = {
  data: Indicator[];
};

type TooltipProps = { active?: boolean; payload?: { value: number; fill: string }[]; label?: string };

const CATEGORY_COLORS = [
  "hsl(0,72%,51%)",
  "hsl(25,90%,55%)",
  "hsl(45,90%,50%)",
  "hsl(200,70%,50%)",
  "hsl(260,60%,60%)",
];

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border px-4 py-3 text-sm shadow-sm">
      <p className="font-medium mb-1">{label}</p>
      <p className="font-mono font-medium" style={{ color: payload[0].fill }}>
        {payload[0].value} показателей
      </p>
    </div>
  );
};

export default function CategoryChart({ data }: Props) {
  const availableResponsibles = useMemo(() => {
    return RESPONSIBLES.filter((r) => data.some((d) => d.responsible === r));
  }, [data]);

  const [selected, setSelected] = useState<string>(availableResponsibles[0] ?? "");

  const chartData = useMemo(() => {
    const problems = data.filter((d) => d.isProblem === 1 && d.responsible === selected);
    const map: Record<string, number> = {};
    problems.forEach((d) => {
      map[d.problemCategory] = (map[d.problemCategory] ?? 0) + 1;
    });
    return Object.entries(map)
      .map(([category, count], i) => ({ category, count, color: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }))
      .sort((a, b) => b.count - a.count);
  }, [data, selected]);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-5">
        {availableResponsibles.map((r) => (
          <button
            key={r}
            onClick={() => setSelected(r)}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
              selected === r
                ? "bg-foreground text-background"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {r.split(" ")[0]}
          </button>
        ))}
      </div>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
          Проблемных показателей нет
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} layout="vertical" barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))", fontFamily: "IBM Plex Mono" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="category"
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              width={130}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))" }} />
            <Bar dataKey="count" radius={[0, 2, 2, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}