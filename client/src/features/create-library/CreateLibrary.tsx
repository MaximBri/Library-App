import { type FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateLibrary } from '@/shared/api/hooks/libraries/useCreateLibrary';
import type { CreateLibraryForm } from './types';
import { createLibrarySchema, libraryFields } from './constants';
import { Modal } from '@/shared/components/Modal/Modal';
import { FormBuilder } from '@/shared/components/FormBuilder/FormBuilder';
import { notify } from '@/shared/utils/notify';

export const CreateLibrary: FC<{
  isOpen: boolean;
  handleClose: () => void;
}> = ({ isOpen, handleClose }) => {
  const { mutate: createLibrary, isPending } = useCreateLibrary();

  const { reset } = useForm<CreateLibraryForm>({
    resolver: zodResolver(createLibrarySchema),
  });

  const onSubmit = (data: CreateLibraryForm) => {
    createLibrary(data, {
      onSuccess: () => {
        notify('Библиотека создана успешно', 'success');
        reset();
        handleClose();
      },
      onError: () => {
        notify('Ошибка при создании библиотеки', 'error');
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Создать библиотеку">
      <FormBuilder
        schema={createLibrarySchema}
        fields={libraryFields}
        onSubmit={onSubmit}
        isLoading={isPending}
      />
    </Modal>
  );
};

export default CreateLibrary;
