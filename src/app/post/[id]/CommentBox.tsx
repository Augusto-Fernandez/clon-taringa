"use client"

import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
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
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<Input>({
        resolver: zodResolver(textInputSchema)
    });

    const createComment:SubmitHandler<Input> = async (data) => {
        await handleComment(postId, userId, userName, data.body, postAuthorId);
        setValue("body", "");
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
                <button 
                    type="submit" 
                    className="
                        btn text-xs bg-green-500 border border-green-300/80 text-white hover:bg-green-600 mt-2
                        lg:text-base lg:font-semibold
                    "
                >
                    Responder
                </button>
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
