import { corsHeaders } from "@/lib/cors";
import { registerUser } from "@/lib/auth-user";
import { buildSessionResponse } from "@/lib/session-response";

export async function OPTIONS(request: Request) {
  return new Response(null, { headers: corsHeaders(request) });
}

export async function POST(request: Request) {
  const cors = corsHeaders(request);
  const body = (await request.json()) as {
    email?: string;
    password?: string;
    name?: string;
  };

  const email = body.email?.trim();
  const password = body.password;
  const name = body.name?.trim();

  if (!email || !password || password.length < 8) {
    return Response.json(
      { error: "需要有效邮箱与至少 8 位密码" },
      { status: 400, headers: cors },
    );
  }

  const result = await registerUser(email, password, name);
  if ("error" in result) {
    return Response.json({ error: result.error }, { status: 409, headers: cors });
  }

  return buildSessionResponse(result.user, cors);
}
