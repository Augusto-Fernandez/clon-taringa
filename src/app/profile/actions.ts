"use server"

import { redirect } from 'next/navigation'

import { prisma } from "../lib/db/prisma"

export async function handleCreateChat(userId:string, toUserId: string) {
    const checkPreviousConversation = await prisma.conversation.findFirst({
        where: {
            userIds: {
                hasEvery: [userId, toUserId]
            }
        }
    })

    if(checkPreviousConversation){
        redirect(`/chat/${checkPreviousConversation.id}`)
    }else{
        const conversation = await prisma.conversation.create({
            data: {
                userIds: [userId, toUserId]
            }
        })

        redirect(`/chat/${conversation.id}`);
    }
};
