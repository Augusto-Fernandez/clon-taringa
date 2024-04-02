"use client"
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
    username: string
    password: string;
};

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

    const onSubmit:SubmitHandler<Inputs> = async (data) => {
        console.log(JSON.stringify(data));
    };

    return (
        <div className="min-h-screen max-h-screen flex justify-center items-center bg-gray-100">
            <form onSubmit={handleSubmit(onSubmit)} className="w-1/4 bg-white p-10 rounded-md border border-gray-400">
                <h1 className="text-slate-600 font-bold text-4xl mb-4">Iniciar Sesión</h1>
                <div className="mb-4 space-y-2">
                    <label className="text-slate-600 block text-sm">Nombre de usuario:</label>
                    <input
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
                    <label className="text-slate-600 block text-sm">Contraseña:</label>
                    <input
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
                <button type="submit" className="btn w-full text-base font-semibold bg-green-500 border border-green-300/80 text-white hover:bg-green-600 mt-2">
                    Ingresar
                </button>
            </form>
        </div>
    );
}
