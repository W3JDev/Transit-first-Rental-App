import { z } from 'zod';

export const ListingSchema = z.object({
  id: z.number(),
  title: z.string(),
  price_rm: z.number(),
  pets_ok: z.boolean()
});
export type ListingDTO = z.infer<typeof ListingSchema>;
