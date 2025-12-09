import { z } from "zod";

export const userCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  roles: z.array(z.string()).optional().default([]),
});

export const userUpdateSchema = userCreateSchema.extend({ id: z.string().optional() });

export type UserCreate = z.infer<typeof userCreateSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
