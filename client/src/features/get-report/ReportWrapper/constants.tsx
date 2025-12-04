import { STATUS_OPTIONS } from '@/features/status-modal/constants';
import Input from '@/shared/components/input/Input';
import { APP_ROLES } from '@/shared/constants';
import z from 'zod';

export const reportSchema = z.object({
  type: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  status: z.string(),
  sortBy: z.string(),
  sortOrder: z.string(),
  role: z.string(),
});

export const baseFields = [
  {
    name: 'type',
    label: 'Тип отчёта',
    render: (reg: any) => (
      <Input
        {...reg}
        options={bookReportsArr.map((report) => report.name)}
        placeholder="Тип отчёта"
      />
    ),
  },
];

export const dateFields = [
  {
    name: 'startDate',
    label: 'Дата начала',
    render: (reg: any) => (
      <Input {...reg} type="date" placeholder="Дата начала" />
    ),
  },
  {
    name: 'endDate',
    label: 'Дата конца',
    render: (reg: any) => (
      <Input {...reg} type="date" placeholder="Дата конца" />
    ),
  },
];

export const booksActivityFields = [
  ...dateFields,
  {
    name: 'status',
    label: 'Статус заявок',
    render: (reg: any) => (
      <Input
        {...reg}
        options={STATUS_OPTIONS.map((item) => item.text)}
        placeholder="Статус заявок"
      />
    ),
  },
  {
    name: 'sortBy',
    label: 'Сортировка по параметру',
    render: (reg: any) => (
      <Input
        {...reg}
        options={STATUS_OPTIONS.map((item) => item.text)}
        placeholder="Сортировка по параметру"
      />
    ),
  },
  {
    name: 'sortOrder',
    label: 'Сортировка по...',
    render: (reg: any) => (
      <Input
        {...reg}
        options={['Возрастанию', 'Убыванию']}
        placeholder="Сортировка по..."
      />
    ),
  },
];

export const libraryActivityFields = [...dateFields];

export const bookReportsArr = [
  {
    endpoint: 'book-popularity',
    name: 'Популярность книг',
  },
  {
    endpoint: 'library-activity',
    name: 'Активность библиотеки',
  },
  {
    endpoint: 'user-activity',
    name: 'Активность пользователей',
  },
];

export const userActivitiesFields = [
  ...dateFields,
  {
    name: 'role',
    label: 'Роль пользователей',
    render: (reg: any) => (
      <Input
        {...reg}
        options={Object.values(APP_ROLES)}
        placeholder="Роль пользователей"
      />
    ),
  },
  {
    name: 'sortBy',
    label: 'Сортировка по параметру',
    render: (reg: any) => (
      <Input
        {...reg}
        options={STATUS_OPTIONS.map((item) => item.text)}
        placeholder="Сортировка по параметру"
      />
    ),
  },
  {
    name: 'sortOrder',
    label: 'Сортировка по...',
    render: (reg: any) => (
      <Input
        {...reg}
        options={['Возрастанию', 'Убыванию']}
        placeholder="Сортировка по..."
      />
    ),
  },
];

export const formFieldsArr = [
  { name: 'Популярность книг', fields: booksActivityFields },
  { name: 'Активность библиотеки', fields: libraryActivityFields },
  { name: 'Активность пользователя', fields: userActivitiesFields },
];
