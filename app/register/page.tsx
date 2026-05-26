"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
        name: form.get("name"),
      }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error ?? "注册失败");
      setLoading(false);
      return;
    }
    await signIn("credentials", {
      email: String(form.get("email")),
      password: String(form.get("password")),
      callbackUrl: "https://hub.fairyrealm.xyz",
    });
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="text-2xl font-semibold text-violet-200">创建账号</h1>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <input
          name="name"
          type="text"
          placeholder="昵称（可选）"
          className="w-full rounded-lg border border-violet-900/50 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none focus:border-violet-500"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="邮箱"
          className="w-full rounded-lg border border-violet-900/50 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none focus:border-violet-500"
        />
        <input
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="密码（至少 8 位）"
          className="w-full rounded-lg border border-violet-900/50 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none focus:border-violet-500"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-violet-600 py-3 font-medium text-white hover:bg-violet-500 disabled:opacity-60"
        >
          {loading ? "注册中…" : "注册并登录"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-zinc-500">
        已有账号？{" "}
        <Link href="/login" className="text-violet-400 hover:underline">
          登录
        </Link>
      </p>
    </main>
  );
}
