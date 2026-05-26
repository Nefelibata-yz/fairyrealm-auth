import { compare, hash } from "bcryptjs";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export type DbUser = {
  id: string;
  email: string;
  name: string | null;
  password_hash: string;
};

export async function findUserByEmail(email: string) {
  const { env } = await getCloudflareContext({ async: true });
  return env.DB.prepare(
    "SELECT id, email, name, password_hash FROM users WHERE email = ?",
  )
    .bind(email.toLowerCase())
    .first<DbUser>();
}

export async function verifyPassword(email: string, password: string) {
  const row = await findUserByEmail(email);
  if (!row) return null;
  const valid = await compare(password, row.password_hash);
  if (!valid) return null;
  return {
    id: row.id,
    email: row.email,
    name: row.name ?? row.email,
  };
}

export async function registerUser(
  email: string,
  password: string,
  name?: string,
) {
  const existing = await findUserByEmail(email);
  if (existing) {
    return { error: "该邮箱已注册" as const };
  }
  const { env } = await getCloudflareContext({ async: true });
  const id = crypto.randomUUID();
  const passwordHash = await hash(password, 12);
  await env.DB.prepare(
    "INSERT INTO users (id, email, name, password_hash) VALUES (?, ?, ?, ?)",
  )
    .bind(id, email.toLowerCase(), name ?? email, passwordHash)
    .run();
  return {
    user: { id, email: email.toLowerCase(), name: name ?? email },
  };
}
