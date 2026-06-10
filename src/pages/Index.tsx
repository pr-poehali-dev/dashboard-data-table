import { useMemo, useState } from "react";
import { mockData } from "@/data/mockData";
import FilterPanel from "@/components/dashboard/FilterPanel";
import ExecutorChart from "@/components/dashboard/ExecutorChart";
import CategoryChart from "@/components/dashboard/CategoryChart";
import DataTable from "@/components/dashboard/DataTable";
import StatCard from "@/components/dashboard/StatCard";
import Icon from "@/components/ui/icon";

type Filters = {
  responsible: string;
  department: string;
  isProblem: string;
  search: string;
};

export default function Index() {
  const [filters, setFilters] = useState<Filters>({
    responsible: "",
    department: "",
    isProblem: "",
    search: "",
  });

  const filtered = useMemo(() => {
    return mockData.filter((d) => {
      if (filters.responsible && d.responsible !== filters.responsible) return false;
      if (filters.department && d.department !== filters.department) return false;
      if (filters.isProblem !== "" && String(d.isProblem) !== filters.isProblem) return false;
      if (filters.search && !d.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [filters]);

  const totalProblems = filtered.filter((d) => d.isProblem === 1).length;
  const totalOk = filtered.filter((d) => d.isProblem === 0).length;
  const problemPct = filtered.length > 0 ? Math.round((totalProblems / filtered.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background font-ibm">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-foreground rounded-sm flex items-center justify-center">
              <Icon name="BarChart2" size={13} className="text-background" />
            </div>
            <span className="font-medium text-sm tracking-wide">Дашборд показателей</span>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {new Date().toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" })}
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Всего показателей" value={filtered.length} />
          <StatCard label="Проблемных" value={totalProblems} accent="red" sub={`${problemPct}% от общего числа`} />
          <StatCard label="В норме" value={totalOk} accent="blue" />
          <StatCard
            label="Охват исполнителей"
            value={new Set(filtered.map((d) => d.responsible)).size}
            sub="уникальных исполнителей"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border p-6 rounded-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-semibold">Показатели по исполнителям</h2>
                <p className="text-xs text-muted-foreground mt-0.5">проблемные и непроблемные</p>
              </div>
              <Icon name="Users" size={16} className="text-muted-foreground" />
            </div>
            <ExecutorChart data={filtered} />
          </div>

          <div className="bg-card border border-border p-6 rounded-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-semibold">Проблемы по категориям</h2>
                <p className="text-xs text-muted-foreground mt-0.5">выберите исполнителя</p>
              </div>
              <Icon name="AlertTriangle" size={16} className="text-muted-foreground" />
            </div>
            <CategoryChart data={filtered} />
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-sm">
          <div className="px-6 pt-6 pb-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold">Все показатели</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {filtered.length} из {mockData.length} записей
                </p>
              </div>
              <Icon name="Table" size={16} className="text-muted-foreground" />
            </div>
            <FilterPanel filters={filters} onChange={setFilters} />
          </div>
          <div className="px-2">
            <DataTable data={filtered} />
          </div>
        </div>
      </main>
    </div>
  );
}
