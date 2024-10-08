"use server"

import { redirect } from "next/navigation";

import { prisma } from "@/app/lib/db/prisma";

export async function handleCreatePost(
    title: string, 
    body: string, 
    category: string, 
    nsfw: boolean, 
    authorId: string, 
    banner?:string, 
    link?: string, 
    storageRef?:string
) {
    await prisma.post.create({
        data: {
            title: title,
            body: body,
            category: category,
            nsfw: nsfw,
            userId: authorId,
            banner: banner,
            link: link,
            storeRef: storageRef
        }
    });

    redirect("/");
};
