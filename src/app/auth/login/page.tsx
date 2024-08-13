"use client"
import { SubmitHandler, useForm } from "react-hook-form";
import {useRouter} from 'next/navigation'
import {useState} from 'react'
import { signIn } from "next-auth/react";
import Link from "next/link";

import SubmitButton from "@/components/SubmitButton";

type Inputs = {
    username: string
    password: string;
};

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
    const router = useRouter()

    const onSubmit:SubmitHandler<Inputs> = async (data) => {
        setIsLoading(true);
        
        const res = await signIn("credentials", {
            username: data.username,
            password: data.password,
            redirect: false,
        });

        if (res?.error) {
            alert("Nombre de usuario y/o contraseña son incorrectos")
            setIsLoading(false);
        } else {
            setIsLoading(false);
            router.push("/")
            router.refresh()
        }
    };

    return (
        <div className="min-h-screen max-h-screen flex justify-center items-center bg-gray-100">
            <form 
                onSubmit={handleSubmit(onSubmit)} 
                className="
                    w-1/2 bg-white p-10 rounded-md border border-gray-400
                    md:w-1/3
                "
            >
                <h1 
                    className="
                        text-slate-600 font-bold text-xl mb-4
                        md:text-2xl
                        lg:text-4xl
                    "
                >
                    Iniciar Sesión
                </h1>
                <div className="mb-4 space-y-2">
                    <label className="text-slate-600 block text-sm">Nombre de usuario:</label>
                    <input
                        type="text"
                        className="input p-3 rounded block w-full border border-gray-300 hover:no-animation focus:outline-none"
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
                {
                    isLoading ? (
                        <button 
                            disabled
                            className="
                                btn mt-2 w-full bg-white border border-gray-300
                            "
                        >
                            <span className="bg-slate-700/50 loading loading-spinner loading-md m-auto block h-11"/>
                        </button>
                    ) : (
                        <SubmitButton content="Ingresar" width="w-full mb-4"/>
                    )
                }
                <div className="border-t border-gray-300 flex justify-center pt-3">
                    <Link href={"/auth/register"} className="text-blue-600">
                        Crear Cuenta
                    </Link>
                </div>
            </form>
        </div>
    );
}
