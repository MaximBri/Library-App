'use client';

import { useForm, type FieldValues, type Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/button/Button';
import { Input } from '@/shared/components/input/Input';
import type { FormBuilderProps } from './types';
import { useEffect } from 'react';

export const FormBuilder = <T extends FieldValues>({
  schema,
  fields,
  onSubmit,
  submitText = 'Отправить',
  isLoading = false,
  defaultValues,
}: FormBuilderProps<T>) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<T>({ resolver: zodResolver(schema), defaultValues });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [reset, defaultValues]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete='off'>
      {fields.map((field) => (
        <label
          key={String(field.name)}
          style={{ display: 'block', marginBottom: 16 }}
        >
          <span>{field.label}</span>
          {field.render ? (
            field.render(register(field.name as Path<T>))
          ) : (
            <Input
              {...register(field.name as Path<T>)}
              placeholder={field.placeholder}
              type={field.type}
            />
          )}
          {errors[field.name] && (
            <div style={{ color: 'red' }}>
              {String(errors[field.name]?.message)}
            </div>
          )}
        </label>
      ))}

      <Button type="submit" text={submitText} isLoading={isLoading} />
    </form>
  );
};
