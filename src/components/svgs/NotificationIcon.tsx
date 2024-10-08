interface IconProps {
    className: string
    line: string
}

export default function NotificationIcon({className, line}:IconProps) {
    return(
        <>
            <svg className={className} viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" fill="none" />
                <circle cx="12" cy="13" r="2" stroke={line} strokeLinejoin="round" />
                <path d="M12 7.5C7.69517 7.5 4.47617 11.0833 3.39473 12.4653C3.14595 12.7832 3.14595 13.2168 3.39473 13.5347C4.47617 14.9167 7.69517 18.5 12 18.5C16.3048 18.5 19.5238 14.9167 20.6053 13.5347C20.8541 13.2168 20.8541 12.7832 20.6053 12.4653C19.5238 11.0833 16.3048 7.5 12 7.5Z"
                    stroke={line}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </>
    );   
};