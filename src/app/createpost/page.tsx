import { redirect } from "next/navigation";
import { prisma } from "../lib/db/prisma";
import { getServerSession } from "next-auth";

import { authOptions } from "../api/auth/[...nextauth]/route";

import PostAuthorship from "./PostAuthorship";
import SelectCategoty from "@/components/SelectCategory";
import UserButton from "@/components/UserButton";

export const metadata = {
    title: "Create Post"
}

async function createPost(formData:FormData) {
    "use server";

    const session = await getServerSession(authOptions);
    const userFound = await prisma.user.findUnique({
        where: {
            userName: session?.user?.name as string
        }
    }) 

    const title = formData.get("tituloPost")?.toString();
    const body = formData.get("cuerpoPost")?.toString();
    const category = formData.get("categoria")?.toString();
    const link = formData.get("link")?.toString();

    let nsfw = false;

    if(formData.get("nsfw")==="on"){
        nsfw = true;
    }

    if(!title || !body || !category){
        throw Error("Missing Required Fields");
    }

    await prisma.post.create({
        data: {title, body, category, link, nsfw, author: {connect: {id: userFound?.id}}}
    });

    redirect("/");
}

export default async function CreatePost (){
    return(
        <div className="min-h-screen bg-gray-100">
            <div className="mx-60 p-5 space-y-5">
                <h1 className="text-slate-600 font-semibold text-4xl">Crear Post</h1>
                <form action={createPost}>
                    <div className="flex space-x-3">
                        <div className="w-2/3 bg-white rounded-md border border-gray-400">
                            <input 
                                name="tituloPost"
                                required 
                                type="text" 
                                placeholder="Título (obligatorio)" 
                                className="input h-14 hover:no-animation focus:outline-none w-full border border-b-gray-300 rounded-b-none" 
                            />
                            <div className="bg-gray-100 pl-4">
                                <div className="flex h-14 p-4 space-x-10">
                                    <p className=" text-sm border-l border-gray-200 pl-8">Imagen</p>
                                    <p className=" text-sm border-l border-gray-200 pl-8">Video</p>
                                    <p className=" text-sm border-l border-gray-200 pl-8">Link</p>
                                </div>
                            </div>
                            <textarea 
                                name="cuerpoPost"
                                required 
                                className="textarea resize-none w-full min-h-96 max-h-96 hover:no-animation focus:outline-none border border-t-gray-300 rounded-t-none h-14" 
                                placeholder="Contenido del post (obligatorio)">
                            </textarea>
                        </div>
                        <div className="w-1/3 bg-white rounded-md border border-gray-400">
                            <p className="border border-b-gray-300 h-14 p-4 text-slate-600 font-semibold">Completar post</p>
                            <PostAuthorship/>
                            <div className="flex p-4 space-x-8">
                                <p className="py-4 text-slate-600 text-sm">Categoria:</p>
                                <SelectCategoty/>
                            </div>
                            <div className="flex pl-4 space-x-16">
                                <label className="text-slate-600 text-sm">NSFW</label> 
                                <input
                                    name="nsfw"
                                    type="checkbox" 
                                    className="checkbox" 
                                />
                            </div>
                            <div className="p-4">
                                <UserButton content="Publicar" width="w-full"/>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}