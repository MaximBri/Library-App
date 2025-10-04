import { useEffect, useState } from 'react';
import type { LibraryCreateModel } from '@/shared/api/hooks/libraries/types';
import { useCreateLibrary } from '@/shared/api/hooks/libraries/useCreateLibrary';

export const CreateLibrary = () => {
  const data: LibraryCreateModel = {
    address: 'Пушкина, 215',
    librarianId: 1,
    name: 'Библиотека №1',
  };
  const [create, setCreate] = useState<boolean>(false);
  const { mutate: createLibrary, isPending } = useCreateLibrary();
  useEffect(() => {
    if (!isPending && !create) {
      setCreate((prev) => !prev);
      createLibrary(data);
    }
  }, [isPending, create]);
  return (
    <div>
      <form>{/* <Input></Input> */}</form>
    </div>
  );
};
