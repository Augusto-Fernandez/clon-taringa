"use server"

import { revalidatePath } from "next/cache";

import { prisma } from "@/app/lib/db/prisma";

export async function handleVote(postId: string, userId: string, type:'UP' | 'DOWN') {   
    const previousVote = await prisma.vote.findUnique({
        where: {
            userId: userId,
            postId: postId
        },
    });

    if(previousVote && previousVote.type === type){
        await prisma.vote.delete({
            where: {
                userId: userId,
                postId: postId
            },
        })
    }

    if(previousVote && previousVote?.type !== type){
        await prisma.vote.update({
            where: {
                userId: userId,
                postId: postId
            },
            data: {
                type: type
            }
        })
    }

    if(previousVote === null){
        await prisma.vote.create({
            data: {
                userId: userId,
                postId: postId,
                type: type
            }
        })
    }

    revalidatePath("/post/[id]","page");
}

export async function handleComment(postId: string, userId: string, message: string) {
    await prisma.comment.create({
        data: {
            userId: userId,
            postId: postId,
            message: message
        }
    })

    revalidatePath("/post/[id]","page");
};
