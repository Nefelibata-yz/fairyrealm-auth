"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "https://hub.fairyrealm.xyz";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: String(form.get("email")),
      password: String(form.get("password")),
      redirect: false,
      callbackUrl,
    });
    setLoading(false);
    if (result?.error) {
      setError("邮箱或密码错误");
      return;
    }
    window.location.href = callbackUrl;
  }

  return (
    <>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
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
          placeholder="密码"
          className="w-full rounded-lg border border-violet-900/50 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none focus:border-violet-500"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-violet-600 py-3 font-medium text-white hover:bg-violet-500 disabled:opacity-60"
        >
          {loading ? "登录中…" : "登录"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-zinc-500">
        还没有账号？{" "}
        <Link href="/register" className="text-violet-400 hover:underline">
          注册
        </Link>
      </p>
    </>
  );
}
