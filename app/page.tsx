import Link from "next/link";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6">
      <p className="text-sm uppercase tracking-widest text-violet-400">auth</p>
      <h1 className="mt-2 text-4xl font-bold text-zinc-50">Fairyrealm Auth</h1>
      <p className="mt-4 text-zinc-400">
        跨子域统一登录服务。Cookie 域名为{" "}
        <code className="text-violet-300">.fairyrealm.xyz</code>。
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        {session ? (
          <>
            <span className="rounded-lg border border-violet-800/60 px-4 py-2 text-sm text-zinc-300">
              已登录：{session.user.email ?? session.user.name}
            </span>
            <Link
              href="/api/auth/signout"
              className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-700"
            >
              退出
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm text-white hover:bg-violet-500"
            >
              登录
            </Link>
            <Link
              href="/register"
              className="rounded-lg border border-violet-700 px-4 py-2 text-sm text-violet-200 hover:bg-violet-950"
            >
              注册
            </Link>
          </>
        )}
        <a
          href="https://hub.fairyrealm.xyz"
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-900"
        >
          返回导航 hub →
        </a>
      </div>
    </main>
  );
}
