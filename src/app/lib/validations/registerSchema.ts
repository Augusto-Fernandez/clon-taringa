import { z } from "zod";

export const registerSchema = z.object({
    username: z.string()
        .min(3, {
            message: "El nombre de usuario debe tener mínimo tres caracteres",
        })
        .max(12, {
            message: "El nombre de usuario debe tener menos de doce caracteres",
        }),
    email: z.string()
        .email({
            message: "Por favor ingrese una dirección de mail válida",
        }),
    password: z.string()
        .min(8, {
            message: "La contraseña debe tener mínimo ocho caracteres",
        }),
    confirmPassword: z.string()
        .min(8, {
            message: "La contraseña debe tener mínimo ocho caracteres",
        })
});