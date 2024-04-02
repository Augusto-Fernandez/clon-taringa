"use client"
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
    username: string
    email: string;
    password: string;
    confirmPassword: string;
};

export default function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

    const onSubmit:SubmitHandler<Inputs> = async (data) => {
        if (data.password !== data.confirmPassword) {
            return alert("Contraseñas no coinciden");
        }

        console.log(JSON.stringify(data));
    };

    return (
        <div className="min-h-screen max-h-screen flex justify-center items-center bg-gray-100">
            <form onSubmit={handleSubmit(onSubmit)} className="w-1/4 bg-white p-10 rounded-md border border-gray-400">
                <h1 className="text-slate-600 font-bold text-4xl mb-4">Crear Usuario</h1>
                <div className="mb-4 space-y-2">
                    <label htmlFor="username" className="text-slate-600 block text-sm">Nombre de usuario:</label>
                    <input
                        id="username"
                        type="text"
                        className="input p-3 rounded block w-full border border-gray-300 hover:no-animation focus:outline-non"
                        placeholder="Nombre de Usuario"
                        {...register("username", {
                            required: {
                                value: true,
                                message: "Nombre de usuario es requerido",
                            },
                        })}
                    />
                    {errors.username && typeof errors.username.message === 'string' && (
                        <span className="text-red-500 text-xs font-bold">
                            {errors.username.message}
                        </span>
                    )}
                </div>
                <div className="mb-4 space-y-2">
                    <label htmlFor="email" className="text-slate-600 block text-sm">Email:</label>
                    <input
                        id="email"
                        type="email"
                        className="input p-3 rounded block w-full border border-gray-300 hover:no-animation focus:outline-non"
                        placeholder="Email"
                        {...register("email", {
                            required: {
                                value: true,
                                message: "Email es requerido",
                            },
                        })}
                    />
                    {errors.email && typeof errors.email.message === 'string' && (
                        <span className="text-red-500 text-xs font-bold">
                            {errors.email.message}
                        </span>
                    )}
                </div>
                <div className="mb-4 space-y-2">
                    <label htmlFor="password" className="text-slate-600 block text-sm">Contraseña:</label>
                    <input
                        id="password"
                        type="password"
                        className="input p-3 rounded block w-full border border-gray-300 hover:no-animation focus:outline-non"
                        placeholder="********"
                        {...register("password", {
                            required: {
                                value: true,
                                message: "Contraseña es requerida",
                            },
                        })}
                    />
                    {errors.password && typeof errors.password.message === 'string' && (
                        <span className="text-red-500 text-xs font-bold">
                            {errors.password.message}
                        </span>
                    )}
                </div>
                <div className="mb-4 space-y-2">
                    <label htmlFor="confirmPassword" className="text-slate-600 mb-2 block text-sm">Confirmar Contraseña:</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        className="input p-3 rounded block mb-2 w-full border border-gray-300 hover:no-animation focus:outline-non"
                        placeholder="********"
                        {...register("confirmPassword", {
                            required: {
                            value: true,
                            message: "Es obligatorio confirmar contraseña",
                            },
                        })}
                    />
                    {errors.confirmPassword && typeof errors.confirmPassword.message === 'string' && (
                        <span className="text-red-500 text-xs font-bold">
                            {errors.confirmPassword.message}
                        </span>
                    )}
                </div>
                <button type="submit" className="btn w-full text-base font-semibold bg-green-500 border border-green-300/80 text-white hover:bg-green-600 mt-2">
                    Registrar
                </button>
            </form>
        </div>
    );
}
