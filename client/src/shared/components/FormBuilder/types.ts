import type { ReactNode } from 'react';
import type { SubmitHandler } from 'react-hook-form';

export type FieldType = 'text' | 'number' | 'email' | 'password' | 'textarea';

export interface FormField<T> {
  name: keyof T;
  label: string;
  placeholder?: string;
  type?: FieldType;
  render?: (props: any) => ReactNode;
}

export interface FormBuilderProps<T> {
  schema: any;
  fields: FormField<T>[];
  onSubmit: SubmitHandler<T>;
  submitText?: string;
  isLoading?: boolean;
}
