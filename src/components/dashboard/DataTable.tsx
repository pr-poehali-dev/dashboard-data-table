import { useState } from "react";
import { Indicator } from "@/data/mockData";
import Icon from "@/components/ui/icon";

type Props = {
  data: Indicator[];
};

type SortKey = keyof Indicator;
type SortDir = "asc" | "desc";

const formatValue = (v: number, name: string): string => {
  if (name.toLowerCase().includes("выручка") || name.toLowerCase().includes("расход") || name.toLowerCase().includes("бюджет дебитор")) {
    return new Intl.NumberFormat("ru-RU").format(v);
  }
  return String(v);
};

export default function DataTable({ data }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("responsible");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const sorted = [...data].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === "string" && typeof bv === "string")
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    if (typeof av === "number" && typeof bv === "number")
      return sortDir === "asc" ? av - bv : bv - av;
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / perPage);
  const paged = sorted.slice((page - 1) * perPage, page * perPage);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <Icon name="ChevronsUpDown" size={13} className="text-muted-foreground/50" />;
    return sortDir === "asc"
      ? <Icon name="ChevronUp" size={13} className="text-foreground" />
      : <Icon name="ChevronDown" size={13} className="text-foreground" />;
  };

  const cols: { key: SortKey; label: string; align?: string }[] = [
    { key: "name", label: "Показатель" },
    { key: "responsible", label: "Исполнитель" },
    { key: "department", label: "Отдел" },
    { key: "value", label: "Значение", align: "right" },
    { key: "isProblem", label: "Статус" },
    { key: "problemCategory", label: "Категория проблемы" },
    { key: "date", label: "Дата" },
  ];

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {cols.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`py-3 px-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none ${col.align === "right" ? "text-right" : "text-left"}`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.label}
                    <SortIcon k={col.key} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-muted-foreground">
                  Нет данных по выбранным фильтрам
                </td>
              </tr>
            )}
            {paged.map((row, i) => (
              <tr
                key={row.id}
                className={`border-b border-border/50 hover:bg-muted/40 transition-colors animate-slide-up`}
                style={{ animationDelay: `${i * 30}ms`, animationFillMode: "both" }}
              >
                <td className="py-3 px-4 font-medium">{row.name}</td>
                <td className="py-3 px-4 text-muted-foreground">{row.responsible}</td>
                <td className="py-3 px-4 text-muted-foreground">{row.department}</td>
                <td className="py-3 px-4 text-right font-mono">{row.value}</td>
                <td className="py-3 px-4">
                  {row.isProblem === 1 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-sm bg-red-50 text-red-600 border border-red-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                      Проблемный
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-sm bg-blue-50 text-blue-600 border border-blue-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                      Норма
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-muted-foreground text-xs">
                  {row.isProblem === 1 ? row.problemCategory : "—"}
                </td>
                <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                  {new Date(row.date).toLocaleDateString("ru-RU")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <span className="text-xs text-muted-foreground">
            {data.length} записей · страница {page} из {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-sm border border-border rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Icon name="ChevronLeft" size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1.5 text-sm border rounded transition-colors ${
                  page === p ? "bg-foreground text-background border-foreground" : "border-border hover:bg-muted"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-sm border border-border rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Icon name="ChevronRight" size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
