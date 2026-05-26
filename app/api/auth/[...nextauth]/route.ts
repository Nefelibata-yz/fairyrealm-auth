import { handlers } from "@/auth";

// Auth.js handler 与 Next 15 App Router 类型定义不完全一致
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const { GET, POST } = handlers as any;
