import Footer from "@/component/ui/Footer";
import Header from "@/component/ui/Header";
import { Providers } from "./provider";
import "@/app/globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campus Code",
  description:
    "Campus Code is a nationwide community dedicated to empowering students through impactful events, sessions, and hackathons.",
  metadataBase: new URL("https://www.campuscode.in/"),
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html  lang="en" suppressHydrationWarning>
     <body className="myfonts transition-colors duration-300 ease-in-out bg-white text-black dark:bg-gray-900 dark:text-white">
        <Providers>
          <Header />

          <main className="min-h-[calc(100vh-200px)]">{children}</main>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}
