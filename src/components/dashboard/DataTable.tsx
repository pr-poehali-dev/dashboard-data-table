import { useState } from "react";
import { Indicator } from "@/data/mockData";
import Icon from "@/components/ui/icon";

type Props = {
  data: Indicator[];
};

type SortKey = keyof Indicator;
type SortDir = "asc" | "desc";

export default function DataTable({ data }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("responsible");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const perPage = 10;

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
    if (sortKey !== k) return <Icon name="ChevronsUpDown" size={13} className="text-muted-foreground/40" />;
    return sortDir === "asc"
      ? <Icon name="ChevronUp" size={13} className="text-foreground" />
      : <Icon name="ChevronDown" size={13} className="text-foreground" />;
  };

  const cols: { key: SortKey; label: string }[] = [
    { key: "name", label: "Показатель" },
    { key: "responsible", label: "Исполнитель" },
    { key: "isProblem", label: "Статус" },
    { key: "problemCategory", label: "Категория проблемы" },
  ];

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-3 px-4 text-left text-xs text-muted-foreground font-medium w-8">#</th>
              {cols.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="py-3 px-4 font-medium text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none text-left"
                >
                  <span className="inline-flex items-center gap-1.5 uppercase tracking-wide">
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
                <td colSpan={5} className="py-12 text-center text-muted-foreground">
                  Нет данных по выбранным фильтрам
                </td>
              </tr>
            )}
            {paged.map((row, i) => (
              <tr
                key={row.id}
                className="border-b border-border/50 hover:bg-muted/40 transition-colors animate-slide-up"
                style={{ animationDelay: `${i * 20}ms`, animationFillMode: "both" }}
              >
                <td className="py-3 px-4 font-mono text-xs text-muted-foreground/50">
                  {(page - 1) * perPage + i + 1}
                </td>
                <td className="py-3 px-4 font-medium max-w-sm">
                  <span title={row.name} className="line-clamp-2 leading-snug">{row.name}</span>
                </td>
                <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">{row.responsible}</td>
                <td className="py-3 px-4">
                  {row.isProblem === 1 ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-sm bg-red-50 text-red-600 border border-red-100 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block shrink-0" />
                      Проблемный
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-sm bg-blue-50 text-blue-600 border border-blue-100 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block shrink-0" />
                      В норме
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
                  {row.isProblem === 1 ? row.problemCategory : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border px-4 pb-4">
          <span className="text-xs text-muted-foreground">
            {data.length} записей · страница {page} из {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2.5 py-1.5 border border-border rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Icon name="ChevronLeft" size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1.5 text-xs border rounded transition-colors ${
                  page === p ? "bg-foreground text-background border-foreground" : "border-border hover:bg-muted"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-2.5 py-1.5 border border-border rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Icon name="ChevronRight" size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
