"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function loginPage() {
  const { data: session } = useSession();
  return (
    <>
      {!session && <button onClick={() => signIn("github")}>Sign In</button>}
      {session && <button onClick={() => signOut()}>Sign Out</button>}
      <h1>{session?.user.name}</h1>
    </>
  );
}
