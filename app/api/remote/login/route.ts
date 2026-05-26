import { corsHeaders } from "@/lib/cors";
import { verifyPassword } from "@/lib/auth-user";
import { buildSessionResponse } from "@/lib/session-response";

export async function OPTIONS(request: Request) {
  return new Response(null, { headers: corsHeaders(request) });
}

export async function POST(request: Request) {
  const cors = corsHeaders(request);
  const body = (await request.json()) as { email?: string; password?: string };

  if (!body.email || !body.password) {
    return Response.json({ error: "请输入邮箱和密码" }, { status: 400, headers: cors });
  }

  const user = await verifyPassword(body.email, body.password);
  if (!user) {
    return Response.json({ error: "邮箱或密码错误" }, { status: 401, headers: cors });
  }

  return buildSessionResponse(user, cors);
}
