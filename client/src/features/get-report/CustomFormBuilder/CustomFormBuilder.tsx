import type { FormField } from '@/shared/components/FormBuilder/types';
import Input from '@/shared/components/input/Input';
import type {
  FieldErrors,
  FieldValues,
  UseFormRegister,
} from 'react-hook-form';
import type { Path } from 'react-router-dom';

export interface CustomFormBuilderProps<T extends FieldValues> {
  fields: FormField<T>[];
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

export const CustomFormBuilder = <T extends FieldValues>({
  fields,
  errors,
  register,
}: CustomFormBuilderProps<T>) => {
  return fields.map((field) => (
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
  ));
};
