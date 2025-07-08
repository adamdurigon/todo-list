"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <Button
      variant="outline"
      className="text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white text-sm sm:text-base"
      onClick={handleSignOut}
    >
      Se déconnecter
    </Button>
  );
}
