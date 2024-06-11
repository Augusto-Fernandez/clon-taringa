import { getServerSession } from "next-auth";

import { prisma } from "../lib/db/prisma";
import { authOptions } from "../api/auth/[...nextauth]/route";

import PaginationBar from "@/components/PaginationBar";
import { Conversation, Message, MessageNotification, User } from "@prisma/client";
import ChatCard from "@/components/ChatCard";
import formatDate from "../lib/formatDate";
import { handleChatRedirect } from "./actions";

interface MessagesPageProps{
    searchParams: { query: string, page: string };
}

export default async function MessagesPage ({searchParams:{query, page = "1"}}:MessagesPageProps){
    const session = await getServerSession(authOptions);

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

    const totalConversationsCount = await prisma.conversation.count({
        where: {
            userIds: {
                has: userLogged?.id as string
            }
        }
    });

    const totalPages = Math.ceil(totalConversationsCount/pageSize);

    const getQueryUser = await prisma.user.findUnique({
        where: {
            userName: query
        }
    });

    const conversationsArray: Conversation[] = [];

    if(getQueryUser){
        const conversations = await prisma.conversation.findMany({
            where: {
                userIds: {
                    has: userLogged?.id as string && getQueryUser?.id
                }
            },
            orderBy: { updatedAt:"desc" },
            skip: (currentPage-1)*pageSize,
            take: pageSize
        });

        conversationsArray.push(...conversations);
    }

    const otherUserArray:User[] = [];
    const lastMessageArray:Message[] = [];
    const messageNotificationArray: MessageNotification[] = [];

    await Promise.all(conversationsArray.map(async (conversation) => {
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

    const getMessageUserName = (chatId: string) => {
        const message = lastMessageArray.find(message => message.conversationId === chatId);

        if(message?.senderId === userLogged.id){
            return userLogged.userName;
        }

        const getUserName = otherUserArray.find(user => user.id === message?.senderId)
        return getUserName?.userName as string;
    };

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
        <div className="min-h-screen bg-gray-100 flex justify-center">
            <div className=" min-h-screen w-2/3 bg-slate-300 mx-20 rounded-lg justify-center">
                <div className="pt-10 pl-10 flex">
                    <h1 className="text-slate-600 font-semibold text-4xl">Mensajes</h1>
                </div>
                <div className="bg-red-800 h-[41.25rem] rounded-md mt-10 mx-10 mb-2 p-3">
                    {
                        conversationsArray.length > 0 ? (
                            conversationsArray.map(chat => (
                                <ChatCard 
                                    key={ chat.id}
                                    otherUserName={getOtherUserName(chat.userIds)}
                                    chatId={chat.id}
                                    messageUserName={getMessageUserName(chat.id)}
                                    body={getLastMessageBody(chat.id)}
                                    date={getLastMessageDate(chat.id)}
                                    notifCount={getMessageNotification(chat.id)}
                                    userId={userLogged?.id as string}
                                    handleChatRedirect={handleChatRedirect}
                                />
                            ))
                        ) : (
                            <div className="w-full flex justify-center">
                                <p className="p-10 text-5xl font-semibold">No se encontró chat</p>
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
