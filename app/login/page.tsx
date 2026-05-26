import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="text-2xl font-semibold text-violet-200">Fairyrealm 登录</h1>
      <p className="mt-2 text-sm text-zinc-400">
        统一账号，适用于所有 *.fairyrealm.xyz 子站
      </p>
      <Suspense fallback={<p className="mt-8 text-zinc-500">加载中…</p>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
