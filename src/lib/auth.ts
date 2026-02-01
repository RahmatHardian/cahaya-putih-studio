import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password diperlukan");
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Find admin user
        const admin = await prisma.admin.findUnique({
          where: { email, isActive: true },
        });

        if (!admin) {
          throw new Error("Email atau password salah");
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(
          password,
          admin.passwordHash
        );

        if (!isValidPassword) {
          throw new Error("Email atau password salah");
        }

        // Return user object
        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = request.nextUrl.pathname.startsWith("/admin");
      const isOnAuthPage = request.nextUrl.pathname.startsWith("/auth");

      if (isOnAdmin) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }

      if (isOnAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/admin", request.nextUrl));
      }

      return true;
    },
  },
});

// Type augmentation is in src/types/next-auth.d.ts
