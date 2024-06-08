import { getServerSession } from "next-auth";

import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "../lib/db/prisma";
import { Post, User } from "@prisma/client";

import ReportCard from "./ReportCard";
import PaginationBar from "@/components/PaginationBar";
import { deleteReport, deletePost } from "./actions";

interface PanelPageProps{
    searchParams: {page: string};
}

export const metadata = {
    title: "Panel de Admin"
}

export default async function PanelPage ({searchParams:{page = "1"}}: PanelPageProps){
    const session = await getServerSession(authOptions);

    const getAdmin = await prisma.user.findUnique({
        where:{
            userName: session?.user?.name as string
        }
    })

    if(!getAdmin?.isAdmin){
        return(
            <div className="h-screen">Page not found.</div>
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
                id: report.postId
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
        let postTitle = "undefined";

        const findPost = postArray.find(post => post.id === postId);
        if(findPost){
            return findPost.title;
        }

        return postTitle;
    };

    const getUserName = (userId: string) => {
        let userName = "undefined";

        const findUser = userArray.find(user => user.id === userId);
        if(findUser){
            return findUser.userName;
        }

        return userName;
    };

    return(
        <div className="min-h-screen bg-gray-100 flex justify-center">
            <div className=" min-h-screen w-2/3 bg-slate-300 mx-20 rounded-lg justify-center">
                <div className="pt-10 pl-10 flex">
                    <h1 className="text-slate-600 font-semibold text-4xl">Reportes</h1>
                </div>
                <div className="bg-red-800 h-[41.25rem] rounded-md mt-10 mx-10 mb-2 p-3">
                    {
                        reports.map(report => (
                            <ReportCard
                                key={report.id}
                                postId={report.postId}
                                userName={getUserName(report.userId)}
                                postTitle={getPostTitle(report.postId)}
                                body={report.body}
                                reportId={report.id}
                                deleteReport={deleteReport}
                                deletePost={deletePost}
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
                            <div className="join-item btn">1</div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};
