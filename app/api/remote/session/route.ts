import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { corsHeaders } from "@/lib/cors";
import { sessionCookieName } from "@/lib/session-cookie";

export async function OPTIONS(request: Request) {
  return new Response(null, { headers: corsHeaders(request) });
}

export async function GET(request: NextRequest) {
  const cors = corsHeaders(request);
  if (!process.env.AUTH_SECRET) {
    return Response.json({ user: null }, { headers: cors });
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    cookieName: sessionCookieName,
    secureCookie: process.env.NODE_ENV === "production",
  });

  if (!token?.sub) {
    return Response.json({ user: null }, { headers: cors });
  }

  return Response.json(
    {
      user: {
        id: token.sub,
        email: token.email as string | undefined,
        name: token.name as string | undefined,
      },
    },
    { headers: cors },
  );
}
