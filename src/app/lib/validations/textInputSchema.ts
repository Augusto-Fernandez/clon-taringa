import { z } from "zod";

export const textInputSchema = z.object({
    body: z.string()
        .min(1, {
            message: "Es necesario ingresar una respuesta",
        })
        .max(200, {
            message: "El mensaje debe tener menos de 200 caracteres",
        })
        .refine((value) => value.trim().length > 0, {
            message: "El texto no puede estar vacío o ser solo espacios",
        }),
});