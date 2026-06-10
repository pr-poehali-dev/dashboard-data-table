import Icon from "@/components/ui/icon";
import { DEPARTMENTS, RESPONSIBLES } from "@/data/mockData";

type Filters = {
  responsible: string;
  department: string;
  isProblem: string;
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
    filters.responsible || filters.department || filters.isProblem || filters.search;

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="relative">
        <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          className="pl-8 pr-3 py-2 text-sm bg-card border border-border rounded focus:outline-none focus:ring-1 focus:ring-foreground transition-all w-52"
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
        value={filters.department}
        onChange={(e) => set("department", e.target.value)}
        className="px-3 py-2 text-sm bg-card border border-border rounded focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
      >
        <option value="">Все отделы</option>
        {DEPARTMENTS.map((d) => (
          <option key={d} value={d}>{d}</option>
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

      {hasActive && (
        <button
          onClick={() => onChange({ responsible: "", department: "", isProblem: "", search: "" })}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon name="X" size={13} />
          Сбросить
        </button>
      )}
    </div>
  );
}
