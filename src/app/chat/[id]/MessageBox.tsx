"use client"

import React, { useState, useEffect } from 'react';

import UserButton from "@/components/UserButton"

interface MessageBoxProps {
    chatId: string;
    userId: string;
    otherUserId: string;
    handleMessage: ( body: string, chatId: string, userId: string, otherUserId: string) => Promise<void>;
};

export default function MessageBox ({chatId, userId, otherUserId, handleMessage}: MessageBoxProps){
    const [response, setResponse] = useState("");
    const handleResponseChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setResponse(event.target.value);
    };

    const createComment = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await handleMessage(response, chatId, userId, otherUserId);
        setResponse("");
    };

    useEffect(() => {
        const messageBox = document.getElementById('messageBox');
        if(messageBox){
            messageBox.scrollIntoView(false);
        }
    });
    
    return(
        <form id='messageBox' onSubmit={createComment} className="mx-10 mt-2 mb-8 rounded-3xl bg-white p-4 flex space-x-4 border">
            <textarea 
                className="w-full hover:no-animation focus:outline-none border border-t-gray-300 rounded-md min-h-16 h-auto"
                required
                placeholder="Agregar respuesta"
                value={response}
                onChange={handleResponseChange}
            >
            </textarea>
            <UserButton content="Responder" width="w-auto"/>
        </form>
    );
};
