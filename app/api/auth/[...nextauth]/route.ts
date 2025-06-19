import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import {authOptions} from "@/lib/auth";

const prisma = new PrismaClient();
const handler = NextAuth({
    ...authOptions,
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Verify credentials against DB
                const user = await prisma.user.findUnique({ where: { email: credentials?.email }});
                if (user && user.password === credentials?.password) {
                    return { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin };
                }
                return null;
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!
        })
    ],
    callbacks: {
        async session({ session, user }) {
            // Include isAdmin flag in session
            if (user && session.user) {
                session.user.isAdmin = user.isAdmin;
            }
            return session;
        }
    }
});

export { handler as GET, handler as POST };