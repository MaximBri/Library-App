import z from "zod";

export const fields = [
  {
    value: 'name',
    placeholder: 'Имя',
    name: 'name',
  },
  {
    value: 'surname',
    placeholder: 'Фамилия',
    name: 'surname',
  },
];

export const updateUserDataSchema = z.object({
  name: z.string(),
  surname: z.string(),
});
