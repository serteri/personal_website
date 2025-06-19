import { NextAuthOptions } from "next-auth";
export const authOptions: NextAuthOptions = {
    session: { strategy: "database" },
    callbacks: {
        async session({ session, user }) {
            if (session.user) session.user.isAdmin = user.isAdmin;
            return session;
        }
    }
};