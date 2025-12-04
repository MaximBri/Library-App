import type z from 'zod';
import type { reportSchema } from './constants';

export type ReportForm = z.infer<typeof reportSchema>;
