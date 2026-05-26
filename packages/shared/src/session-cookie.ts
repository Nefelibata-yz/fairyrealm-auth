export const sessionCookieName =
  process.env.NODE_ENV === "production"
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

export const cookieDomain =
  process.env.AUTH_COOKIE_DOMAIN ?? ".fairyrealm.xyz";
