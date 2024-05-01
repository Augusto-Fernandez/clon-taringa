interface IconProps {
    className: string
}

export default function SearchButtonIcon({className}:IconProps) {
    return(
        <>
            <svg className={className} viewBox="0 0 24 24" fill="none">
                <rect fill="rgb(34, 197, 94)" />
                <circle cx="10.5" cy="10.5" r="6.5" stroke="rgb(255, 255, 255)" strokeLinejoin="round" />
                <path d="M19.6464 20.3536C19.8417 20.5488 20.1583 20.5488 20.3536 20.3536C20.5488 20.1583 20.5488 19.8417 20.3536 19.6464L19.6464 20.3536ZM20.3536 19.6464L15.3536 14.6464L14.6464 15.3536L19.6464 20.3536L20.3536 19.6464Z" 
                    fill="rgb(255, 255, 255)" 
                />
            </svg>
        </>
    );   
};