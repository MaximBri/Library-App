import { type FC } from 'react';
import type { CreateBookForm } from '../create-book/types';
import {
  bookFields,
  BookTypeMap,
  CreateBookSchema,
  type BookType,
} from '../create-book/constants';
import { Modal } from '@/shared/components/Modal/Modal';
import { FormBuilder } from '@/shared/components/FormBuilder/FormBuilder';
import { useUpdateBook } from '@/shared/api/hooks/books/useUpdateBook';
import { notify } from '@/shared/utils/notify';
import { useGetAuthors } from '@/shared/api/hooks/authors/useGetAuthors';
import { useAddAuthor } from '@/shared/api/hooks/authors/useAddAuthor';
import Input from '@/shared/components/input/Input';
import styles from '../create-book/styles.module.scss';
import type { BookModel } from '@/shared/api/hooks/books/types';

export const EditBook: FC<{
  isOpen: boolean;
  data: BookModel;
  handleClose: () => void;
}> = ({ data, isOpen, handleClose }) => {
  const { mutate: updateBook, isPending } = useUpdateBook();
  const { data: authorsData } = useGetAuthors();
  const { mutateAsync: createAuthor } = useAddAuthor();

  const authors = authorsData?.items || [];

  const authorOptions = authors.map(
    (a) => `${a.surname} ${a.name}${a.patronymic ? ' ' + a.patronymic : ''}`
  );

  const fields = bookFields.map((f) => {
    if (f.name === 'author') {
      return {
        ...f,
        render: (reg: any) => (
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
        render: (reg: any) => (
          <Input {...reg} options={Object.values(BookTypeMap)} />
        ),
      };
    }

    return f;
  });

  const defaultValues: CreateBookForm = {
    name: data.name,
    author: data.author
      ? `${data.author.surname} ${data.author.name}${
          data.author.patronymic ? ' ' + data.author.patronymic : ''
        }`
      : '',
    isbn: data.isbn,
    type: BookTypeMap[data.type as BookType],
    theme: data.theme,
    publishingYear: String(data.publishingYear),
  };

  const handleSubmit = async (formData: CreateBookForm) => {
    formData.type = Object.keys(BookTypeMap).find(
      (key) => BookTypeMap[key as BookType] === formData.type
    ) as BookType;

    if (formData.author && typeof formData.author === 'string') {
      const matched = authors.find(
        (a) =>
          `${a.surname} ${a.name}${a.patronymic ? ' ' + a.patronymic : ''}` ===
          formData.author
      );
      if (matched) {
        formData.author = String(matched.id);
      } else {
        const fio = formData.author.trim().split(/\s+/);
        const surname = fio[0] || '-';
        const name = fio[1] || '-';
        const patronymic = fio.length > 2 ? fio.slice(2).join(' ') : undefined;

        const created = await createAuthor({ name, surname, patronymic });
        formData.author = String(created.id);
      }
    }

    updateBook(
      { bookData: formData, bookId: Number(data.id) },
      {
        onSuccess: () => {
          handleClose();
          notify('Данные книги успешно обновлены', 'success');
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Редактировать книгу">
      <FormBuilder
        schema={CreateBookSchema}
        fields={fields}
        onSubmit={handleSubmit}
        isLoading={isPending}
        defaultValues={defaultValues}
      />
    </Modal>
  );
};
