import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Todo App",
  description: "Une application de gestion de tâches simple et efficace",
};

// Layout principal
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          {children}
          <Toaster
            theme="dark"
            position="top-right"
            expand={true}
            richColors={true}
            closeButton={true}
            toastOptions={{
              style: {
                background: "rgb(17 24 39)",
                border: "1px solid rgb(55 65 81)",
                color: "white",
              },
              duration: 4000,
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
