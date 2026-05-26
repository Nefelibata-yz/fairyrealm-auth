const PROXY_PORT = process.env.FAIRYREALM_PROXY_PORT ?? "8080";

const LOCAL_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "http://127.0.0.1:3002",
  "http://127.0.0.1:3003",
  `http://fairyrealm.local:${PROXY_PORT}`,
  `http://www.fairyrealm.local:${PROXY_PORT}`,
  `http://hub.fairyrealm.local:${PROXY_PORT}`,
  `http://auth.fairyrealm.local:${PROXY_PORT}`,
  `http://blog.fairyrealm.local:${PROXY_PORT}`,
];

const PROD_ORIGINS = [
  "https://fairyrealm.xyz",
  "https://www.fairyrealm.xyz",
  "https://hub.fairyrealm.xyz",
  "https://blog.fairyrealm.xyz",
  "https://auth.fairyrealm.xyz",
  "https://ai.fairyrealm.xyz",
];

export function corsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get("Origin") ?? "";
  const allowed = [...PROD_ORIGINS, ...LOCAL_ORIGINS];
  const headers: HeadersInit = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true",
  };
  if (allowed.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}
