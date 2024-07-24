interface IconProps {
    className: string
}

export default function AdminPanelIcon({className}:IconProps) {
    return(
        <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24"/>
            <circle cx="12" cy="12" r="9" stroke="white" strokeLinejoin="round" />
            <path d="M12 3C12 3 8.5 6 8.5 12C8.5 18 12 21 12 21" stroke="white" strokeLinejoin="round" />
            <path d="M12 3C12 3 15.5 6 15.5 12C15.5 18 12 21 12 21" stroke="white" strokeLinejoin="round" />
            <path d="M3 12H21" stroke="white" strokeLinejoin="round" />
            <path d="M19.5 7.5H4.5" stroke="white" strokeLinejoin="round" />
            <g filter="url(#filter0_d_15_556)">
                <path d="M19.5 16.5H4.5" stroke="white" strokeLinejoin="round"/>
            </g>
        </svg>
    );   
};