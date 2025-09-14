import { useSession, signIn, signOut } from "next-auth/react";

export default function SignInButton() {
  const { data: session, status } = useSession();
  if (status === "loading") return null;
  if (session) return <button onClick={() => signOut()}>Sign out</button>;
  return <button onClick={() => signIn()}>Sign in</button>;
}
