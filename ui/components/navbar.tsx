'use client'

import Link from "next/link";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import MenuButton from "./menu-button";

export default function Navbar() {
  const { login } = useLogin();
  const { logout, authenticated } = usePrivy();

  return (
    <nav className="w-full fixed z-50">
      <div className="mx-auto h-16 p-5 flex items-center justify-between">
        <Link href="/" className="font-bold text-4xl">
          App
        </Link>
        
        <div className="flex items-center gap-4">
          <MenuButton>
            {authenticated ? (
              <div onClick={logout}>
                Logout
              </div>
            ) : (
              <div onClick={login}>
                Login
              </div>
            )}
          </MenuButton>
        </div>
      </div>
    </nav>
  );
}
