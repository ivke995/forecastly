import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  CloudSun,
  Cloudy,
  Heart,
  LayoutDashboard,
  Settings,
  SunMedium,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
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

const primaryNavItems = [
  {
    title: "Dashboard/Search",
    href: "#top",
    icon: LayoutDashboard,
    active: true,
  },
];

const forecastNavItems = [
  {
    title: "Current",
    href: "#current-weather",
    icon: SunMedium,
  },
  {
    title: "Hourly",
    href: "#hourly-forecast",
    icon: CloudSun,
  },
  {
    title: "7-Day",
    href: "#daily-forecast",
    icon: Cloudy,
  },
  {
    title: "Favorites",
    href: "#favorite-cities",
    icon: Heart,
  },
];

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
        <TooltipProvider>
          <SidebarProvider>
            <Sidebar collapsible="icon" variant="sidebar">
              <SidebarHeader>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className="h-12"
                      render={<a href="#top" aria-label="Forecastly dashboard home" />}
                      tooltip="Forecastly"
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sm font-black tracking-tight text-sidebar-primary-foreground">
                        F
                      </span>
                      <span className="min-w-0 leading-tight">
                        <span className="block truncate font-semibold">
                          Forecastly
                        </span>
                        <span className="block truncate text-xs text-sidebar-foreground/70">
                          Smart weather
                        </span>
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarHeader>

              <SidebarSeparator />

              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {primaryNavItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            isActive={item.active}
                            render={<a href={item.href} />}
                            tooltip={item.title}
                          >
                            <item.icon aria-hidden="true" />
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarGroupLabel>Forecast sections</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {forecastNavItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            render={<a href={item.href} />}
                            tooltip={item.title}
                          >
                            <item.icon aria-hidden="true" />
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>

              <SidebarFooter>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton disabled tooltip="Settings (coming soon)">
                      <Settings aria-hidden="true" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
              <SidebarRail />
            </Sidebar>

            <SidebarInset>
              <header className="sticky top-0 z-10 border-sidebar-border/80 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
                <div className="mx-auto flex w-full max-w-[1200px] items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
                  <SidebarTrigger aria-label="Toggle navigation sidebar" />
                  <div className="min-w-0">
                    <p className="text-sm leading-tight font-semibold tracking-tight">
                      Forecastly
                    </p>
                    <p className="text-muted-foreground text-xs leading-5">
                      Dashboard and forecast shortcuts
                    </p>
                  </div>
                </div>
              </header>
              <main
                id="top"
                className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12"
              >
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
