import { Metadata } from "next";
import { getServerSession } from "next-auth";

import { prisma } from "../lib/db/prisma";
import { authOptions } from "../api/auth/[...nextauth]/route";

import PostCard from "@/components/PostCard";
import ProfileCommentCard from "./ProfileCommentCard";
import { Comment, Post } from "@prisma/client";
import PaginationBar from "@/components/PaginationBar";
import { handleCreateChat, handleProfileDescription, handleProfileImage } from "./actions";
import CreateChatButton from "./CreateChatButton";
import ProfileDescription from "./ProfileDescription";
import ProfileImage from "./ProfileImage";

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

    let loggedUserId = null;
    let loggedUserDescription = null;

    if (session?.user) {
        const userLogged = await prisma.user.findUnique({
            where: {
                userName: session?.user?.name as string
            }
        });

        loggedUserId = userLogged?.id;
        loggedUserDescription = userLogged?.profileDescription;
    };
    
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
        <main className="bg-gradient-to-r from-purple-100 from-5% via-pink-200 via-30% to-emerald-100 to-95% ...">
            <div className="min-h-screen flex justify-center">
                <div className=" min-h-screen w-2/3 bg-slate-300/50 mx-20 rounded-lg justify-center">
                    <div className="pt-10 pl-10 flex justify-between">
                        <div className="md:flex">
                            <ProfileImage
                                image={user?.image as string}
                                userId={user?.id as string}
                                loggedUserId={loggedUserId as string}
                                handleProfileImage={handleProfileImage}
                            />
                            <div className="p-2">
                                <h1 
                                    className="
                                        text-xl text-slate-700/90
                                        md:text-2xl
                                        lg:text-3xl
                                    "
                                >
                                    {user?.userName}
                                </h1>
                                {
                                    session?.user && loggedUserId === user?.id ? 
                                    (
                                        <ProfileDescription
                                            userId={loggedUserId as string}
                                            profileDescription={loggedUserDescription as string}
                                            handleProfileDescription={handleProfileDescription}
                                        />
                                    ) : (
                                        <div 
                                            className="
                                                min-h-18 h-auto max-w-[13rem]
                                                md:max-w-[22rem]
                                                lg:max-w-[30rem]
                                            "
                                        >
                                            <p 
                                                className="
                                                    text-slate-700/90 text-[0.5rem]
                                                    lg:text-xs
                                                " 
                                                style={{ overflowWrap: 'break-word', whiteSpace: 'normal' }}
                                            >
                                                {user?.profileDescription}
                                            </p>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end mx-10 mt-1">
                        {
                            session?.user && loggedUserId as string !== user?.id && (
                                <CreateChatButton
                                    userId={loggedUserId as string}
                                    toUserId={user?.id as string}
                                    handleCreateChat={handleCreateChat}
                                />
                            )
                        }
                    </div>
                    <div className="bg-slate-400/10 min-h-[41.25rem] h-auto rounded-md mt-3 mx-10 mb-2 p-3">
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
                                    <p 
                                        className="
                                            p-10 text-base
                                            md:text-2xl
                                            lg:text-4xl lg:font-semibold
                                        "
                                    >
                                        No hay actividad de este usuario
                                    </p>
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
                                <div className="bg-slate-300/25 hover:bg-slate-400/25 text-slate-500 border border-slate-400 join-item btn">1</div>
                            )
                        }
                    </div>
                </div>
            </div>
        </main>
    );
}
