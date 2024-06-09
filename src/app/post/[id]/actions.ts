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

export async function handleComment(postId: string, userId: string, userName: string, image: string | null, message: string, postAuthorId: string) {
    await prisma.comment.create({
        data: {
            userId: userId,
            postId: postId,
            userName: userName,
            profileImg: image,
            message: message
        }
    })

    if(userId !== postAuthorId){
        await prisma.notification.create({
            data: {
                userId: postAuthorId,
                subject: "POST",
                subjectId: postId,
                fromUserId: userId,
                readed: false
            }
        })
    }

    revalidatePath("/post/[id]","page");
};

export async function handleResponse(postId: string, userId: string, userName: string, image: string | null, message: string, parentId: string) {   
    const comment = await prisma.comment.create({
        data: {
            userId: userId,
            postId: postId,
            userName: userName,
            profileImg: image,
            message: message,
            parentId: parentId
        }
    })

    const findParentComment = await prisma.comment.findUnique({
        where: {
            id: comment.parentId as string
        }
    })

    if(userId !== findParentComment?.userId){
        await prisma.notification.create({
            data: {
                userId: findParentComment?.userId as string,
                subject: "COMMENT",
                subjectId: postId,
                fromUserId: userId,
                readed: false
            }
        })
    }

    revalidatePath("/post/[id]","page");
};

export async function handleCommentVote(commentId: string, userId: string, type:'UP' | 'DOWN') {   
    const previousVote = await prisma.commentVote.findUnique({
        where: {
            userId: userId,
            commentId: commentId
        },
    });

    if(previousVote && previousVote.type === type){
        await prisma.commentVote.delete({
            where: {
                userId: userId,
                commentId: commentId
            },
        })
    }

    if(previousVote && previousVote?.type !== type){
        await prisma.commentVote.update({
            where: {
                userId: userId,
                commentId: commentId
            },
            data: {
                type: type
            }
        })
    }

    if(previousVote === null){
        await prisma.commentVote.create({
            data: {
                userId: userId,
                commentId: commentId,
                type: type
            }
        })
    }

    revalidatePath("/post/[id]","page");
}

export async function savePost(postId: string, userId: string) {
    const previousSave = await prisma.savedPost.findUnique({
        where: {
            userId: userId,
            postId: postId
        },
    });

    if(previousSave){
        await prisma.savedPost.delete({
            where: {
                userId: userId,
                postId: postId
            },
        })
    }

    if(previousSave === null){
        await prisma.savedPost.create({
            data: {
                userId: userId,
                postId: postId
            }
        })
    }

    revalidatePath("/post/[id]","page");
}

export async function reportPost(postId: string, userId: string, body: string) {
    const previousReport = await prisma.report.findUnique({
        where: {
            userId: userId,
            postId: postId
        },
    });

    if(previousReport === null){
        await prisma.report.create({
            data: {
                userId: userId,
                subjectType: "POST",
                postId: postId,
                body: body
            }
        })
    }

    revalidatePath("/post/[id]","page");
}

export async function reportComment(commentId: string, postId: string, userId: string, body: string) {
    const previousReport = await prisma.report.findUnique({
        where: {
            userId: userId,
            commentId: commentId
        },
    });

    if(previousReport === null){
        await prisma.report.create({
            data: {
                userId: userId,
                subjectType: "COMMENT",
                postId: postId,
                commentId: commentId,
                body: body
            }
        })
    }

    revalidatePath("/post/[id]","page");
}

export async function deleteReport(subjectId: string, userId: string, subject: "POST" | "COMMENT") {
    if(subject === "POST"){
        await prisma.report.delete({
            where: {
                postId: subjectId,
                userId: userId,
                subjectType: subject
            }
        })
    }

    if(subject === "COMMENT"){
        await prisma.report.delete({
            where: {
                commentId: subjectId,
                userId: userId,
                subjectType: subject
            }
        })
    }

    revalidatePath("/post/[id]","page");
}
