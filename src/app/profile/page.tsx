import { Metadata } from "next";
import Image from "next/image";
import { getServerSession } from "next-auth";

import { prisma } from "../lib/db/prisma";
import { authOptions } from "../api/auth/[...nextauth]/route";

import PostCard from "@/components/PostCard";
import ProfileCommentCard from "./ProfileCommentCard";
import profilePicPlaceholder from "../../../public/profilePicPlaceholder.png" 
import { Comment, Post } from "@prisma/client";
import PaginationBar from "@/components/PaginationBar";
import { handleCreateChat } from "./actions";
import CreateChatButton from "./CreateChatButton";

interface ProfilePageProps {
    searchParams: {query: string, page: string};
}

export function generateMetadata({searchParams: { query }}: ProfilePageProps): Metadata {
    return { 
        title: `${query} - Taringa?`,
    };
}

export default async function ProfilePage({searchParams: { query, page = "1" }}: ProfilePageProps) {
    const session = await getServerSession(authOptions);

    const userLogged = await prisma.user.findUnique({
        where: {
            userName: session?.user?.name as string
        }
    });
    
    const user = await prisma.user.findUnique({
        where: {
            userName: query
        }
    });

    const posts = await prisma.post.findMany({
        where: {
            author: {
                id: user?.id
            }
        },
        orderBy: { id: "desc" }
    });

    const comments = await prisma.comment.findMany({
        where: {
            userId: user?.id
        },
        orderBy: { id: "desc" }
    });

    const userActivity: (Post | Comment)[] = [...posts, ...comments.map((comment) => ({ ...comment, type: "comment" }))];
    userActivity.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));

    const currentPage = parseInt(page);
    const pageSize = 10;
    const totalActivityCount = userActivity.length;
    const totalPages = Math.ceil(totalActivityCount/pageSize)

    const userActivityPage = userActivity.slice((currentPage-1)*pageSize, currentPage === 1 ? 10 : currentPage*pageSize);
    
    return(
        <div className="min-h-screen bg-gray-100 flex justify-center">
            <div className=" min-h-screen w-2/3 bg-slate-300 mx-20 rounded-lg justify-center">
                <div className="pt-10 pl-10 flex justify-between">
                    <div className="flex">
                        <Image src={user?.image || profilePicPlaceholder} alt="Profile picture" width={40} height={40} className="w-28 rounded-full"/>
                        <h1 className="text-3xl p-4">{user?.userName}</h1>
                    </div>
                    {
                        session?.user && userLogged?.id as string !== user?.id && (
                            <CreateChatButton
                                userId={userLogged?.id as string}
                                toUserId={user?.id as string}
                                handleCreateChat={handleCreateChat}
                            />
                        )
                    }
                </div>
                <div className="bg-red-800 h-[41.25rem] rounded-md mt-10 mx-10 mb-2 p-3">
                    {userActivityPage.length > 0 ? (
                            userActivityPage.map((activity, index) => {
                                if ("type" in activity && activity.type === "comment") {
                                    return <ProfileCommentCard comment={activity as Comment} key={index} />;
                                } else {
                                    return <PostCard post={activity as Post} key={activity.id} />;
                                }
                            })
                        ) : (
                            <div className="w-full flex justify-center">
                                <p className="p-10 text-5xl font-semibold">No hay actividad de este usuario</p>
                            </div>
                    )}
                </div>
                <div className="h-14 flex justify-center">
                    {
                        totalPages>1 ? (
                            <PaginationBar 
                                currentPage={currentPage} 
                                totalPages={totalPages}
                                query={query}
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
