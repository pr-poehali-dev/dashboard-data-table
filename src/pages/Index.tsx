import { mockData, RESPONSIBLES } from "@/data/mockData";
import ExecutorChart from "@/components/dashboard/ExecutorChart";
import CategoryChart from "@/components/dashboard/CategoryChart";
import Icon from "@/components/ui/icon";

const totalProblems = mockData.filter((d) => d.isProblem === 1).length;
const totalOk = mockData.filter((d) => d.isProblem === 0).length;
const problemPct = Math.round((totalProblems / mockData.length) * 100);

const RESPONSIBLE_ORDER = ["Булатов Г.Б.", "Латыпов Р.М.", "Макаров В.В.", "Пронин Д.В.", "Кизлык М.А."];
const CATEGORY_ORDER = ["Замена показателя и методики", "Корректировка методики", "МО", "Полнота охвата", "не выносим", "справочно"];

const sortedData = [...mockData].sort((a, b) => {
  const rA = RESPONSIBLE_ORDER.indexOf(a.responsible);
  const rB = RESPONSIBLE_ORDER.indexOf(b.responsible);
  if (rA !== rB) return rA - rB;
  if (a.isProblem !== b.isProblem) return b.isProblem - a.isProblem;
  const cA = CATEGORY_ORDER.indexOf(a.problemCategory);
  const cB = CATEGORY_ORDER.indexOf(b.problemCategory);
  return cA - cB;
});

export default function Index() {
  return (
    <div className="min-h-screen bg-background font-ibm">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-foreground rounded-sm flex items-center justify-center">
              <Icon name="BarChart2" size={13} className="text-background" />
            </div>
            <span className="font-medium text-sm tracking-wide">Дашборд показателей</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground font-mono">
              {new Date().toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" })}
            </span>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium border border-border rounded-sm bg-card hover:bg-muted transition-colors print:hidden"
            >
              <Icon name="Printer" size={13} />
              Печать / PDF
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-6">

        {/* KPI + Charts row */}
        <div className="grid grid-cols-12 gap-5 mb-5">

          {/* KPI column */}
          <div className="col-span-12 lg:col-span-2 flex flex-row lg:flex-col gap-3">
            <div className="flex-1 bg-card border border-border p-4 rounded-sm">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Всего</p>
              <p className="text-4xl font-light font-mono text-foreground">{mockData.length}</p>
              <p className="text-[10px] text-muted-foreground mt-1">показателей</p>
            </div>
            <div className="flex-1 bg-card border border-border p-4 rounded-sm">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Проблемных</p>
              <p className="text-4xl font-light font-mono text-red-500">{totalProblems}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{problemPct}% от всех</p>
            </div>
            <div className="flex-1 bg-card border border-border p-4 rounded-sm">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">В норме</p>
              <p className="text-4xl font-light font-mono text-blue-500">{totalOk}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{100 - problemPct}% от всех</p>
            </div>
            <div className="flex-1 bg-card border border-border p-4 rounded-sm">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Исполнители</p>
              <p className="text-4xl font-light font-mono text-foreground">{RESPONSIBLES.length}</p>
              <p className="text-[10px] text-muted-foreground mt-1">ответственных</p>
            </div>
          </div>

          {/* Chart 1 */}
          <div className="col-span-12 lg:col-span-5 bg-card border border-border p-5 rounded-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-widest">По исполнителям</h2>
                <p className="text-[11px] text-muted-foreground mt-0.5">проблемные и непроблемные</p>
              </div>
              <Icon name="Users" size={14} className="text-muted-foreground" />
            </div>
            <ExecutorChart data={mockData} />
          </div>

          {/* Chart 2 */}
          <div className="col-span-12 lg:col-span-5 bg-card border border-border p-5 rounded-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-widest">Категории проблем</h2>
                <p className="text-[11px] text-muted-foreground mt-0.5">по каждому исполнителю</p>
              </div>
              <Icon name="AlertTriangle" size={14} className="text-muted-foreground" />
            </div>
            <CategoryChart data={mockData} />
          </div>
        </div>

        {/* Full table */}
        <div className="bg-card border border-border rounded-sm">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest">Все показатели</h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">{mockData.length} записей</p>
            </div>
            <Icon name="Table" size={14} className="text-muted-foreground" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-2.5 px-4 text-left text-[10px] text-muted-foreground font-medium uppercase tracking-widest w-8">#</th>
                  <th className="py-2.5 px-4 text-left text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Показатель</th>
                  <th className="py-2.5 px-4 text-left text-[10px] text-muted-foreground font-medium uppercase tracking-widest whitespace-nowrap">Исполнитель</th>
                  <th className="py-2.5 px-4 text-left text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Статус</th>
                  <th className="py-2.5 px-4 text-left text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Категория проблемы</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((row, i) => (
                  <tr key={row.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                    <td className="py-2 px-4 font-mono text-[11px] text-muted-foreground/40">{i + 1}</td>
                    <td className="py-2 px-4 text-[12px] max-w-md">
                      <span className="line-clamp-1" title={row.name}>{row.name}</span>
                    </td>
                    <td className="py-2 px-4 text-[12px] text-muted-foreground whitespace-nowrap">{row.responsible}</td>
                    <td className="py-2 px-4">
                      {row.isProblem === 1 ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded-sm bg-red-50 text-red-600 border border-red-100 whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                          Проблемный
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded-sm bg-blue-50 text-blue-600 border border-blue-100 whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                          В норме
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4 text-[11px] text-muted-foreground whitespace-nowrap">
                      {row.isProblem === 1 ? row.problemCategory : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}