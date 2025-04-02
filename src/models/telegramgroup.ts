import { z }            from "zod";

export const TelegramGroupSchema = z.object({  
  ownerId:            z.string().uuid(),
  description:        z.string().optional(),
  subscriptionPlanId: z.string().uuid().optional(),
  categoryId:         z.string().uuid().optional(),
  link:               z.string().url(),
});
