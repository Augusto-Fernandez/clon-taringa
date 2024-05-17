import { getServerSession } from "next-auth";

import { prisma } from "@/app/lib/db/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
    
    return (
        <div className="min-h-screen bg-gray-100 flex justify-center">
            <div className=" min-h-screen w-2/3 bg-slate-300 mx-20 rounded-lg justify-center">
                <div className="pt-10 pl-10 flex">
                    <h1 className="text-slate-600 font-semibold text-4xl">Chat con <span>{otherUser?.userName}</span></h1>
                </div>
                <div className="bg-red-800 min-h-[41.25rem] h-auto rounded-md mt-10 mx-10 mb-10 p-3">
                    
                </div>
            </div>
        </div>
    );
};
