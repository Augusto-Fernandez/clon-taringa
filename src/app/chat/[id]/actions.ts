"use server"

import { revalidatePath } from "next/cache";

import { prisma } from "@/app/lib/db/prisma";

export async function handleMessage(body: string, conversationId: string, senderId: string, receiverId: string) {
    await prisma.message.create({
        data:{
            body: body,
            conversationId: conversationId,
            senderId: senderId
        }
    })

    const checkMessageNotification = await prisma.messageNotification.findUnique({
        where:{
            userId: receiverId,
            conversationId: conversationId
        }
    })

    if(checkMessageNotification && senderId !== receiverId){
        await prisma.messageNotification.update({
            where: {
                id: checkMessageNotification.id
            },
            data: {
                count: checkMessageNotification.count+1
            }
        })
    }

    if(!checkMessageNotification && senderId !== receiverId){
        await prisma.messageNotification.create({
            data:{
                userId: receiverId,
                conversationId: conversationId
            }
        })
    }

    revalidatePath("/chat/[id]","page");
};
