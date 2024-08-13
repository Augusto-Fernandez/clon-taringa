"use client"

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import SubmitButton from "@/components/SubmitButton";
import { textInputSchema } from "../lib/validations/textInputSchema";

interface ProfileDescriptionButtonProps {
    userId: string;
    profileDescription: string;
    handleProfileDescription: (userId: string, profileDescription: string) => Promise<void>;
}

type Input = {
    body: string
};

export default function ProfileDescription({userId, profileDescription, handleProfileDescription}:ProfileDescriptionButtonProps){
    const [textInput, setTextInput] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<Input>({
        resolver: zodResolver(textInputSchema)
    });
    
    const handleProfileDescriptionButton = () => {
        setTextInput(true);
    };

    const handleProfileDescriptionEvent:SubmitHandler<Input> = async (data) => {
        setIsLoading(true);
        await handleProfileDescription(userId, data.body);
        setIsLoading(false);
        setTextInput(false);
    };
    
    return(
            <div 
                className="
                    min-h-18 h-auto max-w-[13rem]
                    md:max-w-[22rem]
                    lg:max-w-[30rem]
                "
            >
                {
                    !profileDescription && textInput === false && (
                        <div className="w-full flex justify-end">
                            <button 
                                onClick={handleProfileDescriptionButton} 
                                className="
                                    btn bg-slate-300/25 border border-slate-400 text-slate-500 text-[0.5rem] hover:bg-slate-400/25
                                    md:text-xs
                                "
                            >
                                Agregar descripción a perfil
                            </button>
                        </div>
                    )
                }
                {
                    profileDescription && textInput === false && (
                        <>
                            <p 
                                className="
                                    text-slate-700/90 text-[0.5rem]
                                    lg:text-xs
                                " 
                                style={{ overflowWrap: 'break-word', whiteSpace: 'normal' }}
                            >
                                {profileDescription}
                            </p>
                            <button onClick={handleProfileDescriptionButton} 
                                className="
                                    text-xs bg-slate-400 p-2 rounded text-white hover:bg-slate-500 mt-1
                                    md:h-8 md:mt-2
                                    lg:mt-4
                                "
                            >
                                Modificar
                            </button>
                        </>
                    )
                }
                {
                    textInput === true && (
                        <>
                            <form 
                                onSubmit={handleSubmit(handleProfileDescriptionEvent)} 
                                className="
                                    w-full
                                    md:flex md:space-x-4
                                "
                            >
                                <textarea 
                                    className="
                                        h-16 textarea resize-none hover:no-animation focus:outline-none border border-white bg-slate-300/10 text-xs
                                        md:w-60
                                        lg:w-96 lg:text-base
                                    "
                                    {...register("body")}
                                >
                                </textarea>
                                {
                                    isLoading ? (
                                        <button 
                                            disabled
                                            className="btn mt-2 w-20 bg-white border border-gray-300"
                                        >
                                            <span className="bg-slate-700/50 loading loading-spinner loading-md m-auto block h-11"/>
                                        </button>
                                    ) : (
                                        <SubmitButton
                                            content="Agregar"
                                            width="w-20 opacity-75"
                                        />
                                    )
                                }
                            </form>
                            {errors.body && typeof errors.body.message === 'string' && (
                                <span className="text-red-500 text-[0.75rem] text-xs">
                                    {errors.body.message}
                                </span>
                            )}
                        </>
                    )
                }
            </div>
    );
}
