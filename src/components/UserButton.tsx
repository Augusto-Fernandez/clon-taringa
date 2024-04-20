interface UserButtonProps {
    content: string;
    width: string;
}

export default function UserButton ({content, width}:UserButtonProps) {
    return (
        <button type="submit" className={`btn ${width} text-base font-semibold bg-green-500 border border-green-300/80 text-white hover:bg-green-600 mt-2`}>
            {content}
        </button>
    );  
};
