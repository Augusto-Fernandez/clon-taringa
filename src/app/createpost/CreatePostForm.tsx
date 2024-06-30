"use client"

import { useState } from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import dynamic from 'next/dynamic';

import UserButton from "@/components/UserButton";
import 'react-quill/dist/quill.snow.css';
import { toolbarOptions } from "./toolBarOptions";

interface CreatePostFormProps {
    authorId: string;
    handleCreatePost: (title: string, body: string, category: string, nsfw: boolean, authorId: string, link?: string) => Promise<void>;
}

type Input = {
    title: string;
    body: string;
    category: string;
    author: boolean;
    link?: string;
    nsfw: boolean;
}

export default function CreatePostForm ({authorId, handleCreatePost}:CreatePostFormProps){
    const [isChecked, setIsChecked] = useState(false);

    const { register, handleSubmit, formState: { errors }, control } = useForm<Input>();

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };
    const [category, setCategory] = useState('');

    const handleCategoriaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(event.target.value);
    };

    const createPost:SubmitHandler<Input> = async (data) => {
        if(isChecked === true){
            await handleCreatePost(data.title, data.body, data.category, data.nsfw, authorId);
        }else{
            await handleCreatePost(data.title, data.body, data.category, data.nsfw, authorId, data.link);
        };
    };

    const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
    
    return(
        <form onSubmit={handleSubmit(createPost)}>
            <div className="flex space-x-3">
                <div className="w-2/3 bg-white rounded-md border border-gray-400">
                    <input 
                        placeholder="Título (obligatorio)" 
                        className="input h-14 hover:no-animation focus:outline-none w-full border border-b-gray-300 rounded-b-none" 
                        {...register("title", {
                            required: {
                                value: true,
                                message: "Es necesario un titulo",
                            },
                            minLength: {
                                value: 3,
                                message: "El título debe tener al menos 3 caracteres",
                            },
                            maxLength: {
                                value: 20,
                                message: "El título no debe exceder los 20 caracteres",
                            },
                            validate: {
                                notEmpty: value => value.trim() !== "" || "El título no puede estar vacío",
                            }
                        })}
                    />
                    {errors.title && typeof errors.title.message === 'string' && (
                        <span className="p-3 text-red-500 text-sm font-bold">
                            {errors.title.message}
                        </span>
                    )}
                    <Controller
                        name="body"
                        control={control}
                        defaultValue=""
                        rules={{ 
                            required: {
                                value: true,
                                message: "Es necesario ingresar contenido al post",
                            },
                            validate: {
                                notEmpty: value => {
                                    const text = value.replace(/<\/?[^>]+(>|$)/g, "").trim();
                                    return text !== "" || "Es necesario ingresar contenido al post";
                                }
                            }
                        }}
                        render={({ field }) => (
                                <ReactQuill 
                                    modules={{toolbar:toolbarOptions}}
                                    className="min-h-96 h-auto bg-white"
                                    theme="snow" 
                                    value={field.value} 
                                    onChange={field.onChange} 
                                />
                            )
                        }
                    />
                    {errors.body && typeof errors.body.message === 'string' && (
                        <span className="p-3 text-red-500 text-sm font-bold">
                            {errors.body.message}
                        </span>
                    )}
                </div>
                <div className="w-1/3 bg-white rounded-md border border-gray-400">
                    <p className="border border-b-gray-300 h-14 p-4 text-slate-600 font-semibold">Completar post</p>
                    <div className="flex p-4 space-x-3">
                        <input 
                            type="checkbox"
                            className="checkbox"
                            checked={isChecked} 
                            {...register("author")}
                            onChange={handleCheckboxChange}
                        />
                        <label className="text-slate-600 text-sm">El post es de mi autoria</label> 
                    </div>
                    <label className="text-slate-600 pl-4 py-2 text-sm">Acreditar informacion de terceros utilizada.</label>
                    <input 
                        placeholder="http://" 
                        className="input h-8 hover:no-animation focus:outline-none w-72 border border-gray-300 ml-4 rounded"
                        disabled={isChecked}
                        {...register("link", {
                            required: !isChecked && {
                                value: true,
                                message: "Es necesario ingresar una URL",
                            },
                            pattern: {
                                value: /^http:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/,
                                message: "La URL debe comenzar con 'http://'",
                            }
                        })}
                    />
                    {!isChecked && errors.link && typeof errors.link.message === 'string' && (
                        <span className="p-5 text-red-500 text-sm font-bold">
                            {errors.link.message}
                        </span>
                    )}
                    <div className="flex p-4 space-x-8">
                        <p className="py-4 text-slate-600 text-sm">Categoria:</p>
                        <select
                            className="border border-gray-300 h-9 mt-2 bg-white rounded w-[11.8rem] text-gray-500 pl-4"
                            value={category}
                            {...register("category", {
                                required: {
                                    value: true,
                                    message: "Es necesario seleccionar una categoría",
                                },
                            })}
                            onChange={handleCategoriaChange} 
                        >
                            <option disabled value="" className="font-sans dropdown-content">Seleccionar</option>
                            <option value="Anime y Manga" className="font-sans dropdown-content">Anime y Manga</option>
                            <option value="Arte" className="font-sans dropdown-content">Arte</option>
                            <option value="Deportes" className="font-sans dropdown-content">Deportes</option>
                            <option value="Economia" className="font-sans dropdown-content">Economia</option>
                            <option value="Humor" className="font-sans dropdown-content">Humor</option>
                            <option value="Juegos" className="font-sans dropdown-content">Juegos</option>
                            <option value="Musica" className="font-sans dropdown-content">Musica</option>
                            <option value="Noticias" className="font-sans dropdown-content">Noticias</option>
                            <option value="Offtopic" className="font-sans dropdown-content">Offtopic</option>
                            <option value="Politica" className="font-sans dropdown-content">Politica</option>
                            <option value="Recetas y Cocina" className="font-sans dropdown-content">Recetas y Cocina</option>
                            <option value="Reseñas" className="font-sans dropdown-content">Reseñas</option>
                            <option value="Turismo" className="font-sans dropdown-content">Turismo</option>
                            <option value="TV, Cine y Series" className="font-sans dropdown-content">TV, Cine y Series</option>
                            <option value="Vehiculos" className="font-sans dropdown-content">Vehiculos</option>
                            <option value="Video" className="font-sans dropdown-content">Video</option>                   
                        </select>
                    </div>
                    {errors.category && typeof errors.category.message === 'string' && (
                        <span className="pl-4 text-red-500 text-sm font-bold">
                            {errors.category.message}
                        </span>
                    )}
                    <div className="flex pl-4 space-x-16">
                        <label className="text-slate-600 text-sm">NSFW</label> 
                        <input
                            type="checkbox" 
                            className="checkbox"
                            {...register("nsfw")}
                        />
                    </div>
                    <div className="p-4">
                        <UserButton content="Publicar" width="w-full"/>
                    </div>
                </div>
            </div>
        </form>
    );
}
