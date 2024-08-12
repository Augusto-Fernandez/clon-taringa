"use client"

import { useState } from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import dynamic from 'next/dynamic';
import { v4 as uuidv4 } from "uuid";

import UserButton from "@/components/UserButton";
import 'react-quill/dist/quill.snow.css';
import { storage } from "../services/firebase/firebaseConfig";
import { getDownloadURL, ref, uploadBytes, deleteObject, StorageReference } from "firebase/storage";

interface CreatePostFormProps {
    authorId: string;
    handleCreatePost: (
        title: string, 
        body: string, 
        category: string, 
        nsfw: boolean, 
        authorId: string, 
        banner?:string , 
        link?: string, 
        storageRef?: string
    ) => Promise<void>;
}

type Input = {
    title: string;
    body: string;
    category: string;
    nsfw: boolean;
    author: boolean;
    banner?: string;
    link?: string;
    storageRef?: string;
}

export default function CreatePostForm ({authorId, handleCreatePost}:CreatePostFormProps){
    const [isChecked, setIsChecked] = useState(false);
    const [bannerUpload, setBannerUpload] = useState<File | null>(null);
    const [storegeReference, setStoreReference] = useState(`post-${uuidv4()}`);
    const [isLoading, setIsLoading] = useState(false);

    type firebaseObject = {
        imgSrc: string,
        fileRef: StorageReference
    };

    const [imageLinkArray, setImageLinkArray] = useState<firebaseObject[] | null>(null);

    const { register, handleSubmit, formState: { errors }, control } = useForm<Input>();

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };
    const [category, setCategory] = useState('');

    const handleCategoriaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(event.target.value);
    };

    const uploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        if (file && !["image/jpeg", "image/jpg"].includes(file.type)) {
            alert("Solo se permiten imágenes de tipo JPG o JPEG");
            setBannerUpload(null);
        } else {
            setBannerUpload(file);
        }
    };

    const createPost:SubmitHandler<Input> = async (data) => {
        setIsLoading(true);
        //Esta sección borra de Firebase las imagenes que no se utilizan en el HTML
        //Verifica si se utilizaron imagenes en el post
        if(imageLinkArray){
            //Array que guarda los src de las imagenes en data.body
            const foundSrcImg:string[] = [];
            //Array que va a guardar la referencia de archivo de las imagenes no utilizadas
            const unusedImages:StorageReference[] = [];

            //Regex que va a buscar el contenido de src de las etiquetas img
            const imgTagRegex = /<img[^>]+src="([^">]+)"/g;
            let match: RegExpExecArray | null;

            //Busca en data.body los src de las img y las pushea al array
            while ((match = imgTagRegex.exec(data.body)) !== null) {
                foundSrcImg.push(match[1].replace(/&amp;/g, '&'));
            };

            //Busca en cada imagen que se haya cargado en el post
            //Si no están el los src de data.body, las pushea al array de imagenes no utilizadas
            for(let src of imageLinkArray){
                if(!foundSrcImg.includes(src.imgSrc)){
                    unusedImages.push(src.fileRef);
                }
            }

            //Borra una por una las imagenes cargadas no fueron utilizadas en data.body
            unusedImages?.forEach(async (src) => {
                await deleteObject(src);
            });
        };

        if (bannerUpload === null){
            await handleCreatePost(data.title, data.body, data.category, data.nsfw, authorId, undefined, data.link, storegeReference);
            setBannerUpload(null);
            setIsLoading(false);
            return;
        };

        //hace referencia a la colección y el nombre del archivo donde se va a cargar
        const imageRef = ref(storage, `post-banner/${uuidv4()}`);

        //hace una instancia de FileReader para leer el contenido cargado
        const reader = new FileReader();

        //define la función que se ejecutará cuando la lectura del archivo sea exitosa
        reader.onload = async (e) => {
            //obtiene el resultado de la lectura del archivo y lo asigna a la variable result.
            const result = e.target?.result as string;
            if (!result) {
                await handleCreatePost(data.title, data.body, data.category, data.nsfw, authorId, undefined, data.link, storegeReference);
                alert("Ocurrió un error al leer la imagen");
                setBannerUpload(null);
                setIsLoading(false);
                return;
            }

            //crea una nueva instancia de Image y asigna el resultado de la lectura del archivo
            const img = new window.Image();
            img.src = result;

            //define la función que se ejecutará cuando la imagen se haya cargado
            img.onload = async () => {
                //crea el elemento canvas.
                const canvas = document.createElement('canvas');
                //toma el contexto 2d del canvas
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    await handleCreatePost(data.title, data.body, data.category, data.nsfw, authorId, undefined, data.link, storegeReference);
                    alert("Ocurrió un error al leer la imagen");
                    setBannerUpload(null);
                    setIsLoading(false);
                    return;
                }

                //establece las dimensiones del canvas a 360x360 píxeles
                canvas.width = 960;
                canvas.height = 130;

                //calcula la relación de aspecto de la imagen
                // aspectRatio > 1, es mas ancha
                // aspectRatio < 1, es mas alta
                // aspectRatio = 1, es mas cuadrada
                const aspectRatio = img.width / img.height;
                //srcX y srcY representan las coordenadas del punto superior izquierdo
                //srcWidht y srcHeight representan las dimensiones de la imagen original
                let srcX, srcY, srcWidth, srcHeight;

                if (aspectRatio > 1) {// en el caso de que sea mas ancha
                    srcHeight = img.height;
                    srcWidth = img.height;
                    srcX = (img.width - srcWidth) / 2;//centra el recorte horizontalmente 
                    srcY = 0; //el recorte comienza desde el borde superior
                } else { // en caso de que sea mas alta o cuadrada 
                    srcWidth = img.width;
                    srcHeight = img.width;
                    srcX = 0;//el recorte comienza desde el borde izquierdo
                    srcY = (img.height - srcHeight) / 2; //centra el recorte verticalmente
                }

                //dibuja la imagen en el canvas, recortándola al centro con las dimensiones especificadas
                ctx.drawImage(img, srcX, srcY, srcWidth, srcHeight, 0, 0, 960, 130);

                //convierte el contenido del canvas a un Blob en formato JPEG.
                canvas.toBlob(async (blob) => {
                    if (!blob) {
                        await handleCreatePost(data.title, data.body, data.category, data.nsfw, authorId, undefined, data.link, storegeReference);
                        alert("Ocurrió un error al leer la imagen");
                        setBannerUpload(null);
                        setIsLoading(false);
                        return;
                    }

                    //Hace el upload a Firebase
                    try {
                        await uploadBytes(imageRef, blob);
                    } catch (e) {
                        setBannerUpload(null);
                        setIsLoading(false);
                        alert("Ocurrió un error al subir imagen");
                        return console.log(e);
                    }

                    //consige el URL de la imagen y se la pasa al servidor para que actualice el campo image de user
                    const imgUrl = await getDownloadURL(imageRef);
                    await handleCreatePost(data.title, data.body, data.category, data.nsfw, authorId, imgUrl, data.link, storegeReference);

                    setBannerUpload(null);
                    setIsLoading(false);
                }, 'image/jpeg'); //define que se tiene que codificar como un JPEG
            };
        };
        //esto ejecuta toda la función que se declaró en reader.onload()
        reader.readAsDataURL(bannerUpload);
    };

    const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

    const handleQuillmageUpload = function (this: any) {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
    
        input.onchange = async () => {
            if (input.files) {
                const file = input.files[0];

                if (file && !["image/jpeg", "image/jpg"].includes(file.type)) {
                    alert("Solo se permiten imágenes de tipo JPG o JPEG");
                    return;
                };

                const storageRef = ref(storage, `post-images/${storegeReference}/${uuidv4()}`);
    
                try {
                    await uploadBytes(storageRef, file);
                    const url = await getDownloadURL(storageRef);
                    setImageLinkArray(
                        prevArray => (prevArray ? 
                                [...prevArray, {imgSrc: url, fileRef: storageRef }] 
                            : 
                                [{imgSrc: url, fileRef: storageRef }]
                        )
                    )
                    const quill = this.quill
                    const range = quill.getSelection();
                    if (range) {
                        quill.insertEmbed(range.index, 'image', url);
                    } else {
                        quill.insertEmbed(quill.getLength(), 'image', url);
                    }
                } catch (error) {
                    console.error('Error uploading image: ', error);
                }
            }
        };
    };

    const toolbarOptions = {
        container: [
            ['bold', 'italic', 'underline', 'strike'],
            ['link', 'image'],
            [{ 'list': 'ordered' }],
            [{ 'size': ['small', false, 'large'] }],
            [{ 'color': [] }],
            [{ 'align': [] }],
        ],
        handlers: {
            image: handleQuillmageUpload
        }
    };
    
    return(
        <form onSubmit={handleSubmit(createPost)}>
            <div 
                className="
                    space-y-4
                    md:flex md:space-x-3 md:space-y-0
                "
            >
                <div 
                    className="
                        bg-white rounded-md border border-gray-400
                        md:w-2/3
                    "
                >
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
                <div 
                    className="
                        bg-white rounded-md border border-gray-400
                        md:w-1/3
                    "
                >
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
                    <label 
                    className="
                        text-slate-600 pl-4 py-2
                        md:text-[0.65rem]
                        lg:text-sm
                    "
                    >
                        Acreditar informacion de terceros utilizada.
                    </label>
                    <input 
                        placeholder="http://" 
                        className="
                            input h-8 hover:no-animation focus:outline-none border border-gray-300 ml-4 rounded
                            md:w-52
                            lg:w-72
                        "
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
                    <div 
                        className="
                            flex p-4 space-x-2
                            md:space-x-4
                            lg:space-x-8
                        "
                    >
                        <p 
                            className="
                                py-4 text-slate-600 text-xs
                                lg:text-sm
                            "
                        >
                            Categoria:
                        </p>
                        <select
                            className="
                                border border-gray-300 h-9 mt-2 bg-white rounded text-gray-500 pl-4
                                md:w-[8.2rem]
                                lg:w-[11.8rem]
                            "
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
                    <div className="p-4 space-y-2">
                        <label className="text-slate-600 text-sm">Agregar Portada (Opcional)</label>
                        <input 
                            onChange={uploadImage} 
                            type="file" 
                            className="file-input file-input-bordered w-full h-8"
                        />
                    </div>
                    <div className="p-4">
                        {
                            isLoading ? (
                                <button 
                                    disabled
                                    className="mt-2 w-full bg-white border border-gray-300"
                                >
                                    <span className="bg-slate-700/50 loading loading-spinner loading-md m-auto block h-11"/>
                                </button>
                            ) : (
                                <UserButton content="Publicar" width="w-full"/>
                            )
                        }
                    </div>
                </div>
            </div>
        </form>
    );
}
