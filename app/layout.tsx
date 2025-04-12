import Footer from "@/component/ui/Footer";
import Header from "@/component/ui/Header";
import { Providers } from "./provider";
import "@/app/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="myfonts bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300 ease-in-out">
        <Providers>
          <Header />
          <main className="min-h-[calc(100vh-200px)]">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
