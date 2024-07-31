"use client"

import Link from "next/link";
import { useState } from "react";

import { Report } from "@prisma/client";

import DeleteIcon from "@/components/svgs/DeleteIcon";
import ReportUpIcon from "@/components/svgs/ReportUpIcon";
import ReportDownIcon from "@/components/svgs/ReportDownIcon";

interface ReportCardProps {
    report: Report
    userName: string;
    postTitle?: string;
    postStorageRef?: string;
    deleteReport: (reportId: string) => Promise<void>;
    deletePost: (postId: string, storageRef: string) => Promise<void>;
    deleteComment: (commentId: string) => Promise<void>;
}

export default function ReportCard({report, userName, postTitle, postStorageRef, deleteReport, deletePost, deleteComment}:ReportCardProps) {
    const [reportBody, setReportBody] = useState(false);
    
    const handleReportDetails = () =>{
        setReportBody(!reportBody);
    }

    const handleDeleteReport = async () => {
        await deleteReport(report.id);
    }

    const handleDeletePost = async () => {
        await deletePost(report.postId, postStorageRef as string);
    }

    const handleDeleteComment = async () => {
        await deleteComment(report.commentId as string);
    }

    const formatedPostTitle = postTitle?.length as number > 25 ? report.body.substring(0, 25) + "..." : postTitle;
    
    return(
        <div className="min-h-14 h-auto rounded-lg bg-slate-200/55 mb-2 ">
            <div 
                className="
                    justify-between p-1
                    md:p-2 md:flex 
                    lg:p-3
                "
            >
                <Link 
                    href={"/post/"+report.postId} 
                    className="
                        text-slate-700/90 text-[0.6rem]
                        md:text-sm
                        lg:font-semibold lg:text-base
                    "
                >
                    {
                        report.subjectType === "POST" ? (
                            <p>El usurio <span className="text-blue-600">{userName}</span> reportó el post <span className="text-blue-600">{formatedPostTitle}</span></p>
                        ) : (
                            <p>El usurio <span className="text-blue-600">{userName}</span> reportó el comentario <span className="text-blue-600">{report.commentId}</span>.</p>
                        )
                    }
                </Link>
                <div 
                    className="
                        flex justify-end space-x-1
                        md:space-x-2
                        lg:space-x-4
                    "
                >
                    {
                        reportBody ? (
                            <button onClick={handleReportDetails}>
                                <ReportDownIcon
                                    className="
                                        w-4 h-4
                                        md:w-6 md:h-6
                                        lg:w-8 lg:h-8
                                    "
                                    line="grey"
                                />
                            </button>
                        ) : (
                            <button onClick={handleReportDetails}>
                                <ReportUpIcon
                                    className="
                                        w-4 h-4
                                        md:w-6 md:h-6
                                        lg:w-8 lg:h-8
                                    "
                                    line="grey"
                                />
                            </button>
                        )
                    }
                    <button onClick={handleDeleteReport}>
                        <DeleteIcon
                            className="
                                w-4 h-4
                                md:w-6 md:h-6
                                lg:w-8 lg:h-8
                            "
                        />
                    </button>
                </div>
            </div>
            {
                reportBody && (
                    <>
                        <p 
                            className="
                                p-5 text-slate-700/90 text-[0.6rem] mx-3 border-t border-slate-400
                                md:text-xs
                                lg:text-sm
                            "
                            style={{ overflowWrap: 'break-word', whiteSpace: 'normal' }}
                        >
                            {report.body}
                        </p>
                        <div className="flex justify-end p-3">
                            {
                                report.subjectType === "POST" ? (
                                    <button 
                                        className="
                                            btn btn-error text-white text-xs
                                            md:text-sm
                                            lg:text-base
                                        "
                                        onClick={handleDeletePost}
                                    >
                                        Borrar Post
                                    </button>
                                ) : (
                                    <button 
                                        className="
                                            btn btn-error text-white text-xs
                                            md:text-sm
                                            lg:text-base
                                        "
                                        onClick={handleDeleteComment}
                                    >
                                        Borrar Comentario
                                    </button>
                                )
                            }
                        </div>
                    </>
                )
            }
        </div>
    );
}