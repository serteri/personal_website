import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";

// ÖNEMLİ: Yeni bir prisma client oluşturmak yerine, singleton client'ımızı import ediyoruz.
import prisma from "@/lib/prisma";

const authOptions: AuthOptions = {
    // PrismaAdapter'ı singleton client'ımızla kullanıyoruz
    adapter: PrismaAdapter(prisma),

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Lütfen e-posta ve şifrenizi girin.");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.hashedPassword) {
                    // Kullanıcı bulunamadı veya bu kullanıcının şifresi yok (örn: Google ile kayıt olmuş)
                    throw new Error("Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı.");
                }

                // GÜVENLİ YÖNTEM: Gelen şifre ile veritabanındaki hash'lenmiş şifreyi karşılaştır
                const isPasswordCorrect = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword
                );

                if (!isPasswordCorrect) {
                    throw new Error("Hatalı şifre.");
                }

                // Şifre doğruysa, kullanıcı objesini döndür.
                // Geri dönen objeye şifreyi dahil etme!
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    isAdmin: user.isAdmin,
                };
            },
        }),
    ],

    // Session ve JWT'ye özel alanları eklemek için callbacks
    callbacks: {
        async jwt({ token, user }) {
            // İlk giriş anında (user objesi varken), veriyi token'a ekle
            if (user) {
                token.id = user.id;
                token.isAdmin = user.isAdmin;
            }
            return token;
        },
        async session({ session, token }) {
            // Token'daki veriyi client-side'da erişilecek session objesine aktar
            if (token && session.user) {
                session.user.id = token.id;
                session.user.isAdmin = token.isAdmin;
            }
            return session;
        },
    },

    // JWT session stratejisini kullanıyoruz
    session: {
        strategy: "jwt",
    },

    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };