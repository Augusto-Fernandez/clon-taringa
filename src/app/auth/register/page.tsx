"use client"
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { registerSchema } from "@/app/lib/validations/registerSchema";
import SubmitButton from "@/components/SubmitButton";


type Inputs = {
    username: string
    email: string;
    password: string;
    confirmPassword: string;
};

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
        resolver: zodResolver(registerSchema)
    });

    const router = useRouter();

    const onSubmit:SubmitHandler<Inputs> = async (data) => {
        setIsLoading(true);
        
        if (data.password !== data.confirmPassword) {
            setIsLoading(false);
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
            setIsLoading(false);
            router.push("/auth/login");
        } else {
            setIsLoading(false);
            const errorData = await res.json();
            if (errorData.message === "Email already exists") {
                alert("El correo electrónico ya está registrado");
            } else if (errorData.message === "username already exists") {
                alert("El nombre de usuario ya está registrado");
            } else {
                alert("Ocurrió un error inesperado. Por favor, inténtalo de nuevo.");
            }
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <form 
                onSubmit={handleSubmit(onSubmit)} 
                className="
                    w-2/3 bg-white p-10 rounded-md border border-gray-400
                    md:w-1/2
                    lg:w-1/3
                "
            >
                <h1 
                    className="
                        text-slate-600 font-bold text-xl mb-4
                        md:text-2xl
                        lg:text-4xl
                    "
                >
                    Crear Usuario
                </h1>
                <div className="mb-4 space-y-2">
                    <label className="text-slate-600 block text-sm">Nombre de usuario:</label>
                    <input
                        type="text"
                        className="input p-3 rounded block w-full border border-gray-300 hover:no-animation focus:outline-non"
                        placeholder="Nombre de Usuario"
                        {...register("username")}
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
                        {...register("email")}
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
                        {...register("password")}
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
                        {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && typeof errors.confirmPassword.message === 'string' && (
                        <span className="text-red-500 text-xs font-bold">
                            {errors.confirmPassword.message}
                        </span>
                    )}
                </div>
                {
                    isLoading ? (
                        <button disabled className="btn mt-2 w-full bg-white border border-gray-300">
                            <span className="bg-slate-700/50 loading loading-spinner loading-md m-auto block h-11"/>
                        </button>
                    ) : (
                        <SubmitButton content="Registrar" width="w-full"/>
                    )
                }
            </form>
        </div>
    );
}
