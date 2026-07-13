"use client";

import { useSession } from "next-auth/react";
import LogoutButton from "../auth/LogoutButton";
import LoginButton from "../auth/LoginButton";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="w-full grid grid-cols-3 items-center px-6 py-4">
      <div>
        <h1 className="text-xl font-bold">Strata</h1>
      </div>

      <div className="text-center">
        {session && <span>Welcome, {session.user.name}</span>}
      </div>

      <div className="flex justify-end">
        {session ? <LogoutButton /> : <LoginButton />}
      </div>
    </nav>
  );
};

export default Navbar;
