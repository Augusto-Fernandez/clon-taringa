"use client"

import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import UserButton from "@/components/UserButton"
import { textInputSchema } from '@/app/lib/validations/textInputSchema';

interface MessageBoxProps {
    chatId: string;
    userId: string;
    otherUserId: string;
    handleMessage: ( body: string, chatId: string, userId: string, otherUserId: string) => Promise<void>;
};

type Input = {
    body: string;
};

export default function MessageBox ({chatId, userId, otherUserId, handleMessage}: MessageBoxProps){
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<Input>({
        resolver: zodResolver(textInputSchema)
    });

    const createComment:SubmitHandler<Input> = async (data) => {
        await handleMessage(data.body, chatId, userId, otherUserId);
        setValue("body", "");
    };

    useEffect(() => {
        const messageBox = document.getElementById('messageBox');
        if(messageBox){
            messageBox.scrollIntoView(false);
        }
    });
    
    return(
        <>
            <form id='messageBox' onSubmit={handleSubmit(createComment)} className="mx-10 mt-2 rounded-3xl bg-slate-300/70 p-4 flex space-x-4">
                <textarea 
                    className="w-full hover:no-animation focus:outline-none border rounded-md min-h-16 h-auto"
                    placeholder="Agregar respuesta"
                    {...register("body")}
                >
                </textarea>
                <UserButton content="Responder" width="w-auto opacity-75"/>
            </form>
            {errors.body && typeof errors.body.message === 'string' && (
                <span className="ml-14  text-red-500 text-sm font-bold">
                    {errors.body.message}
                </span>
            )}
        </>
    );
};
