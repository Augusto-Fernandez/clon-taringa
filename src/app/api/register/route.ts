import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import bcrypt from 'bcrypt';
import { prisma } from "@/app/lib/db/prisma";

export async function POST(request:NextRequest) {
    try {
        const data = await request.json();

        const userFound = await prisma.user.findUnique({
            where: {
                email: data.email,
            },
        });

        if (userFound) {
            return NextResponse.json(
                {
                    message: "Email already exists",
                },
                {
                    status: 400,
                }
            );
        }

        const usernameFound = await prisma.user.findUnique({
            where: {
                userName: data.username,
            },
        });

        if (usernameFound) {
            return NextResponse.json(
                {
                    message: "username already exists",
                },
                {
                    status: 400,
                }
            );
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const newUser = await prisma.user.create({
            data: {
                userName: data.username,
                email: data.email,
                password: hashedPassword,
                isAdmin: false
            },
        });

        const { password: _, ...user } = newUser;

        return NextResponse.json(user);
    } catch (error:any) {
        return NextResponse.json(
            {
                message: error instanceof Error ? error.message : String(error)
            },
            {
                status: 500,
            }
        );
    }
}
