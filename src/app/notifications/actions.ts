"use server"

import { revalidatePath } from "next/cache";

import { prisma } from "../lib/db/prisma";

export async function handleNotification(notificationId: string) {
    await prisma.notification.update({
        where: {
            id: notificationId
        },
        data:{
            readed: true
        }
    })

    revalidatePath("/notifications","page");
};
