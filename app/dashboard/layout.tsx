import { Inter } from "next/font/google";
import "../globals.css";
import { Toaster } from "sonner";
import Providers from "@/providers/session-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/app-sidebar";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Separator } from "@/components/ui/separator";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Providers>
        <TooltipProvider>
          <SidebarProvider>
            <AppSidebar />

            <SidebarInset>
              {/* HEADER */}
              <header className="flex h-16 items-center gap-2 px-4 border-gray-400 border bg-background">
                <SidebarTrigger />

                <Separator orientation="vertical" className="h-4" />

                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="/dashboard">
                        Dashboard
                      </BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbSeparator className="hidden md:block" />

                    <BreadcrumbItem>
                      <BreadcrumbPage>Users</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </header>

              {/* MAIN CONTENT */}
              <main className="flex-1 p-4 bg-muted/30 min-h-screen">
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>

          <Toaster richColors position="top-right" />
        </TooltipProvider>
      </Providers>
    </div>
  );
}
