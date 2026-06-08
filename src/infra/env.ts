import z from "zod";

export const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    PORT: z.coerce.number().default(3333),
    JWT_PRIVATE: z.string(),
    JWT_PUBLIC: z.string(),
})

export type Env = z.infer<typeof envSchema>