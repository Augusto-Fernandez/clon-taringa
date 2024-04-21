interface IconProps {
    className: string
}

export default function Upvote({className}:IconProps) {
    return(
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" fill="rgb(16, 185, 129)"/>
            <path d="M12 18L12 6M12 6L7 11M12 6L17 11" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );   
};