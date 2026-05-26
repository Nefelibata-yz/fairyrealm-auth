import { encode } from "next-auth/jwt";
import { cookieDomain, sessionCookieName } from "@fairyrealm/shared";

export async function buildSessionResponse(
  user: { id: string; email: string; name: string },
  cors: HeadersInit,
) {
  if (!process.env.AUTH_SECRET) {
    return Response.json(
      { error: "AUTH_SECRET 未配置" },
      { status: 500, headers: cors },
    );
  }

  const token = await encode({
    token: {
      sub: user.id,
      email: user.email,
      name: user.name,
    },
    secret: process.env.AUTH_SECRET,
    salt: sessionCookieName,
    maxAge: 30 * 24 * 60 * 60,
  });

  const headers = new Headers(cors);
  headers.append(
    "Set-Cookie",
    `${sessionCookieName}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }${cookieDomain ? `; Domain=${cookieDomain}` : ""}`,
  );

  return Response.json(
    { user: { id: user.id, email: user.email, name: user.name } },
    { headers },
  );
}
