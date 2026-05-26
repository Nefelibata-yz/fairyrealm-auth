import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { compare } from "bcryptjs";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type DbUser = {
  id: string;
  email: string;
  name: string | null;
  password_hash: string;
};

const cookieDomain =
  process.env.AUTH_COOKIE_DOMAIN ?? ".fairyrealm.xyz";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const { env } = await getCloudflareContext({ async: true });
        const row = await env.DB.prepare(
          "SELECT id, email, name, password_hash FROM users WHERE email = ?",
        )
          .bind(String(credentials.email).toLowerCase())
          .first<DbUser>();

        if (!row) {
          return null;
        }

        const valid = await compare(
          String(credentials.password),
          row.password_hash,
        );
        if (!valid) {
          return null;
        }

        return {
          id: row.id,
          email: row.email,
          name: row.name ?? row.email,
        };
      },
    }),
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
          }),
        ]
      : []),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.session-token"
          : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain: cookieDomain,
      },
    },
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  trustHost: true,
});
