interface IconProps {
    className: string
    line: string
}

export default function ReportUpIcon({className, line}:IconProps) {
    return(
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" fill="none"/>
            <path d="M7 14.5L12 9.5L17 14.5" stroke={line} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );   
};
