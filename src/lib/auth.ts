import { AuthOptions } from "next-auth";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import crypto from 'crypto';

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
        const payload = await getPayload({ config: configPromise });
        const email = user.email;
        const fullName = user.name || '';
        const nameParts = fullName.trim().split(' ');
        const surname = nameParts.length > 1 ? nameParts.pop() : '';
        const firstName = nameParts.join(' ') || email?.split('@')[0] || '';
        const provider = account?.provider;
        const providerAccountId = account?.providerAccountId;

        if (email) {
          const existingCustomers = await payload.find({
            collection: 'customers' as any,
            where: { email: { equals: email } },
            overrideAccess: true,
          });

          if (existingCustomers.docs.length === 0) {
            const randomPassword = crypto.randomBytes(32).toString('hex');
            await payload.create({
              collection: 'customers' as any,
              data: {
                name: firstName,
                surname: surname,
                email: email,
                password: randomPassword,
                provider: provider || 'credentials',
                providerAccountId: providerAccountId || '',
              },
              overrideAccess: true,
            });
          } else if (provider !== 'credentials') {
            const existingUser = existingCustomers.docs[0];
            
            // Eğer daha önceden bu sağlayıcıyla giriş yapmış ve hesap bağlanmışsa sorun yok
            if (existingUser.provider === provider && existingUser.providerAccountId === providerAccountId) {
              // Zaten bağlı, devam et
            } else {
              // GÜVENLİK (Account Takeover): Sadece e-posta eşleşmesine bakarak mevcut 
              // hesaba otomatik bağlama YAPMIYORUZ. Eğer e-posta daha önce şifreyle 
              // veya başka bir yöntemle alınmışsa girişi reddet ve uyar.
              throw new Error("EmailAlreadyExists");
            }
          }
        }
      } catch (e) {
        console.error("Müşteri senkronizasyon hatası:", e);
      }
      return true;
    },
    async session({ session, token }) {
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};
