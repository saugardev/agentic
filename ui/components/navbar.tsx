'use client'

import Link from "next/link";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import MenuButton from "./menu-button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { login } = useLogin();
  const { logout, authenticated, user } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (user?.wallet?.address) {
      document.cookie = `user_address=${user.wallet.address}; path=/`;
      router.refresh();
    }
  }, [router, user]);

  const handleLogout = () => {
    document.cookie = 'user_address=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    logout();
    router.refresh();
  };

  return (
    <nav className="w-full fixed z-50">
      <div className="mx-auto h-16 p-5 flex items-center justify-between">
        <Link href="/" className="font-bold text-4xl">
          App
        </Link>
        
        <div className="flex items-center gap-4">
          <MenuButton>
            {authenticated ? (
              <div onClick={handleLogout}>
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
