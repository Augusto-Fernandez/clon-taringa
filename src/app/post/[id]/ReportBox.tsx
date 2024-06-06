"use client"

import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import FlagIcon from "@/components/svgs/FlagIcon";
import UserButton from "@/components/UserButton";
import CloseIcon from "@/components/svgs/CloseIcon";

interface ReportBoxProps {
    postId: string
    userId: string
    isReported: boolean;
    reportPost: (postId: string, userId: string, body: string) => Promise<void>;
    deleteReport: (postId: string, userId: string) => Promise<void>;
}

type Input = {
    reportBody: string
};

export default function ReportBox({postId, userId, isReported, reportPost, deleteReport}:ReportBoxProps){
    const [reported, setReported] = useState(isReported);
    const [modal, setModal] = useState(false);

    useEffect(() => {
        setReported(isReported);
    }, [isReported]);

    const handleModal = async () => {
        if(isReported){
            await deleteReport(postId, userId);
        }else{
            setModal(!modal);
        }
    };

    const { register, handleSubmit, formState: { errors } } = useForm<Input>();

    const handleReportForm:SubmitHandler<Input> = async (data) => {
        await reportPost(postId, userId, data.reportBody);
        setModal(!modal);
    }
    
    return(
        <>
            <button onClick={handleModal}>
                {
                    reported ? (
                        <div className="bg-red-600 p-1 rounded mt-6">
                            <FlagIcon
                                className="w-7 h-7 bg-red-600"
                                line="white"
                            />
                        </div>
                    ) : (
                        <FlagIcon
                            className="w-7 h-7 mt-6"
                            line="red"
                        />
                    )
                }
            </button>
            {
                modal && (
                    <div className="fixed inset-0 z-10 flex items-center justify-center">
                        <form 
                            onSubmit={handleSubmit(handleReportForm)}
                            className="bg-white border-2 p-8 rounded-md border-slate-400 flex flex-col space-y-4"
                        >
                            <div className="flex justify-between">
                                <label className="text-slate-600 font-semibold text-4xl">Motivo de denuncia</label>
                                <button onClick={handleModal}>
                                    <CloseIcon
                                        className="w-10 h-10"
                                        line="rgb(239, 68, 68)"
                                    />
                                </button>
                            </div>
                            <textarea 
                                className="w-[40rem] min-h-[20rem] max-h-[20rem] border border-gray-300 rounded hover:no-animation focus:outline-none"
                                {...register("reportBody", {
                                    required: {
                                        value: true,
                                        message: "Es necesario un motivo de denuncia",
                                    },
                                })}
                            ></textarea>
                            {errors.reportBody && typeof errors.reportBody.message === 'string' && (
                                <span className="text-red-500 text-xs font-bold">
                                    {errors.reportBody.message}
                                </span>
                            )}
                            <div className="flex justify-end w-full">
                                <UserButton
                                    content="Denunciar"
                                    width="w-24"
                                />
                            </div>
                        </form>
                    </div>
                )
            }
        </>
    );
};
