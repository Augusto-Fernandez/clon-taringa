"use client";

import { useState } from "react";

export default function SelectCategoty (){
    const [categoria, setCategoria] = useState('');

    const handleCategoriaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCategoria(event.target.value);
    };

    return(
        <>
            <select 
                name="categoria"
                required
                value={categoria}
                onChange={handleCategoriaChange} 
                className="select select-bordered focus:outline-none w-auto"
            >
                <option disabled value="" className="font-sans">Seleccionar</option>
                <option value="Anime y Manga" className="font-sans">Anime y Manga</option>
                <option value="Arte" className="font-sans">Arte</option>
                <option value="Deportes" className="font-sans">Deportes</option>
                <option value="Economia" className="font-sans">Economia</option>
                <option value="Humor" className="font-sans">Humor</option>
                <option value="Juegos" className="font-sans">Juegos</option>
                <option value="Musica" className="font-sans">Musica</option>
                <option value="Noticias" className="font-sans">Noticias</option>
                <option value="Offtopic" className="font-sans">Offtopic</option>
                <option value="Politica" className="font-sans">Politica</option>
                <option value="Recetas y Cocina" className="font-sans">Recetas y Cocina</option>
                <option value="Reseñas" className="font-sans">Reseñas</option>
                <option value="Turismo" className="font-sans">Turismo</option>
                <option value="TV, Cine y Series" className="font-sans">TV, Cine y Series</option>
                <option value="Vehiculos" className="font-sans">Vehiculos</option>
                <option value="Video" className="font-sans">Video</option>                   
            </select>
        </>
    );
}
