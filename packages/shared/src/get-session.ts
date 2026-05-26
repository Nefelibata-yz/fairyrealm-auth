import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { sessionCookieName } from "./session-cookie";

export type SessionUser = {
  id: string;
  email?: string;
  name?: string;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  if (!process.env.AUTH_SECRET) {
    return null;
  }

  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const token = await getToken({
    req: { headers: { cookie: cookieHeader } } as unknown as NextRequest,
    secret: process.env.AUTH_SECRET,
    cookieName: sessionCookieName,
    secureCookie: process.env.NODE_ENV === "production",
  });

  if (!token?.sub) return null;

  return {
    id: token.sub,
    email: token.email as string | undefined,
    name: token.name as string | undefined,
  };
}
