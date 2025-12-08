import { z } from "zod";

export const productCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  count: z.preprocess((v) => Number(v), z.number().int().nonnegative("Count must be >= 0")),
  price: z.preprocess((v) => Number(v), z.number().nonnegative("Price must be >= 0")),
  groupType: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
