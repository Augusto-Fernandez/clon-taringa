"use client"

export default function RegisterPage() {
    return (
        <div className="min-h-screen max-h-screen flex justify-center items-center bg-gray-100">
            <form className="w-1/4 bg-white p-10 rounded-md border border-gray-400">
                <h1 className="text-slate-600 font-bold text-4xl mb-4">Crear Usuario</h1>
                <label htmlFor="username" className="text-slate-600 mb-2 block text-sm">
                    Nombre de usuario:
                </label>
                <input
                    type="text"
                    className="input p-3 rounded block mb-2 w-full border border-gray-300 hover:no-animation focus:outline-non"
                    placeholder="Nombre de Usuario"
                />
                <label htmlFor="email" className="text-slate-600 mb-2 block text-sm">
                    Email:
                </label>
                <input
                    type="email"
                    className="input p-3 rounded block mb-2 w-full border border-gray-300 hover:no-animation focus:outline-non"
                    placeholder="Email"
                />
                <label htmlFor="password" className="text-slate-600 mb-2 block text-sm">
                    Contraseña:
                </label>
                <input
                    className="input p-3 rounded block mb-2 w-full border border-gray-300 hover:no-animation focus:outline-non"
                    placeholder="********"
                />
                <label
                    htmlFor="confirmPassword"
                    className="text-slate-600 mb-2 block text-sm"
                >
                    Confirmar Contraseña:
                </label>
                <input
                    type="password"
                    className="input p-3 rounded block mb-2 w-full border border-gray-300 hover:no-animation focus:outline-non"
                    placeholder="********"
                />
                <button className="btn w-full text-base font-semibold bg-green-500 border border-green-300/80 text-white hover:bg-green-600 mt-2">
                    Registrar
                </button>
            </form>
        </div>
    );
}
