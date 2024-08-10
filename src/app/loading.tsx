export default function LoadingPage() {
    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 from-5% via-pink-200 via-30% to-emerald-100 to-95% ...">
            <span className="bg-slate-700/50 loading loading-dots loading-lg m-auto block"/>
        </div>
    );
}
