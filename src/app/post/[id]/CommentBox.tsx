"use client"

import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import UserButton from "@/components/UserButton";
import profilePicPlaceholder from "../../../../public/profilePicPlaceholder.png"
import { textInputSchema } from "@/app/lib/validations/textInputSchema";

interface CommentBoxProps{
    image: string | null;
    postId: string;
    userId: string;
    userName: string;
    postAuthorId: string
    handleComment: (postId: string, userId: string, userName: string, image: string | null, message: string, postAuthorId: string) => Promise<void>;
}

type Input = {
    body: string;
};

export default function CommentBox ({image, postId, userId, userName, handleComment, postAuthorId}:CommentBoxProps){
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<Input>({
        resolver: zodResolver(textInputSchema)
    });

    const createComment:SubmitHandler<Input> = async (data) => {
        await handleComment(postId, userId, userName, image, data.body, postAuthorId);
        setValue("body", "");
    };

    return(
        <>
            <form onSubmit={handleSubmit(createComment)} className="mx-72 my-8 rounded-3xl bg-white p-4 flex space-x-4 border">
                <Image
                    src={image || profilePicPlaceholder}
                    alt="Profile picture"
                    priority={true}
                    width={20}
                    height={20}
                    className="w-12 h-12 rounded-full mt-2"
                />
                <textarea 
                    className="w-full hover:no-animation focus:outline-none border border-t-gray-300 rounded-md min-h-16 h-auto"
                    placeholder="Agregar comentario"
                    {...register("body")}
                >
                </textarea>
                <UserButton content="Comentar" width="w-auto"/>
            </form>
            {errors.body && typeof errors.body.message === 'string' && (
                <span className="ml-96 text-red-500 text-sm font-bold">
                    {errors.body.message}
                </span>
            )}
        </>
    );
}
