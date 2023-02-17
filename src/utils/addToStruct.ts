import { z } from 'zod';

export const IMarketService_addToStruct_input_shape = z
  .array(z.string().uuid('Produto inválido'), {
    description: 'Produtos inválido',
  })
  .min(1, 'Envie ao menos 1 produto');

export type IMarketService_addToStruct_input_type = z.infer<
  typeof IMarketService_addToStruct_input_shape
>;

export type IMarketService_addToStruct_output_type = void;
