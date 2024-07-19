"use server"

import { revalidatePath } from "next/cache";

import { prisma } from "../lib/db/prisma";
import { storage } from "../services/firebase/firebaseConfig";
import { getDownloadURL, ref, uploadBytes, deleteObject, StorageReference } from "firebase/storage";

export async function deleteReport(reportId: string) {
    await prisma.report.delete({
        where: {
            id: reportId
        }
    })

    revalidatePath("/panel","page");
};

export async function deletePost(postId: string, storageRef: string) {
    await prisma.post.delete({
        where: {
            id: postId
        }
    })

    const postStorageRef = ref(storage, `post-images/${storageRef}}`);
    await deleteObject(postStorageRef);

    await prisma.report.deleteMany({
        where:{
            postId: postId
        }
    })

    revalidatePath("/panel","page");
};

export async function deleteComment(commentId: string) {
    await prisma.comment.delete({
        where: {
            id: commentId
        }
    })

    await prisma.report.deleteMany({
        where:{
            commentId: commentId
        }
    })

    revalidatePath("/panel","page");
};
