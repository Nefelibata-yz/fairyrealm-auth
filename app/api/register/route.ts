import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
    name?: string;
  };

  const email = body.email?.trim().toLowerCase();
  const password = body.password;
  const name = body.name?.trim() || email;

  if (!email || !password || password.length < 8) {
    return NextResponse.json(
      { error: "需要有效邮箱与至少 8 位密码" },
      { status: 400 },
    );
  }

  const { env } = await getCloudflareContext({ async: true });
  const existing = await env.DB.prepare(
    "SELECT id FROM users WHERE email = ?",
  )
    .bind(email)
    .first();

  if (existing) {
    return NextResponse.json({ error: "该邮箱已注册" }, { status: 409 });
  }

  const id = crypto.randomUUID();
  const passwordHash = await hash(password, 12);

  await env.DB.prepare(
    "INSERT INTO users (id, email, name, password_hash) VALUES (?, ?, ?, ?)",
  )
    .bind(id, email, name, passwordHash)
    .run();

  return NextResponse.json({ ok: true });
}
