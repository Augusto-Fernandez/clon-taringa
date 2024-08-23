import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { prisma } from "../lib/db/prisma";

import UserMenu from "./UserMenu";
import SearchButton from "@/components/SearchButton";
import Link from "next/link";

async function searchPosts(formData: FormData) {
    "use server";

    const searchQuery = formData.get("searchQuery")?.toString();

    if (searchQuery) {
        redirect("/search?query=" + searchQuery);
    }
}

export default async function Navbar() {
    const session = await getServerSession();

    let notificationCount = 0;
    let messageNotificationCount = 0;
    let isAdmin = false;
    let userImg = null;
    
    if(session){
        const loggedUser = await prisma.user.findUnique({
            where: {
                userName: session?.user?.name as string
            }
        })

        isAdmin = loggedUser?.isAdmin as boolean;
        userImg = loggedUser?.image as string;

        const getNotificationCount = await prisma.notification.findMany({
            where: {
                userId: loggedUser?.id
            }
        })

        getNotificationCount.forEach(notification => {
            if(getNotificationCount.length > 0 && notification.readed === false){
                notificationCount++
            }
        })

        const getMessageNotificationCount = await prisma.messageNotification.findMany({
            where:{
                userId: loggedUser?.id
            }
        })

        getMessageNotificationCount.forEach(messageNotification => {
            if(getMessageNotificationCount.length > 0){
                messageNotificationCount = messageNotificationCount+messageNotification.count
            }
        })
    }

    return (
        <div className="navbar bg-green-300">
            <div className="flex-1">
                <Link href="/" className="btn btn-ghost hover:bg-green-400/50 text-white text-2xl">Taringa?</Link>
            </div>
            <div className="gap-2">
                <UserMenu 
                    session={session}
                    notificationCount={notificationCount}
                    messageNotificationCount={messageNotificationCount}
                    image={userImg}
                    isAdmin={isAdmin}
                />
                <form action={searchPosts} className="flex justify-center items-center space-x-1">
                    <input 
                        type="text" 
                        placeholder="Buscar Post" 
                        name="searchQuery" 
                        className="
                            input input-bordered h-10 w-24 md:w-auto text-[0.7rem]
                            md:text-base
                        "
                    />
                    <SearchButton
                        className="btn-ghost h-9 w-9 bg-green-500/50 rounded-lg hover:bg-green-600/50"
                        svgSize="w-7 h-7"
                    />
                </form>
            </div>
        </div>
    )
}