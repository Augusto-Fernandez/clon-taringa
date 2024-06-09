import { getServerSession } from "next-auth";
import { Post, User } from "@prisma/client";

import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "../lib/db/prisma";

import PaginationBar from "@/components/PaginationBar";
import NotificationCard from "./NotificationCard";
import { handleNotification, handleDeleteNotification } from "./actions";

interface NotificationPageProps{
    searchParams: {page: string};
}

export const metadata = {
    title: "Notifications"
}

export default async function NotificationPage ({searchParams:{page = "1"}}: NotificationPageProps){
    const session = await getServerSession(authOptions);

    let userId = null

    if(session?.user){
        const userLogged = await prisma.user.findUnique({
            where:{
                userName: session?.user?.name as string
            }
        })

        userId = userLogged?.id
    }

    const currentPage = parseInt(page);
    const pageSize = 10;

    const notifications = await prisma.notification.findMany({
        where:{
            userId: userId as string
        },
        orderBy: { id: "desc" },
        skip: (currentPage-1)*pageSize,
        take: pageSize
    })

    const totalNotificationCount = await prisma.notification.count({
        where:{
            userId: userId as string
        }
    })

    const totalPages = Math.ceil(totalNotificationCount/pageSize);

    const fromUserArray:User[] = [];
    const postArray:Post[] = [];

    await Promise.all(notifications.map(async (notification) => {
        const fromUser = await prisma.user.findUnique({
            where: {
                id: notification.fromUserId
            }
        });

        const postName = await prisma.post.findUnique({
            where: {
                id: notification.subjectId
            }
        })

        if(fromUser){
            fromUserArray.push(fromUser);
        }

        if(postName){
            postArray.push(postName);
        }
    }));

    const getFromUserName = (fromUserId: string) => {
        let fromUserName: string;

        const searchFromUserName = fromUserArray.find(fromUser => fromUser.id === fromUserId)
        fromUserName = searchFromUserName?.userName as string;

        return fromUserName;
    }

    const getPostName = (postId: string) => {
        let postName: string;

        const searchPostName = postArray.find(post => post.id === postId)
        postName = searchPostName?.title as string;

        return postName;
    }
    
    return(
        <div className="min-h-screen bg-gray-100 flex justify-center">
            <div className=" min-h-screen w-2/3 bg-slate-300 mx-20 rounded-lg justify-center">
                <div className="pt-10 pl-10 flex">
                    <h1 className="text-slate-600 font-semibold text-4xl">Notificaciones</h1>
                </div>
                <div className="bg-red-800 h-[41.25rem] rounded-md mt-10 mx-10 mb-2 p-3">
                    {
                        notifications.length > 0 ? (
                            notifications.map(notification => (
                                <NotificationCard
                                    key={notification.id}
                                    fromUserName={getFromUserName(notification.fromUserId)}
                                    postId={notification.subjectId}
                                    postName={getPostName(notification.subjectId)}
                                    subject={notification.subject}
                                    readed={notification.readed}
                                    notificationId={notification.id}
                                    handleNotification={handleNotification}
                                    handleDeleteNotification={handleDeleteNotification}
                                />
                            ))
                        ) : (
                            <div className="w-full flex justify-center">
                                <p className="p-10 text-5xl font-semibold">No hay notificaciones</p>
                            </div>
                        )
                    }
                </div>
                <div className="h-14 flex justify-center">
                    {
                        totalPages>1 ? (
                            <PaginationBar 
                                currentPage={currentPage} 
                                totalPages={totalPages}
                            />
                        ) : (
                            <div className="join-item btn">1</div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}
