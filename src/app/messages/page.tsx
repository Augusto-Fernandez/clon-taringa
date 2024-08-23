import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { prisma } from "../lib/db/prisma";

import PaginationBar from "@/components/PaginationBar";
import { Message, MessageNotification, User } from "@prisma/client";
import ChatCard from "@/components/ChatCard";
import formatDate from "../lib/formatDate";
import { handleChatRedirect } from "./actions";
import SearchButton from "@/components/SearchButton";

export const metadata = {
    title: "Mensajes"
}

interface MessagesPageProps{
    searchParams: {page: string};
}

async function searchChat(formData: FormData) {
    "use server";

    const searchQuery = formData.get("searchQuery")?.toString();

    if (searchQuery) {
        redirect("/searchchat?query=" + searchQuery);
    }
}

export default async function MessagesPage ({searchParams:{page = "1"}}:MessagesPageProps){
    const session = await getServerSession();

    const currentPage = parseInt(page);
    const pageSize = 10;

    const userLogged = await prisma.user.findUnique({
        where: {
            userName: session?.user?.name as string
        }
    });

    if(!userLogged){
        return(
            <div>
                <p>Acceso no autorizado, por favor iniciar sesión</p>
            </div>
        );
    }

    const conversations = await prisma.conversation.findMany({
        where: {
            userIds: {
                has: userLogged?.id as string
            }
        },
        orderBy: { updatedAt:"desc" },
        skip: (currentPage-1)*pageSize,
        take: pageSize
    });

    const totalConversationsCount = await prisma.conversation.count({
        where: {
            userIds: {
                has: userLogged?.id as string
            }
        }
    });

    const totalPages = Math.ceil(totalConversationsCount/pageSize);

    const otherUserArray:User[] = [];
    const lastMessageArray:Message[] = [];
    const messageNotificationArray: MessageNotification[] = [];

    await Promise.all(conversations.map(async (conversation) => {
        const otherUserId = conversation?.userIds.find(id => id !== userLogged?.id);
        
        const otherUsers = await prisma.user.findMany({
            where: {
                id: otherUserId
            }
        });
    
        if (otherUsers.length > 0) {
            otherUserArray.push(...otherUsers);
        }

        const lastMessage = await prisma.message.findFirst({
            where: {
                conversationId: conversation.id
            },
            orderBy:{id:"desc"},
            take: 1
        });

        if(lastMessage){
            lastMessageArray.push(lastMessage);
        }

        const messageNotification = await prisma.messageNotification.findUnique({
            where:{
                conversationId: conversation.id,
                userId: userLogged?.id
            }
        });

        if(messageNotification){
            messageNotificationArray.push(messageNotification);
        }
    }));

    const getOtherUserName = (userIds: string[]) => {
        const otherUserId = userIds.find(id => id !== userLogged?.id);
        const getOtherUserName = otherUserArray.find(user => user.id === otherUserId);
        
        return getOtherUserName?.userName as string;
    }

    const getLastMessageBody = (chatId: string) => {
        const message = lastMessageArray.find(message => message.conversationId === chatId);
        return message?.body as string;
    };

    const getLastMessageDate = (chatId: string) => {
        const message = lastMessageArray.find(message => message.conversationId === chatId);
        return formatDate(message?.createdAt as Date);
    };

    const getMessageNotification = (chatId: string) => {
        const messageNotification = messageNotificationArray.find(notification => notification.conversationId === chatId && notification.userId === userLogged?.id)
    
        if(messageNotification){
            return messageNotification.count;
        }

        return 0;
    }
    
    return(
        <main className="bg-gradient-to-r from-purple-100 from-5% via-pink-200 via-30% to-emerald-100 to-95% ...">
            <div className="min-h-screen flex justify-center">
                <div className=" min-h-screen w-2/3 bg-slate-300/50 mx-20 rounded-lg justify-center">
                    <div className="pt-10 px-10 flex justify-between">
                        <h1 
                            className="
                                text-slate-700/90 font-semibold text-xl
                                md:text-2xl
                                lg:text-3xl
                            "
                        >
                            Mensajes
                        </h1>
                        <form action={searchChat} className="flex justify-center items-center space-x-1">
                            <input type="text" placeholder="Buscar chat" name="searchQuery" 
                                className="
                                    input w-16 h-7 border-slate-300 bg-slate-300/50 placeholder-slate-600 text-slate-700/90
                                    md:w-auto md:h-10 md:border-2
                                "
                            />
                            <SearchButton
                                className="
                                    btn-ghost h-7 w-7 bg-green-500/50 rounded-lg hover:bg-green-400
                                    md:h-9 md:w-9
                                "
                                svgSize="w-7 h-7"
                            />
                        </form>
                    </div>
                    <div className="bg-slate-400/40 h-[41.25rem] rounded-md mt-10 mx-10 mb-2 p-3">
                        {
                            conversations.length > 0 ? (
                                conversations.map(chat => (
                                    <ChatCard 
                                        key={ chat.id}
                                        otherUserName={getOtherUserName(chat.userIds)}
                                        chatId={chat.id}
                                        body={getLastMessageBody(chat.id)}
                                        date={getLastMessageDate(chat.id)}
                                        notifCount={getMessageNotification(chat.id)}
                                        userId={userLogged?.id as string}
                                        handleChatRedirect={handleChatRedirect}
                                    />
                                ))
                            ) : (
                                <div className="w-full flex justify-center">
                                    <p 
                                        className="
                                            p-10 text-base
                                            md:text-2xl
                                            lg:text-4xl lg:font-semibold
                                        "
                                    >
                                        No hay mensajes
                                    </p>
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
};
