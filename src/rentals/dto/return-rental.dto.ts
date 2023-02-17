import { z } from 'zod';
import { zodSchema } from '../../utils/zodSchema';

export const ReturnRentalDto = zodSchema<{ id: string }>({
  id: z.string().min(1, 'Id inválido'),
});

export type IReturnRentalDto = z.infer<typeof ReturnRentalDto>;
