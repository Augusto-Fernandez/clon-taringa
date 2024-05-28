"use server"

import { redirect } from 'next/navigation'

import { prisma } from "../lib/db/prisma"

export async function handleChatRedirect(conversationId: string, userId: string) {
    const checkMessageNotification = await prisma.messageNotification.findUnique({
        where:{
            userId: userId,
            conversationId: conversationId
        }
    })
    
    if(checkMessageNotification){
        await prisma.messageNotification.delete({
            where:{
                conversationId: conversationId,
                userId: userId
            }
        })
    }

    redirect(`/chat/${conversationId}`);
};