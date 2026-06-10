export type Indicator = {
  id: number;
  name: string;
  responsible: string;
  value: number;
  isProblem: number; // 0 or 1
  problemCategory: string;
  department: string;
  date: string;
};

export const PROBLEM_CATEGORIES = [
  "Нехватка ресурсов",
  "Срыв сроков",
  "Качество данных",
  "Технический сбой",
  "Нет данных",
];

export const RESPONSIBLES = [
  "Иванов А.В.",
  "Петрова М.С.",
  "Сидоров К.Н.",
  "Кузнецова Е.И.",
  "Михайлов Д.О.",
];

export const DEPARTMENTS = ["Аналитика", "Продажи", "Операции", "Финансы"];

export const mockData: Indicator[] = [
  { id: 1, name: "Выручка Q1", responsible: "Иванов А.В.", value: 1200000, isProblem: 0, problemCategory: "Нет данных", department: "Продажи", date: "2026-01-15" },
  { id: 2, name: "Конверсия сайта", responsible: "Иванов А.В.", value: 3.4, isProblem: 1, problemCategory: "Качество данных", department: "Аналитика", date: "2026-01-20" },
  { id: 3, name: "NPS клиентов", responsible: "Иванов А.В.", value: 67, isProblem: 1, problemCategory: "Срыв сроков", department: "Аналитика", date: "2026-02-01" },
  { id: 4, name: "Расходы отдела", responsible: "Иванов А.В.", value: 450000, isProblem: 0, problemCategory: "Нет данных", department: "Финансы", date: "2026-02-10" },
  { id: 5, name: "Кол-во заявок", responsible: "Иванов А.В.", value: 342, isProblem: 1, problemCategory: "Нехватка ресурсов", department: "Продажи", date: "2026-02-15" },

  { id: 6, name: "Маржинальность", responsible: "Петрова М.С.", value: 28.5, isProblem: 0, problemCategory: "Нет данных", department: "Финансы", date: "2026-01-10" },
  { id: 7, name: "Отток клиентов", responsible: "Петрова М.С.", value: 5.2, isProblem: 1, problemCategory: "Качество данных", department: "Аналитика", date: "2026-01-25" },
  { id: 8, name: "Средний чек", responsible: "Петрова М.С.", value: 8700, isProblem: 0, problemCategory: "Нет данных", department: "Продажи", date: "2026-02-05" },

  { id: 9, name: "Время обработки", responsible: "Сидоров К.Н.", value: 2.3, isProblem: 1, problemCategory: "Технический сбой", department: "Операции", date: "2026-01-18" },
  { id: 10, name: "Ошибки системы", responsible: "Сидоров К.Н.", value: 12, isProblem: 1, problemCategory: "Технический сбой", department: "Операции", date: "2026-01-22" },
  { id: 11, name: "Загрузка серверов", responsible: "Сидоров К.Н.", value: 87, isProblem: 1, problemCategory: "Нехватка ресурсов", department: "Операции", date: "2026-02-08" },
  { id: 12, name: "Uptime сервиса", responsible: "Сидоров К.Н.", value: 99.1, isProblem: 0, problemCategory: "Нет данных", department: "Операции", date: "2026-02-20" },
  { id: 13, name: "Запросов в сек", responsible: "Сидоров К.Н.", value: 1500, isProblem: 1, problemCategory: "Нехватка ресурсов", department: "Операции", date: "2026-03-01" },
  { id: 14, name: "Инциденты P1", responsible: "Сидоров К.Н.", value: 3, isProblem: 0, problemCategory: "Нет данных", department: "Операции", date: "2026-03-05" },

  { id: 15, name: "Бюджет план/факт", responsible: "Кузнецова Е.И.", value: 94.2, isProblem: 0, problemCategory: "Нет данных", department: "Финансы", date: "2026-01-30" },
  { id: 16, name: "Дебиторка", responsible: "Кузнецова Е.И.", value: 2300000, isProblem: 1, problemCategory: "Срыв сроков", department: "Финансы", date: "2026-02-14" },
  { id: 17, name: "ROI кампаний", responsible: "Кузнецова Е.И.", value: 140, isProblem: 0, problemCategory: "Нет данных", department: "Финансы", date: "2026-02-22" },

  { id: 18, name: "Найм персонала", responsible: "Михайлов Д.О.", value: 8, isProblem: 1, problemCategory: "Срыв сроков", department: "Операции", date: "2026-01-12" },
  { id: 19, name: "Текучесть кадров", responsible: "Михайлов Д.О.", value: 12.3, isProblem: 1, problemCategory: "Качество данных", department: "Операции", date: "2026-02-03" },
  { id: 20, name: "Обучение пройдено", responsible: "Михайлов Д.О.", value: 78, isProblem: 0, problemCategory: "Нет данных", department: "Операции", date: "2026-02-28" },
  { id: 21, name: "Удовлетв. сотр.", responsible: "Михайлов Д.О.", value: 71, isProblem: 0, problemCategory: "Нет данных", department: "Операции", date: "2026-03-10" },
];
