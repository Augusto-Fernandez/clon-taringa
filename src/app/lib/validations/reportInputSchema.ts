import { z } from "zod";

export const reportInputSchema = z.object({
    reportBody: z.string()
        .min(1, {
            message: "Es necesario un motivo de denuncia",
        })
        .max(200, {
            message: "La denuncia debe tener menos de 200 caracteres",
        })
        .refine((value) => value.trim().length > 0, {
            message: "El texto no puede estar vacío o ser solo espacios",
    }),
});