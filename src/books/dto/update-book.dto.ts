import { z } from 'zod';
import { zodSchema } from '../../utils/zodSchema';
import { Book } from '@prisma/client';

export const UpdateBookDto = zodSchema<Pick<Book, 'author' | 'title'>>({
  title: z.string().min(1, 'Título inválido'),
  author: z.string().min(1, 'Autor inválido'),
});

export type IUpdateBookDto = z.infer<typeof UpdateBookDto>;
