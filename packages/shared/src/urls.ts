const DEV_PROXY_PORT = process.env.FAIRYREALM_PROXY_PORT ?? "8080";

export function getAuthBaseUrl() {
  if (process.env.NEXT_PUBLIC_AUTH_URL) {
    return process.env.NEXT_PUBLIC_AUTH_URL.replace(/\/$/, "");
  }
  if (process.env.NODE_ENV === "development") {
    if (process.env.FAIRYREALM_USE_PROXY === "1") {
      return `http://auth.fairyrealm.local:${DEV_PROXY_PORT}`;
    }
    return "http://localhost:3000";
  }
  return "https://auth.fairyrealm.xyz";
}

export function getPublicSiteUrl(subdomain: "www" | "hub" | "blog" | "auth" | "") {
  if (process.env.NODE_ENV === "development" && process.env.FAIRYREALM_USE_PROXY === "1") {
    const host =
      subdomain === "www" || subdomain === ""
        ? "fairyrealm.local"
        : `${subdomain}.fairyrealm.local`;
    return `http://${host}:${DEV_PROXY_PORT}`;
  }
  if (subdomain === "" || subdomain === "www") {
    return "https://fairyrealm.xyz";
  }
  return `https://${subdomain}.fairyrealm.xyz`;
}
