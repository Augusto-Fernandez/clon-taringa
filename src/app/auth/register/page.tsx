"use client"
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import UserButton from "@/components/UserButton";

type Inputs = {
    username: string
    email: string;
    password: string;
    confirmPassword: string;
};

export default function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

    const router = useRouter();

    const onSubmit:SubmitHandler<Inputs> = async (data) => {
        if (data.password !== data.confirmPassword) {
            return alert("Contraseñas no coinciden");
        }

        const res = await fetch("/api/register", {
            method: "POST",
            body: JSON.stringify({
                username: data.username,
                email: data.email,
                password: data.password,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if(res.ok){
            router.push("/auth/login");
        }
    };

    return (
        <div className="min-h-screen max-h-screen flex justify-center items-center bg-gray-100">
            <form onSubmit={handleSubmit(onSubmit)} className="w-1/4 bg-white p-10 rounded-md border border-gray-400">
                <h1 className="text-slate-600 font-bold text-4xl mb-4">Crear Usuario</h1>
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
                    <label className="text-slate-600 block text-sm">Email:</label>
                    <input
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
                <div className="mb-4 space-y-2">
                    <label className="text-slate-600 mb-2 block text-sm">Confirmar Contraseña:</label>
                    <input
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
                <UserButton content="Registrar"/>
            </form>
        </div>
    );
}
