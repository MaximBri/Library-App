import { FormBuilder } from '@/shared/components/FormBuilder/FormBuilder';
import type { FC } from 'react';
import type { CreateBookForm } from './types';
import { useAddAuthor } from '@/shared/api/hooks/authors/useAddAuthor';
import {
  bookFields,
  BookTypeMap,
  CreateBookSchema,
  type BookType,
} from './constants';
import type { FormField } from '@/shared/components/FormBuilder/types';
import Input from '@/shared/components/input/Input';
import styles from './styles.module.scss';
import { useGetAuthorsInfinite } from '@/shared/api/hooks/authors/useGetAuthorsInfinite';

export const CreateBookFormWrapper: FC<{
  onCreate: (data: CreateBookForm & { author?: string }) => void;
  isLoading?: boolean;
}> = ({ onCreate, isLoading }) => {
  const { data: authorsData } = useGetAuthorsInfinite();
  const { mutateAsync: createAuthor } = useAddAuthor();
  const authors = authorsData?.pages.flatMap((page) => page.items) || [];
  console.log(authors)
  const authorOptions = authors?.map(
    (a: any) =>
      `${a.surname} ${a.name}${a.patronymic ? ' ' + a.patronymic : ''}`
  );

  const fields: FormField<CreateBookForm>[] = bookFields.map((f) => {
    if (f.name === 'author') {
      return {
        ...f,
        render: (reg) => (
          <div className={styles.authorField}>
            <Input
              {...reg}
              options={authorOptions}
              placeholder="Фамилия Имя Отчество"
              className={styles.authorInput}
            />
          </div>
        ),
      };
    }

    if (f.name === 'type') {
      return {
        ...f,
        render: (reg) => (
          <Input {...reg} options={Object.values(BookTypeMap)} />
        ),
      };
    }

    return f;
  });

  const handleSubmit = async (data: CreateBookForm) => {
    data.type = Object.keys(BookTypeMap).find(
      (key) => BookTypeMap[key as keyof typeof BookTypeMap] === data.type
    ) as BookType;
    if (data.author && typeof data.author === 'string') {
      const matched = authors.find(
        (a: any) =>
          `${a.surname} ${a.name}${a.patronymic ? ' ' + a.patronymic : ''}` ===
          data.author
      );
      if (matched) {
        data.author = String(matched.id);
      } else {
        const fio = String(data.author).trim().split(/\s+/);
        const surname = fio[0] || '-';
        const name = fio[1] || '-';
        const patronymic = fio.length > 2 ? fio.slice(2).join(' ') : undefined;

        const created = await createAuthor({
          name,
          surname,
          patronymic,
        });
        data.author = String(created.id);
      }
    }
    onCreate(data);
  };

  return (
    <div className={styles.createForm}>
      <FormBuilder
        schema={CreateBookSchema}
        fields={fields}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};
