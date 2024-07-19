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
        <div className="min-h-14 h-auto rounded-lg bg-slate-300 mb-2 ">
            <div className="flex justify-between p-3">
                <Link href={"/post/"+report.postId} className="text-slate-600 font-semibold">
                    {
                        report.subjectType === "POST" ? (
                            <p>El usurio <span className="text-blue-600">{userName}</span> reportó el post <span className="text-blue-600">{formatedPostTitle}</span></p>
                        ) : (
                            <p>El usurio <span className="text-blue-600">{userName}</span> reportó el comentario <span className="text-blue-600">{report.commentId}</span>.</p>
                        )
                    }
                </Link>
                <div className="flex space-x-4">
                    {
                        reportBody ? (
                            <button onClick={handleReportDetails}>
                                <ReportDownIcon
                                    className="w-8 h-8"
                                    line="black"
                                />
                            </button>
                        ) : (
                            <button onClick={handleReportDetails}>
                                <ReportUpIcon
                                    className="w-8 h-8"
                                    line="black"
                                />
                            </button>
                        )
                    }
                    <button onClick={handleDeleteReport}>
                        <DeleteIcon/>
                    </button>
                </div>
            </div>
            {
                reportBody && (
                    <>
                        <p 
                            className="p-5 text-slate-700 text-sm mx-3 border-t border-slate-400"
                            style={{ overflowWrap: 'break-word', whiteSpace: 'normal' }}
                        >
                            {report.body}
                        </p>
                        <div className="flex justify-end p-3">
                            {
                                report.subjectType === "POST" ? (
                                    <button 
                                        className="btn btn-error text-white"
                                        onClick={handleDeletePost}
                                    >
                                        Borrar Post
                                    </button>
                                ) : (
                                    <button 
                                        className="btn btn-error text-white"
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