import { getServerSession } from "next-auth";

import { prisma } from "../lib/db/prisma";
import { Post, User } from "@prisma/client";

import ReportCard from "./ReportCard";
import PaginationBar from "@/components/PaginationBar";
import { deleteReport, deletePost, deleteComment } from "./actions";

interface PanelPageProps{
    searchParams: {page: string};
}

export const metadata = {
    title: "Panel de Admin"
}

export default async function PanelPage ({searchParams:{page = "1"}}: PanelPageProps){
    const session = await getServerSession();

    const getAdmin = await prisma.user.findUnique({
        where:{
            userName: session?.user?.name as string
        }
    })

    if(!getAdmin){
        return(
            <div>
                <p>Acceso no autorizado, por favor iniciar sesión</p>
            </div>
        );
    }

    if(!getAdmin?.isAdmin){
        return(
            <div className="h-screen">
                <p>Page not found.</p>
            </div>
        );
    }
    
    const currentPage = parseInt(page);
    const pageSize = 10;

    const reports = await prisma.report.findMany({
        orderBy: { id: "desc" },
        skip: (currentPage-1)*pageSize,
        take: pageSize
    })

    const totalReportsCount = await prisma.report.count();
    const totalPages = Math.ceil(totalReportsCount/pageSize);

    const postArray: Post[] = [];
    const userArray: User[] = [];

    await Promise.all(reports.map(async (report) => {
        const reportedPosts = await prisma.post.findUnique({
            where: {
                id: report.postId as string
            }
        });

        if (reportedPosts) {
            postArray.push(reportedPosts);
        }

        const reportingUser = await prisma.user.findUnique({
            where: {
                id: report.userId
            }
        })

        if(reportingUser){
            userArray.push(reportingUser);
        }
    }));

    const getPostTitle = (postId: string) => {
        const findPost = postArray.find(post => post.id === postId);
        return findPost?.title as string;
    };

    const getPostStorageRef = (postId: string) => {
        const findPost = postArray.find(post => post.id === postId);
        return findPost?.storeRef as string;
    };

    const getUserName = (userId: string) => {
        const findUser = userArray.find(user => user.id === userId);
        return findUser?.userName as string;
    };

    return(
        <main className="bg-gradient-to-r from-purple-100 from-5% via-pink-200 via-30% to-emerald-100 to-95% ...">
            <div className="min-h-screen flex justify-center">
                <div className=" min-h-screen w-2/3 bg-slate-300/50 mx-20 rounded-lg justify-center">
                    <div className="pt-10 pl-10 flex">
                        <h1 
                            className="
                                text-slate-700/90 font-semibold text-xl
                                md:text-2xl
                                lg:text-3xl
                            "
                        >
                            Reportes
                        </h1>
                    </div>
                    <div className="bg-slate-400/10 min-h-[41.25rem] h-auto rounded-md mt-10 mx-10 mb-2 p-3">
                        {
                            reports.map(report => (
                                <ReportCard
                                    key={report.id}
                                    report={report}
                                    userName={getUserName(report.userId)}
                                    postTitle={getPostTitle(report.postId)}
                                    postStorageRef={getPostStorageRef(report.postId)}
                                    deleteReport={deleteReport}
                                    deletePost={deletePost}
                                    deleteComment={deleteComment}
                                />
                            ))
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
