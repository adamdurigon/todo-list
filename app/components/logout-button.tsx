import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export const LogoutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return <button onClick={handleSignOut}>Logout</button>;
};
