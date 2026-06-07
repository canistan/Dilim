import { AuthOptions } from "next-auth";
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
        // Bu adımda normal şartlarda Payload CMS'ten e-posta/şifre kontrolü yapılır.
        // Şimdilik sadece e-postası dolu olanları geçiriyoruz. Gerçekte auth kontrolü yazılmalı.
        if (credentials?.email) {
          return { id: credentials.email, name: credentials.email.split('@')[0], email: credentials.email };
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
