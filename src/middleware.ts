export { default } from "next-auth/middleware";

export const config = { 
    matcher: [
        "/createpost/:path*", 
        "/saved/:path*", 
        "/chat/:path*", 
        "/messages/:path*", 
        "/notifications/:path*"
    ] 
}
