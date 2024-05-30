import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { prisma } from "../lib/db/prisma";
import { authOptions } from "../api/auth/[...nextauth]/route";

import PaginationBar from "@/components/PaginationBar";
import { Message, MessageNotification, User } from "@prisma/client";
import ChatCard from "@/components/ChatCard";
import formatDate from "../lib/formatDate";
import { handleChatRedirect } from "./actions";
import SearchButton from "@/components/SearchButton";

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
    const session = await getServerSession(authOptions);

    const currentPage = parseInt(page);
    const pageSize = 10;

    const userLogged = await prisma.user.findUnique({
        where: {
            userName: session?.user?.name as string
        }
    });

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
        let otherUserName: string = "";
        
        const otherUserId = userIds.find(id => id !== userLogged?.id);
        
        otherUserArray.forEach(user => {
            if(user.id === otherUserId){
                otherUserName = user.userName;
            }
        });

        return otherUserName;
    }

    const getMessageProps = (chatId:string, prop: "userName" | "body" | "date") => {
        const message = lastMessageArray.find(message => message.conversationId === chatId);

        if( message && prop === "userName" && message.conversationId === chatId && message.senderId === userLogged?.id){
            return userLogged.userName;
        }

        if( message && prop === "userName" && message.conversationId === chatId && message.senderId !== userLogged?.id){
            const getUserName = otherUserArray.find(user => user.id === message.senderId)
            return getUserName?.userName as string;
        }

        if( message && prop === "body" && message.conversationId === chatId ){
            return message.body as string;
        }
        if( message && prop === "date" && message.conversationId === chatId ){
            return formatDate(message.createdAt);
        }

        return "undefined";
    };

    const getMessageNotification = (chatId: string) => {
        const messageNotification = messageNotificationArray.find(notification => notification.conversationId === chatId && notification.userId === userLogged?.id)
    
        if(messageNotification){
            return messageNotification.count;
        }

        return 0;
    }

    const totalConversationsCount = await prisma.conversation.count({
        where: {
            userIds: {
                has: userLogged?.id as string
            }
        }
    });

    const totalPages = Math.ceil(totalConversationsCount/pageSize);
    
    return(
        <div className="min-h-screen bg-gray-100 flex justify-center">
            <div className=" min-h-screen w-2/3 bg-slate-300 mx-20 rounded-lg justify-center">
                <div className="pt-10 px-10 flex justify-between">
                    <h1 className="text-slate-600 font-semibold text-4xl">Mensajes</h1>
                    <form action={searchChat} className="flex justify-center items-center space-x-1">
                        <input type="text" placeholder="Buscar chat" name="searchQuery" className="input input-bordered w-24 md:w-auto h-10"/>
                        <SearchButton
                            className="btn-ghost h-9 w-9 bg-green-500 rounded-lg hover:bg-green-400"
                            svgSize="w-7 h-7"
                        />
                    </form>
                </div>
                <div className="bg-red-800 h-[41.25rem] rounded-md mt-10 mx-10 mb-2 p-3">
                    {
                        conversations.length > 0 ? (
                            conversations.map(chat => (
                                <ChatCard 
                                    key={ chat.id}
                                    otherUserName={getOtherUserName(chat.userIds)}
                                    chatId={chat.id}
                                    messageUserName={getMessageProps(chat.id, "userName")}
                                    body={getMessageProps(chat.id, "body")}
                                    date={getMessageProps(chat.id, "date")}
                                    notifCount={getMessageNotification(chat.id)}
                                    userId={userLogged?.id as string}
                                    handleChatRedirect={handleChatRedirect}
                                />
                            ))
                        ) : (
                            <div className="w-full flex justify-center">
                                <p className="p-10 text-5xl font-semibold">No hay mensajes</p>
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
};
