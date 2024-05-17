import { getServerSession } from "next-auth";

import { prisma } from "../lib/db/prisma";
import { authOptions } from "../api/auth/[...nextauth]/route";

import PaginationBar from "@/components/PaginationBar";

interface MessagesPageProps{
    searchParams: {page: string};
}

export default async function MessagesPage ({searchParams:{page = "1"}}:MessagesPageProps){
    const session = await getServerSession(authOptions);

    const currentPage = parseInt(page);
    const pageSize = 10;

    const userLogged = await prisma.user.findUnique({
        where: {
            userName: session?.user?.name as string
        }
    })

    const conversations = await prisma.conversation.findMany({
        where: {
            userIds: {
                has: userLogged?.id as string
            }
        },
        orderBy: { id: "desc" },
        skip: (currentPage-1)*pageSize,
        take: pageSize
    })

    const totalConversationsCount = await prisma.conversation.count({
        where: {
            userIds: {
                has: userLogged?.id as string
            }
        }
    })

    const totalPages = Math.ceil(totalConversationsCount/pageSize);
    
    return(
        <div className="min-h-screen bg-gray-100 flex justify-center">
            <div className=" min-h-screen w-2/3 bg-slate-300 mx-20 rounded-lg justify-center">
                <div className="pt-10 pl-10 flex">
                    <h1 className="text-slate-600 font-semibold text-4xl">Notificaciones</h1>
                </div>
                <div className="bg-red-800 h-[41.25rem] rounded-md mt-10 mx-10 mb-2 p-3">

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
