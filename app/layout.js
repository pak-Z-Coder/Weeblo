import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";
import Header from "@/components/Header";
import { AppWrapper } from "../context/page";
import Footer from "@/components/Footer";
import NextTopLoader from "nextjs-toploader";
import Head from "next/head";
export const metadata = {
  title: "Weeblo",
  description:
    "Weeblo - A Modern Anime streaming application for Weebs - Ads free service",
  url: "https://www.weeblo.vercel.app",
  siteName: "Weeblo",
  name: "Weeblo",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta
          name="keywords"
          content="Weeblo Anime, anime streaming, watch anime online, subbed anime, dubbed anime,watch anime online free,one piece "
        />
        <meta name="author" content="Weeblo Anime" />
        <meta property="og:title" content="Weeblo Anime - Watch Anime Online" />
      </Head>
      <body className="bg-gray-50 text-black dark:bg-[#100b25] dark:text-white overflow-x-hidden w-screen ">
        <AppWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            enableColorScheme={false}>
            <NextTopLoader
              color="#0283ed"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
              showSpinner={false}
              easing="ease"
              speed={200}
              shadow="0 0 10px #2299DD,0 0 5px #2299DD"
            />
            <Header />
            <div className="min-h-screen no-scrollbar">{children}</div>
            <Footer />
          </ThemeProvider>
        </AppWrapper>
      </body>
    </html>
  );
}
