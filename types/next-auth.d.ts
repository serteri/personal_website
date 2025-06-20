import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id: string; // user id'sini de eklemek iyi bir pratiktir
            isAdmin?: boolean;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        isAdmin?: boolean;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        isAdmin?: boolean;
    }
}
