import Footer from "@/component/ui/Footer";
import Header from "@/component/ui/Header";
import {NextProvider} from "../providers/NextuiProviders";
import Providers from "../providers/Providers";
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
    <html  className="dark" lang="en" suppressHydrationWarning>
      <body className="myfonts transition-colors duration-300 ease-in-out bg-white text-black dark:bg-gray-900 dark:text-white">
        <NextProvider>
        <Providers>
          <Header />
          <main className="min-h-[calc(100vh-200px)]">{children}</main>
          <Footer />
          </Providers>
        </NextProvider>
      </body>
    </html>
  );
}
