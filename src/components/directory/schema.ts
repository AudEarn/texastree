import { z } from "zod";

export const formSchema = z.object({
  fullName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  serviceType: z.string().optional(),
  treeCount: z.string().optional(),
  treeHeight: z.string().optional(),
  debrisHauling: z.string().optional(),
  timeframe: z.string().optional(),
  specificDate: z.string().optional(),
  preferredContact: z.string().optional(),
  description: z.string().optional()
});

export type FormValues = z.infer<typeof formSchema>;