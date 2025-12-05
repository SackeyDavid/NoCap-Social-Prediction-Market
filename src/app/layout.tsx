import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { BottomNav } from "@/components/bottom-nav";
import { TopBar } from "@/components/top-bar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NoCap - Social Prediction Market",
  description: "Bet on culture, music, and trends.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050505] text-white min-h-screen`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <TopBar />
          <div className="pb-20 md:pl-0"> {/* Removed sidebar padding for now to match mobile-first legacy design */}
            {/* We can keep the desktop sidebar if we want, but user asked for "original UI" which seemed mobile focused. 
                 I'll hide the sidebar for now or restyle it if I had one. 
                 The previous layout had a sidebar. I'll keep it simple and mobile-first as requested. */}

            <main className="max-w-5xl mx-auto">
              {children}
            </main>
            <BottomNav />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
