import { getServerSession } from "next-auth";

import { prisma } from "@/app/lib/db/prisma";

import MessageBox from "./MessageBox";
import { handleMessage } from "./actions";
import MessageBubble from "./MessageBubble";
import { User } from "@prisma/client";
import formatDate from "@/app/lib/formatDate";

interface ChatPageProps {
    params: {
        id: string;
    };
}

export default async function ChatPage ({params:{id}}:ChatPageProps){
    const session = await getServerSession();

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

    const chat = await prisma.conversation.findUnique({
        where: {
            id: id
        }
    });

    if(!chat?.userIds.includes(userLogged?.id as string)){
        return(
            <div className="h-screen">Page not found.</div>
        );
    }

    const otherUserId = chat?.userIds.find(id => id !== userLogged?.id);

    const otherUser = await prisma.user.findUnique({
        where: {
            id: otherUserId
        }
    });

    const messages = await prisma.message.findMany({
        where:{
            conversationId: chat?.id
        },
        orderBy: { id: "asc" }
    })

    const messagesUsersArray:User[] = [];

    await Promise.all(messages.map(async (message) => {
        const messagesUsers = await prisma.user.findMany({
            where: {
                id: message.senderId
            }
        });
    
        if (messagesUsers.length > 0) {
            messagesUsersArray.push(...messagesUsers);
        }
    }));

    const getUserName = (userId: string) => {
        const getUserName = messagesUsersArray.find(user => user.id === userId);
        return getUserName?.userName as string;
    }

    const getUserProfileImg = (userId: string) => {
        const getUserImg = messagesUsersArray.find(user => user.id === userId);
        return getUserImg?.image as string;
    }

    const checkSenderId = (userId: string) => {
        let senderIsLoggeduser: boolean = false

        if(userLogged?.id === userId){
            senderIsLoggeduser = true;
        }

        return senderIsLoggeduser;
    }

    const getOtherUserId = () => {
        const getOtherUser = chat?.userIds.find(id => id !== userLogged?.id);
        return getOtherUser;
    }
    
    return (
        <main className="bg-gradient-to-r from-purple-100 from-5% via-pink-200 via-30% to-emerald-100 to-95% ...">
            <div className="min-h-[40rem] h-auto flex justify-center">
                <div className="h-auto w-2/3 bg-slate-300/50 mx-20 rounded-lg justify-center">
                    <div className="pt-10 pl-10 flex">
                        <h1 
                            className="
                                text-slate-700/90 font-semibold text-xl
                                md:text-2xl
                                lg:text-3xl
                            "
                        >
                            Chat con <span>{otherUser?.userName}</span>
                        </h1>
                    </div>
                    <div className="bg-slate-400/40 min-h-[25rem] h-auto rounded-md mt-10 mx-10 p-3">
                        {
                            messages.map(message => (
                                <MessageBubble
                                    key={message.id}
                                    userImage={getUserProfileImg(message.senderId)}
                                    userName={getUserName(message.senderId)}
                                    body={message.body as string}
                                    createdAt={formatDate(message.createdAt)}
                                    checkSenderId={checkSenderId(message.senderId)}
                                />
                            ))
                        }
                    </div>
                    {
                        session?.user && (
                            <MessageBox
                                chatId={chat?.id as string}
                                userId={userLogged?.id as string}
                                otherUserId={getOtherUserId() as string}
                                handleMessage={handleMessage}
                            />
                        )
                    }
                </div>
            </div>
        </main>
    );
};
