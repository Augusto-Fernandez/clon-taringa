"use server"

import { redirect } from 'next/navigation'
import { revalidatePath } from "next/cache";

import { prisma } from "../lib/db/prisma"
import { getDownloadURL, StorageReference, uploadBytes } from 'firebase/storage';

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

export async function handleProfileDescription(userId:string, profileDescription: string) {
    await prisma.user.update({
        where: {
            id: userId
        },
        data:{
            profileDescription: profileDescription
        }
    })

    revalidatePath("/profile/[id]","page");
};

export async function handleProfileImage(userId: string, imageUrl: string) {
    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            image: imageUrl
        }
    })

    revalidatePath("/profile/[id]","page");
};
