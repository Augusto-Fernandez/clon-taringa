"use server"

import { revalidatePath } from "next/cache";

import { prisma } from "../lib/db/prisma";

export async function deleteReport(reportId: string) {
    await prisma.report.delete({
        where: {
            id: reportId
        }
    })

    revalidatePath("/panel","page");
};

export async function deletePost(postId: string) {
    await prisma.post.delete({
        where: {
            id: postId
        }
    })

    await prisma.report.deleteMany({
        where:{
            postId: postId
        }
    })

    revalidatePath("/panel","page");
};
