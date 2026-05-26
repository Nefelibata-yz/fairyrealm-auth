# fairyrealm-auth

`auth.fairyrealm.xyz` — 跨子域统一登录（Auth.js + D1）。

## 本地

```bash
npm install
npm run db:migrate:local
cp .dev.vars.example .dev.vars   # 编辑 AUTH_SECRET
npm run dev
```

## 部署

见仓库根目录 [`../DEPLOY.md`](../DEPLOY.md)。

## 环境变量

| 变量 | 说明 |
|------|------|
| `AUTH_SECRET` | 与 hub/blog 相同，用于 JWT |
| `AUTH_URL` | `https://auth.fairyrealm.xyz` |
| `AUTH_COOKIE_DOMAIN` | `.fairyrealm.xyz` |
