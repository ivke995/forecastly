import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Forecastly",
  description: "Smart weather forecasts and recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground font-sans">
        <div className="flex min-h-dvh flex-col">
          <header className="border-foreground/10 border-b">
            <div className="mx-auto flex w-full max-w-[1200px] items-center gap-3 px-4 py-5 sm:px-6 lg:px-8">
              <div
                aria-label="Forecastly logo"
                className="bg-foreground text-background flex size-10 shrink-0 items-center justify-center rounded-2xl text-lg font-black tracking-tight"
              >
                F
              </div>
              <div className="min-w-0">
                <p className="text-base leading-tight font-semibold tracking-tight">
                  Forecastly
                </p>
                <p className="text-foreground/70 text-sm leading-5">
                  Smart Weather Forecasts
                </p>
              </div>
            </div>
          </header>
          <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
