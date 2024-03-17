export default function CreatePost (){
    return(
        <div className="min-h-screen bg-gray-100">
            <div className="mx-60 p-5 space-y-5">
                <h1 className="text-slate-600 font-semibold text-4xl">Crear Post</h1>
                <div className="flex space-x-3">
                    <div className="w-2/3 bg-white rounded-md border border-gray-400">
                        <input type="text" placeholder="Título (obligatorio)" className="input h-14 hover:no-animation focus:outline-none w-full border border-b-gray-300 rounded-b-none" />
                        <div className="bg-gray-100 pl-4">
                            <div className="flex h-14 p-4 space-x-10">
                                <p className=" text-sm border-l border-gray-200 pl-8">Imagen</p>
                                <p className=" text-sm border-l border-gray-200 pl-8">Video</p>
                                <p className=" text-sm border-l border-gray-200 pl-8">Link</p>
                            </div>
                        </div>
                        <textarea className="textarea w-full min-h-96 max-h-96 hover:no-animation focus:outline-none border border-t-gray-300 rounded-t-none h-14" placeholder="Contenido del post (obligatorio)"></textarea>
                    </div>
                    <div className="w-1/3 bg-white rounded-md border border-gray-400">
                        <p className="border border-b-gray-300 h-14 p-4 text-slate-600 font-semibold">Completar post</p>
                        <div className="flex p-4 space-x-3">
                            <input type="checkbox" defaultChecked className="checkbox" />
                            <p className="text-slate-600 text-sm">El post es de mi autoria</p> 
                        </div>
                        <p className="text-slate-600 pl-4 py-2 text-sm">Acreditar informacion de terceros utilizada.</p>
                        <input type="text" placeholder="http://" className="input h-8 hover:no-animation focus:outline-none w-72 border border-gray-300 ml-4 rounded" />
                        <div className="flex p-4 space-x-8">
                            <p className="py-4 text-slate-600 text-sm">Categoria:</p>
                            <div className="dropdown">
                                <div tabIndex={0} role="button" className="btn m-1">Seleccionar</div>
                                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-80 max-h-80">
                                    <li><a>Video</a></li>
                                    <li><a>Offtopic</a></li>
                                    <li><a>Recetas y Cocina</a></li>
                                    <li><a>Noticias</a></li>
                                    <li><a>Politica</a></li>
                                    <li><a>Juegos</a></li>
                                    <li><a>Anime y Manga</a></li>
                                    <li><a>Arte</a></li>
                                    <li><a>Economia</a></li>
                                    <li><a>Vehiculos</a></li>
                                    <li><a>Humor</a></li>
                                    <li><a>Musica</a></li>
                                    <li><a>TV, Cine y Series</a></li>
                                    <li><a>Deportes</a></li>
                                    <li><a>Turismo</a></li>
                                    <li><a>Reseñas</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex pl-4 space-x-16">
                            <p className="text-slate-600 text-sm">NSFW</p> 
                            <input type="checkbox" defaultChecked className="checkbox" />
                        </div>
                        <div className="p-4">
                            <button className="btn w-full text-base font-semibold bg-green-500 border border-green-300/80 text-white hover:bg-green-600">
                                Publicar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}