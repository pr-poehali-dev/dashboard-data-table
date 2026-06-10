import { useState, useEffect, useCallback } from "react";
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

const SLIDES = [
  { id: 0, label: "Титул" },
  { id: 1, label: "Итоги" },
  { id: 2, label: "По исполнителям" },
  { id: 3, label: "По категориям" },
  { id: 4, label: "Показатели" },
];

const date = new Date().toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" });

export default function Index() {
  const [slide, setSlide] = useState(0);
  const [animDir, setAnimDir] = useState<"in" | "out">("in");
  const [visible, setVisible] = useState(true);

  const goTo = useCallback((next: number) => {
    if (next === slide || next < 0 || next >= SLIDES.length) return;
    setVisible(false);
    setAnimDir(next > slide ? "in" : "in");
    setTimeout(() => {
      setSlide(next);
      setVisible(true);
    }, 180);
  }, [slide]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goTo(slide + 1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") goTo(slide - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [slide, goTo]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-background font-ibm flex flex-col">

      {/* Top bar */}
      <header className="shrink-0 border-b border-border bg-card px-8 py-3 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-foreground rounded-sm flex items-center justify-center">
            <Icon name="BarChart2" size={11} className="text-background" />
          </div>
          <span className="text-xs font-medium tracking-wide text-muted-foreground">Дашборд показателей</span>
        </div>

        {/* Slide dots */}
        <div className="flex items-center gap-1.5">
          {SLIDES.map((s) => (
            <button
              key={s.id}
              onClick={() => goTo(s.id)}
              title={s.label}
              className={`transition-all rounded-full ${
                slide === s.id
                  ? "w-6 h-2 bg-foreground"
                  : "w-2 h-2 bg-border hover:bg-muted-foreground"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground font-mono">{date}</span>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded-sm hover:bg-muted transition-colors"
          >
            <Icon name="Printer" size={12} />
            PDF
          </button>
        </div>
      </header>

      {/* Slide area */}
      <div className="flex-1 relative overflow-hidden">
        <div
          className="absolute inset-0 transition-opacity duration-200"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {slide === 0 && <SlideTitle />}
          {slide === 1 && <SlideKPI />}
          {slide === 2 && <SlideExecutors />}
          {slide === 3 && <SlideCategories />}
          {slide === 4 && <SlideTable />}
        </div>
      </div>

      {/* Bottom nav */}
      <footer className="shrink-0 border-t border-border bg-card px-8 py-3 flex items-center justify-between print:hidden">
        <span className="text-xs text-muted-foreground font-mono">
          {slide + 1} / {SLIDES.length} — {SLIDES[slide].label}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => goTo(slide - 1)}
            disabled={slide === 0}
            className="px-3 py-1.5 text-xs border border-border rounded-sm hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
          >
            <Icon name="ChevronLeft" size={13} />
            Назад
          </button>
          <button
            onClick={() => goTo(slide + 1)}
            disabled={slide === SLIDES.length - 1}
            className="px-3 py-1.5 text-xs border border-border rounded-sm bg-foreground text-background hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
          >
            Далее
            <Icon name="ChevronRight" size={13} />
          </button>
        </div>
      </footer>
    </div>
  );
}

/* ── Слайд 1: Титул ── */
function SlideTitle() {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-foreground text-background px-12">
      <div className="max-w-2xl text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-background/40 mb-8 font-mono">
          Аналитический дашборд
        </p>
        <h1 className="text-5xl font-light leading-tight mb-6">
          Мониторинг показателей<br />транспортной системы
        </h1>
        <div className="w-12 h-px bg-background/30 mx-auto mb-6" />
        <p className="text-sm text-background/50 font-mono">
          {new Date().toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" })}
        </p>
        <div className="mt-12 flex items-center justify-center gap-8 text-background/40 text-xs font-mono">
          <span>{mockData.length} показателей</span>
          <span>·</span>
          <span>{RESPONSIBLES.length} исполнителя</span>
        </div>
      </div>
    </div>
  );
}

/* ── Слайд 2: KPI ── */
function SlideKPI() {
  const cards = [
    { label: "Всего показателей", value: mockData.length, sub: "в мониторинге", accent: "default" as const },
    { label: "Проблемных", value: totalProblems, sub: `${problemPct}% от всех`, accent: "red" as const },
    { label: "В норме", value: totalOk, sub: `${100 - problemPct}% от всех`, accent: "blue" as const },
    { label: "Исполнителей", value: RESPONSIBLES.length, sub: "ответственных", accent: "default" as const },
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center px-16">
      <SlideHeader title="Ключевые показатели" sub="сводка по всем данным" />
      <div className="grid grid-cols-4 gap-6 w-full max-w-4xl">
        {cards.map((c) => (
          <div key={c.label} className="bg-card border border-border rounded-sm p-8 flex flex-col">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">{c.label}</p>
            <p className={`text-6xl font-light font-mono mb-3 ${
              c.accent === "red" ? "text-red-500" : c.accent === "blue" ? "text-blue-500" : "text-foreground"
            }`}>{c.value}</p>
            <p className="text-xs text-muted-foreground mt-auto">{c.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Слайд 3: Диаграмма исполнители ── */
function SlideExecutors() {
  return (
    <div className="h-full flex flex-col px-16 py-10">
      <SlideHeader title="По исполнителям" sub="проблемные и непроблемные показатели" />
      <div className="flex-1 bg-card border border-border rounded-sm p-8 min-h-0">
        <ExecutorChart data={mockData} />
      </div>
    </div>
  );
}

/* ── Слайд 4: Диаграмма категории ── */
function SlideCategories() {
  return (
    <div className="h-full flex flex-col px-16 py-10">
      <SlideHeader title="Категории проблем" sub="разбивка по исполнителям" />
      <div className="flex-1 bg-card border border-border rounded-sm p-8 min-h-0">
        <CategoryChart data={mockData} />
      </div>
    </div>
  );
}

/* ── Слайд 5: Таблица ── */
function SlideTable() {
  return (
    <div className="h-full flex flex-col px-16 py-10">
      <SlideHeader title="Все показатели" sub={`${mockData.length} записей`} />
      <div className="flex-1 bg-card border border-border rounded-sm overflow-auto min-h-0">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card z-10">
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
  );
}

/* ── Вспомогательный заголовок слайда ── */
function SlideHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6 shrink-0">
      <h2 className="text-2xl font-light text-foreground">{title}</h2>
      <p className="text-xs text-muted-foreground mt-1">{sub}</p>
    </div>
  );
}
