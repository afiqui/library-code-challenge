import { z } from 'zod';
import { zodSchema } from '../../utils/zodSchema';
import { Book } from '@prisma/client';

export const SearchByTitleDto = zodSchema<Pick<Book, 'title'>>({
  title: z.string().min(1, 'Título inválido'),
});

export type ISearchByTitleDto = z.infer<typeof SearchByTitleDto>;
