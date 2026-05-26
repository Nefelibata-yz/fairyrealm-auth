import { AuthNav } from "./AuthNav";
import { getSessionUser } from "./get-session";
import { getAuthBaseUrl } from "./urls";

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  const authBaseUrl = getAuthBaseUrl();

  return (
    <>
      <AuthNav authBaseUrl={authBaseUrl} initialUser={user} />
      {children}
    </>
  );
}
