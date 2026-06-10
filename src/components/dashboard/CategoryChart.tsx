import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  LabelList,
} from "recharts";
import { Indicator, RESPONSIBLES } from "@/data/mockData";

type Props = {
  data: Indicator[];
};

type TooltipPayloadItem = { value: number; fill: string; name: string };
type TooltipProps = { active?: boolean; payload?: TooltipPayloadItem[]; label?: string };

const CATEGORY_COLORS: Record<string, string> = {
  "Замена показателя и методики": "#ed8936",
  "Корректировка методики": "#ecc94b",
  "МО": "#e53e3e",
  "Полнота охвата": "#4299e1",
  "не выносим": "#9f7aea",
  "справочно": "#68d391",
};

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + (p.value ?? 0), 0);
  return (
    <div className="bg-card border border-border px-4 py-3 text-sm shadow-sm">
      <p className="font-medium mb-2">{label}</p>
      {payload.filter((p) => p.value > 0).map((p) => (
        <p key={p.name} className="flex justify-between gap-6" style={{ color: p.fill }}>
          <span className="text-xs">{p.name}</span>
          <span className="font-mono font-medium">{p.value}</span>
        </p>
      ))}
      <p className="mt-2 pt-2 border-t border-border text-muted-foreground flex justify-between gap-6">
        <span>Всего проблемных</span>
        <span className="font-mono font-medium">{total}</span>
      </p>
    </div>
  );
};

export default function CategoryChart({ data }: Props) {
  const categories = Object.keys(CATEGORY_COLORS);

  const chartData = useMemo(() => {
    return RESPONSIBLES.map((r) => {
      const problems = data.filter((d) => d.isProblem === 1 && d.responsible === r);
      const entry: Record<string, string | number> = { name: r.split(" ")[0] };
      categories.forEach((cat) => {
        entry[cat] = problems.filter((d) => d.problemCategory === cat).length;
      });
      return entry;
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
          width={60}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))" }} />
        <Legend iconType="square" iconSize={9} wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
        {categories.map((cat, i) => {
          const isLast = i === categories.length - 1;
          return (
            <Bar key={cat} dataKey={cat} stackId="a" fill={CATEGORY_COLORS[cat]}
              radius={isLast ? [0, 2, 2, 0] : [0, 0, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[cat]} />
              ))}
              <LabelList
                dataKey={cat}
                position="inside"
                style={{ fill: "#fff", fontSize: 11, fontFamily: "IBM Plex Mono", fontWeight: 500 }}
                formatter={(v: number) => (v > 0 ? v : "")}
              />
              {isLast && (
                <LabelList
                  content={(props) => {
                    const { x, y, width, height, index } = props as { x: number; y: number; width: number; height: number; index: number };
                    const row = chartData[index];
                    if (!row) return null;
                    const total = categories.reduce((s, c) => s + ((row[c] as number) ?? 0), 0);
                    if (total === 0) return null;
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
              )}
            </Bar>
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
}