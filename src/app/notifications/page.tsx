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

    const userLogged = await prisma.user.findUnique({
        where:{
            userName: session?.user?.name as string
        }
    })

    if(!userLogged){
        return(
            <div>
                <p>Acceso no autorizado, por favor iniciar sesión</p>
            </div>
        );
    }

    const currentPage = parseInt(page);
    const pageSize = 10;

    const notifications = await prisma.notification.findMany({
        where:{
            userId: userLogged.id
        },
        orderBy: { id: "desc" },
        skip: (currentPage-1)*pageSize,
        take: pageSize
    })

    const totalNotificationCount = await prisma.notification.count({
        where:{
            userId: userLogged.id
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
        const searchFromUserName = fromUserArray.find(fromUser => fromUser.id === fromUserId)
        return searchFromUserName?.userName as string;
    }

    const getPostName = (postId: string) => {
        const searchPostName = postArray.find(post => post.id === postId)
        return searchPostName?.title as string;
    }
    
    return(
        <main className="bg-gradient-to-r from-purple-100 from-5% via-pink-200 via-30% to-emerald-100 to-95% ...">
            <div className="min-h-screen flex justify-center">
                <div className=" min-h-screen w-2/3 bg-slate-300/50 mx-20 rounded-lg justify-center">
                    <div className="pt-10 pl-10 flex">
                        <h1 
                            className="
                                text-slate-700/90 font-semibold text-xl
                                md:text-2xl
                                lg:text-3xl
                            "
                        >
                            Notificaciones
                        </h1>
                    </div>
                    <div className="bg-slate-400/10 min-h-[41.25rem] h-auto rounded-md mt-10 mx-10 mb-2 p-3">
                        {
                            notifications.length > 0 ? (
                                notifications.map(notification => (
                                    <NotificationCard
                                        key={notification.id}
                                        notification={notification}
                                        fromUserName={getFromUserName(notification.fromUserId)}
                                        postName={getPostName(notification.subjectId)}
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
                                <div className="bg-slate-300/25 hover:bg-slate-400/25 text-slate-500 border border-slate-400 join-item btn">1</div>
                            )
                        }
                    </div>
                </div>
            </div>
        </main>
    );
}
