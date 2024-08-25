import { z } from "zod";

export const flatSchema = z.object({
  body: z.object({
    location: z.string().optional(),
    description: z.string().optional(),
    rentAmount: z.number().optional(),
    bedrooms: z.number().optional(),
    amenities: z.string().optional(),
  }),
});
