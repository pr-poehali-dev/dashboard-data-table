import Icon from "@/components/ui/icon";
import { RESPONSIBLES, PROBLEM_CATEGORIES } from "@/data/mockData";

export type Filters = {
  responsible: string;
  isProblem: string;
  category: string;
  search: string;
};

type Props = {
  filters: Filters;
  onChange: (f: Filters) => void;
};

export default function FilterPanel({ filters, onChange }: Props) {
  const set = (key: keyof Filters, value: string) =>
    onChange({ ...filters, [key]: value });

  const hasActive =
    filters.responsible || filters.isProblem || filters.category || filters.search;

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="relative">
        <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          className="pl-8 pr-3 py-2 text-sm bg-card border border-border rounded focus:outline-none focus:ring-1 focus:ring-foreground transition-all w-60"
        />
      </div>

      <select
        value={filters.responsible}
        onChange={(e) => set("responsible", e.target.value)}
        className="px-3 py-2 text-sm bg-card border border-border rounded focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
      >
        <option value="">Все исполнители</option>
        {RESPONSIBLES.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>

      <select
        value={filters.isProblem}
        onChange={(e) => set("isProblem", e.target.value)}
        className="px-3 py-2 text-sm bg-card border border-border rounded focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
      >
        <option value="">Все статусы</option>
        <option value="1">Проблемные</option>
        <option value="0">Непроблемные</option>
      </select>

      <select
        value={filters.category}
        onChange={(e) => set("category", e.target.value)}
        className="px-3 py-2 text-sm bg-card border border-border rounded focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
      >
        <option value="">Все категории</option>
        {PROBLEM_CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {hasActive && (
        <button
          onClick={() => onChange({ responsible: "", isProblem: "", category: "", search: "" })}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon name="X" size={13} />
          Сбросить
        </button>
      )}
    </div>
  );
}
