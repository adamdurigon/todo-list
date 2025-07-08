import { Metadata } from "next";
import { RegisterForm } from "@/app/components/auth/register-form";

export const metadata: Metadata = {
  title: "Inscription | Todo App",
  description: "Créez votre compte Todo App",
};

export default function RegisterPage() {
  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Créer un compte
          </h1>
          <p className="text-sm text-muted-foreground">
            Remplissez le formulaire ci-dessous pour créer votre compte
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
