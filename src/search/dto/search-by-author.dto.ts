import { z } from 'zod';
import { zodSchema } from '../../utils/zodSchema';
import { Book } from '@prisma/client';

export const SearchByAuthorDto = zodSchema<Pick<Book, 'author'>>({
  author: z.string().min(1, 'Autor inválido'),
});

export type ISearchByAuthorDto = z.infer<typeof SearchByAuthorDto>;
