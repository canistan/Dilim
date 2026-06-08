import { AuthOptions } from "next-auth";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-Posta", type: "email" },
        password: { label: "Şifre", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          const payload = await getPayload({ config: configPromise });
          
          const isEmail = credentials.email.includes('@');
          let loginEmail = credentials.email;

          if (!isEmail) {
            const users = await payload.find({
              collection: 'customers' as any,
              where: {
                phone: {
                  equals: credentials.email,
                },
              },
            });
            if (users.docs.length > 0) {
              loginEmail = users.docs[0].email;
            } else {
              return null; // Telefon bulunamadı
            }
          }

          const result = await payload.login({
            collection: 'customers' as any,
            data: {
              email: loginEmail,
              password: credentials.password,
            },
          });

          if (result.user) {
            return {
              id: result.user.id,
              name: result.user.name,
              email: result.user.email,
            };
          }
        } catch (error) {
          // Giriş başarısız (Yanlış şifre vb.)
          return null;
        }
        
        return null;
      }
    })
  ],
  pages: {
    signIn: '/giris',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        const url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        await fetch(`${url}/api/sync-customer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            provider: account?.provider,
            providerAccountId: account?.providerAccountId
          })
        });
      } catch (e) {
        console.error("Müşteri senkronizasyon hatası:", e);
      }
      return true;
    },
    async session({ session, token }) {
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "dilim_secret_key_123_test_only",
};
