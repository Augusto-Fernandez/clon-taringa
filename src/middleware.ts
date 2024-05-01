export { default } from "next-auth/middleware";

export const config = { matcher: ["/createpost/:path*", "/saved/:path*"] }
