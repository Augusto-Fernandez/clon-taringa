import { prisma } from "@/app/lib/db/prisma";
import { getServerSession } from "next-auth";

import { authOptions } from "../api/auth/[...nextauth]/route";

import { handleCreatePost } from "./actions";
import CreatePostForm from "./CreatePostForm";

export const metadata = {
    title: "Create Post"
}

export default async function CreatePost (){
    const session = await getServerSession(authOptions);

    const userLogged = await prisma.user.findUnique({
        where:{
            userName: session?.user?.name as string
        }
    })

    if(!userLogged){
        return(
            <div>
                <p>Acceso no autorizado, por favor iniciar sesión</p>
            </div>
        );
    }
    
    return(
        <div className="min-h-screen bg-gray-100">
            <div 
                className="
                    mx-4 p-5  space-y-1
                    md:space-y-3
                    lg:space-y-5
                "
            >
                <h1 
                    className="
                        text-slate-600 font-semibold text-xl
                        md:text-2xl
                        lg:text-4xl
                    "
                >
                    Crear Post
                </h1>
                <CreatePostForm
                    authorId={userLogged.id}
                    handleCreatePost={handleCreatePost}
                />
            </div>
        </div>
    );
}