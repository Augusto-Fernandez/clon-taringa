"use client"

import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";

import profilePicPlaceholder from "../../../../public/profilePicPlaceholder.png"
import { textInputSchema } from "@/app/lib/validations/textInputSchema";

interface CommentBoxProps{
    image: string | null;
    postId: string;
    userId: string;
    userName: string;
    postAuthorId: string
    handleComment: (postId: string, userId: string, userName: string, message: string, parentId: string) => Promise<void>;
}

type Input = {
    body: string;
};

export default function CommentBox ({image, postId, userId, userName, handleComment, postAuthorId}:CommentBoxProps){
    const [isLoading, setIsLoading] = useState(false);
    
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<Input>({
        resolver: zodResolver(textInputSchema)
    });

    const createComment:SubmitHandler<Input> = async (data) => {
        setIsLoading(true);
        await handleComment(postId, userId, userName, data.body, postAuthorId);
        setValue("body", "");
        setIsLoading(false);
    };

    return(
        <>
            <form 
                onSubmit={handleSubmit(createComment)} 
                className="
                    my-8 rounded-3xl bg-white p-4 flex space-x-4 border
                    md:mx-36
                    lg:mx-72
                "
            >
                <Image
                    src={image || profilePicPlaceholder}
                    alt="Profile picture"
                    priority={true}
                    width={20}
                    height={20}
                    className="w-12 h-12 rounded-full mt-2"
                />
                <textarea 
                    className="
                        w-full hover:no-animation focus:outline-none border border-t-gray-300 rounded-md min-h-16 h-auto text-xs
                        md:text-base
                    "
                    placeholder="Agregar comentario"
                    {...register("body")}
                >
                </textarea>
                {
                    isLoading ? (
                        <button 
                            disabled
                            className="
                                btn mt-2 w-20 bg-white border border-gray-300
                                md:w-28
                            "
                        >
                            <span className="bg-slate-700/50 loading loading-spinner loading-md m-auto block h-11"/>
                        </button>
                    ) : (
                        <button 
                            type="submit" 
                            className="
                                btn text-xs bg-green-500 border border-green-300/80 text-white hover:bg-green-600 mt-2
                                lg:text-base lg:font-semibold
                            "
                        >
                            Responder
                        </button>
                    )
                }
            </form>
            {errors.body && typeof errors.body.message === 'string' && (
                <span 
                    className="
                        ml-20 text-red-500 text-sm font-bold
                        md:ml-44
                        lg:ml-96
                    "
                >
                    {errors.body.message}
                </span>
            )}
        </>
    );
}
