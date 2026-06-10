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
} from "recharts";
import { Indicator, RESPONSIBLES } from "@/data/mockData";

type Props = {
  data: Indicator[];
};

type TooltipPayloadItem = { value: number; fill: string; name: string };
type TooltipProps = { active?: boolean; payload?: TooltipPayloadItem[]; label?: string };

const CATEGORY_COLORS: Record<string, string> = {
  "МО": "#e53e3e",
  "Замена показателя и методики": "#ed8936",
  "не выносим": "#9f7aea",
  "Корректировка методики": "#ecc94b",
  "Полнота охвата": "#4299e1",
  "справочно": "#68d391",
};

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border px-4 py-3 text-sm shadow-sm">
      <p className="font-medium mb-2">{label}</p>
      {payload.filter((p) => p.value > 0).map((p) => (
        <p key={p.name} className="flex justify-between gap-6" style={{ color: p.fill }}>
          <span className="text-xs">{p.name}</span>
          <span className="font-mono font-medium">{p.value}</span>
        </p>
      ))}
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
      <BarChart data={chartData} barGap={2} barSize={14}>
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
        <Legend iconType="square" iconSize={9} wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
        {categories.map((cat) => (
          <Bar key={cat} dataKey={cat} stackId="a" fill={CATEGORY_COLORS[cat]} radius={[0, 0, 0, 0]}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[cat]} />
            ))}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
