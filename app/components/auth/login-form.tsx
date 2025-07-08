"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { LoginSchema, type LoginFormData, type AuthFormProps } from "@/types";

export function LoginForm({ className }: AuthFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  const validateForm = (): boolean => {
    try {
      LoginSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof Error) {
        const zodError = JSON.parse(error.message);
        const fieldErrors: Partial<LoginFormData> = {};

        zodError.forEach((err: { path: string[]; message: string }) => {
          const field = err.path[0] as keyof LoginFormData;
          fieldErrors[field] = err.message;
        });

        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Effacer l'erreur du champ lors de la modification
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        // Gestion spécifique des erreurs selon les meilleures pratiques UX
        if (result.error === "CredentialsSignin") {
          // Nous devons faire un appel API pour déterminer le type d'erreur spécifique
          try {
            const response = await fetch("/api/auth/check-credentials", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: formData.email,
                password: formData.password,
              }),
            });

            const errorData = await response.json();

            if (errorData.errorType === "USER_NOT_FOUND") {
              toast.error("Utilisateur introuvable", {
                description:
                  "Aucun utilisateur ne correspond à cette adresse email",
              });
            } else if (errorData.errorType === "INVALID_PASSWORD") {
              toast.error("Mot de passe incorrect", {
                description: "Le mot de passe saisi est incorrect",
              });
            } else {
              toast.error("Erreur de connexion", {
                description: "Email ou mot de passe incorrect",
              });
            }
          } catch (error) {
            console.error("Error calling check-credentials API:", error); // Debug log
            toast.error("Erreur de connexion", {
              description: "Email ou mot de passe incorrect",
            });
          }
        } else {
          toast.error("Erreur de connexion", {
            description: "Une erreur est survenue lors de la connexion",
          });
        }
        return;
      }

      router.push("/");
    } catch {
      toast.error("Erreur", {
        description: "Une erreur est survenue, veuillez réessayer",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`grid gap-6 ${className}`}>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-xl"
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="nom@exemple.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={isLoading}
              required
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-400 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                disabled={isLoading}
                required
                className={errors.password ? "border-red-500 pr-10" : "pr-10"}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm">{errors.password}</p>
            )}
          </div>

          <Button disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion en cours...
              </>
            ) : (
              "Se connecter"
            )}
          </Button>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-black px-2 text-gray-400">Ou</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button variant="outline" asChild>
          <Link href="/register">Créer un compte</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/">Retour à l&apos;accueil</Link>
        </Button>
      </div>
    </div>
  );
}
