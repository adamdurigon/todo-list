import { Metadata } from "next";
import { LoginForm } from "@/app/components/auth/login-form";

export const metadata: Metadata = {
  title: "Connexion | Todo App",
  description: "Connectez-vous à votre compte Todo App",
};

export default function LoginPage() {
  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Connexion</h1>
          <p className="text-sm text-muted-foreground">
            Entrez vos identifiants pour vous connecter
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
