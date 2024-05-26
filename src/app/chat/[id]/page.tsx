import { getServerSession } from "next-auth";

import { prisma } from "@/app/lib/db/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
    const session = await getServerSession(authOptions);

    const userLogged = await prisma.user.findUnique({
        where: {
            userName: session?.user?.name as string
        }
    });

    const chat = await prisma.conversation.findUnique({
        where: {
            id: id
        }
    });

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

    const getUserProps = (userId: string, prop: "image" | "userName") => {
        let userProp: string = "";

        messagesUsersArray.forEach(user => {
            if(user.id === userId && prop === "image"){
                userProp = user.image as string;
            }
            if(user.id === userId && prop === "userName"){
                userProp = user.userName as string;
            }
        });

        return userProp;
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

        if(getOtherUser){
            return getOtherUser;
        }

        return "undefined";
    }
    
    return (
        <div className="min-h-[40rem] h-auto bg-gray-100 flex justify-center">
            <div className="h-auto w-2/3 bg-slate-300 mx-20 rounded-lg justify-center">
                <div className="pt-10 pl-10 flex">
                    <h1 className="text-slate-600 font-semibold text-4xl">Chat con <span>{otherUser?.userName}</span></h1>
                </div>
                <div className="bg-red-800 min-h-[25rem] h-auto rounded-md mt-10 mx-10 p-3">
                    {
                        messages.map(message => (
                            <MessageBubble
                                key={message.id}
                                userImage={getUserProps(message.senderId, "image")}
                                userName={getUserProps(message.senderId, "userName")}
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
                            otherUserId={getOtherUserId()}
                            handleMessage={handleMessage}
                        />
                    )
                }
            </div>
        </div>
    );
};
