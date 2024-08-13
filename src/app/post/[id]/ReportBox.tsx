"use client"

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

import FlagIcon from "@/components/svgs/FlagIcon";
import SubmitButton from "@/components/SubmitButton";
import CloseIcon from "@/components/svgs/CloseIcon";
import { reportInputSchema } from "@/app/lib/validations/reportInputSchema";

interface ReportBoxProps {
    postId: string
    userId: string
    isReported: boolean;
    reportPost: (postId: string, userId: string, body: string) => Promise<void>;
    deleteReport: (postId: string, userId: string, subjectType:"POST" | "COMMENT") => Promise<void>;
}

type Input = {
    reportBody: string
};

export default function ReportBox({postId, userId, isReported, reportPost, deleteReport}:ReportBoxProps){
    const [reported, setReported] = useState(isReported);
    const [modal, setModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setReported(isReported);
    }, [isReported]);

    const handleModal = async () => {
        if(isReported){
            await deleteReport(postId, userId, "POST");
        }else{
            setModal(!modal);
        }
    };

    const { register, handleSubmit, formState: { errors } } = useForm<Input>({
        resolver: zodResolver(reportInputSchema)
    });

    const handleReportForm:SubmitHandler<Input> = async (data) => {
        setIsLoading(true);
        await reportPost(postId, userId, data.reportBody);
        setIsLoading(false);
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
                                <label 
                                    className="
                                        text-slate-600 font-semibold text-xl
                                        md:text-2xl
                                        lg:text-4xl
                                    "
                                >
                                    Motivo de denuncia
                                </label>
                                <button onClick={handleModal}>
                                    <CloseIcon
                                        className="w-10 h-10"
                                        line="rgb(239, 68, 68)"
                                    />
                                </button>
                            </div>
                            <textarea 
                                className="
                                    w-[24rem] min-h-[10rem] max-h-[10rem] border border-gray-300 rounded hover:no-animation focus:outline-none
                                    md:w-[27rem] md:min-h-[15rem] md:max-h-[15rem] 
                                    lg:w-[40rem] lg:min-h-[20rem] lg:max-h-[20rem]
                                "
                                {...register("reportBody")}
                            >
                            </textarea>
                            {errors.reportBody && typeof errors.reportBody.message === 'string' && (
                                <span className="text-red-500 text-xs font-bold">
                                    {errors.reportBody.message}
                                </span>
                            )}
                            <div className="flex justify-end w-full">
                                {
                                    isLoading ? (
                                        <button 
                                            disabled
                                            className="btn mt-2 w-24 bg-white border border-gray-300"
                                        >
                                            <span className="bg-slate-700/50 loading loading-spinner loading-md m-auto block h-11"/>
                                        </button>
                                    ) : (
                                        <SubmitButton
                                            content="Denunciar"
                                            width="w-24"
                                        />
                                    )
                                }
                            </div>
                        </form>
                    </div>
                )
            }
        </>
    );
};
