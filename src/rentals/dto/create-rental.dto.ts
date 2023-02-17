import { ZodError, z } from 'zod';
import { zodSchema } from '../../utils/zodSchema';
import { Rental } from '@prisma/client';

export const CreateRentalDto = zodSchema<
  Pick<Rental, 'userId' | 'bookId'> & { dueDate: Date | string }
>({
  userId: z.string().min(1, 'Usuário inválido'),
  bookId: z.string().min(1, 'Livro inválido'),
  dueDate: z.string().transform((str) => {
    const now = new Date();
    const date = new Date(str);
    if (date <= now) {
      throw new ZodError([
        {
          path: ['dueDate'],
          code: 'invalid_date',
          message: 'A data de devolução deve ser maior que a data atual',
        },
      ]);
    }
    return date;
  }),
});

export type ICreateRentalDto = z.infer<typeof CreateRentalDto>;
