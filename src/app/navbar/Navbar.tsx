import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { prisma } from "../lib/db/prisma";
import { authOptions } from "../api/auth/[...nextauth]/route";

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
    const session = await getServerSession(authOptions);

    let notificationCount = 0;
    
    if(session){
        const loggedUser = await prisma.user.findUnique({
            where: {
                userName: session?.user?.name as string
            }
        })

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
    }

    return (
        <div className="navbar bg-green-300">
            <div className="flex-1">
                <Link href="/" className="btn btn-ghost text-xl">Taringa?</Link>
            </div>
            <div className="gap-2">
                <UserMenu 
                    session={session}
                    notificationCount={notificationCount}
                />
                <form action={searchPosts} className="flex justify-center items-center space-x-1">
                    <input type="text" placeholder="Buscar Post" name="searchQuery" className="input input-bordered w-24 md:w-auto"/>
                    <SearchButton/>
                </form>
            </div>
        </div>
    )
}