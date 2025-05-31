import type { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

type AuthConfig = {
  providers: any[];
  callbacks: {
    jwt: (params: { token: any; user: any }) => Promise<any>;
    session: (params: { session: any; token: any }) => Promise<any>;
  };
  pages: {
    signIn: string;
  };
  session: {
    strategy: "jwt";
  };
};

export const authConfig: AuthConfig = {
  providers: [
    Credentials({

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {

        return {
          id: "user-1",
          name: "Demo User",
          email: "user@example.com",
          image: "" 
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
};

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
