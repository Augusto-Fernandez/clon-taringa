"use server"

import { revalidatePath } from "next/cache";

import { prisma } from "@/app/lib/db/prisma";

export async function handleMessage(body: string, conversationId: string, senderId: string) {
    await prisma.message.create({
        data:{
            body: body,
            conversationId: conversationId,
            senderId: senderId
        }
    })

    revalidatePath("/chat/[id]","page");
};
