import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/app/lib/db/prisma";
import bcrypt from 'bcrypt'

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "User Name", type: "text", placeholder: "Nombdre de Usuario" },
                password: { label: "Password", type: "password", placeholder: "*****" },
            },
            async authorize(credentials, req) {
                const userFound = await prisma.user.findUnique({
                    where: {
                        userName: credentials?.username
                    }
                })

                if (!userFound) throw new Error('No user found')

                const matchPassword = await bcrypt.compare(credentials!.password, userFound.password)

                if (!matchPassword) throw new Error('Wrong password')

                return {
                    id: userFound.id,
                    name: userFound.userName,
                    email: userFound.email,
                }
            },
        }),
    ],
    pages: {
        signIn: "/auth/login",
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };