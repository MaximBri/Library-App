export const STATUS_OPTIONS = [
  { label: 'Все', value: 'all' },
  { label: 'Ожидает одобрения', value: 'pending' },
  { label: 'Одобрено', value: 'approved' },
  { label: 'Отклонено', value: 'rejected' },
  { label: 'Завершено', value: 'completed' },
];

export const LIMIT_OPTIONS = ['10', '20', '50'];

export const STATUS_MAP: Record<string, string> = STATUS_OPTIONS.reduce(
  (acc, cur) => {
    acc[cur.label] = cur.value;
    return acc;
  },
  {} as Record<string, string>
);
