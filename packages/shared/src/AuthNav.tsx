"use client";

import { FormEvent, useEffect, useState } from "react";

export type SessionUser = {
  id: string;
  email?: string;
  name?: string;
};

type AuthNavProps = {
  authBaseUrl: string;
  initialUser: SessionUser | null;
};

export function AuthNav({ authBaseUrl, initialUser }: AuthNavProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"login" | "register">("login");
  const [user, setUser] = useState<SessionUser | null>(initialUser);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function refreshSession() {
    try {
      const res = await fetch(`${authBaseUrl}/api/remote/session`, {
        credentials: "include",
      });
      const data = (await res.json()) as { user: SessionUser | null };
      setUser(data.user);
    } catch {
      /* auth 未启动时忽略 */
    }
  }

  useEffect(() => {
    void refreshSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authBaseUrl]);

  async function onLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await fetch(`${authBaseUrl}/api/remote/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    const data = (await res.json()) as { error?: string; user?: SessionUser };
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "登录失败");
      return;
    }
    setUser(data.user ?? null);
    setOpen(false);
    window.location.reload();
  }

  async function onRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await fetch(`${authBaseUrl}/api/remote/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
        name: form.get("name"),
      }),
    });
    const data = (await res.json()) as { error?: string; user?: SessionUser };
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "注册失败");
      return;
    }
    setUser(data.user ?? null);
    setOpen(false);
    window.location.reload();
  }

  function onLogout() {
    const callback = encodeURIComponent(window.location.href);
    window.location.href = `${authBaseUrl}/api/auth/signout?callbackUrl=${callback}`;
  }

  return (
    <div className="fixed right-4 top-4 z-50">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-violet-500/40 bg-zinc-950/80 px-4 py-2 text-sm text-violet-100 shadow-lg shadow-violet-900/20 backdrop-blur-md transition hover:border-violet-400/70 hover:bg-vinc-950"
      >
        <span className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_8px_#a78bfa]" />
        {user ? (user.name ?? user.email ?? "已登录") : "账号"}
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default bg-black/20"
            aria-label="关闭"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-violet-800/50 bg-zinc-950/95 p-4 shadow-2xl shadow-violet-950/50 backdrop-blur-xl">
            {user ? (
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-wider text-violet-400">
                  已登录
                </p>
                <p className="text-sm text-zinc-200">
                  {user.name ?? user.email}
                </p>
                <p className="truncate text-xs text-zinc-500">{user.email}</p>
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full rounded-lg border border-zinc-700 py-2 text-sm text-zinc-300 hover:bg-zinc-900"
                >
                  退出登录
                </button>
                <p className="text-center text-[10px] text-zinc-600">
                  登录状态仅用于展示，不影响浏览
                </p>
              </div>
            ) : (
              <>
                <div className="mb-3 flex rounded-lg bg-zinc-900 p-1 text-xs">
                  <button
                    type="button"
                    className={`flex-1 rounded-md py-1.5 ${tab === "login" ? "bg-violet-600 text-white" : "text-zinc-400"}`}
                    onClick={() => setTab("login")}
                  >
                    登录
                  </button>
                  <button
                    type="button"
                    className={`flex-1 rounded-md py-1.5 ${tab === "register" ? "bg-violet-600 text-white" : "text-zinc-400"}`}
                    onClick={() => setTab("register")}
                  >
                    注册
                  </button>
                </div>
                {tab === "login" ? (
                  <form onSubmit={onLogin} className="space-y-3">
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="邮箱"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-violet-600"
                    />
                    <input
                      name="password"
                      type="password"
                      required
                      placeholder="密码"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-violet-600"
                    />
                    {error && (
                      <p className="text-xs text-red-400">{error}</p>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-lg bg-violet-600 py-2 text-sm text-white hover:bg-violet-500 disabled:opacity-60"
                    >
                      {loading ? "…" : "登录"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={onRegister} className="space-y-3">
                    <input
                      name="name"
                      type="text"
                      placeholder="昵称（可选）"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-violet-600"
                    />
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="邮箱"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-violet-600"
                    />
                    <input
                      name="password"
                      type="password"
                      required
                      minLength={8}
                      placeholder="密码（≥8 位）"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-violet-600"
                    />
                    {error && (
                      <p className="text-xs text-red-400">{error}</p>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-lg bg-violet-600 py-2 text-sm text-white hover:bg-violet-500 disabled:opacity-60"
                    >
                      {loading ? "…" : "注册"}
                    </button>
                  </form>
                )}
                <p className="mt-3 text-center text-[10px] text-zinc-600">
                  预留账号体系 · 暂不限制任何功能
                </p>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
