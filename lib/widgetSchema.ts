import { z } from 'zod';

const optional = (max: number) =>
    z
        .string()
        .trim()
        .max(max)
        .optional()
        .transform((v) => (v ? v : null));

const httpsUrl = z
    .string()
    .trim()
    .max(500)
    .optional()
    .transform((v) => (v ? v : null))
    .refine((v) => v === null || /^https?:\/\//i.test(v), 'Booking URL must start with http(s)://');

export const widgetSchema = z.object({
    slug: z
        .string()
        .trim()
        .toLowerCase()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug: lowercase letters, numbers and hyphens only')
        .min(3)
        .max(60),
    businessName: z.string().trim().min(2).max(120),
    industry: z.string().trim().min(2).max(40).default('general'),
    assistantName: z.string().trim().min(1).max(30).default('Sam'),
    primaryColor: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, 'Colour must be a hex value like #0f172a').default('#0f172a'),
    greetingMessage: z.string().trim().min(2).max(300),
    services: z.string().trim().min(2).max(4000),
    serviceArea: optional(1000),
    businessHours: optional(1000),
    customInstructions: optional(4000),
    bookingUrl: httpsUrl,
    notifyEmail: z
        .string()
        .trim()
        .toLowerCase()
        .max(254)
        .optional()
        .transform((v) => (v ? v : null))
        .refine((v) => v === null || z.string().email().safeParse(v).success, 'Notify email is not valid'),
    notifyPhone: optional(30),
    isActive: z.boolean().default(true),
});

export type WidgetInput = z.infer<typeof widgetSchema>;
