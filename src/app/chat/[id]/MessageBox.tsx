"use client"

import React, { useState, useEffect } from 'react';
import { SubmitHandler, useForm } from "react-hook-form";

import UserButton from "@/components/UserButton"

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
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<Input>();

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
            <form id='messageBox' onSubmit={handleSubmit(createComment)} className="mx-10 mt-2 rounded-3xl bg-white p-4 flex space-x-4 border">
                <textarea 
                    className="w-full hover:no-animation focus:outline-none border border-t-gray-300 rounded-md min-h-16 h-auto"
                    placeholder="Agregar respuesta"
                    {...register("body", {
                        required: {
                            value: true,
                            message: "Es necesario ingresar una respuesta",
                        },
                    })}
                >
                </textarea>
                <UserButton content="Responder" width="w-auto"/>
            </form>
            {errors.body && typeof errors.body.message === 'string' && (
                <span className="ml-14  text-red-500 text-sm font-bold">
                    {errors.body.message}
                </span>
            )}
        </>
    );
};
