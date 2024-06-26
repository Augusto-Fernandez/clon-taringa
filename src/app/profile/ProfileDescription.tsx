"use client"

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import UserButton from "@/components/UserButton";
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

    const { register, handleSubmit, formState: { errors } } = useForm<Input>({
        resolver: zodResolver(textInputSchema)
    });
    
    const handleProfileDescriptionButton = () => {
        setTextInput(true);
    };

    const handleProfileDescriptionEvent:SubmitHandler<Input> = async (data) => {
        await handleProfileDescription(userId, data.body);
        setTextInput(false);
    };
    
    return(
        <div className="w-[51rem] h-16">
            {
                !profileDescription && textInput === false && (
                    <div className="w-full flex justify-end">
                        <button onClick={handleProfileDescriptionButton} className="btn w-56">Agregar descripción a perfil</button>
                    </div>
                )
            }
            {
                profileDescription && textInput === false && (
                    <>
                        <p className="text-xs h-12" style={{ overflowWrap: 'break-word', whiteSpace: 'normal' }}>{profileDescription}</p>
                        <div className="flex justify-end">
                            <button onClick={handleProfileDescriptionButton} className="text-xs bg-slate-400 p-2 rounded text-white hover:bg-slate-500">Modificar</button>
                        </div>
                    </>
                )
            }
            {
                textInput === true && (
                    <>
                        <form onSubmit={handleSubmit(handleProfileDescriptionEvent)} className="w-full flex space-x-4">
                            <textarea 
                                className="w-5/6 h-16 textarea resize-none hover:no-animation focus:outline-none border border-white bg-slate-300"
                                {...register("body")}
                            >
                            </textarea>
                            <UserButton
                                content="Agregar"
                                width="w-20"
                            />
                        </form>
                        {errors.body && typeof errors.body.message === 'string' && (
                            <span className="ml-14  text-red-500 text-sx">
                                {errors.body.message}
                            </span>
                        )}
                    </>
                )
            }
        </div>
    );
}

/*
<div className="w-[51rem] h-16">
            {profileDescription ? (
                    <>
                        <p className="text-xs" style={{ overflowWrap: 'break-word', whiteSpace: 'normal' }}>{profileDescription}</p>
                        <div className="flex justify-end">
                            <button onClick={handleProfileDescriptionButton} className="text-xs bg-slate-400 p-2 rounded text-white hover:bg-slate-500">Modificar</button>
                        </div>
                    </>
                ) : (
                    textInput ? (
                        <>
                            <form onSubmit={handleSubmit(handleProfileDescriptionEvent)} className="w-full flex space-x-4">
                                <textarea 
                                    className="w-5/6 h-16 textarea resize-none hover:no-animation focus:outline-none border border-white bg-slate-300"
                                    {...register("body")}
                                >
                                </textarea>
                                <UserButton
                                    content="Agregar"
                                    width="w-20"
                                />
                            </form>
                            {errors.body && typeof errors.body.message === 'string' && (
                                <span className="ml-14  text-red-500 text-sx">
                                    {errors.body.message}
                                </span>
                            )}
                        </>
                    ) : (
                        <div className="w-full flex justify-end">
                            <button onClick={handleProfileDescriptionButton} className="btn w-56">Agregar descripción a perfil</button>
                        </div>
                    )
                )}
        </div>
*/