import { type FC } from 'react';
import z from 'zod';
import type { CreateBookForm } from './types';
import { bookFields, CreateBookSchema } from './constants';
import { useCreateBook } from '@/shared/api/hooks/books/useCreateBook';
import { useParams } from 'react-router-dom';
import { useGetAuthors } from '@/shared/api/hooks/authors/useGetAuthors';
import { authorApi } from '@/shared/api/authors/authorApi';
import styles from './styles.module.scss';
import { Modal } from '@/shared/components/Modal/Modal';
import { FormBuilder } from '@/shared/components/FormBuilder/FormBuilder';
import type { FormField } from '@/shared/components/FormBuilder/types';
import { Input } from '@/shared/components/input/Input';

export const CreateBook: FC<{
  isOpen: boolean;
  handleClose: () => void;
}> = ({ isOpen, handleClose }) => {
  const { mutate: createBook, isPending } = useCreateBook();
  const { id } = useParams();

  const handleCreate = (data: CreateBookForm & { author?: string }) => {
    createBook(
      { ...data, libraryId: Number(id) },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Создать книгу">
      <CreateBookFormWrapper onCreate={handleCreate} isLoading={isPending} />
    </Modal>
  );
};

const CreateBookFormWrapper: FC<{
  onCreate: (data: CreateBookForm & { author?: string }) => void;
  isLoading?: boolean;
}> = ({ onCreate, isLoading }) => {
  const { data: authorsData } = useGetAuthors();
  const authors = authorsData?.items || [];

  const ExtendedSchema = (CreateBookSchema as any).extend({
    newAuthor: z.string().optional(),
    author: z.string().optional(),
  });

  const authorOptions = authors.map(
    (a: any) => `${a.surname} ${a.name}${a.patronymic ? ' ' + a.patronymic : ''}`
  );

  const fields: FormField<CreateBookForm>[] = bookFields.flatMap((f) =>
    f.name === 'author'
      ? [
          {
            ...f,
            render: (reg) => (
              <div className={styles.authorField}>
                <Input
                  {...(reg as any)}
                  options={authorOptions}
                  placeholder="Фамилия Имя Отчество"
                  className={styles.authorInput}
                />
              </div>
            ),
          } as FormField<CreateBookForm>,
          { name: 'newAuthor', label: 'Или добавьте нового автора', placeholder: 'Фамилия Имя Отчество' } as any,
        ]
      : [f]
  );

  const handleSubmit = async (data: any) => {
    if (data.newAuthor && String(data.newAuthor).trim()) {
      const fio = String(data.newAuthor).trim().split(/\s+/);
      const surname = fio[0] || '-';
      const name = fio[1] || '-';
      const patronymic = fio.length > 2 ? fio.slice(2).join(' ') : undefined;

      const created = await authorApi.createAuthor({ name, surname, patronymic } as any);
      data.author = String(created.id);
    }

    if (data.author && typeof data.author === 'string') {
      const matched = authors.find(
        (a: any) => `${a.surname} ${a.name}${a.patronymic ? ' ' + a.patronymic : ''}` === data.author
      );
      if (matched) data.author = String(matched.id);
    }

    onCreate(data);
  };

  return (
    <div className={styles.createForm}>
      <FormBuilder schema={ExtendedSchema} fields={fields} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default CreateBook;
